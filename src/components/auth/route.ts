import fs from "fs";
import path from "path";
import passport from "passport";

import { Router } from "express";

import { keysDir } from "../../keys";
import { DBPostgres } from "../../db";
import { AuthService } from "./service";
import { SuccessResponse } from "../../responses/success.responses";
import { ValidateJoiSchema } from "../../middlewares/joi.validator";
import { loginSchema, registerSchema } from "./model";

import { CredentialsAuthResponse } from "./types/responses.dto";
import { LoginCredentials, RegisterCredentials } from "./types/credentials.dto";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../../security/jwt/types/jwt.dto";
import { VerifyRefreshToken } from "../../security/jwt/verify.jwt";
import { RefreshTokenMiddleware } from "../../middlewares/refresh.token.validator";
import {
  AccessSessionValidator,
  RefreshSessionValidator,
} from "../../middlewares/session.validator";

const publicKey = fs.readFileSync(path.join(keysDir, "public", "public.pem"));

const AuthRouter = Router();
const authService = new AuthService(DBPostgres, "postgres");

AuthRouter.get("/public-key", (req, res, next) => {
  try {
    const strKey = Buffer.from(publicKey).toString("utf-8");
    const parsed = strKey
      .replace("-----BEGIN PUBLIC KEY-----", "")
      .replace("-----END PUBLIC KEY-----", "")
      .replaceAll("\n", "");

    SuccessResponse(req, res, { publicKey: parsed });
  } catch (error) {
    next(error);
  }
});

AuthRouter.post(
  "/refresh-token",
  passport.authenticate("jwt-body", { session: false }),
  async (req, res, next) => {
    try {
      const payload = req.user as RefreshTokenPayload;
      const response = await authService.refreshSession(payload);

      SuccessResponse(req, res, response);
    } catch (error) {
      next(error);
    }
  }
);

AuthRouter.post(
  "/sign-up",
  ValidateJoiSchema(registerSchema, "body"),
  async (req, res, next) => {
    try {
      const data: RegisterCredentials = req.body;
      const response = await authService.register(data);

      SuccessResponse<CredentialsAuthResponse>(req, res, response);
    } catch (error) {
      next(error);
    }
  }
);

AuthRouter.post(
  "/log-in",
  ValidateJoiSchema(loginSchema, "body"),
  async (req, res, next) => {
    try {
      const data: LoginCredentials = req.body;
      const response = await authService.login(data);

      SuccessResponse<CredentialsAuthResponse>(req, res, response);
    } catch (error) {
      next(error);
    }
  }
);

AuthRouter.post(
  "/close-session",
  passport.authenticate("jwt-bearer", { session: false }),
  async (req, res, next) => {
    try {
      const refreshToken = req.body.refreshToken;
      const refreshPayload = VerifyRefreshToken(refreshToken);

      const accessPayload = req.user as AccessTokenPayload;
      console.log(refreshPayload, accessPayload);

      const closed = await authService.closeSession(
        accessPayload,
        refreshPayload
      );

      SuccessResponse(req, res, closed);
    } catch (error) {
      next(error);
    }
  }
);

AuthRouter.post(
  "/close-other-session",
  passport.authenticate("jwt-bearer", { session: false }),
  async (req, res, next) => {
    try {
      const sessionId = parseInt(req.body.sessionId) as number;
      const refreshToken = req.body.refreshToken;
      const refreshPayload = VerifyRefreshToken(refreshToken);

      const accessPayload = req.user as AccessTokenPayload;
      const closed = await authService.closeAnotherSession(
        accessPayload,
        refreshPayload,
        sessionId
      );

      SuccessResponse(req, res, closed);
    } catch (error) {
      next(error);
    }
  }
);

AuthRouter.delete(
  "/delete-user",
  passport.authenticate("jwt-bearer", { session: false }),
  async (req, res, next) => {
    try {
      const refreshToken = req.body.refreshToken;
      const refreshPayload = VerifyRefreshToken(refreshToken);

      const accessPayload = req.user as AccessTokenPayload;
      const deleted = await authService.deleteUser(
        accessPayload,
        refreshPayload
      );

      SuccessResponse(req, res, deleted);
    } catch (error) {
      next(error);
    }
  }
);

export { AuthRouter };

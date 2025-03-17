import passport from "passport";

import { Router } from "express";

import { DBPostgres } from "../../db";
import { AuthService } from "./service";
import { SuccessResponse } from "../../responses/success.responses";
import { ValidateJoiSchema } from "../../middlewares/joi.validator";
import { RefreshTokenMiddleware } from "../../middlewares/refresh.token.validator";
import { loginSchema, recoverPasswordSchema, registerSchema } from "./model";

import { CredentialsAuthResponse } from "./types/responses.dto";
import { LoginCredentials, RegisterCredentials } from "./types/credentials.dto";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../../security/jwt/types/jwt.dto";
import { RSAKeysLoaders } from "../../utils/rsa.keys.loaders";

const AuthRouter = Router();
const authService = new AuthService(DBPostgres, "postgres");

AuthRouter.get("/public-key", (req, res, next) => {
  try {
    const key = RSAKeysLoaders.publicKey;

    SuccessResponse(req, res, { publicKey: key });
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
  "/recovery-request-password-change",
  ValidateJoiSchema(recoverPasswordSchema, "body"),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const change = await authService.requestPasswordChange(email);

      SuccessResponse(req, res, change);
    } catch (error) {
      next(error);
    }
  }
);

AuthRouter.post(
  "/recovery-validate-password-change-code",
  async (req, res, next) => {
    try {
      const { code, token } = req.body;
      const valid = await authService.validateCode(token, code);

      SuccessResponse(req, res, valid);
    } catch (error) {
      next(error);
    }
  }
);

AuthRouter.post("/recovery-password-change", async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const changed = await authService.confirmPasswordChange(token, password);

    SuccessResponse(req, res, changed);
  } catch (error) {
    next(error);
  }
});

AuthRouter.post(
  "/close-session",
  passport.authenticate("jwt-bearer", { session: false }),
  RefreshTokenMiddleware,
  async (req, res, next) => {
    try {
      const refreshPayload = req.refresh as unknown as RefreshTokenPayload;
      const accessPayload = req.user as AccessTokenPayload;

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
  RefreshTokenMiddleware,
  async (req, res, next) => {
    try {
      const sessionId = parseInt(req.body.sessionId) as number;
      const refreshPayload = req.refresh as unknown as RefreshTokenPayload;
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
  RefreshTokenMiddleware,
  async (req, res, next) => {
    try {
      const refreshPayload = req.refresh as RefreshTokenPayload;
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

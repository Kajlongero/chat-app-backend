import { Router } from "express";
import { LoginCredentials, RegisterCredentials } from "./types/credentials.dto";

import { AuthService } from "./service";
import { DBPostgres } from "../../db";
import { SuccessResponse } from "../../responses/success.responses";
import { CredentialsAuthResponse } from "./types/responses.dto";
import { ValidateJoiSchema } from "../../middlewares/joi.validator";
import { loginSchema, registerSchema } from "./model";

const AuthRouter = Router();
const authService = new AuthService(DBPostgres, "postgres");

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

export { AuthRouter };

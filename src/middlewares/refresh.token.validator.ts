import { Request, Response, NextFunction } from "express";
import { CommonsResponses } from "../responses/commons.responses";
import { VerifyRefreshToken } from "../security/jwt/verify.jwt";
import { unauthorized } from "@hapi/boom";
import { RefreshTokenPayload } from "../security/jwt/types/jwt.dto";

export const RefreshTokenMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.body.refreshToken as string;
  if (!token) next(unauthorized(CommonsResponses.en[401].generic));

  const payload = VerifyRefreshToken(token);
  if (!payload) next(unauthorized(CommonsResponses.en[401].generic));

  req.refresh = payload as RefreshTokenPayload;

  next();
};

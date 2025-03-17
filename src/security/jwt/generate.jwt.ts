import { sign } from "jsonwebtoken";

import { authConfigs } from "../../configs";

import type { AccessTokenPayload, RefreshTokenPayload } from "./types/jwt.dto";

export const SignAccessToken = (payload: AccessTokenPayload) => {
  return sign(payload, authConfigs.ACCESS_TOKEN_SECRET as string);
};

export const SignRefreshToken = (payload: RefreshTokenPayload) => {
  return sign(payload, authConfigs.REFRESH_TOKEN_SECRET as string);
};

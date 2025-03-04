import { sign } from "jsonwebtoken";

import { AuthConfigs } from "../../configs";

import type { AccessTokenPayload, RefreshTokenPayload } from "./types/jwt.dto";

export const SignAccessToken = (payload: AccessTokenPayload) => {
  return sign(payload, AuthConfigs.ACCESS_TOKEN_SECRET as string);
};

export const SignRefreshToken = (payload: RefreshTokenPayload) => {
  return sign(payload, AuthConfigs.REFRESH_TOKEN_SECRET as string);
};

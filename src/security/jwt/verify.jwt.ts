import { verify } from "jsonwebtoken";

import { AuthConfigs } from "configs";

import type { AccessTokenPayload, RefreshTokenPayload } from "./types/jwt.dto";

export const VerifyAccessToken = (token: string): AccessTokenPayload => {
  const decoded = verify(token, AuthConfigs.ACCESS_TOKEN_SECRET as string);
  return decoded as AccessTokenPayload;
};

export const VerifyRefreshToken = (token: string): RefreshTokenPayload => {
  const decoded = verify(token, AuthConfigs.REFRESH_TOKEN_SECRET as string);
  return decoded as RefreshTokenPayload;
};

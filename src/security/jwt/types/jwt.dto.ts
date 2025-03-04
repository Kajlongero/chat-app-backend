export type AccessTokenPayload = {
  sub: string | number;
  jti: string;
  aud: string | string[];
  roles: string[];
  exp?: string | number;
  iat?: string | number;
};

export type RefreshTokenPayload = {
  sub: string | number;
  jti: string;
  aud: string | string[];
  exp?: string | number;
  iat?: string | number;
};

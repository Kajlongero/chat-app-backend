import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
} from "passport-jwt";

import { authConfigs } from "../configs/index";

// Jwt Strategies

const AccessJwtBearerOpts: StrategyOptionsWithoutRequest = {
  secretOrKey: authConfigs.ACCESS_TOKEN_SECRET as string,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const RefreshJwtBodyOpts: StrategyOptionsWithoutRequest = {
  secretOrKey: authConfigs.REFRESH_TOKEN_SECRET as string,
  jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
};

const RefreshJwtHeaderOpts: StrategyOptionsWithoutRequest = {
  secretOrKey: authConfigs.REFRESH_TOKEN_SECRET as string,
  jwtFromRequest: ExtractJwt.fromHeader("X-Refresh-Token"),
};

export const AccessJwtBearerStrategy = new JwtStrategy(
  AccessJwtBearerOpts,
  async (payload, done) => done(null, payload)
);

export const RefreshJwtBodyStrategy = new JwtStrategy(
  RefreshJwtBodyOpts,
  async (payload, done) => done(null, payload)
);

export const RefreshJwtHeaderStrategy = new JwtStrategy(
  RefreshJwtHeaderOpts,
  async (payload, done) => done(null, payload)
);

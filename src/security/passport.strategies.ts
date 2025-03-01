import passport from "passport";

import {
  type VerifyCallback,
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptionsWithoutRequest,
  VerifiedCallback,
} from "passport-jwt";
import { Strategy } from "passport-local";

import { AuthConfigs } from "../configs/index";

// Jwt Strategies

const AccessJwtBearerOpts: StrategyOptionsWithoutRequest = {
  secretOrKey: AuthConfigs.ACCESS_TOKEN_SECRET as string,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const RefreshJwtBodyOpts: StrategyOptionsWithoutRequest = {
  secretOrKey: AuthConfigs.REFRESH_TOKEN_SECRET as string,
  jwtFromRequest: ExtractJwt.fromBodyField("refreshToken"),
};

const RefreshJwtHeaderOpts: StrategyOptionsWithoutRequest = {
  secretOrKey: AuthConfigs.REFRESH_TOKEN_SECRET as string,
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

// Local Strategy

passport.use("jwt-bearer", AccessJwtBearerStrategy);
passport.use("jwt-header", RefreshJwtHeaderStrategy);
passport.use("jwt-body", RefreshJwtBodyStrategy);

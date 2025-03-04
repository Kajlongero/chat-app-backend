import {
  badRequest,
  unauthorized,
  forbidden,
  notFound,
  notAcceptable,
  expectationFailed,
  conflict,
  tooManyRequests,
  internal,
} from "@hapi/boom";
import crypto from "crypto";
import bcrypt from "bcrypt";

import { DBDependenciesInjector } from "../../db/injector";
import { DbQueries } from "../../db";

import { LoginCredentials, RegisterCredentials } from "./types/credentials.dto";
import { AuthInfo, User } from "../../types/user.dto";
import { DBCommonsQuerys } from "../../lib/commons.querys";

import type { Engine } from "../../db/injector/types/engine";
import { RegisterResponse } from "./types/responses.dto";
import { genKeys } from "../../security/generate.rsa";
import {
  SignAccessToken,
  SignRefreshToken,
} from "../../security/jwt/generate.jwt";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../../security/jwt/types/jwt.dto";
import { Roles } from "./types/roles.dto";

export class AuthService extends DBCommonsQuerys {
  private database: DBDependenciesInjector;
  private engine: Engine;

  private queries: (typeof DbQueries)[Engine];

  constructor(database: DBDependenciesInjector, engine: Engine) {
    super(database, engine);

    this.database = database;
    this.engine = engine;
    this.queries = DbQueries[this.engine];
  }

  async register(data: RegisterCredentials) {
    const { username, email, password } = data;

    const existUsername = await this.getByUsername(username);
    if (existUsername) throw conflict("Username already taken");

    const existEmail = await this.getInfoByEmail(email);
    if (existEmail) throw conflict("Email already taken");

    const hash = await bcrypt.hash(password, 10);

    const res = await this.database.query<RegisterResponse[]>(
      this.queries.user.auth.registerUser,
      [username, email, hash]
    );

    const register = res[0];

    const keys = await genKeys("MEDIUM");
    const jti = crypto.randomUUID();

    const accessTokenPayload: AccessTokenPayload = {
      sub: register.user_id,
      jti,
      aud: ["access_app_token"],
      roles: [register.role_name],
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
      iat: Date.now(),
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      sub: register.user_id,
      jti,
      aud: ["refresh_app_token"],
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30 * 6,
      iat: Date.now(),
    };

    const session = await this.database.query<
      { readonly session_id: number }[]
    >(this.queries.user.auth.session.createSession, [
      register.auth_id,
      jti,
      keys.publicKey,
      "6 month",
    ]);
    if (!session.length) throw expectationFailed();

    const accessToken = SignAccessToken(accessTokenPayload);
    const refreshToken = SignRefreshToken(refreshTokenPayload);

    console.log(session[0]);

    return {
      sessionId: session[0].session_id,
      privateKey: keys.privateKey,
      accessToken,
      refreshToken,
    };
  }

  async login(data: LoginCredentials) {
    const { email, password } = data;

    const existEmail = await this.getInfoByEmail(email);
    if (!existEmail) throw unauthorized("Email or password invalid");

    const compare = await bcrypt.compare(password, existEmail.password);
    if (!compare) throw unauthorized("Email or password invalid");

    const { id: userId } = await this.database.query<{ id: string }>(
      this.queries.user.auth.getUserIdByAuthId,
      [existEmail.auth_id]
    );

    const roles = await this.database.query<Roles[]>(
      this.queries.user.auth.getUserRoles,
      [existEmail.auth_id]
    );

    const keys = await genKeys("MEDIUM");
    const jti = crypto.randomUUID();

    const accessTokenPayload: AccessTokenPayload = {
      jti,
      sub: userId,
      aud: ["access_app_token"],
      roles: roles.map((role) => role.name),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
      iat: Date.now(),
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      jti,
      sub: userId,
      aud: ["refresh_app_token"],
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30 * 6,
      iat: Date.now(),
    };

    const session = await this.database.query<
      { readonly session_id: number }[]
    >(this.queries.user.auth.session.createSession, [
      existEmail.auth_id,
      jti,
      keys.publicKey,
      "6 month",
    ]);
    if (!session.length) throw expectationFailed();

    const accessToken = SignAccessToken(accessTokenPayload);
    const refreshToken = SignRefreshToken(refreshTokenPayload);

    return {
      sessionId: session[0].session_id,
      privateKey: keys.privateKey,
      accessToken,
      refreshToken,
    };
  }
}

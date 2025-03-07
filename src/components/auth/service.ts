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
import { ActiveSession, Auth, AuthInfo, User } from "../../types/user.dto";
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

    const register = await this.database.query<RegisterResponse[]>(
      this.queries.user.auth.registerUser,
      [username, email, hash]
    );
    const res = register[0];
    const keys = await genKeys("MEDIUM");

    const session = await this.database.query<ActiveSession[]>(
      this.queries.user.auth.session.createSession,
      [res.auth_id, "6 month", keys.publicKey]
    );
    if (!session.length) throw expectationFailed();

    const ses = session[0];

    const accessTokenPayload: AccessTokenPayload = {
      sub: res.user_id,
      jti: ses.at_jti,
      aud: ["access_app_token"],
      roles: [res.role_name],
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
      iat: Date.now(),
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      sub: res.user_id,
      jti: ses.rt_jti,
      aud: ["refresh_app_token"],
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30 * 6,
      iat: Date.now(),
    };

    const accessToken = SignAccessToken(accessTokenPayload);
    const refreshToken = SignRefreshToken(refreshTokenPayload);

    return {
      sessionId: ses.id,
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

    const users = await this.database.query<{ id: string }[]>(
      this.queries.user.auth.getUserIdByAuthId,
      [existEmail.auth_id]
    );

    const user = users[0];

    const roles = await this.database.query<Roles[]>(
      this.queries.user.auth.getUserRoles,
      [existEmail.auth_id]
    );

    const keys = await genKeys("MEDIUM");

    const session = await this.database.query<ActiveSession[]>(
      this.queries.user.auth.session.createSession,
      [existEmail.auth_id, "6 month", keys.publicKey]
    );
    if (!session.length) throw expectationFailed();

    const ses = session[0];

    const accessTokenPayload: AccessTokenPayload = {
      sub: user.id,
      jti: ses.at_jti,
      aud: ["access_app_token"],
      roles: roles.map((role) => role.name),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
      iat: Date.now(),
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      sub: user.id,
      jti: ses.rt_jti,
      aud: ["refresh_app_token"],
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30 * 6,
      iat: Date.now(),
    };

    const accessToken = SignAccessToken(accessTokenPayload);
    const refreshToken = SignRefreshToken(refreshTokenPayload);

    return {
      sessionId: ses.id,
      privateKey: keys.privateKey,
      accessToken,
      refreshToken,
    };
  }

  async refreshSession(payload: RefreshTokenPayload) {
    const { sub, jti } = payload;

    const existsSession = await this.verifySessionAndIfUserExists(payload);

    const updateSessions = await this.database.query<ActiveSession[]>(
      this.queries.user.auth.session.refreshSession,
      ["6 month"]
    );
    const session = updateSessions[0];

    const roles = await this.database.query<Roles[]>(
      this.queries.user.auth.getUserRoles,
      [session.auth_id]
    );

    const accessTokenPayload: AccessTokenPayload = {
      sub,
      jti: session.at_jti,
      aud: ["access_app_token"],
      roles: roles.map((role) => role.name),
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30,
      iat: Date.now(),
    };

    const refreshTokenPayload: RefreshTokenPayload = {
      sub,
      jti: session.rt_jti,
      aud: ["refresh_app_token"],
      exp: Date.now() + 1000 * 60 * 60 * 24 * 30 * 6,
      iat: Date.now(),
    };

    const accessToken = SignAccessToken(accessTokenPayload);
    const refreshToken = SignRefreshToken(refreshTokenPayload);

    return {
      sessionId: session.id,
      accessToken,
      refreshToken,
    };
  }

  async closeSession(access: AccessTokenPayload, refresh: RefreshTokenPayload) {
    const { jti: jtiAccess } = access;

    const existsSession = await this.verifySessionAndIfUserExists(refresh);

    const session = existsSession[0];
    if (session.at_jti !== jtiAccess) throw unauthorized();

    const deleteSession = await this.database.query(
      this.queries.user.auth.session.deleteSessionById,
      [session.id]
    );

    return true;
  }

  async closeAnotherSession(
    access: AccessTokenPayload,
    refresh: RefreshTokenPayload,
    sessionId: number
  ) {
    const { sub } = refresh;
    const { jti: jtiAccess } = access;

    const existsSession = await this.verifySessionAndIfUserExists(refresh);

    const session = existsSession[0];
    if (session.at_jti !== jtiAccess) throw unauthorized();

    const authInfo = await this.database.query<Auth[]>(
      this.queries.user.auth.getAuthByUserId,
      [sub]
    );
    if (!authInfo.length) throw unauthorized();

    const existsSessionToClose = await this.database.query<ActiveSession[]>(
      this.queries.user.auth.session.getSessionById,
      [sessionId]
    );
    if (!existsSessionToClose.length) throw notFound("Session not found");

    const auth = authInfo[0];
    const sessionToClose = existsSessionToClose[0];

    if (sessionToClose.auth_id !== auth.id) throw unauthorized();

    await this.database.query(
      this.queries.user.auth.session.deleteSessionById,
      [sessionId]
    );

    return true;
  }

  async deleteUser(access: AccessTokenPayload, refresh: RefreshTokenPayload) {
    const { sub } = refresh;
    const { jti: jtiAccess } = access;

    const existsSession = await this.verifySessionAndIfUserExists(refresh);

    const session = existsSession[0];
    if (session.at_jti !== jtiAccess) throw unauthorized();

    const deleted = await this.database.query<User[]>(
      this.queries.user.deleteUserById,
      [sub]
    );
    const user = deleted[0];

    return user.id;
  }
}

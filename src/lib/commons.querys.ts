import { unauthorized } from "@hapi/boom";

import { DbQueries } from "../db";
import { DBDependenciesInjector } from "../db/injector";

import { ActiveSession, AuthInfo, User } from "../types/user.dto";
import { RefreshTokenPayload } from "../security/jwt/types/jwt.dto";
import { Engine } from "../db/injector/types/engine";
import { CommonsResponses } from "../responses/commons.responses";

export class DBCommonsQuerys {
  private _database: DBDependenciesInjector;
  private _engine: Engine;

  protected constructor(database: DBDependenciesInjector, engine: Engine) {
    this._database = database;
    this._engine = engine;
  }

  public async getInfoByEmail(email: string): Promise<AuthInfo | null> {
    const data = await this._database.query<AuthInfo[]>(
      DbQueries[this._engine].user.auth.getAuthInfoByEmail,
      [email]
    );
    if (data.length) return data[0];

    return null;
  }

  public async getByUsername(username: string): Promise<User | null> {
    const data = await this._database.query<User[]>(
      DbQueries[this._engine].user.auth.getAuthInfoByEmail,
      [username]
    );
    if (data.length) return data[0];

    return null;
  }

  public async getByUserId(id: string): Promise<User | null> {
    const data = await this._database.query<User[]>(
      DbQueries[this._engine].user.getUserById,
      [id]
    );
    if (data.length) return data[0];

    return null;
  }

  public async verifySessionAndIfUserExists(payload: RefreshTokenPayload) {
    const { sub, jti } = payload;

    const existsSession = await this._database.query<ActiveSession[]>(
      DbQueries[this._engine].user.auth.session.getSessionByRtJti,
      [jti]
    );
    if (!existsSession.length)
      throw unauthorized(CommonsResponses.en[401].generic);

    const existsUser = await this.getByUserId(sub as string);
    if (!existsUser) throw unauthorized(CommonsResponses.en[401].generic);

    return existsSession;
  }
}

import { DBDependenciesInjector } from "../db/injector";
import { DbQueries } from "../db";

import { AuthInfo, User } from "../types/user.dto";
import { Engine } from "../db/injector/types/engine";

export class DBCommonsQuerys {
  private _database: DBDependenciesInjector;
  private _engine: Engine;

  protected constructor(database: DBDependenciesInjector, engine: Engine) {
    this._database = database;
    this._engine = engine;
  }

  public async getInfoByEmail(email: string): Promise<AuthInfo> {
    const data = await this._database.query<AuthInfo[]>(
      DbQueries[this._engine].user.auth.getAuthInfoByEmail,
      [email]
    );

    return data[0];
  }

  public async getByUsername(username: string): Promise<User> {
    const data = await this._database.query<User[]>(
      DbQueries[this._engine].user.auth.getAuthInfoByEmail,
      [username]
    );
    return data[0];
  }

  public async getByUserId(id: string) {}
}

import { IDBDependenciesInjectorModel } from "./interfaces/db.dto";

import { DbQueries } from "../../db";

export class DBDependenciesInjector implements IDBDependenciesInjectorModel {
  private database: IDBDependenciesInjectorModel;

  constructor(database: IDBDependenciesInjectorModel) {
    this.database = database;
  }

  async query<T>(str: string, params: any[]): Promise<T> {
    const data = await this.database.query<T>(str, params);
    const results = data as T;

    return results;
  }

  async uniqueQuery<T>(str: string, params: any[]): Promise<T> {
    const elements = await this.query(str, params);
    const res = elements as T[];

    return res[0];
  }

  get totalCount(): number {
    return this.database.totalCount;
  }

  get waitingCount(): number {
    return this.database.waitingCount;
  }
}

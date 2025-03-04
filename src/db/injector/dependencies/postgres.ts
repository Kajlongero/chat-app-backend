import type { Pool } from "pg";
import type { IDBDependenciesInjectorModel } from "../interfaces/db.dto";

export class DBPostgresInjector implements IDBDependenciesInjectorModel {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  public async query<T>(str: string, params: any[]): Promise<T> {
    const res = await this.pool.query(str, params);
    const data = res.rows;

    return data as T;
  }

  public get totalCount() {
    return this.pool.totalCount;
  }

  public get waitingCount() {
    return this.pool.waitingCount;
  }
}

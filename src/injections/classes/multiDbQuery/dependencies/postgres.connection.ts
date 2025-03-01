import { Pool } from "pg";
import { internal } from "@hapi/boom";

import { MultiDbQueryDefinitions } from "../interfaces/definitions";

export class PostgresConnection implements MultiDbQueryDefinitions {
  private pool: Pool;

  constructor(pool: Pool) {
    this.pool = pool;
  }

  async connect() {
    await this.pool.connect();
  }

  async close() {}

  async query<T, E>(query: string, params: any[]) {
    try {
      const request = await this.pool.query(query, params);
      const res: T = request.rows as T;

      return res;
    } catch (error) {
      throw internal("Error executing the query");
    }
  }

  idleCount() {
    return this.pool.idleCount;
  }

  totalCount() {
    return this.pool.totalCount;
  }

  waitingCount() {
    return this.pool.waitingCount;
  }
}

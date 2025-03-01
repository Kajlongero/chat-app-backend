import pg from "pg";

import { DbConfigs } from ".";

export const pool = new pg.Pool({
  connectionString: DbConfigs.DB_CONNECTION_STRING,
});

import pg from "pg";

import { dbConfigs } from ".";

export const pool = new pg.Pool({
  connectionString: dbConfigs.DB_CONNECTION_STRING,
});

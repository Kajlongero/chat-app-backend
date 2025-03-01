import { pool } from "@configs/pool";
import { PostgresConnection } from "./dependencies/postgres.connection";
import { MultiDbQueryProvider } from "./multi.db.query";

const instance = new PostgresConnection(pool);

export const PostgresDbConnection = new MultiDbQueryProvider(instance);

import { pool } from "../configs/pool";

import { DBDependenciesInjector } from "./injector";
import { DBPostgresInjector } from "./injector/dependencies/postgres";

import DbQueries from "../sql/querys.json";

const PostgresInstance = new DBPostgresInjector(pool);
const DBPostgres = new DBDependenciesInjector(PostgresInstance);

export { DbQueries, PostgresInstance, DBPostgres };

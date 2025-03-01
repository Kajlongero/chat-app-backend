require("dotenv").config();

const {
  SERVER_PORT,
  DB_CONNECTION_STRING,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = process.env;

export const ServerConfigs = {
  SERVER_PORT: parseInt(SERVER_PORT as string),
};

export const AuthConfigs = {
  ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET,
};

export const DbConfigs = {
  DB_CONNECTION_STRING,
};

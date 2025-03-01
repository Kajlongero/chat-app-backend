require("dotenv").config();

const {
  SERVER_PORT,
  DB_CONNECTION_STRING,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  RSA_KEY_PAIR_PASSPHRASE,
} = process.env;

export const ServerConfigs = {
  SERVER_PORT: parseInt(SERVER_PORT as string),
};

export const AuthConfigs = {
  ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET,
  RSA_KEY_PAIR_PASSPHRASE: RSA_KEY_PAIR_PASSPHRASE,
};

export const DbConfigs = {
  DB_CONNECTION_STRING,
};

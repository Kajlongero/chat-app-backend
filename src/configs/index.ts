import dotenv from "dotenv";

dotenv.config();

const {
  SERVER_PORT,
  DB_CONNECTION_STRING,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  RSA_KEY_PAIR_PASSPHRASE,
  MAIL_FROM,
  MAIL_PASS,
  MAIL_HOST,
  MAIL_PORT,
} = process.env;

export const serverConfigs = {
  SERVER_PORT: parseInt(SERVER_PORT as string),
};

export const authConfigs = {
  ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET,
  RSA_KEY_PAIR_PASSPHRASE: RSA_KEY_PAIR_PASSPHRASE,
};

export const dbConfigs = {
  DB_CONNECTION_STRING,
};

export const mailConfigs = {
  MAIL_FROM,
  MAIL_PASS,
  MAIL_PORT,
  MAIL_HOST,
};

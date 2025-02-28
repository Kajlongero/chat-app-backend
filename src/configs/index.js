require("dotenv").config();

const { SERVER_PORT, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

const ServerConfigs = {
  SERVER_PORT: parseInt(SERVER_PORT),
};

const AuthConfigs = {
  ACCESS_TOKEN_SECRET: ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: REFRESH_TOKEN_SECRET,
};

module.exports = {
  ServerConfigs,
  AuthConfigs,
};

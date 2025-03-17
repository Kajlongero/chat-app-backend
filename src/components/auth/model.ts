import _ from "joi";

const email = _.string().email();
const password = _.string().min(8).max(32);
const username = _.string().min(3).max(64);

const code = _.number().min(1000000).max(9999999);
const token = _.string();

export const loginSchema = _.object({
  email: email.required(),
  password: password.required(),
});

export const registerSchema = _.object({
  email: email.required(),
  password: password.required(),
  username: username.required(),
});

export const recoverPasswordSchema = _.object({
  email: email.required(),
});

export const validateCodeSchema = _.object({
  code: code.required(),
  token: token.required(),
});

export const changePasswordSchema = _.object({
  password: password.required(),
  token: token.required(),
});

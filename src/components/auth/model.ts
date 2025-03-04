import _ from "joi";

const userId = _.string().uuid();
const email = _.string().email();
const password = _.string().min(8).max(32);
const username = _.string().min(3).max(64);

export const loginSchema = _.object({
  email: email.required(),
  password: password.required(),
});

export const registerSchema = _.object({
  email: email.required(),
  password: password.required(),
  username: username.required(),
});

const registerUserSchema = _.object({});

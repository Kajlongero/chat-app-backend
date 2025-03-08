import { NextFunction, Request, Response } from "express";
import { DBDependenciesInjector } from "../db/injector";
import { DbQueries, PostgresInstance } from "../db";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
} from "../security/jwt/types/jwt.dto";
import { ActiveSession, User } from "../types/user.dto";
import { unauthorized } from "@hapi/boom";
import { CommonsResponses } from "../responses/commons.responses";

const DB = new DBDependenciesInjector(PostgresInstance);
const queries = DbQueries["postgres"];

export const AccessSessionValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = req.user as unknown as AccessTokenPayload;

  const validateSession = await DB.query<ActiveSession[]>(
    queries.user.auth.session.getSessionByAtJti,
    [payload.jti]
  );
  if (!validateSession.length)
    next(unauthorized(CommonsResponses.en[401].generic));

  const ses = validateSession[0];
  if (new Date(ses.expires_at).toISOString() >= new Date().toISOString())
    next(unauthorized(CommonsResponses.en[401].generic));

  next();
};

export const RefreshSessionValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = req.refresh as unknown as RefreshTokenPayload;

  const validateSession = await DB.query<ActiveSession[]>(
    queries.user.auth.session.getSessionByRtJti,
    [payload.jti]
  );
  if (!validateSession.length)
    next(unauthorized(CommonsResponses.en[401].generic));

  const ses = validateSession[0];
  if (new Date(ses.expires_at).toISOString() >= new Date().toISOString())
    next(unauthorized(CommonsResponses.en[401].generic));

  next();
};

export const UserValidator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const payload = req.user as AccessTokenPayload;

  const validateUser = await DB.query<User[]>(queries.user.getUserById, [
    payload.sub,
  ]);
  if (!validateUser.length)
    next(unauthorized(CommonsResponses.en[401].generic));

  const user = validateUser[0];
  if (user.deleted_at) next(unauthorized(CommonsResponses.en[401].generic));

  next();
};

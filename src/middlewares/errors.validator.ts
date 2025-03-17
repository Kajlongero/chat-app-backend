import type { Request, Response, NextFunction } from "express";
import Boom from "@hapi/boom";

export const DoActionHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Aquí puedes implementar la lógica para guardar logs
  next(err);
};

export const BoomErrorsHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  console.error(err);

  if (Boom.isBoom(err)) {
    const { output } = err;
    return res.status(output.statusCode).json(output.payload);
  }
  next(err);
};

export const ServerErrorsHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  return res.status(500).json({
    statusCode: 500,
    error: "Internal Server Error",
    message: "Internal Server Error",
  });
};

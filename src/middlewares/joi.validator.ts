import { badRequest } from "@hapi/boom";

import type { Schema } from "joi";
import type { Request, Response, NextFunction } from "express";

export const ValidateJoiSchema =
  (schema: Schema, param: keyof Request) =>
  (req: Request, res: Response, next: NextFunction) => {
    const values = req[param];

    const { error } = schema.validate(values, { abortEarly: false });
    if (error) next(badRequest(error));

    return next();
  };

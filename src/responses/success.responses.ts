import { Request, Response } from "express";

export const SuccessResponse = <T>(
  req: Request,
  res: Response,
  body: T,
  statusCode: number = 200,
  message: string = "Success"
) => {
  return res.status(statusCode).json({
    data: body,
    message,
    statusCode,
  });
};

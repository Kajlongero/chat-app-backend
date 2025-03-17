import { privateDecrypt, constants } from "crypto";

import { RSAKeysLoaders } from "../utils/rsa.keys.loaders";
import { authConfigs } from "../configs";

import type { NextFunction, Request, Response } from "express";
import { forbidden } from "@hapi/boom";

export const rsaCredentialsValidator =
  (prop: keyof Request) =>
  (req: Request, res: Response, next: NextFunction) => {
    const data = req[prop];

    if (!Object.keys(data).length) next();

    const opts = {
      key: RSAKeysLoaders.privateKey,
      passphrase: authConfigs.RSA_KEY_PAIR_PASSPHRASE,
    };

    let body: Record<string, unknown> = {};

    try {
      for (const [key, value] of Object.entries(data)) {
        const elem = privateDecrypt(
          {
            ...opts,
            padding: constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: "SHA-256",
          },
          Buffer.from(value as string, "base64")
        );

        body[key] = elem.toString("utf8");
      }

      req.body = body;

      next();
    } catch (error) {
      next(forbidden());
    }
  };

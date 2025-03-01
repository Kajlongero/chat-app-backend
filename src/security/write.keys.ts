import path from "path";

import { internal } from "@hapi/boom";

import { existsSync, mkdir, writeFile } from "fs";
import { promisify } from "util";

import { keysDir } from "../keys";
import { genKeys } from "./generate.rsa";
import { KeyPair, SECURITY_LEVEL } from "../types/security.level";

const dir = promisify(mkdir);
const write = promisify(writeFile);

export const writeKeys = async (security: SECURITY_LEVEL) => {
  const keys: KeyPair = await genKeys(security);
  const keyDir = keysDir;

  const publicPath = path.join(keyDir, "public");
  const privatePath = path.join(keyDir, "private");

  try {
    if (!existsSync(publicPath)) await dir(publicPath);
    if (!existsSync(privatePath)) await dir(privatePath);

    const publicKeyFilename = path.join(publicPath, "public.pem");
    const privateKeyFilename = path.join(privatePath, "private.pem");

    await Promise.all([
      write(publicKeyFilename, keys.publicKey),
      write(privateKeyFilename, keys.privateKey),
    ]);

    return true;
  } catch (error) {
    console.error(error);
    throw internal("Failed to generate keys");
  }
};

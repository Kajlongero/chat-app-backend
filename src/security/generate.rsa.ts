import { promisify } from "node:util";
import { generateKeyPair } from "crypto";
import { RSAKeyPairOptions } from "node:crypto";

import { badData } from "@hapi/boom";

import { AuthConfigs } from "../configs";
import { KeyPair, SECURITY_LEVEL, SECURITY_SIZE } from "../types/security.dto";

const keyPair = promisify(generateKeyPair);

const getOpts = (level: SECURITY_SIZE): RSAKeyPairOptions<"pem", "pem"> => ({
  modulusLength: level,
  publicKeyEncoding: {
    type: "spki",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
    cipher: "aes-256-cbc",
    passphrase: AuthConfigs.RSA_KEY_PAIR_PASSPHRASE,
  },
});

export const genKeys = async (security: SECURITY_LEVEL): Promise<KeyPair> => {
  if (!SECURITY_SIZE[security]) {
    throw badData(`Invalid security level: ${security}`);
  }

  try {
    const keys = await keyPair("rsa", getOpts(SECURITY_SIZE[security]));
    return keys;
  } catch (error) {
    console.log(error);
    throw badData("Failed to generate RSA key pair");
  }
};

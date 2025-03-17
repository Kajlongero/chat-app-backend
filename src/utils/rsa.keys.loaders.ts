import { join } from "path";
import { readFileSync } from "fs";

import { keysDir } from "../keys";

const KEY_PATH = join(keysDir, "public", "public.pem");

export class RSAKeysLoaders {
  private static instance: RSAKeysLoaders;

  private static publickey: string;
  private static privatekey: string;

  private constructor() {
    RSAKeysLoaders.publickey = this.loadPublicKey();
    RSAKeysLoaders.privatekey = this.loadPrivateKey();
  }

  private loadPublicKey() {
    const key = readFileSync(KEY_PATH, "utf-8");

    const parsed = key
      .replace("-----BEGIN PUBLIC KEY-----", "")
      .replace("-----END PUBLIC KEY-----", "")
      .replaceAll("\n", "");

    return parsed;
  }

  private loadPrivateKey() {
    const key = readFileSync(KEY_PATH, "utf-8");

    return key;
  }

  public static getInstance(): RSAKeysLoaders {
    if (!RSAKeysLoaders.instance) {
      RSAKeysLoaders.instance = new RSAKeysLoaders();
    }
    return RSAKeysLoaders.instance;
  }

  public static get publicKey() {
    return this.publickey;
  }

  public static get privateKey() {
    return this.privatekey;
  }
}

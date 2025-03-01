export type SECURITY_LEVEL = "HIGH" | "MEDIUM";

export enum SECURITY_SIZE {
  MEDIUM = 2048,
  HIGH = 4096,
}

export type KeyPair = {
  publicKey: string;
  privateKey: string;
};

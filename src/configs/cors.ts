import type { CorsOptions } from "cors";

export const CorsOpts: CorsOptions = {
  credentials: true,
  origin: "*",
  methods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
  exposedHeaders: [
    "X-User-Preferred-Language",
    "X-App-Identifier",
    "X-Refresh-Token",
  ],
  allowedHeaders: [
    "X-User-Preferred-Language",
    "X-App-Identifier",
    "X-Refresh-Token",
  ],
};

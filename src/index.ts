import path from "path";
import cors from "cors";
import express from "express";
import passport from "passport";
import { Server } from "socket.io";
import { createServer } from "http";

import {
  AccessJwtBearerStrategy,
  RefreshJwtBodyStrategy,
  RefreshJwtHeaderStrategy,
} from "./security/passport.strategies";

passport.use("jwt-bearer", AccessJwtBearerStrategy);
passport.use("jwt-header", RefreshJwtHeaderStrategy);
passport.use("jwt-body", RefreshJwtBodyStrategy);

import apiRouter from "./definitions/api";

import {
  BoomErrorsHandler,
  ServerErrorsHandler,
} from "./middlewares/errors.validator";

import { serverConfigs } from "./configs/index";
import { CorsOpts } from "./configs/cors";

import { writeKeys } from "./security/write.keys";
import { RSAKeysLoaders } from "./utils/rsa.keys.loaders";

writeKeys("HIGH");

RSAKeysLoaders.getInstance();

const app = express();
const httpServer = createServer(app);

app.use("/statics", express.static(path.join(__dirname, "public")));

app.use(cors(CorsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

apiRouter(app);

app.use(BoomErrorsHandler as express.ErrorRequestHandler);
app.use(ServerErrorsHandler as unknown as express.ErrorRequestHandler);

const io = new Server(httpServer);

io.on("connection", (socket) => {});

export { app };

httpServer.listen(serverConfigs.SERVER_PORT, () => {
  console.log(`Listening at port: ${serverConfigs.SERVER_PORT}`);
});

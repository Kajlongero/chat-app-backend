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

import { ServerConfigs } from "./configs/index";
import { CorsOpts } from "./configs/cors";

import { writeKeys } from "./security/write.keys";

writeKeys("HIGH");

const app = express();
const httpServer = createServer(app);

app.use(cors(CorsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

apiRouter(app);

app.use(BoomErrorsHandler as express.ErrorRequestHandler);
app.use(ServerErrorsHandler as unknown as express.ErrorRequestHandler);

const io = new Server(httpServer);

io.on("connection", (socket) => {});

export { app };

httpServer.listen(ServerConfigs.SERVER_PORT, () => {
  console.log(`Listening at port: ${ServerConfigs.SERVER_PORT}`);
});

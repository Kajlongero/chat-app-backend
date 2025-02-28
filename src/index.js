const cors = require("cors");
const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");

const apiRouter = require("./definitions/api");
const {
  BoomErrorsHandler,
  ServerErrorsHandler,
} = require("./middlewares/errors.validator");

const { ServerConfigs } = require("./configs");
const CorsOpts = require("./configs/cors");

const app = express();
const httpServer = createServer(app);

app.use(cors(CorsOpts));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

apiRouter(app);

app.use(BoomErrorsHandler);
app.use(ServerErrorsHandler);

const io = new Server(httpServer);

io.on("connection", (socket) => {});

httpServer.listen(ServerConfigs.SERVER_PORT, () => {
  console.log(`Listening at port: ${ServerConfigs.SERVER_PORT}`);
});

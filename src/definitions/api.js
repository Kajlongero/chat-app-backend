const router = require("express").Router();

const apiRouter = (app) => {
  app.use("/api/v1", router);
  // here will go every router contained in components/./route.js
};

module.exports = apiRouter;

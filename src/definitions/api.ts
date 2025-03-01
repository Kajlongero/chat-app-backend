import { type Application, Router } from "express";

const router = Router();

const apiRouter = (app: Application) => {
  app.use("/api/v1", router);
  // here will go every router contained in components/./route.js
};

export default apiRouter;

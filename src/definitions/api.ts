import { AuthRouter } from "../components/auth/route";
import { type Application, Router } from "express";

const router = Router();

const apiRouter = (app: Application) => {
  app.use("/api/v1", router);

  router.use("/auth", AuthRouter);
};

export default apiRouter;

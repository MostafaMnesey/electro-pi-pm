import { Router } from "express";
import path from "node:path";
import express from "express";
import authenticationRoutes from "./modules/authentication/authenticaion.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import projectRoutes from "./modules/project/project.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
const rootRouter = Router();

// Static files
rootRouter.use("/uploads", express.static(path.resolve("./uploads")));

rootRouter.use("/authentication", authenticationRoutes);
rootRouter.use("/user", userRoutes);
rootRouter.use("/projects", projectRoutes);
rootRouter.use("/tasks", taskRoutes);

// Root health check
rootRouter.get("/", (req, res) => {
  res.json({ message: "Welcome to Project Manager API" });
});

export default rootRouter;

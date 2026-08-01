import { Router } from "express";
import path from "node:path";
import express from "express";
import authenticationRoutes from "./modules/authentication/authenticaion.routes.js";
import userRoutes from "./modules/user/user.routes.js";
import projectRoutes from "./modules/project/project.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
import swaggerUi from "swagger-ui-express";
import fs from "node:fs";

const rootRouter = Router();

// Static files
rootRouter.use("/uploads", express.static(path.resolve("./uploads")));

// Swagger UI under /api/v1/docs
try {
  const openapiSpec = JSON.parse(fs.readFileSync(path.resolve("./openapi.json"), "utf8"));
  rootRouter.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
  rootRouter.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));
  rootRouter.get("/openapi.json", (req, res) => res.json(openapiSpec));
} catch (err) {
  console.error("Swagger setup warning:", err.message);
}

rootRouter.use("/authentication", authenticationRoutes);
rootRouter.use("/user", userRoutes);
rootRouter.use("/projects", projectRoutes);
rootRouter.use("/tasks", taskRoutes);

// Root health check
rootRouter.get("/", (req, res) => {
  res.json({ message: "Welcome to Project Manager API" });
});

export default rootRouter;

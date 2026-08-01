import { Router } from "express";
import * as controller from "./task.controller.js";
import { authentication } from "../../Middlewares/Authentication.js";
import { validation } from "../../Middlewares/Validation.js";
import { authorize } from "../../Middlewares/AuthorizationMiddleware.js";
import { projectMemberGuard } from "../../Middlewares/ProjectMemberGuard.js";
import * as schemas from "./task.validation.js";
import { PERMISSIONS_V2 } from "../../Constants/permissions.constants.js";

const router = Router();

// Project tasks endpoints
router.post(
  "/projects/:projectId/tasks",
  authentication(),
  authorize(PERMISSIONS_V2.TASKS.CREATE),
  projectMemberGuard(),
  validation(schemas.createTaskSchema),
  controller.createTask
);

router.get(
  "/projects/:projectId/tasks",
  authentication(),
  projectMemberGuard(),
  validation(schemas.getTasksSchema),
  controller.getProjectTasks
);

// Individual task endpoints
router.get(
  "/tasks/:id",
  authentication(),
  projectMemberGuard(),
  validation(schemas.getTaskByIdSchema),
  controller.getTaskById
);

router.patch(
  "/tasks/:id",
  authentication(),
  authorize(PERMISSIONS_V2.TASKS.UPDATE),
  projectMemberGuard(),
  validation(schemas.updateTaskSchema),
  controller.updateTask
);

router.patch(
  "/tasks/:id/status",
  authentication(),
  authorize(PERMISSIONS_V2.TASKS.UPDATE),
  projectMemberGuard(),
  validation(schemas.updateTaskStatusSchema),
  controller.updateTaskStatus
);

router.patch(
  "/tasks/:id/assign",
  authentication(),
  authorize(PERMISSIONS_V2.TASKS.UPDATE),
  projectMemberGuard(),
  validation(schemas.assignTaskSchema),
  controller.assignTask
);

router.delete(
  "/tasks/:id",
  authentication(),
  authorize(PERMISSIONS_V2.TASKS.DELETE),
  projectMemberGuard(),
  validation(schemas.deleteTaskSchema),
  controller.deleteTask
);

export default router;

import { asyncHandler } from "../Utils/Response.js";
import { isAdmin } from "../Utils/Permissions/permissions.js";
import { MESSAGES } from "../Constants/messages.constants.js";
import * as db from "../database/dbService.js";

/**
 * Middleware to verify that the authenticated user is a member of the relevant project
 * or has an admin role.
 */
export const projectMemberGuard = () => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      return next(new Error(MESSAGES.UNAUTHORIZED, { cause: 401 }));
    }

    // Bypass check for admin / super_admin
    if (isAdmin(req.user)) {
      // If task ID is in params, populate req.task for downstream handlers if available
      let taskId = req.params.id;
      if (taskId && !req.params.projectId) {
        const task = await db.findOne({
          model: "Task",
          where: { id: taskId },
        });
        if (!task) {
          return next(new Error(MESSAGES.TASK_NOT_FOUND, { cause: 404 }));
        }
        req.task = task;
      }
      return next();
    }

    let projectId = req.params.projectId;
    let taskId = req.params.id;

    if (!projectId && taskId) {
      const task = await db.findOne({
        model: "Task",
        where: { id: taskId },
      });

      if (!task) {
        return next(new Error(MESSAGES.TASK_NOT_FOUND, { cause: 404 }));
      }

      req.task = task;
      projectId = task.projectId;
    }

    if (!projectId) {
      return next(new Error(MESSAGES.NOT_FOUND, { cause: 404 }));
    }

    // Check project existence & owner
    const project = await db.findOne({
      model: "Project",
      where: { id: projectId },
    });

    if (!project) {
      return next(new Error(MESSAGES.PROJECT_NOT_FOUND || MESSAGES.NOT_FOUND, { cause: 404 }));
    }

    if (project.ownerId === req.user.id) {
      return next();
    }

    // Check if user is in ProjectMember
    const member = await db.findOne({
      model: "ProjectMember",
      where: {
        projectId_userId: {
          projectId,
          userId: req.user.id,
        },
      },
    });

    if (!member) {
      return next(new Error(MESSAGES.FORBIDDEN, { cause: 403 }));
    }

    next();
  });
};

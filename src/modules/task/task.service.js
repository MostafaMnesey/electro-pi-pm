import { errorResponse } from "../../Utils/Response.js";
import { MESSAGES } from "../../Constants/messages.constants.js";
import { isAdmin } from "../../Utils/Permissions/permissions.js";
import * as db from "../../database/dbService.js";

export const taskSelectFields = {
  id: true,
  title: true,
  description: true,
  status: true,
  priority: true,
  dueDate: true,
  creatorId: true,
  assigneeId: true,
  projectId: true,
  createdAt: true,
  updatedAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  assignee: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
};

/**
 * Helper to check if a user is a member or owner of a project.
 */
const isProjectMember = async (projectId, userId) => {
  const project = await db.findOne({
    model: "Project",
    where: { id: projectId },
  });

  if (!project) return false;

  if (project.ownerId === userId) return true;

  const member = await db.findOne({
    model: "ProjectMember",
    where: {
      projectId_userId: {
        projectId,
        userId,
      },
    },
  });

  return !!member;
};

export const createTaskService = async (req) => {
  const { projectId } = req.params;
  const { title, description, priority, dueDate, assigneeId } = req.body;
  const creatorId = req.user.id;

  // 1. Verify project exists
  const project = await db.findOne({
    model: "Project",
    where: { id: projectId },
  });

  if (!project) {
    errorResponse({
      message: MESSAGES.PROJECT_NOT_FOUND || MESSAGES.NOT_FOUND,
      status: 404,
    });
  }

  // 2. Verify assignee is a member of the project
  const memberValid = await isProjectMember(projectId, assigneeId);
  if (!memberValid) {
    errorResponse({
      message: MESSAGES.NOT_PROJECT_MEMBER,
      status: 400,
    });
  }

  // 3. Create task
  const task = await db.create({
    model: "Task",
    data: {
      title,
      description: description || null,
      priority,
      dueDate: new Date(dueDate),
      creatorId,
      assigneeId,
      projectId,
    },
    select: taskSelectFields,
  });

  return task;
};

export const getProjectTasksService = async (req) => {
  const { projectId } = req.params;
  const { status, priority, assigneeId, page = 1, limit = 10 } = req.query;

  const where = { projectId };

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (assigneeId) where.assigneeId = assigneeId;

  const tasks = await db.findManyWithPaginationAndCount({
    model: "Task",
    page: Number(page),
    limit: Number(limit),
    where,
    select: taskSelectFields,
  });

  return tasks;
};

export const getTaskByIdService = async (req) => {
  const { id } = req.params;

  const task = await db.findOne({
    model: "Task",
    where: { id },
    select: taskSelectFields,
  });

  if (!task) {
    errorResponse({
      message: MESSAGES.TASK_NOT_FOUND,
      status: 404,
    });
  }

  return task;
};

export const updateTaskService = async (req) => {
  const { id } = req.params;
  const { title, description, priority, dueDate } = req.body;

  // Admin-only requirement check
  if (!isAdmin(req.user)) {
    errorResponse({
      message: MESSAGES.FORBIDDEN,
      status: 403,
    });
  }

  const existingTask = await db.findOne({
    model: "Task",
    where: { id },
  });

  if (!existingTask) {
    errorResponse({
      message: MESSAGES.TASK_NOT_FOUND,
      status: 404,
    });
  }

  const dataToUpdate = {};
  if (title !== undefined) dataToUpdate.title = title;
  if (description !== undefined) dataToUpdate.description = description;
  if (priority !== undefined) dataToUpdate.priority = priority;
  if (dueDate !== undefined) dataToUpdate.dueDate = new Date(dueDate);

  const updatedTask = await db.updateOne({
    model: "Task",
    where: { id },
    data: dataToUpdate,
    select: taskSelectFields,
  });

  return updatedTask;
};

export const updateTaskStatusService = async (req) => {
  const { id } = req.params;
  const { status } = req.body;

  const task = await db.findOne({
    model: "Task",
    where: { id },
  });

  if (!task) {
    errorResponse({
      message: MESSAGES.TASK_NOT_FOUND,
      status: 404,
    });
  }

  // Ownership check: MEMBER can only update status if assigned to this task
  if (!isAdmin(req.user) && task.assigneeId !== req.user.id) {
    errorResponse({
      message: MESSAGES.NOT_TASK_ASSIGNEE,
      status: 403,
    });
  }

  const updatedTask = await db.updateOne({
    model: "Task",
    where: { id },
    data: { status },
    select: taskSelectFields,
  });

  return updatedTask;
};

export const assignTaskService = async (req) => {
  const { id } = req.params;
  const { assigneeId } = req.body;

  // Admin-only check
  if (!isAdmin(req.user)) {
    errorResponse({
      message: MESSAGES.FORBIDDEN,
      status: 403,
    });
  }

  const task = await db.findOne({
    model: "Task",
    where: { id },
  });

  if (!task) {
    errorResponse({
      message: MESSAGES.TASK_NOT_FOUND,
      status: 404,
    });
  }

  // Verify assignee is member of the task's project
  const memberValid = await isProjectMember(task.projectId, assigneeId);
  if (!memberValid) {
    errorResponse({
      message: MESSAGES.NOT_PROJECT_MEMBER,
      status: 400,
    });
  }

  const updatedTask = await db.updateOne({
    model: "Task",
    where: { id },
    data: { assigneeId },
    select: taskSelectFields,
  });

  return updatedTask;
};

export const deleteTaskService = async (req) => {
  const { id } = req.params;

  // Admin-only check
  if (!isAdmin(req.user)) {
    errorResponse({
      message: MESSAGES.FORBIDDEN,
      status: 403,
    });
  }

  const task = await db.findOne({
    model: "Task",
    where: { id },
  });

  if (!task) {
    errorResponse({
      message: MESSAGES.TASK_NOT_FOUND,
      status: 404,
    });
  }

  const deletedTask = await db.deleteOne({
    model: "Task",
    where: { id },
  });

  return deletedTask;
};

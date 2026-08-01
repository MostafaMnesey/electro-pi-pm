import { asyncHandler, successResponse } from "../../Utils/Response.js";
import * as service from "./task.service.js";
import { MESSAGES } from "../../Constants/messages.constants.js";

export const createTask = asyncHandler(async (req, res, next) => {
  const data = await service.createTaskService(req);
  return successResponse({
    res,
    message: MESSAGES.TASK_CREATED,
    data,
  });
});

export const getProjectTasks = asyncHandler(async (req, res, next) => {
  const data = await service.getProjectTasksService(req);
  return successResponse({
    res,
    message: MESSAGES.TASK_FETCHED,
    data,
  });
});

export const getTaskById = asyncHandler(async (req, res, next) => {
  const data = await service.getTaskByIdService(req);
  return successResponse({
    res,
    message: MESSAGES.TASK_FETCHED,
    data,
  });
});

export const updateTask = asyncHandler(async (req, res, next) => {
  const data = await service.updateTaskService(req);
  return successResponse({
    res,
    message: MESSAGES.TASK_UPDATED,
    data,
  });
});

export const updateTaskStatus = asyncHandler(async (req, res, next) => {
  const data = await service.updateTaskStatusService(req);
  return successResponse({
    res,
    message: MESSAGES.TASK_UPDATED,
    data,
  });
});

export const assignTask = asyncHandler(async (req, res, next) => {
  const data = await service.assignTaskService(req);
  return successResponse({
    res,
    message: MESSAGES.TASK_UPDATED,
    data,
  });
});

export const deleteTask = asyncHandler(async (req, res, next) => {
  const data = await service.deleteTaskService(req);
  return successResponse({
    res,
    message: MESSAGES.TASK_DELETED,
    data,
  });
});

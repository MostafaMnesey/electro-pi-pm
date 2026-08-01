import { asyncHandler, successResponse } from "../../Utils/Response.js";
import * as service from "./project.service.js";
import { MESSAGES } from "../../Constants/messages.constants.js";

export const createProject = asyncHandler(async (req, res, next) => {
  const data = await service.createProjectService(req);
  return successResponse({
    res,
    message: MESSAGES.PROJECT_CREATED,
    data: data,
  });
});

export const getMyProjects = asyncHandler(async (req, res, next) => {
  const data = await service.getMyProjectsService(req);
  return successResponse({
    res,
    message: MESSAGES.PROJECT_FETCHED,
    data: data,
  });
});

export const getAllProjects = asyncHandler(async (req, res, next) => {
  const data = await service.getAllProjectsService(req);
  return successResponse({
    res,
    message: MESSAGES.FETCHED,
    data: data,
  });
});

export const getProjectBySlug = asyncHandler(async (req, res, next) => {
  const data = await service.getProjectBySlugService(req);
  return successResponse({
    res,
    message: MESSAGES.PROJECT_FETCHED,
    data: data,
  });
});

export const updateProject = asyncHandler(async (req, res, next) => {
  const data = await service.updateProjectService(req);
  return successResponse({
    res,
    message: MESSAGES.PROJECT_UPDATED,
    data: data,
  });
});

export const deleteProject = asyncHandler(async (req, res, next) => {
  const data = await service.deleteProjectService(req);
  return successResponse({
    res,
    message: MESSAGES.PROJECT_DELETED,
    data: data,
  });
});

export const addMembers = asyncHandler(async (req, res, next) => {
  const data = await service.addMembersService(req);
  return successResponse({
    res,
    message: MESSAGES.MEMBER_ADDED,
    data: data,
  });
});

export const removeMembers = asyncHandler(async (req, res, next) => {
  const data = await service.removeMembersService(req);
  return successResponse({
    res,
    message: MESSAGES.MEMBER_REMOVED,
    data: data,
  });
});

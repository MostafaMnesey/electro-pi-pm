import { asyncHandler, successResponse } from "../../Utils/Response.js";
import * as service from "./user.service.js";
import { MESSAGES } from "../../Constants/messages.constants.js";

export const getProfile = asyncHandler(async (req, res, next) => {
  const data = await service.getProfileService(req);
  return successResponse({
    res,
    message: MESSAGES.PROFILE_FETCHED,
    data: data,
  });
});

export const getAllusers = asyncHandler(async (req, res, next) => {
  const data = await service.usersService(req);
  return successResponse({
    res,
    message: MESSAGES.FETCHED,
    data: data,
  });
});

export const changeActiveStatus = asyncHandler(async (req, res, next) => {
  const data = await service.changeUserActiveStatusService(req);
  return successResponse({
    res,
    message: MESSAGES.USER_STATUS_UPDATED,
    data: data,
  });
});

export const approveUser = asyncHandler(async (req, res, next) => {
  const data = await service.approveUserService(req);
  return successResponse({
    res,
    message: MESSAGES.USER_STATUS_UPDATED,
    data: data,
  });
});

export const getAllUsersPending = asyncHandler(async (req, res, next) => {
  const data = await service.getAllUsersPendingService(req);
  return successResponse({
    res,
    message: MESSAGES.FETCHED,
    data: data,
  });
});


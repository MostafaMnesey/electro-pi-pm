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

export const users = asyncHandler(async (req, res, next) => {
  const data = await service.usersService(req);
  return successResponse({
    res,
    message: MESSAGES.LOGIN_SUCCESS,
    data: data,
  });
});

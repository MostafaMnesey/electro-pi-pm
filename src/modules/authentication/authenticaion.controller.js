import { asyncHandler, successResponse } from "../../Utils/Response.js";
import * as service from "./authenticaion.service.js";
import { MESSAGES } from "../../Constants/messages.constants.js";

export const signup = asyncHandler(async (req, res, next) => {
  const data = await service.signupService(req);
  return successResponse({
    res,
    status: 201,
    message: MESSAGES.SIGNUP_SUCCESS,
  });
});

export const signin = asyncHandler(async (req, res, next) => {
  const data = await service.signinService(req);
  return successResponse({
    res,
    message: MESSAGES.LOGIN_SUCCESS,
    data: data,
  });
});

export const refreshToken = asyncHandler(async (req, res, next) => {
  const data = await service.refreshTokenService(req);
  return successResponse({
    res,
    message: MESSAGES.TOKEN_REFRESHED,
    data,
  });
});


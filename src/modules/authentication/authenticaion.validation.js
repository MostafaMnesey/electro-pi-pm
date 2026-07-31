import Joi from "joi";
import { MESSAGES } from "../../Constants/messages.constants.js";
import generalFields from "../../Utils/GeneralFields/index.js";

export const signupSchema = {
  body: Joi.object({
    name: generalFields.name.required().messages({
      "string.empty": MESSAGES.NAME_REQUIRED,
      "any.required": MESSAGES.NAME_REQUIRED,
    }),
    email: generalFields.email.required().messages({
      "string.email": MESSAGES.EMAIL_INVALID,
      "any.required": MESSAGES.EMAIL_REQUIRED,
    }),
    password: generalFields.password.required().messages({
      "string.pattern": MESSAGES.PASSWORD_INVALID,
      "any.required": MESSAGES.PASSWORD_REQUIRED,
    }),
    phone: generalFields.phone.required().messages({
      "string.pattern": MESSAGES.PHONE_INVALID,
      "any.required": MESSAGES.PHONE_REQUIRED,
    }),
    confirmPassword: generalFields.confirmPassword.required().messages({
      "string.pattern": MESSAGES.CONFIRM_PASSWORD_INVALID,
      "any.required": MESSAGES.CONFIRM_PASSWORD_REQUIRED,
    }),
  }),
};

export const signinSchema = {
  body: Joi.object({
    email: generalFields.email.required().messages({
      "string.email": MESSAGES.EMAIL_INVALID,
      "any.required": MESSAGES.EMAIL_REQUIRED,
    }),
    password: generalFields.password.required().messages({
      "string.pattern": MESSAGES.PASSWORD_INVALID,
      "any.required": MESSAGES.PASSWORD_REQUIRED,
    }),
  }),
};

export const refreshTokenSchema = {
  body: Joi.object({
    refreshToken: Joi.string().required().messages({
      "string.empty": MESSAGES.REFRESH_TOKEN_REQUIRED,
      "any.required": MESSAGES.REFRESH_TOKEN_REQUIRED,
    }),
  }),
};


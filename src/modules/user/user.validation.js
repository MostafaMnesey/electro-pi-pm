import Joi from "joi";
import { MESSAGES } from "../../Constants/messages.constants.js";
import generalFields from "../../Utils/GeneralFields/index.js";
import { paginationSchema } from "../../Constants/globalValidation.js";

export const getAllUsers = {
  body: Joi.object({
    ...paginationSchema,
    search: Joi.string().optional().allow("").default("").messages({
      "string.base": MESSAGES.NAME_REQUIRED,
      "any.required": MESSAGES.NAME_REQUIRED,
    }),
    approve: Joi.boolean().optional().default(false).messages({
      "boolean.base": MESSAGES.NAME_REQUIRED,
      "any.required": MESSAGES.NAME_REQUIRED,
    }),
    role: Joi.string().optional().default("").messages({
      "string.base": MESSAGES.NAME_REQUIRED,
      "any.required": MESSAGES.NAME_REQUIRED,
    }),
    
  }),
};

import Joi from "joi";
import { MESSAGES } from "../../Constants/messages.constants.js";
import generalFields from "../../Utils/GeneralFields/index.js";
import { paginationSchema } from "../../Constants/globalValidation.js";

export const getAllUsersSchema = {
  query: Joi.object({
    page:paginationSchema.page,
    limit:paginationSchema.limit,
    search: Joi.string().optional().allow(""),
    approved: Joi.boolean().optional(),
    active: Joi.boolean().optional(),
    role: Joi.string().optional().allow(""),
  }),
};

export const changeActiveStatusSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

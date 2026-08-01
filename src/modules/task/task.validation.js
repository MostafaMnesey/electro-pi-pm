import Joi from "joi";
import generalFields from "../../Utils/GeneralFields/index.js";
import { paginationSchema } from "../../Constants/globalValidation.js";

export const createTaskSchema = {
  params: Joi.object({
    projectId: generalFields.id.required(),
  }).required(),
  body: Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
      "string.base": "Title must be a string",
      "string.empty": "Title cannot be empty",
      "string.min": "Title must be at least {#limit} characters",
      "any.required": "Title is required",
    }),
    description: Joi.string().optional().allow("").empty(""),
    priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").required().messages({
      "any.only": "Priority must be one of LOW, MEDIUM, HIGH",
      "any.required": "Priority is required",
    }),
    dueDate: Joi.date().iso().required().messages({
      "date.base": "dueDate must be a valid date",
      "date.format": "dueDate must be in ISO format",
      "any.required": "dueDate is required",
    }),
    assigneeId: generalFields.id.required().messages({
      "any.required": "assigneeId is required",
    }),
  }).required(),
};

export const getTasksSchema = {
  params: Joi.object({
    projectId: generalFields.id.required(),
  }).required(),
  query: Joi.object({
    status: Joi.string().valid("TODO", "IN_PROGRESS", "DONE").optional(),
    priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").optional(),
    assigneeId: generalFields.id.optional(),
    search: Joi.string().optional().allow(""),
    page: paginationSchema.page,
    limit: paginationSchema.limit,
  }),
};

export const getTaskByIdSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

export const updateTaskSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
  body: Joi.object({
    title: Joi.string().min(3).max(100).optional(),
    description: Joi.string().optional().allow("").empty(""),
    priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").optional(),
    dueDate: Joi.date().iso().optional(),
    status: Joi.forbidden().messages({
      "any.unknown": "Status cannot be updated through this endpoint",
    }),
    assigneeId: Joi.forbidden().messages({
      "any.unknown": "Assignee cannot be updated through this endpoint",
    }),
  }).required(),
};

export const updateTaskStatusSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
  body: Joi.object({
    status: Joi.string().valid("TODO", "IN_PROGRESS", "DONE").required().messages({
      "any.only": "Status must be one of TODO, IN_PROGRESS, DONE",
      "any.required": "Status is required",
    }),
  }).required(),
};

export const assignTaskSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
  body: Joi.object({
    assigneeId: generalFields.id.required().messages({
      "any.required": "assigneeId is required",
    }),
  }).required(),
};

export const deleteTaskSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

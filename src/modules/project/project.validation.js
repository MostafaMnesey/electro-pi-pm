import Joi from "joi";
import { MESSAGES } from "../../Constants/messages.constants.js";
import generalFields from "../../Utils/GeneralFields/index.js";
import { paginationSchema } from "../../Constants/globalValidation.js";

export const createProjectSchema = {
  body: Joi.object({
    name: generalFields.name.required(),
    description: Joi.string().optional().allow("").empty(""),
    members: Joi.array().items(generalFields.id).optional().default([]),
  }).required(),
};

export const getProjectBySlugSchema = {
  params: Joi.object({
    slug: generalFields.slug.required(),
  }).required(),
};

export const updateProjectSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
  body: Joi.object({
    name: generalFields.name.optional(),
    description: Joi.string().optional().allow("").empty(""),
  }).required(),
};

export const deleteProjectSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
};

export const addMembersSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
  body: Joi.object({
    userIds: Joi.array().items(generalFields.id).min(1).required(),
  }).required(),
};

export const removeMembersSchema = {
  params: Joi.object({
    id: generalFields.id.required(),
  }).required(),
  body: Joi.object({
    userIds: Joi.array().items(generalFields.id).min(1).required(),
  }).required(),
};

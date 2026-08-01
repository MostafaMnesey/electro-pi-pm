import { Router } from "express";
import * as controller from "./project.controller.js";
import { authentication } from "../../Middlewares/Authentication.js";
import { validation } from "../../Middlewares/Validation.js";
import { authorize, authorizeResource } from "../../Middlewares/AuthorizationMiddleware.js";
import * as schemas from "./project.validation.js";
import { PERMISSIONS_V2 } from "../../Constants/permissions.constants.js";

const router = Router();
const resource = "project";

router.get("/", authentication(), authorize(PERMISSIONS_V2.PROJECTS.READ), controller.getAllProjects);

router.get("/my-projects", authentication(), authorize(PERMISSIONS_V2.PROJECTS.READ), controller.getMyProjects);

router.post("/", authentication(), validation(schemas.createProjectSchema), authorize(PERMISSIONS_V2.PROJECTS.CREATE), controller.createProject);

router.get("/:slug", authentication(), validation(schemas.getProjectBySlugSchema), authorizeResource(resource), controller.getProjectBySlug);

router.patch("/:id", authentication(), validation(schemas.updateProjectSchema), authorizeResource(resource), controller.updateProject);

router.delete("/:id", authentication(), validation(schemas.deleteProjectSchema), authorizeResource(resource), controller.deleteProject);

router.post("/:id/add-members", authentication(), validation(schemas.addMembersSchema), authorizeResource(resource), controller.addMembers);

router.delete("/:id/remove-members", authentication(), validation(schemas.removeMembersSchema), authorizeResource(resource), controller.removeMembers);

export default router;
import { Router } from "express";
import * as controller from "./user.controller.js";
import { authentication } from "../../Middlewares/Authentication.js";
import { validation } from "../../Middlewares/Validation.js";
import { authorizeResource } from "../../Middlewares/AuthorizationMiddleware.js";
import * as schemas from "./user.validation.js";

const router = Router();
const resource = "user";

router.get("/profile", authentication(), controller.getProfile);
router.get("/", authentication(), validation(schemas.getAllUsersSchema), authorizeResource(resource), controller.getAllusers);
router.patch("/:id/active", authentication(), validation(schemas.changeActiveStatusSchema), authorizeResource(resource), controller.changeActiveStatus);

router.get("/pending-approval", authentication(), validation(schemas.getAllUsersSchema), authorizeResource(resource), controller.getAllUsersPending);
router.patch("/:id/approve", authentication(), validation(schemas.changeApproveStatusSchema), authorizeResource(resource), controller.approveUser);

export default router;
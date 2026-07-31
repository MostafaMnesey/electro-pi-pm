import { Router } from "express";
import * as controller from "./user.controller.js";

import { authentication } from "../../Middlewares/Authentication.js";
import { validation } from "../../Middlewares/Validation.js";


import { authorizeResource } from "../../Middlewares/AuthorizationMiddleware.js";
import { paginationSchema } from "../../Constants/globalValidation.js";

const router = Router();

const resource = "user";

router.get("/profile", authentication(), controller.getProfile);
router.get("/", authentication(),validation(paginationSchema),authorizeResource(resource), controller.users);

export default router;
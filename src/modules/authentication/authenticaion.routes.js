import { Router } from "express";
import * as controller from "./authenticaion.controller.js";
import { validation } from "../../Middlewares/Validation.js";
import * as schemas from "./authenticaion.validation.js";

const router = Router();

router.post("/signup", validation(schemas.signupSchema), controller.signup);
router.post("/signin", validation(schemas.signinSchema), controller.signin);
router.post("/refresh-token", validation(schemas.refreshTokenSchema), controller.refreshToken);

export default router;
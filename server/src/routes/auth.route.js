import { Router } from "express";

import { registerValidator } from "../validators/auth/register.validator.js";
import { registerController } from "../controllers/auth/register.controller.js";

import { loginValidator } from "../validators/auth/login.validator.js";
import { loginController } from "../controllers/auth/login.controller.js";

import { refreshTokenController } from "../controllers/auth/refresh-token.controller.js";
import { logoutController } from "../controllers/auth/logout.controller.js";
import { meController } from "../controllers/auth/me.controller.js";

import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", registerValidator, registerController);
router.post("/login", loginValidator, loginController);
router.post("/refresh-token", refreshTokenController);

// Protected routes
router.post("/logout", authenticate, logoutController);
router.get("/me", authenticate, meController);

export default router;

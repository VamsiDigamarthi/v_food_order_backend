import { Router } from "express";

import * as login from "../Controller/LoginController.js";

import { verifyToken } from "../Middleware/ValidateToken.js";

const router = Router();

router.post("/login-email-id", login.loginController);

router.get("/renew-token-login", verifyToken, login.renewTokenLogin);

export default router;

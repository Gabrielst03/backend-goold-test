import { Router } from "express";
import { login, getProfile, verifyToken } from "../../controllers/AuthController.js";
import { autoLogLogin } from "../../middleware/logMiddleware.js";

const router = Router();

router.post("/login", autoLogLogin, login);

router.get("/profile", verifyToken, getProfile);

export default router;

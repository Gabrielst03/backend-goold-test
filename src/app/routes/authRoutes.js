import { Router } from "express";
import { login, getProfile, verifyToken } from "../../controllers/AuthController.js";

const router = Router();

router.post("/login", login);

router.get("/profile", verifyToken, getProfile);

export default router;

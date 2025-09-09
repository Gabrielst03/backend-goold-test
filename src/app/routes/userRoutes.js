import { Router } from "express";
import { createUser, getUsers, getUserById, updateUser } from "../../controllers/UserController.js";
import { verifyToken } from "../../controllers/AuthController.js";
import { requireAdmin, requireOwnershipOrAdmin } from "../../middleware/authMiddleware.js";
import { autoLog } from "../../middleware/logMiddleware.js";

const router = Router();

router.post("/", autoLog("users", "Criar Usuário"), createUser);

router.get("/", verifyToken, requireAdmin, getUsers);
router.get("/:id", verifyToken, requireOwnershipOrAdmin, getUserById);

export default router;
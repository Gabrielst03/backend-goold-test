import { Router } from "express";
import {
    createLog,
    getLogs,
    getMyLogs,
    getLogsByModule,
    getLogsSummary
} from "../../controllers/LogsController.js";
import { verifyToken } from "../../controllers/AuthController.js";
import { requireAdmin } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/summary", verifyToken, requireAdmin, getLogsSummary);

router.get("/my-logs", verifyToken, requireAdmin, getMyLogs);

router.get("/module/:module", verifyToken, requireAdmin, getLogsByModule);

router.post("/", verifyToken, createLog);

router.get("/", verifyToken, requireAdmin, getLogs);

export default router;

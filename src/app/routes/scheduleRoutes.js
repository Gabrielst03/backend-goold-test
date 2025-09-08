import { Router } from "express";
import {
    createSchedule,
    getSchedules,
    getScheduleById,
    updateSchedule,
    updateScheduleStatus,
    cancelSchedule,
    deleteSchedule,
    getMySchedules,
    getUpcomingSchedules
} from "../../controllers/ScheduleController.js";
import { verifyToken } from "../../controllers/AuthController.js";
import { requireAdmin } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/upcoming", verifyToken, getUpcomingSchedules);

// Rota para listar agendamentos do usuário logado
router.get("/my-schedules", verifyToken, getMySchedules);

router.post("/", verifyToken, createSchedule);

router.get("/", verifyToken, getSchedules);

router.get("/:id", verifyToken, getScheduleById);

router.put("/:id", verifyToken, updateSchedule);

router.patch("/:id/status", verifyToken, requireAdmin, updateScheduleStatus);

router.patch("/:id/cancel", verifyToken, cancelSchedule);

router.delete("/:id", verifyToken, deleteSchedule);

export default router;

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
import { autoLog } from "../../middleware/logMiddleware.js";

const router = Router();

router.get("/upcoming", verifyToken, getUpcomingSchedules);

router.get("/my-schedules", verifyToken, getMySchedules);

router.post("/", verifyToken, autoLog("Schedule", "Criação de agendamento"), createSchedule);

router.get("/", verifyToken, getSchedules);

router.get("/:id", verifyToken, getScheduleById);

router.put("/:id", verifyToken, updateSchedule);

router.patch("/:id/status", verifyToken, requireAdmin, autoLog("Schedule", "Alterar Status do Agendamento"), updateScheduleStatus);

router.patch("/:id/cancel", verifyToken, autoLog("Schedule", "Cancelamento de agendamento"), cancelSchedule);

router.delete("/:id", verifyToken, deleteSchedule);

export default router;

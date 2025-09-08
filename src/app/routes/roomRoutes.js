import { Router } from "express";
import {
    createRoom,
    getRooms,
    getRoomById,
    updateRoomAvailability,
    updateRoom,
    deleteRoom,
    getAvailableRooms
} from "../../controllers/RoomController.js";
import { verifyToken } from "../../controllers/AuthController.js";
import { requireAdmin } from "../../middleware/authMiddleware.js";

const router = Router();

router.get("/available", verifyToken, getAvailableRooms);

router.post("/", verifyToken, requireAdmin, createRoom);

router.get("/", verifyToken, getRooms);

router.get("/:id", verifyToken, getRoomById);

router.put("/:id", verifyToken, requireAdmin, updateRoom);

router.patch("/:id/availability", verifyToken, requireAdmin, updateRoomAvailability);

router.delete("/:id", verifyToken, requireAdmin, deleteRoom);

export default router;
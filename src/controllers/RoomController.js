import Room from '../models/Room.js';

export async function createRoom(req, res) {
    try {
        const { number, startTime, endTime, intervalMinutes } = req.body;

        if (!number) {
            return res.status(400).json({ message: "Room number is required" });
        }

        const alreadyExists = await Room.findOne({ where: { number } });

        if (alreadyExists) {
            return res.status(400).json({ message: "Room already exists" });
        }

        const room = await Room.create({
            number,
            availability: true,
            startTime,
            endTime,
            intervalMinutes: intervalMinutes || 30
        });

        return res.status(201).json(room);

    } catch (error) {
        console.error("Error creating room:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getRooms(req, res) {
    try {
        const rooms = await Room.findAll();
        return res.status(200).json(rooms);
    } catch (error) {
        console.error("Error fetching rooms:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getRoomById(req, res) {
    try {
        const { id } = req.params;
        const room = await Room.findByPk(id);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        return res.status(200).json(room);
    } catch (error) {
        console.error("Error fetching room:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateRoomAvailability(req, res) {
    try {
        const { id } = req.params;
        const { availability } = req.body;

        if (typeof availability !== 'boolean') {
            return res.status(400).json({ message: "Availability must be a boolean value" });
        }

        const room = await Room.findByPk(id);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        room.availability = availability;
        await room.save();

        return res.status(200).json(room);
    } catch (error) {
        console.error("Error updating room availability:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function updateRoom(req, res) {
    try {
        const { id } = req.params;
        const { number, availability, startTime, endTime, intervalMinutes } = req.body;

        const room = await Room.findByPk(id);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        if (number && number !== room.number) {
            const existingRoom = await Room.findOne({ where: { number } });
            if (existingRoom) {
                return res.status(400).json({ message: "Room number already exists" });
            }
        }

        if (number) room.number = number;
        if (typeof availability === 'boolean') room.availability = availability;
        if (startTime) room.startTime = startTime;
        if (endTime) room.endTime = endTime;
        if (intervalMinutes) room.intervalMinutes = intervalMinutes;

        await room.save();

        return res.status(200).json(room);
    } catch (error) {
        console.error("Error updating room:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteRoom(req, res) {
    try {
        const { id } = req.params;
        const room = await Room.findByPk(id);

        if (!room) {
            return res.status(404).json({ message: "Room not found" });
        }

        await room.destroy();

        return res.status(200).json({ message: "Room deleted successfully" });
    } catch (error) {
        console.error("Error deleting room:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function getAvailableRooms(req, res) {
    try {
        const availableRooms = await Room.findAll({
            where: { availability: true }
        });

        return res.status(200).json(availableRooms);
    } catch (error) {
        console.error("Error fetching available rooms:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
import Schedule from '../models/Schedule.js';
import Room from '../models/Room.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

export async function createSchedule(req, res) {
    try {
        const { scheduleDate, roomId } = req.body;
        const userId = req.user.id;

        if (!scheduleDate || !roomId) {
            return res.status(400).json({
                message: "Schedule date and room ID are required"
            });
        }

        const scheduleDateObj = new Date(scheduleDate);
        const now = new Date();

        if (scheduleDateObj <= now) {
            return res.status(400).json({
                message: "Schedule date must be in the future"
            });
        }

        const room = await Room.findByPk(roomId);
        if (!room) {
            return res.status(404).json({
                message: "Room not found"
            });
        }

        if (!room.availability) {
            return res.status(400).json({
                message: "Room is not available"
            });
        }

        const existingSchedule = await Schedule.findOne({
            where: {
                roomId,
                scheduleDate,
                status: {
                    [Op.in]: ['pending', 'confirmed']
                }
            }
        });

        if (existingSchedule) {
            return res.status(409).json({
                message: "Room is already scheduled for this date and time"
            });
        }

        const schedule = await Schedule.create({
            scheduleDate,
            userId,
            roomId,
            status: 'pending'
        });

        const createdSchedule = await Schedule.findByPk(schedule.id);

        return res.status(201).json(createdSchedule);

    } catch (error) {
        console.error("Error creating schedule:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getSchedules(req, res) {
    try {
        const { status, roomId, userId, startDate, endDate, page = 1, limit = 10 } = req.query;
        const currentUserId = req.user.id;
        const isAdmin = req.user.accountType === 'admin';

        let whereConditions = {};

        if (!isAdmin) {
            whereConditions.userId = currentUserId;
        }

        if (status) {
            whereConditions.status = status;
        }

        if (roomId) {
            whereConditions.roomId = roomId;
        }

        if (userId && isAdmin) {
            whereConditions.userId = userId;
        }

        if (startDate && endDate) {
            whereConditions.scheduleDate = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        } else if (startDate) {
            whereConditions.scheduleDate = {
                [Op.gte]: new Date(startDate)
            };
        } else if (endDate) {
            whereConditions.scheduleDate = {
                [Op.lte]: new Date(endDate)
            };
        }

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const offset = (pageNum - 1) * limitNum;

        const { count: total, rows: schedules } = await Schedule.findAndCountAll({
            where: whereConditions,
            include: [
                {
                    model: Room,
                    as: 'room',
                    attributes: ['id', 'number', 'availability']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ],
            order: [['scheduleDate', 'ASC']],
            limit: limitNum,
            offset
        });

        const totalPages = Math.ceil(total / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPreviousPage = pageNum > 1;

        return res.status(200).json({
            schedules,
            total,
            totalPages,
            hasNextPage,
            hasPreviousPage
        });

    } catch (error) {
        console.error("Error fetching schedules:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getScheduleById(req, res) {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;
        const isAdmin = req.user.accountType === 'admin';

        const schedule = await Schedule.findByPk(id, {
            include: [
                {
                    model: Room,
                    as: 'room',
                    attributes: ['id', 'number', 'availability']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ]
        });

        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        if (!isAdmin && schedule.userId !== currentUserId) {
            return res.status(403).json({
                message: "Access denied. You can only view your own schedules"
            });
        }

        return res.status(200).json(schedule);

    } catch (error) {
        console.error("Error fetching schedule:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function updateSchedule(req, res) {
    try {
        const { id } = req.params;
        const { scheduleDate, roomId } = req.body;
        const currentUserId = req.user.id;
        const isAdmin = req.user.accountType === 'admin';

        const schedule = await Schedule.findByPk(id);

        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        if (!isAdmin && schedule.userId !== currentUserId) {
            return res.status(403).json({
                message: "Access denied. You can only update your own schedules"
            });
        }

        if (schedule.status === 'confirmed' && !isAdmin) {
            return res.status(400).json({
                message: "Cannot update confirmed schedule"
            });
        }

        if (scheduleDate) {
            const scheduleDateObj = new Date(scheduleDate);
            const now = new Date();

            if (scheduleDateObj <= now) {
                return res.status(400).json({
                    message: "Schedule date must be in the future"
                });
            }

            const existingSchedule = await Schedule.findOne({
                where: {
                    roomId: roomId || schedule.roomId,
                    scheduleDate,
                    status: {
                        [Op.in]: ['pending', 'confirmed']
                    },
                    id: {
                        [Op.ne]: id
                    }
                }
            });

            if (existingSchedule) {
                return res.status(409).json({
                    message: "Room is already scheduled for this date and time"
                });
            }
        }

        if (roomId && roomId !== schedule.roomId) {
            const room = await Room.findByPk(roomId);
            if (!room) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }

            if (!room.availability) {
                return res.status(400).json({
                    message: "Room is not available"
                });
            }
        }

        if (scheduleDate) schedule.scheduleDate = scheduleDate;
        if (roomId) schedule.roomId = roomId;

        await schedule.save();

        return res.status(200).json(schedule);

    } catch (error) {
        console.error("Error updating schedule:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function updateScheduleStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const isAdmin = req.user.accountType === 'admin';

        if (!isAdmin) {
            return res.status(403).json({
                message: "Access denied. Only admins can change schedule status"
            });
        }

        if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                message: "Invalid status. Must be 'pending', 'confirmed', or 'cancelled'"
            });
        }

        const schedule = await Schedule.findByPk(id);

        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        schedule.status = status;
        await schedule.save();

        return res.status(200).json(schedule);

    } catch (error) {
        console.error("Error updating schedule status:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function cancelSchedule(req, res) {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;
        const isAdmin = req.user.accountType === 'admin';

        const schedule = await Schedule.findByPk(id);

        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        if (!isAdmin && schedule.userId !== currentUserId) {
            return res.status(403).json({
                message: "Access denied. You can only cancel your own schedules"
            });
        }

        if (schedule.status === 'cancelled') {
            return res.status(400).json({
                message: "Schedule is already cancelled"
            });
        }

        schedule.status = 'cancelled';
        await schedule.save();

        return res.status(200).json({
            message: "Schedule cancelled successfully",
            schedule
        });

    } catch (error) {
        console.error("Error cancelling schedule:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function deleteSchedule(req, res) {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;
        const isAdmin = req.user.accountType === 'admin';

        const schedule = await Schedule.findByPk(id);

        if (!schedule) {
            return res.status(404).json({
                message: "Schedule not found"
            });
        }

        if (!isAdmin && schedule.userId !== currentUserId) {
            return res.status(403).json({
                message: "Access denied. You can only delete your own schedules"
            });
        }

        if (schedule.status === 'confirmed' && !isAdmin) {
            return res.status(400).json({
                message: "Cannot delete confirmed schedule. Cancel it first."
            });
        }

        await schedule.destroy();

        return res.status(200).json({
            message: "Schedule deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting schedule:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getMySchedules(req, res) {
    try {
        const userId = req.user.id;
        const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

        let whereConditions = { userId };

        if (status) {
            whereConditions.status = status;
        }

        if (startDate && endDate) {
            whereConditions.scheduleDate = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const offset = (pageNum - 1) * limitNum;

        const { count: total, rows: schedules } = await Schedule.findAndCountAll({
            where: whereConditions,
            include: [
                {
                    model: Room,
                    as: 'room',
                    attributes: ['id', 'number', 'availability']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email', 'accountType']
                }
            ],
            order: [['scheduleDate', 'ASC']],
            limit: limitNum,
            offset
        });

        const totalPages = Math.ceil(total / limitNum);
        const hasNextPage = pageNum < totalPages;
        const hasPreviousPage = pageNum > 1;

        return res.status(200).json({
            schedules,
            total,
            totalPages,
            hasNextPage,
            hasPreviousPage
        });

    } catch (error) {
        console.error("Error fetching user schedules:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getUpcomingSchedules(req, res) {
    try {
        const currentUserId = req.user.id;
        const isAdmin = req.user.accountType === 'admin';
        const now = new Date();

        let whereConditions = {
            scheduleDate: {
                [Op.gte]: now
            },
            status: {
                [Op.in]: ['pending', 'confirmed']
            }
        };

        if (!isAdmin) {
            whereConditions.userId = currentUserId;
        }

        const schedules = await Schedule.findAll({
            where: whereConditions,
            include: [
                {
                    model: Room,
                    as: 'room',
                    attributes: ['id', 'number', 'availability']
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'firstName', 'lastName', 'email']
                }
            ],
            order: [['scheduleDate', 'ASC']],
            limit: 10
        });

        return res.status(200).json(schedules);

    } catch (error) {
        console.error("Error fetching upcoming schedules:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
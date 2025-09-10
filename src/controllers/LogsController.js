import Logs from '../models/Logs.js';
import User from '../models/User.js';
import { Op } from 'sequelize';
import sequelize from '../config/database.js';

export async function createLog(req, res) {
    try {
        const { module, activityType } = req.body;
        const userId = req.user.id;

        if (!module) {
            return res.status(400).json({
                message: "Module is required"
            });
        }

        if (!activityType) {
            return res.status(400).json({
                message: "Activity type is required"
            });
        }

        const validModules = ['Account', 'Schedule', 'Auth'];
        if (!validModules.includes(module)) {
            return res.status(400).json({
                message: "Invalid module. Must be 'Account', 'Schedule', or 'Auth'"
            });
        }

        const log = await Logs.create({
            userId,
            module,
            activityType,
            activityDate: new Date()
        });

        return res.status(201).json({
            message: "Log created successfully",
            log
        });

    } catch (error) {
        console.error("Error creating log:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getLogs(req, res) {
    try {
        const { module, userId, activityType, startDate, endDate, limit = 50 } = req.query;
        const isAdmin = req.user.accountType === 'admin';
        const currentUserId = req.user.id;

        let whereConditions = {};

        // Se não for admin, só pode ver seus próprios logs
        if (!isAdmin) {
            whereConditions.userId = currentUserId;
        } else {
            // Se for admin e especificou um userId, filtrar por esse userId
            if (userId) {
                whereConditions.userId = userId;
            }
        }

        if (module) {
            whereConditions.module = module;
        }

        if (activityType) {
            whereConditions.activityType = {
                [Op.like]: `%${activityType}%`
            };
        }

        if (startDate && endDate) {
            whereConditions.activityDate = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        } else if (startDate) {
            whereConditions.activityDate = {
                [Op.gte]: new Date(startDate)
            };
        } else if (endDate) {
            whereConditions.activityDate = {
                [Op.lte]: new Date(endDate)
            };
        }

        const logs = await Logs.findAll({
            where: whereConditions,
            order: [['activityDate', 'DESC']],
            limit: parseInt(limit),
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email', 'accountType'],
                required: false
            }]
        });

        return res.status(200).json({
            total: logs.length,
            logs
        });

    } catch (error) {
        console.error("Error fetching logs:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getMyLogs(req, res) {
    try {
        const userId = req.user.id;
        const { module, activityType, startDate, endDate, limit = 50 } = req.query;

        let whereConditions = { userId };

        if (module) {
            whereConditions.module = module;
        }

        if (activityType) {
            whereConditions.activityType = {
                [Op.like]: `%${activityType}%`
            };
        }

        if (startDate && endDate) {
            whereConditions.activityDate = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        } else if (startDate) {
            whereConditions.activityDate = {
                [Op.gte]: new Date(startDate)
            };
        } else if (endDate) {
            whereConditions.activityDate = {
                [Op.lte]: new Date(endDate)
            };
        }

        const logs = await Logs.findAll({
            where: whereConditions,
            order: [['activityDate', 'DESC']],
            limit: parseInt(limit),
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email', 'accountType'],
                required: false
            }]
        });

        return res.status(200).json({
            total: logs.length,
            logs
        });

    } catch (error) {
        console.error("Error fetching user logs:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getLogsByModule(req, res) {
    try {
        const { module } = req.params;
        const isAdmin = req.user.accountType === 'admin';
        const currentUserId = req.user.id;
        const { userId, activityType, startDate, endDate, limit = 50 } = req.query;

        const validModules = ['Account', 'Schedule', 'Auth'];
        if (!validModules.includes(module)) {
            return res.status(400).json({
                message: "Invalid module. Must be 'Account', 'Schedule', or 'Auth'"
            });
        }

        let whereConditions = { module };

        // Se não for admin, só pode ver seus próprios logs
        if (!isAdmin) {
            whereConditions.userId = currentUserId;
        } else {
            // Se for admin e especificou um userId, filtrar por esse userId
            if (userId) {
                whereConditions.userId = userId;
            }
        }

        if (activityType) {
            whereConditions.activityType = {
                [Op.like]: `%${activityType}%`
            };
        }

        if (startDate && endDate) {
            whereConditions.activityDate = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const logs = await Logs.findAll({
            where: whereConditions,
            order: [['activityDate', 'DESC']],
            limit: parseInt(limit),
            include: [{
                model: User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email', 'accountType'],
                required: false
            }]
        });

        return res.status(200).json({
            module,
            total: logs.length,
            logs
        });

    } catch (error) {
        console.error("Error fetching logs by module:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function getLogsSummary(req, res) {
    try {
        const isAdmin = req.user.accountType === 'admin';
        const currentUserId = req.user.id;

        let whereConditions = {};

        // Se não for admin, só pode ver seus próprios logs
        if (!isAdmin) {
            whereConditions.userId = currentUserId;
        }

        const logsSummary = await Logs.findAll({
            where: whereConditions,
            attributes: [
                'module',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['module'],
            raw: true
        });


        // Logs dos últimos 7 dias
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentLogs = await Logs.count({
            where: {
                ...whereConditions,
                activityDate: {
                    [Op.gte]: sevenDaysAgo
                }
            }
        });

        const totalLogs = await Logs.count({
            where: whereConditions
        });

        return res.status(200).json({
            summary: {
                totalLogs,
                recentLogs: recentLogs,
                byModule: logsSummary
            }
        });

    } catch (error) {
        console.error("Error fetching logs summary:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

export async function createActivityLog(userId, module, activityType) {
    try {
        await Logs.create({
            userId,
            module,
            activityType,
            activityDate: new Date()
        });
    } catch (error) {
        console.error("Error creating activity log:", error);
    }
}

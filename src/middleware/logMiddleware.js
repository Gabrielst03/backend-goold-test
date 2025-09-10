import { createActivityLog } from '../controllers/LogsController.js';

export function autoLog(module, activityType) {
    return async (req, res, next) => {
        const originalJson = res.json;

        res.json = function (data) {
            if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
                createActivityLog(req.user.id, module, activityType).catch(error => {
                    console.error('Error creating auto log:', error);
                });
            }

            return originalJson.call(this, data);
        };

        next();
    };
}

export function autoLogLogin(req, res, next) {
    const originalJson = res.json;

    res.json = function (data) {
        if (res.statusCode >= 200 && res.statusCode < 300 && data.user) {
            createActivityLog(data.user.id, 'Auth', 'Login').catch(error => {
                console.error('Error creating login log:', error);
            });
        }

        return originalJson.call(this, data);
    };

    next();
}

export function autoLogLogout(req, res, next) {
    const originalJson = res.json;

    res.json = function (data) {
        if (res.statusCode >= 200 && res.statusCode < 300 && req.user) {
            createActivityLog(req.user.id, 'Auth', 'Logout').catch(error => {
                console.error('Error creating logout log:', error);
            });
        }

        return originalJson.call(this, data);
    };

    next();
}

// Logs Predefinidos
export const autoLogCreateSchedule = autoLog('Schedule', 'Criação de Agendamento');
export const autoLogUpdateSchedule = autoLog('Schedule', 'Atualização de Agendamento');
export const autoLogCancelSchedule = autoLog('Schedule', 'Cancelamento de Agendamento');
export const autoLogCreateAccount = autoLog('Account', 'Criação de Conta');
export const autoLogUpdateAccount = autoLog('Account', 'Atualização de Conta');
export const autoLogUpdateEmail = autoLog('Account', 'Atualização de E-mail');

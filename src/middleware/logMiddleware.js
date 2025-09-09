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



// Logs Predefinidos
export const autoLogLogin = autoLog('Auth', 'Login');
export const autoLogLogout = autoLog('Auth', 'Logout');
export const autoLogCreateSchedule = autoLog('Schedule', 'Criação de Agendamento');
export const autoLogUpdateSchedule = autoLog('Schedule', 'Atualização de Agendamento');
export const autoLogCancelSchedule = autoLog('Schedule', 'Cancelamento de Agendamento');
export const autoLogCreateAccount = autoLog('Account', 'Criação de Conta');
export const autoLogUpdateAccount = autoLog('Account', 'Atualização de Conta');
export const autoLogUpdateEmail = autoLog('Account', 'Atualização de E-mail');

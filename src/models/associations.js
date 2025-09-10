import User from './User.js';
import Room from './Room.js';
import Schedule from './Schedule.js';
import Logs from './Logs.js';

User.hasMany(Schedule, {
    foreignKey: 'userId',
    as: 'schedules'
});

Schedule.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

Room.hasMany(Schedule, {
    foreignKey: 'roomId',
    as: 'schedules'
});

Schedule.belongsTo(Room, {
    foreignKey: 'roomId',
    as: 'room'
});

User.hasMany(Logs, {
    foreignKey: 'userId',
    as: 'logs'
});

Logs.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

export { User, Room, Schedule, Logs };

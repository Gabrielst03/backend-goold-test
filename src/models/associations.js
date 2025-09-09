import User from './User.js';
import Room from './Room.js';
import Schedule from './Schedule.js';

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

export { User, Room, Schedule };

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const Schedule = sequelize.define("schedules", {
    scheduleDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        },
        allowNull: false,
    },
    roomId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Rooms',
            key: 'id'
        },
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
    }
})

export default Schedule;
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";


const Room = sequelize.define("Rooms", {
    number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    availability: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: true,
    },
    intervalMinutes: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 30,
    }
})

export default Room;
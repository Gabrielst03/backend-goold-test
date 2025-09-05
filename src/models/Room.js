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
    }
})

export default Room;
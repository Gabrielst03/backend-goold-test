import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Logs = sequelize.define("Logs", {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    module: {
        type: DataTypes.ENUM('Account', 'Schedule', 'Auth'),
        allowNull: false
    },
    activityDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    activityType: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

export default Logs;
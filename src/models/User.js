import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const User = sequelize.define("User", {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    accountType: {
        type: DataTypes.ENUM('customer', 'admin'),
        allowNull: false,
    },
    address: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

export default User;

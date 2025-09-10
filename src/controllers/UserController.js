import User from "../models/User.js";
import { hash } from "bcryptjs";
import { formatUserResponse } from "../utils/userFormatter.js";
import { createActivityLog } from "./LogsController.js";

export async function createUser(req, res) {

    const { firstName, lastName, accountType, email, address, password } = req.body;

    const alreadyExists = await User.findOne({ where: { email } });

    const passwordHash = await hash(password, 8);

    if (alreadyExists) {
        return res.status(400).json({ message: "Email already in use" });
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        accountType,
        address,
        password: passwordHash,
    });

    createActivityLog(user.id, 'Account', 'Criação de Conta').catch(error => {
        console.error('Error creating account creation log:', error);
    });

    return res.status(201).json(formatUserResponse(user));
}

export async function getUsers(req, res) {
    const users = await User.findAll({
        attributes: { exclude: ['password'] }
    });
    const formattedUsers = users.map(user => formatUserResponse(user));
    return res.status(200).json(formattedUsers);
}

export async function getUserById(req, res) {
    const { id } = req.params;
    const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] }
    });
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(formatUserResponse(user));
}

export async function updateUser(req, res) {
    const { id } = req.params;
    const { firstName, lastName, email, address } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    await user.update({ firstName, lastName, email, address });
    return res.status(200).json(formatUserResponse(user));
}
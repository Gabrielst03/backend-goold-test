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
    try {
        const { id } = req.params;
        const { firstName, lastName, email, address, accountType } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isAccountTypeChange = accountType && accountType !== user.accountType;

        await user.update({ firstName, lastName, email, address, accountType });

        if (isAccountTypeChange) {
            let action;
            if (accountType === 'admin' && user.accountType === 'customer') {
                action = 'Promoção a Administrador';
            } else if (accountType === 'customer' && user.accountType === 'admin') {
                action = 'Rebaixamento de Administrador';
            } else {
                action = 'Atualização de Tipo de Conta';
            }
            createActivityLog(req.user.id, 'Account', action).catch(error => {
                console.error('Error creating account type change log:', error);
            });
        } else {
            createActivityLog(req.user.id, 'Account', 'Atualização de Perfil').catch(error => {
                console.error('Error creating profile update log:', error);
            });
        }

        return res.status(200).json(formatUserResponse(user));
    } catch (error) {
        console.error("Erro ao atualizar usuário:", error);
        return res.status(500).json({
            message: "Erro interno do servidor"
        });
    }
}

export async function updateUserStatus(req, res) {
    try {
        const { id } = req.params;
        const { isActive } = req.body;
        const currentUserId = req.user.id;

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                message: "isActive deve ser um valor booleano"
            });
        }

        if (parseInt(id) === currentUserId && !isActive) {
            return res.status(403).json({
                message: "Você não pode desativar sua própria conta"
            });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: "Usuário não encontrado"
            });
        }

        await user.update({ status: isActive });

        const action = isActive ? 'Ativação de Conta' : 'Desativação de Conta';
        createActivityLog(req.user.id, 'Account', action).catch(error => {
            console.error('Error creating status update log:', error);
        });

        return res.status(200).json({
            message: `Usuário ${isActive ? 'ativado' : 'desativado'} com sucesso`,
            user: formatUserResponse(user)
        });

    } catch (error) {
        console.error("Erro ao atualizar status do usuário:", error);
        return res.status(500).json({
            message: "Erro interno do servidor"
        });
    }
}
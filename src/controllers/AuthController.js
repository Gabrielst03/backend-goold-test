import User from "../models/User.js";
import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_CONFIG, extractTokenFromHeader } from "../config/jwt.js";
import { formatUserResponse } from "../utils/userFormatter.js";

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email e senha são obrigatórios"
            });
        }

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({
                message: "Credenciais inválidas"
            });
        }

        const isPasswordValid = await compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Credenciais inválidas"
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                accountType: user.accountType
            },
            JWT_CONFIG.secret,
            { expiresIn: JWT_CONFIG.expiresIn }
        );

        return res.status(200).json({
            message: "Login realizado com sucesso",
            token,
            user: formatUserResponse(user)
        });

    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({
            message: "Erro interno do servidor"
        });
    }
}

export async function verifyToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            return res.status(401).json({
                message: "Token de acesso não fornecido ou inválido"
            });
        }

        const decoded = jwt.verify(token, JWT_CONFIG.secret);

        req.user = decoded;

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token expirado"
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Token inválido"
            });
        }

        console.error("Erro na verificação do token:", error);
        return res.status(500).json({
            message: "Erro interno do servidor"
        });
    }
}

export async function getProfile(req, res) {
    try {

        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                message: "Usuário não encontrado"
            });
        }

        return res.status(200).json(formatUserResponse(user));

    } catch (error) {
        console.error("Erro ao buscar perfil:", error);
        return res.status(500).json({
            message: "Erro interno do servidor"
        });
    }
}

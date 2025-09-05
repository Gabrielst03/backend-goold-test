export const JWT_CONFIG = {
    secret: process.env.JWT_SECRET || "jwt_test",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h"
};

export function extractTokenFromHeader(authHeader) {
    if (!authHeader) {
        return null;
    }

    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return null;
    }

    return parts[1];
}

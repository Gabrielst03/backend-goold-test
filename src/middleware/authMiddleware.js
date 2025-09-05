export function requireAdmin(req, res, next) {
    if (req.user.accountType !== 'admin') {
        return res.status(403).json({
            message: "Acesso negado. Apenas administradores podem acessar este recurso."
        });
    }
    next();
}

export function requireOwnershipOrAdmin(req, res, next) {
    const userId = parseInt(req.params.id);
    const currentUserId = req.user.id;
    const isAdmin = req.user.accountType === 'admin';

    if (userId !== currentUserId && !isAdmin) {
        return res.status(403).json({
            message: "Acesso negado. Você só pode acessar seus próprios dados."
        });
    }
    next();
}

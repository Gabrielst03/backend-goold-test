import { Router } from "express";
import { login, getProfile, verifyToken } from "../../controllers/AuthController.js";
import { autoLogLogin, autoLogLogout } from "../../middleware/logMiddleware.js";

const router = Router();

router.post("/login", autoLogLogin, login);

router.post("/logout", verifyToken, autoLogLogout, (req, res) => {
    return res.status(200).json({
        message: "Logout realizado com sucesso"
    });
});

router.get("/profile", verifyToken, getProfile);

export default router;

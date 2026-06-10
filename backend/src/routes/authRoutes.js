import { Router } from "express";
import { getMe, login, logout, signup } from "../controllers/authController.js";

const router = Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.post("/auth/logout", logout);
router.get("/auth/me", getMe);

export default router;

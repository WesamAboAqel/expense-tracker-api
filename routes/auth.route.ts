import express from "express";
import {
    refreshToken,
    sendTokens,
    login,
} from "../controllers/auth.controller.js";
import { generateTokens } from "../middleware/jwt.js";

const router = express.Router();

router.post("/login", login, generateTokens, sendTokens);

router.post("/refresh", refreshToken, sendTokens);

export default router;

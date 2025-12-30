import express from "express";
import {
    refreshToken,
    sendTokens,
    login,
    googleAuth,
} from "../controllers/auth.controller.js";
import { generateTokens } from "../middleware/jwt.js";
import passport from "passport";
import "../services/google.oauth.js";

const router = express.Router();

router.post("/login", login, generateTokens, sendTokens);
router.get(
    "/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
    "/google/callback",
    passport.authenticate("google", { session: false }),
    googleAuth,
    generateTokens,
    sendTokens
);

router.post("/refresh", refreshToken, sendTokens);

export default router;

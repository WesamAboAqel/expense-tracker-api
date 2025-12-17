import { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import {
    getSession,
    refreshTransaction,
    revokeSession,
} from "../repositories/session.repo.js";
import { getUserById } from "../repositories/user.repo.js";
import jwt from "jsonwebtoken";

// @desc    update refresh and access tokens
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const { refreshToken } = request.body;

    if (!refreshToken) {
        response.status(400).json({ msg: "Invalid refresh Token" });
        return;
    }

    const oldRefreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    const newRefreshToken = crypto.randomBytes(64).toString("hex");

    const refresh_token_hash = crypto
        .createHash("sha256")
        .update(newRefreshToken)
        .digest("hex");

    const params = { oldRefreshTokenHash, refresh_token_hash };

    const newSession = await refreshTransaction(params);

    const accessToken = jwt.sign(
        { user_id: newSession.user_id, session_id: newSession.id },
        process.env.JWT_TOKEN_SECRET!,
        { expiresIn: "600s" }
    );

    response.status(200).json({ accessToken, refreshToken: newRefreshToken });
    return;
};

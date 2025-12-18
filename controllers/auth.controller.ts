import { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import { refreshTransaction } from "../repositories/session.repo.js";
import { getUserByUsername } from "../repositories/user.repo.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// @desc    update refresh and access tokens
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const { refreshToken } = request.body;
    // console.log(refreshToken);
    if (!refreshToken) {
        response.status(400).json({ msg: "Invalid refresh Token" });
        return;
    }

    const oldRefreshTokenHash = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    response.locals.refreshToken = crypto.randomBytes(64).toString("hex");

    const refresh_token_hash = crypto
        .createHash("sha256")
        .update(response.locals.refreshToken)
        .digest("hex");

    const params = { oldRefreshTokenHash, refresh_token_hash };

    // console.log(params);

    const newSession = await refreshTransaction(params);

    // console.log(newSession);

    response.locals.accessToken = jwt.sign(
        { user_id: newSession.user_id, session_id: newSession.id },
        process.env.JWT_TOKEN_SECRET!,
        { expiresIn: "600s" }
    );

    next();
};

// @desc    Sends tokens to the client
// @route   POST /api/auth/login & /api/auth/refresh
// @access  Private
export const sendTokens = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    response.status(200).json({
        accessToken: response.locals.accessToken,
        refreshToken: response.locals.refreshToken,
    });
};

// @desc    Login with a user
// @route   POST /api/user/login
// @access  Public
export const login = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username, password } = request.body;

        const user = await getUserByUsername(username);

        if (!user) {
            response.status(400).json({ msg: "User not found" });
            return;
        }

        response.locals.user = user;

        if (!(await bcrypt.compare(password, user.password))) {
            response.status(400).json({ msg: "Wrong password" });
            return;
        }

        next();

        return;
    } catch (error) {
        response.status(400).json({ error });
        console.log(error);
        return;
    }
};

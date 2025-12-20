import type { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { createSession } from "../repositories/session.repo.js";
import bcrypt from "bcrypt";

// @desc    Grants the user access and refresh tokens
// @route   POST /api/login
// @access  Private
export const generateTokens = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const user_id = response.locals.user.id;

    response.locals.refreshToken = crypto.randomBytes(64).toString("hex");
    // console.log(response.locals.refreshToken);

    const refresh_token_hash = crypto
        .createHash("sha256")
        .update(response.locals.refreshToken)
        .digest("hex");

    const session = await createSession({ user_id, refresh_token_hash });

    response.locals.accessToken = jwt.sign(
        { user_id, session_id: session.id },
        process.env.JWT_TOKEN_SECRET!,
        { expiresIn: "600s" }
    );

    next();
};

// @desc    Authenticate Users
// @route   POST /api/*
// @access  Private
export const authentication = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = request.headers["authorization"] || "";

        const [schema, accessToken] = authHeader.split(" ");

        if (schema !== "Bearer" || !accessToken) {
            response.status(401).json({ msg: "Invalid Auth Header!" });
            return;
        }

        const payload = jwt.verify(accessToken, process.env.JWT_TOKEN_SECRET!);
        response.locals.payload = payload;

        next();
    } catch (error) {
        response.status(404).json({ msg: "Authentication Required!" });
        return;
    }
};

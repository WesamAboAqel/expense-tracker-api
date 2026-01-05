import { NextFunction, Request, Response } from "express";
import crypto from "node:crypto";
import { refreshTransaction } from "../repositories/session.repo.js";
import {
    createUser,
    findUserbyGoogleId,
    getUserById,
    getUserByUsername,
} from "../repositories/user.repo.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import passport from "passport";
import { create } from "node:domain";
import { transporter } from "../services/google.nodemailer.js";
import { checkOTP, createOTP } from "../repositories/otp.repo.js";

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
        // console.log(username);

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
    } catch (error) {
        response.status(400).json({ error });
        console.log(error);
        return;
    }
};

// @desc    Google Passport
// @route   GET /api/example
// @access  Public
export const googleAuth = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    // console.log("googleAuth");
    const passportGoogleUser = request.user as {
        google_id: string;
        email: string;
        username: string;
        name: string;
    };

    const searchUser = await findUserbyGoogleId(passportGoogleUser.google_id);

    if (searchUser) {
        response.locals.user = searchUser;
        next();
        return;
    }

    const hashedPassword = await bcrypt.hash(
        crypto.randomBytes(16).toString("hex"),
        10
    );

    const newUser = {
        name: passportGoogleUser.name,
        username: passportGoogleUser.username,
        email: passportGoogleUser.email,
        password: hashedPassword,
        google_id: passportGoogleUser.google_id,
    };

    const user = await createUser(newUser);
    response.locals.user = user;

    next();
    return;
};

// @desc    send otp email after logging in
// @route   POST /api/auth/login
// @access  Private
export const sendOTP = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const user = response.locals.user;
    const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, "0");

    const info = await transporter.sendMail({
        from: `${user.name} wesamabuaqel138@gmail.com`,
        to: `${user.email}`,
        subject: "OTP Verification",
        text: `Dear ${user.name}, you recently requested a one time password to be forwarded to your email, here is it: ${code}, make sure to not share it with anyone please.`, // Plain-text version of the message
        html: `<p>Dear ${user.name},<br> you recently requested a one time password to be forwarded to your email, here is it: <b>${code}</b>, make sure to not share it with anyone please.</p>`, // HTML version of the message
    });

    const code_hash = crypto.createHash("sha256").update(code).digest("hex");

    const params = {
        code_hash,
        user_id: user.id,
    };

    console.log(code_hash);

    await createOTP(params);

    response.status(201).json({ msg: "otp sent" });
    return;
};

// @desc    redeem the otp sent to the email
// @route   POST /api/auth/login
// @access  Private
export const redeemOTP = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const { otp } = request.body;
    const code_hash = crypto.createHash("sha256").update(otp).digest("hex");

    const record = await checkOTP(code_hash);

    response.locals.user = await getUserById(record.user_id);
    next();
};

import type { NextFunction, Request, Response } from "express";
import { createUser, getAllUsers } from "../repositories/user.repo.js";
import bcrypt from "bcrypt";
import { transporter } from "../services/google.nodemailer.js";

// @desc    Get All Users
// @route   GET /api/users
// @access  Private
export const getUsers = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const users = await getAllUsers();
    response.status(200).json(users);
};

// @desc    Add a User
// @route   POST /api/user/signup
// @access  Public
export const signup = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { username, name, password, email } = request.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        if (!username || !name || !hashedPassword) {
            throw new Error("Wrong Inputs");
        }

        const newUser = {
            username,
            email,
            name,
            password: hashedPassword,
            google_id: null,
        };

        response.locals.user = await createUser(newUser);

        next();
    } catch (error) {
        response.status(500).send(error);
        return;
    }
};

// @desc    sends email after signing up
// @route   POST /api/user/signup
// @access  Public
export const signUpEmail = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    const user = response.locals.user;
    const info = await transporter.sendMail({
        from: `${user.name} wesamabuaqel138@gmail.com`,
        to: `${user.email}`,
        subject: "Orientation Email",
        text: `Dear ${user.name}, you signed up successfully for our expenses application, this is our orientation email and we just wanted to say hi.`, // Plain-text version of the message
        html: `<p>Dear ${user.name}, you signed up successfully for our expenses application, this is our orientation email and we just wanted to say hi.</p>`, // HTML version of the message
    });

    response.status(201).json({ msg: "User Created Successfully!" });
};

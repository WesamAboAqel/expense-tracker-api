import type { NextFunction, Request, Response } from "express";
import { createUser, getAllUsers } from "../repositories/user.repo.js";
import bcrypt from "bcrypt";

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
        const { username, name, password } = request.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        if (!username || !name || !hashedPassword) {
            throw new Error("Wrong Inputs");
        }

        const newUser = {
            username,
            name,
            password: hashedPassword,
            google_id: null,
        };

        await createUser(newUser);

        response.status(201).json({ msg: "User Created Successfully!" });
        return;
    } catch (error) {
        response.status(500).send(error);
        return;
    }
};

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

        const newUser = { username, name, password: hashedPassword };

        const user = await createUser(newUser);

        response.status(201).json(user);
        return;
    } catch (error) {
        response.status(500).send(error);
        return;
    }
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

        const users = await getAllUsers();
        // console.log(users);

        const user = users.find((user) => user.username == username);

        if (!user) {
            response.status(400).json({ msg: "User not found" });
            return;
        }

        response.locals.user = user;

        next();
        // console.log("passed");
        return;
    } catch (error) {
        response.status(400).json({ error });
        console.log(error);
        return;
    }
};

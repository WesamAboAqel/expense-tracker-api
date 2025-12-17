import bcrypt from "bcrypt";
import type { NextFunction, Request, Response } from "express";

// @desc    Check Password with hashed password
// @route   POST /api/user/login
// @access  Public
export const checkPassword = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { user } = response.locals;
        const { password } = request.body;

        if (!(await bcrypt.compare(password, user.password))) {
            response.status(400).json({ msg: "Wrong password" });
            return;
        }

        next();
    } catch (error) {
        response.status(404).json({ msg: "Wrong password" });
        return;
    }
};

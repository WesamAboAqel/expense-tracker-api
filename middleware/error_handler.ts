import colors from "colors";
import { formatDateTime } from "../utils/formatDateTime.js";
import { NextFunction, Request, Response } from "express";
colors.enable();

export const errorHandler = (
    error: Error,
    request: Request,
    response: Response,
    next: NextFunction
) => {
    if (error) {
        console.error(formatDateTime(), ` Error: ${error.message}`["red"]);
        return response.status(500).json({ error: error.message });
    }
};

export default errorHandler;

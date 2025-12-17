import colors from "colors";
import { formatDateTime } from "../utils/formatDateTime.js";
import type { NextFunction, Request, Response } from "express";

colors.enable();

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

const logger = (request: Request, response: Response, next: NextFunction) => {
    const methodColors: Partial<Record<HttpMethod, string>> = {
        GET: "green",
        POST: "blue",
        PUT: "yellow",
        DELETE: "red",
    };

    const method: HttpMethod = request.method as HttpMethod;

    const color = methodColors[method] ?? "white";

    const message: any = ` ${request.method} ${
        request.protocol
    }://${request.get("host")}${request.originalUrl}`;

    console.log(formatDateTime(), message[color]);
    next();
};

export default logger;

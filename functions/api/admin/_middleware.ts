import { AppError, ErrorCode } from "@shared/errors";
import { Env } from "@types";

// Basic authorization
const checkAuthorization: PagesFunction<Env> = async (context) => {
    const { request, env } = context;
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Basic ")) {
        throw new AppError(
            "Request isn't authorized",
            ErrorCode.RequestUnauthorized
        );
    }

    const base64Credentials = authHeader.split(" ")[1];
    const credentials = atob(base64Credentials).split(":");
    const apiKey = credentials[0];

    if (apiKey !== env.API_KEY) {
        throw new AppError(
            "Request isn't authorized",
            ErrorCode.RequestUnauthorized
        );
    }

    return await context.next();
};

export const onRequest = [checkAuthorization];

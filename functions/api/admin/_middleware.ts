import { AppError, ErrorCode } from "@shared/errors";
import { Env } from "@types";

import { jwtVerify } from "jose";

const checkAuthorization: PagesFunction<Env> = async (context) => {
    const { API_KEY, USERNAME, JWT_SECRET } = context.env;
    const authHeader = context.request.headers.get("Authorization");

    if (!authHeader) {
        throw new AppError(
            "Request isn't authorized",
            ErrorCode.RequestUnauthorized
        );
    }

    let basicAuthorized = false;
    if (authHeader.startsWith("Basic ")) {
        const base64Credentials = authHeader.split(" ")[1];
        const credentials = atob(base64Credentials).split(":");
        const apiKey = credentials[0];

        if (apiKey === API_KEY) {
            basicAuthorized = true;
        }
    }

    let bearerAuthroized = false;
    if (authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        );
        const { username } = payload;

        if (username === USERNAME) {
            bearerAuthroized = true;
        }
    }

    if (!basicAuthorized && !bearerAuthroized) {
        throw new AppError(
            "Request isn't authorized",
            ErrorCode.RequestUnauthorized
        );
    }

    return await context.next();
};

export const onRequest = [checkAuthorization];

import { AppError, ErrorCode } from "@shared/errors";
import { isCredentials } from "@shared/types";
import { Env } from "@types";

import bcrypt from "bcryptjs";
import { SignJWT } from "jose";

export const onRequestPost: PagesFunction<Env> = async (context) => {
    const { USERNAME, PASSWORD_HASH, JWT_SECRET } = context.env;
    const credentials = await context.request.json();

    if (!isCredentials(credentials)) {
        throw new AppError("Invalid login", ErrorCode.CredentialsInvalid);
    }

    const { username, password } = credentials;
    const usernameMatches = username.toLowerCase() === USERNAME.toLowerCase();
    const passwordMatches = await bcrypt.compare(password, PASSWORD_HASH);
    if (!usernameMatches || !passwordMatches) {
        throw new AppError(
            "Username or password is incorrect",
            ErrorCode.RequestUnauthorized
        );
    }

    const jwt = await new SignJWT({ username })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("2h")
        .sign(new TextEncoder().encode(JWT_SECRET));
    const authorization = { token: jwt };

    return Response.json({ authorization });
};

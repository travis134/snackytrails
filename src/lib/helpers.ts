import { AppError, ErrorCode, isAppErrorData } from "@shared/errors";

// Private helper to generate and retrieve the unique user ID
const getUser = () => {
    const userKey = "user";
    let user = localStorage.getItem(userKey);

    if (!user) {
        user = crypto.randomUUID();
        localStorage.setItem(userKey, user);
    }

    return user;
};

export const appFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
): Promise<Response> => {
    const user = getUser();

    // Ensure headers are initialized
    const headers =
        init?.headers instanceof Headers
            ? init.headers
            : new Headers(init?.headers);
    headers.append("X-User", user);

    // Include the headers in the init object
    const modifiedInit = { ...init, headers };

    const response = await fetch(input, modifiedInit);

    if (!response.ok) {
        const data = await response.json();
        if (isAppErrorData(data)) {
            throw new AppError(data.error, data.error_code);
        } else {
            console.error(data);
            throw new AppError("An unknown error occurred.", ErrorCode.Unknown);
        }
    }

    return response;
};

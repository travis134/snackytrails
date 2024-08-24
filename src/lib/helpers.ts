import { AppError, ErrorCode, isAppErrorData } from "@shared/errors";

// Private helper to generate and retrieve the unique user ID
const getUserId = () => {
    const userIdKey = 'userId';
    let userId = localStorage.getItem(userIdKey);
    
    if (!userId) {
        userId = crypto.randomUUID(); // Generate a new UUID
        localStorage.setItem(userIdKey, userId);
    }
    
    return userId;
};

export const appFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
): Promise<Response> => {
    const userId = getUserId();

    // Ensure headers are initialized
    const headers = init?.headers instanceof Headers ? init.headers : new Headers(init?.headers);
    headers.append('X-User-ID', userId); // Add the user ID header

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

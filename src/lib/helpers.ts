import { AppError, ErrorCode, isAppErrorData } from "@shared/errors";

export const appFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
): Promise<Response> => {
    const response = await fetch(input, init);
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

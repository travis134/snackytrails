import { AppError, ErrorCode, isAppErrorData } from "@shared/errors";

export const appFetch = async (
    input: RequestInfo | URL,
    init?: RequestInit | undefined
): Promise<Response> => {
    const response = await fetch(input, init);

    if (!response.ok) {
        let data;
        try {
            data = await response.json();
        } catch (error) {
            throw new AppError(
                `An unknown error ocurred (status=${response.status}).`,
                ErrorCode.Unknown
            );
        }

        if (isAppErrorData(data)) {
            throw new AppError(data.error, data.error_code);
        } else {
            console.error(data);
            throw new AppError("An unknown error occurred.", ErrorCode.Unknown);
        }
    }

    return response;
};

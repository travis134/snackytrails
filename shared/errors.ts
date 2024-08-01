export type ErrorCode = "user_already_voted" | "invalid_request" | "unknown";

export class APIError extends Error {
    errorCode: ErrorCode;
    status: number;
    innerError?: Error;

    constructor({
        errorCode,
        message,
        statusCode,
        innerError,
    }: {
        errorCode: ErrorCode;
        message: string;
        statusCode: number;
        innerError?: Error;
    }) {
        super(message);
        this.errorCode = errorCode;
        this.name = "APIError";
        this.status = statusCode;
        this.innerError = innerError;
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
    }
}

export const isAPIError = (error: unknown): error is APIError => {
    return error instanceof APIError;
};

export class BadRequestError extends APIError {
    constructor(params?: {
        errorCode?: ErrorCode;
        message?: string;
        innerError?: Error;
    }) {
        super({
            errorCode: params?.errorCode ?? "invalid_request",
            message: params?.message ?? "Bad Request",
            statusCode: 400,
            innerError: params?.innerError,
        });
    }
}

export class UnauthorizedError extends APIError {
    constructor(params?: {
        errorCode?: ErrorCode;
        message?: string;
        innerError?: Error;
    }) {
        super({
            errorCode: params?.errorCode ?? "invalid_request",
            message: params?.message ?? "Unauthorized",
            statusCode: 401,
            innerError: params?.innerError,
        });
    }
}

export class NotFoundError extends APIError {
    constructor(params?: {
        errorCode?: ErrorCode;
        message?: string;
        innerError?: Error;
    }) {
        super({
            errorCode: params?.errorCode ?? "invalid_request",
            message: params?.message ?? "Not Found",
            statusCode: 404,
            innerError: params?.innerError,
        });
    }
}

export class InternalServerError extends APIError {
    constructor(params?: {
        errorCode?: ErrorCode;
        message?: string;
        innerError?: Error;
    }) {
        super({
            errorCode: params?.errorCode ?? "unknown",
            message: params?.message ?? "Internal Server Error",
            statusCode: 500,
            innerError: params?.innerError,
        });
    }
}

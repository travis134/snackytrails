export class APIError extends Error {
    status: number;
    innerError?: Error;

    constructor({
        message,
        statusCode,
        innerError,
    }: {
        message: string;
        statusCode: number;
        innerError?: Error;
    }) {
        super(message);
        this.name = "APIError";
        this.status = statusCode;
        this.innerError = innerError;
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
    }
}

export const isAPIError = (error: unknown): error is APIError => {
    return error instanceof APIError;
};

export class BadRequest extends APIError {
    constructor(params?: { message?: string; innerError?: Error }) {
        super({
            message: params?.message ?? "Bad Request",
            statusCode: 400,
            innerError: params?.innerError,
        });
    }
}

export class Unauthorized extends APIError {
    constructor(params?: { message?: string; innerError?: Error }) {
        super({
            message: params?.message ?? "Unauthorized",
            statusCode: 401,
            innerError: params?.innerError,
        });
    }
}

export class NotFound extends APIError {
    constructor(params?: { message?: string; innerError?: Error }) {
        super({
            message: params?.message ?? "Not Found",
            statusCode: 404,
            innerError: params?.innerError,
        });
    }
}

export class InternalServerError extends APIError {
    constructor(params?: { message?: string; innerError?: Error }) {
        super({
            message: params?.message ?? "Internal Server Error",
            statusCode: 500,
            innerError: params?.innerError,
        });
    }
}

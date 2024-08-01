export class APIError extends Error {
    statusCode: number;
    innerError?: Error;

    constructor(message: string, statusCode: number, innerError?: Error) {
        super(message);
        this.name = 'APIError';
        this.statusCode = statusCode;
        this.innerError = innerError;
        Object.setPrototypeOf(this, new.target.prototype); // Restore prototype chain
    }
}

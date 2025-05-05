

export default class ClientError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || 400;
        Error.captureStackTrace(this, this.constructor);
    }

    static notFound(message: string) {
        throw new ClientError(message || 'Not Found', 404);
    }
    static badRequest(message: string) {
        throw new ClientError(message || 'Bad Request', 400);
    }
    static unauthorized(message: string) {
        throw new ClientError(message || 'Unauthorized', 401);
    }
    static forbidden(message: string) {
        throw new ClientError(message || 'Forbidden', 403);
    }
}

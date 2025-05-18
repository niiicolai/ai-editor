

export default class ClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode || 400;
        Error.captureStackTrace(this, this.constructor);
    }

    static notFound(message) {
        throw new ClientError(message || 'Not Found', 404);
    }
    static badRequest(message) {
        throw new ClientError(message || 'Bad Request', 400);
    }
    static unauthorized(message) {
        throw new ClientError(message || 'Unauthorized', 401);
    }
    static forbidden(message) {
        throw new ClientError(message || 'Forbidden', 403);
    }
}

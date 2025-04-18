import ClientError from '../errors/clientError.js';

export const paginatorValidator = (page, limit) => {
    if (!page) ClientError.badRequest("page is required");
    if (typeof page !== "number") ClientError.badRequest("page must be a number");
    if (page < 1) ClientError.badRequest("page 0 out of bounds. Min page is 1");
    if (!limit) ClientError.badRequest("limit is required");
    if (typeof limit !== "number") ClientError.badRequest("limit must be a number");
    if (limit < 1) ClientError.badRequest("limit 0 out of bounds. Min limit is 1");
    if (limit > 100) ClientError.badRequest("limit 100 out of bounds. Max limit is 100");
}

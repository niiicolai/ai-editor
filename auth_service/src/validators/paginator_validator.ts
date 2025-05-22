import ClientError from "../errors/client_error";

export const paginatorValidator = (
  page: number,
  limit: number,
  options = {
    minLimit: 1,
    maxLimit: 100,
  }
) => {
  if (typeof page !== "number") 
    ClientError.badRequest("page must be a number");
  if (page < 1)
    ClientError.badRequest(`page ${page} out of bounds. Min page is 1`);
  if (typeof limit !== "number")
    ClientError.badRequest("limit must be a number");
  if (limit < options.minLimit)
    ClientError.badRequest(
      `limit ${limit} out of bounds. Min limit is ${options.minLimit}`
    );
  if (limit > options.maxLimit)
    ClientError.badRequest(
      `limit ${limit} out of bounds. Max limit is ${options.maxLimit}`
    );
};

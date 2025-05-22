import ClientError from "../errors/client_error";

export const objectValidator = (
  obj: object,
  entityName: string = "options"
) => {
  if (!obj) ClientError.badRequest(`${entityName} is required`);

  if (typeof obj !== "object")
    ClientError.badRequest(`${entityName} must be an object`);
};

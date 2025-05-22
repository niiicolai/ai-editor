import ClientError from "../errors/client_error";

export const numberValidator = (
  n: number,
  entityName: string = "amount",
  options = {
    min: {
      enabled: false,
      value: 0,
    },
    max: {
      enabled: false,
      value: 0,
    },
  }
) => {
  if (typeof n !== "number")
    ClientError.badRequest(`${entityName} must be a number`);
  if (options.min && options.min.enabled && n < options.min.value)
    ClientError.badRequest(
      `${entityName} ${n} out of bounds. Min ${entityName} is ${options.min.value}`
    );
  if (options.max && options.max.enabled && n > options.max.value)
    ClientError.badRequest(
      `${entityName} ${n} out of bounds. Max ${entityName} is ${options.max.value}`
    );
};

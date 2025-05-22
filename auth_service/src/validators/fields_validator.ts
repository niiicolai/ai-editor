import ClientError from '../errors/client_error';

export const fieldsValidator = (fields: string[], allowedFields: string[]): string[] => {
  if (fields) {
    fields.forEach((field) => {
      if (!allowedFields.includes(field)) {
        ClientError.badRequest(`invalid field ${field}. Allowed fields are ${allowedFields.join(", ")}`);
      }
    });
  }

  return (fields
        ? fields.filter((field) => allowedFields.includes(field))
        : allowedFields
    );
};

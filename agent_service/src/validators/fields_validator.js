import ClientError from '../errors/client_error.js';

export const fieldsValidator = (fields, allowedFields) => {
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

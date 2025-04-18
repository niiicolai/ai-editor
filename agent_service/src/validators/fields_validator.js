import ClientError from '../errors/clientError.js';

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
    ).join(" ");
};

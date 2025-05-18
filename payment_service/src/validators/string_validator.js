import ClientError from '../errors/client_error.js';

export const stringValidator = (s, entityName='name', options = {
    min: {
        enabled: false,
        value: 0,
    },
    max: {
        enabled: false,
        value: 0,
    },
    regex: {
        enabled: false,
        value: null,
    },
}) => {
    if (!s) ClientError.badRequest(`${entityName} is required`);
    if (typeof s !== "string") ClientError.badRequest(`${entityName} must be a string`);
    if (options.min && options.min.enabled && s.length < options.min.value) ClientError.badRequest(`${entityName} ${s} out of bounds. Min ${entityName} is ${options.min.value}`);
    if (options.max && options.max.enabled && s.length > options.max.value) ClientError.badRequest(`${entityName} ${s} out of bounds. Max ${entityName} is ${options.max.value}`);
    if (options.regex && options.regex.enabled && !options.regex.value.test(s)) ClientError.badRequest(`${entityName} ${s} does not match the required pattern`);
}

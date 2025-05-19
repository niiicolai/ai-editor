import ClientError from '../errors/client_error';

export const idValidator = (_id, entityName='_id') => {
    if (!_id) ClientError.badRequest(`${entityName} is required`);

    if (typeof _id !== "string") 
        ClientError.badRequest(`${entityName} must be a string`);

    if (!/^[0-9a-fA-F]{24}$/.test(_id))
        ClientError.badRequest(`${entityName} must be a valid ObjectId`);
}

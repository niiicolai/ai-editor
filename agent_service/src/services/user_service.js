import User from "../mongodb/models/user_model.js";
import dto from "../dto/user_dto.js";
import ClientError from '../errors/clientError.js';

import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";

const allowedFields = [
  "_id",
  "username",
  "email",
  "created_at",
  "updated_at",
];

export default class UserService {
  /**
   * @function find
   * @description Get user by id
   * @param {String} _id
   * @param {Array} fields
   * @param {String} fields.username
   * @param {String} fields.email
   * @param {String} fields.created_at
   * @param {String} fields.updated_at
   * @param {String} fields.logins.type
   * @param {String} fields.logins.created_at
   * @param {String} fields.logins.updated_at
   * @returns {Promise<Object>}
   */
  static async find(_id, fields = null) {
    idValidator(_id);
    fields = fieldsValidator(fields, allowedFields);

    const user = await User
      .findOne({ _id, deleted_at: null })
      .select(fields);
    if (!user) ClientError.notFound("user not found");

    return dto(user);
  }
}

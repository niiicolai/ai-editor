import PwdService from "./pwd_service.js";
import JwtService from "./jwt_service.js";
import User from "../mongodb/models/user_model.js";
import dto from "../dto/user_dto.js";
import mongoose from "mongoose";
import ClientError from '../errors/clientError.js';

import { newUserSaga } from "../rabbitmq/sagas/new_user_saga.js";
import { updateUserSaga } from "../rabbitmq/sagas/update_user_saga.js";
import { deleteUserSaga } from "../rabbitmq/sagas/delete_user_saga.js";

import { idValidator } from "../validators/id_validator.js";
import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";

const allowedFields = [
  "_id",
  "username",
  "email",
  "created_at",
  "updated_at",
  "logins.type",
  "logins.created_at",
  "logins.updated_at",
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

  /**
   * @function create
   * @description Create user and authenticate
   * @param {Object} body
   * @param {String} body.username
   * @param {String} body.password
   * @param {String} body.email
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
  static async create(body, fields = null) {
    objectValidator(body, "body");
    stringValidator(body.username, "username");
    stringValidator(body.password, "password");
    stringValidator(body.email, "email");

    const usernameExists = await User.exists({ username: body.username });
    if (usernameExists) ClientError.badRequest("username already exists");

    const emailExists = await User.exists({ email: body.email });
    if (emailExists) ClientError.badRequest("email already exists");

    const user = await newUserSaga(body);

    return {
      user: await this.find(user._id.toString(), fields),
      token: await JwtService.sign({ _id: user._id.toString() }),
    };
  }

  /**
   * @function update
   * @param {String} _id
   * @param {Object} body
   * @param {String} body.username
   * @param {String} body.password
   * @param {String} body.email
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
  static async update(_id, body, fields = null) {
    idValidator(_id);
    objectValidator(body, "body");

    const user = await User.findOne({ _id, deleted_at: null });
    if (!user) ClientError.notFound("user not found");

    await updateUserSaga(_id, body);

    return await this.find(_id, fields);
  }

  /**
   * @function destroy
   * @param {String} _id
   * @returns {Promise<String>}
   */
  static async destroy(_id) {
    idValidator(_id);

    const user = await User.findOne({ _id, deleted_at: null });
    if (!user) ClientError.notFound("user not found");

    await deleteUserSaga(_id);
  }
}

import JwtService from "./jwt_service.js";
import User from "../mongodb/models/user_model.js";
import dto from "../dto/user_dto.js";
import ClientError from '../errors/clientError.js';

import { produceNewUserSaga } from "../rabbitmq/sagas/new_user_saga.js";
import { produceUpdateUserSaga } from "../rabbitmq/sagas/update_user_saga.js";
import { produceDeleteUserSaga } from "../rabbitmq/sagas/delete_user_saga.js";

import { idValidator } from "../validators/id_validator.js";
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

interface UserResponse {
  _id: string;
  username: string;
  email: string;
  logins?: {
    type: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  updated_at: string;
}

interface UserCreateResponse {
  token: string;
  user: UserResponse;
}

interface UserCreateBody {
  email: string;
  password: string;
  username: string;
}

interface UserUpdateBody {
  email: string;
  password: string;
  username: string;
}

export default class UserService {
  /**
   * @function find
   * @description Get user by id
   * @param {String} _id
   * @param {Array<string>} fields
   * @returns {Promise<UserResponse>}
   */
  static async find(_id: string, fields: Array<string> = []): Promise<UserResponse> {
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
   * @param {UserCreateBody} body
   * @param {Array<string>} fields
   * @returns {Promise<UserCreateResponse>}
   */
  static async create({ username, password, email }: UserCreateBody, fields: Array<string> = []): Promise<UserCreateResponse> {
    stringValidator(username, "username");
    stringValidator(password, "password");
    stringValidator(email, "email");

    const usernameExists = await User.exists({ username });
    if (usernameExists) ClientError.badRequest("username already exists");

    const emailExists = await User.exists({ email });
    if (emailExists) ClientError.badRequest("email already exists");

    const { user } = await produceNewUserSaga({
      username, password, email
    });

    const token = await JwtService.sign({ _id: user._id.toString() });

    return {
      user: await this.find(user._id.toString(), fields),
      token,
    };
  }

  /**
   * @function update
   * @param {String} _id
   * @param {UserUpdateBody} body
   * @param {Array<string>} fields
   * @returns {Promise<UserResponse>}
   */
  static async update(_id: string, { username, password, email }: UserUpdateBody, fields: Array<string> = []): Promise<UserResponse> {
    idValidator(_id);

    const user = await User.findOne({ _id, deleted_at: null });
    if (!user) ClientError.notFound("user not found");

    await produceUpdateUserSaga({ username, password, email, _id });

    return await this.find(_id, fields);
  }

  /**
   * @function destroy
   * @param {String} _id
   * @returns {Promise<void>}
   */
  static async destroy(_id: string): Promise<void> {
    idValidator(_id);

    const user = await User.findOne({ _id, deleted_at: null });
    if (!user) ClientError.notFound("user not found");

    await produceDeleteUserSaga({ _id });
  }
}

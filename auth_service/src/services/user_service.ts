import JwtService from "./jwt_service";
import User from "../mongodb/models/user_model";
import dto from "../dto/user_dto";
import ClientError from '../errors/client_error';

import { produceNewUserSaga } from "../rabbitmq/sagas/new_user_saga";
import { produceUpdateUserSaga } from "../rabbitmq/sagas/update_user_saga";
import { produceDeleteUserSaga } from "../rabbitmq/sagas/delete_user_saga";

import { idValidator } from "../validators/id_validator";
import { stringValidator } from "../validators/string_validator";
import { fieldsValidator } from "../validators/fields_validator";

const allowedFields = [
  "_id",
  "username",
  "email",
  "role",
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
  role: string;
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
  role: string;
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
      .select(fields.join(" "));
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
  static async create({ username, password, email, role }: UserCreateBody, fields: Array<string> = []): Promise<UserCreateResponse> {
    stringValidator(username, "username", {
      min: { enabled: true, value: 3 },
      max: { enabled: true, value: 50 },
      regex: null,
    });
    stringValidator(password, "password", {
      min: { enabled: true, value: 8 },
      max: { enabled: true, value: 100 },
      regex: null,
    });
    stringValidator(email, "email", {
      min: { enabled: true, value: 5 },
      max: { enabled: true, value: 200 },
      regex: { enabled: true, value: /^[^@]+@[^@]+\.[^@]+$/ }
    });
    stringValidator(role, "role", {
      min: { enabled: false, value: 0 },
      max: { enabled: false, value: 0 },
      regex: { enabled: true, value: /member|admin/ }
    });

    const usernameExists = await User.exists({ username });
    if (usernameExists) ClientError.badRequest("username already exists");

    const emailExists = await User.exists({ email });
    if (emailExists) ClientError.badRequest("email already exists");

    const { user } = await produceNewUserSaga({
      username, password, email, role
    });

    const token = await JwtService.sign({ _id: user._id.toString(), role: user.role });

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

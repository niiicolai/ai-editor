
import PwdService from "./pwd_service.js";
import JwtService from "./jwt_service.js";
import User from "../mongodb/models/user_model.js";
import ClientError from '../errors/clientError.js';

import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";


export default class UserLoginService {

  /**
   * @function login
   * @description Login with email and password
   * @param {Object} body
   * @param {String} body.email
   * @param {String} body.password
   * @param {String} body.token
   * @returns {Object}
   */
  static async login(body) {
    objectValidator(body, "body");
    stringValidator(body.email, "email");
    stringValidator(body.password, "password");

    const user = await User.findOne({ email: body.email });
    if (!user) ClientError.notFound("user not found");

    const login = user.logins.find((login) => login.type === "password");
    if (!login) ClientError.notFound("user not found");

    const isPasswordValid = await PwdService.comparePassword(
      body.password,
      login.password
    );
    if (!isPasswordValid) ClientError.unauthorized("Invalid password");

    return { token: await JwtService.sign({ _id: user._id }) };
  }
}

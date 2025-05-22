import PwdService from "./pwd_service";
import JwtService from "./jwt_service";
import User from "../mongodb/models/user_model";
import ClientError from "../errors/client_error";

import { stringValidator } from "../validators/string_validator";

interface UserLoginBody {
  email: string;
  password: string;
}

interface UserLoginResponse {
  token: string;
}

export default class UserLoginService {
  /**
   * @function login
   * @description Login with email and password
   * @param {Object} body
   * @param {String} body.email
   * @param {String} body.password
   * @param {String} body.token
   * @returns {Promise<UserLoginResponse>}
   */
  static async login({ email, password }: UserLoginBody): Promise<UserLoginResponse> {
    stringValidator(email, "email");
    stringValidator(password, "password");

    const user = await User.findOne({ email });
    if (!user) ClientError.notFound("user not found");

    const login = user?.logins.find((login) => login.type === "password");
    if (!login) ClientError.notFound("user not found");

    if (!user?._id) {
      throw new Error("User ID is missing");
    }

    const isPasswordValid = login && await PwdService.comparePassword(
      password,
      login.password
    );
    if (!isPasswordValid) ClientError.unauthorized("Invalid password");
    
    return { token: await JwtService.sign({ _id: user._id.toString(), role: user.role }) };
  }
}

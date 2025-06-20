import UserPasswordReset from "../mongodb/models/user_password_reset_model";
import User from "../mongodb/models/user_model";
import dto from "../dto/user_password_reset_dto";
import ClientError from "../errors/client_error";
import PwdService from "./pwd_service";
import mongoose from "mongoose";

import { produceSendEmailSaga } from "../rabbitmq/sagas/send_email_saga";

import { idValidator } from "../validators/id_validator";
import { stringValidator } from "../validators/string_validator";
import { fieldsValidator } from "../validators/fields_validator";

const WEBSITE_URL = process.env.WEBSITE_URL;
if (!WEBSITE_URL) console.error('WEBSITE_URL should be set in the .env file');

const allowedFields = ["expired_at", "created_at", "updated_at"];

interface UserPasswordResetResponse {
  expired_at: string;
  created_at: string;
  updated_at: string;
}

export default class UserPasswordResetService {
  /**
   * @function find
   * @description Get user password reset by id
   * @param {String} _id
   * @param {Array<string>} fields
   * @returns {Promise<UserPasswordResetResponse>}
   */
  static async find(
    _id: string,
    fields: Array<string> = []
  ): Promise<UserPasswordResetResponse> {
    idValidator(_id);
    fields = fieldsValidator(fields, allowedFields);

    const userPwdReset = await UserPasswordReset.findOne({
      _id,
    }).select(fields);
    if (!userPwdReset) ClientError.notFound("user password reset not found");

    return dto(userPwdReset);
  }

  /**
   * @function create
   * @description Create user password reset
   * @param {UserPasswordResetCreateBody} body
   * @param {Array<string>} fields
   * @returns {Promise<UserPasswordResetResponse>}
   */
  static async create(
    {
      email,
    }: {
      email: string;
    },
    fields: Array<string> = []
  ): Promise<UserPasswordResetResponse> {
    stringValidator(email, "email", {
      min: { enabled: true, value: 5 },
      max: { enabled: true, value: 200 },
      regex: { enabled: true, value: /^[^@]+@[^@]+\.[^@]+$/ }
    });
    
    const user = await User.findOne({ email });
    if (!user) ClientError.notFound("user not found");

    if (!user?._id) {
      throw new Error("User ID is missing");
    }

    try {
      const userPasswordReset = new UserPasswordReset({
        expired_at: new Date(Date.now() + 10 * 60 * 1000), // Add 10 minutes
        user: user._id,
      });
      await userPasswordReset.save();

      await produceSendEmailSaga({
        to: user.email,
        subject: "Password reset request",
        content: `Hi,\n\nClick on the following link to reset password: ${WEBSITE_URL}/user/password-reset/${userPasswordReset._id}`,
      });

      return await this.find(userPasswordReset._id.toString(), fields);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /**
   * @function update
   * @param {String} _id
   * @param {UserPasswordResetUpdateBody} body
   * @param {Array<string>} fields
   * @returns {Promise<UserPasswordResetResponse>}
   */
  static async update(
    _id: string,
    {
      password,
    }: {
      password: string;
    },
    fields: Array<string> = []
  ): Promise<UserPasswordResetResponse> {
    idValidator(_id);
    stringValidator(password, "password", {
      min: { enabled: true, value: 8 },
      max: { enabled: true, value: 100 },
      regex: null,
    });

    const userPwdReset = await UserPasswordReset.findOne({
      _id,
      deleted_at: null,
    });
    if (!userPwdReset) ClientError.notFound("user password reset not found");
    if (userPwdReset && userPwdReset.expired_at < new Date()) {
      ClientError.badRequest("user password reset has expired");
    }

    if (!userPwdReset?.user) {
      ClientError.notFound("user password reset not found");
    }

    const user = await User.findOne({
      _id: userPwdReset?.user,
      deleted_at: null,
    });
    if (!user) ClientError.notFound("user not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (user) {
        password = await PwdService.hashPassword(password); 
        const pwdLogin = user.logins.find((l) => l.type == "password");
        if (!pwdLogin) user.logins.push({ type: 'password', password })
        else if (pwdLogin) pwdLogin.password = password;
        await user.save({ session });
      }

      if (userPwdReset) {
        userPwdReset.deleted_at = new Date();
      } else {
        throw new Error("userPwdReset is undefined");
      }
      await userPwdReset?.save({ session });

      await produceSendEmailSaga({
        to: user?.email,
        subject: "Password reset complete",
        content: `Hi,\n\nYour password has been changed.`,
      });

      await session.commitTransaction();

      return await this.find(_id.toString(), fields);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  }

  /**
   * @function destroy
   * @param {String} _id
   * @returns {Promise<void>}
   */
  static async destroy(_id: string): Promise<void> {
    idValidator(_id);

    const userPwdReset = await UserPasswordReset.findOne({
      _id,
      deleted_at: null,
    });
    if (!userPwdReset) ClientError.notFound("user password reset not found");

    try {
      if (userPwdReset) {
        if (!userPwdReset.expired_at) {
          userPwdReset.expired_at = new Date();
        }

        userPwdReset.deleted_at = new Date();

        await userPwdReset?.save();
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

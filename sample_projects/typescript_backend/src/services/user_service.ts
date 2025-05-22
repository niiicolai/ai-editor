import UserModel from "../mongodb/models/user_model.js";
import bcrypt from "bcrypt";

export class UserService {
  /**
   * @function find
   * @description Find user by id
   * @param {String} _id
   * @returns {Promise<Object | null>}
   */
  static async find(_id: string): Promise<object | null> {
    return await UserModel.findOne({ _id });
  }

  /**
   * @function findAll
   * @description Find all pages
   * @returns {Promise<Object>}
   */
  static async findAll(): Promise<object> {
    return await UserModel.find();
  }

  /**
   * @function create
   * @description Create user
   * @param {Object} body
   * @param {String} body.username
   * @param {String} body.password
   * @returns {Promise<Object>}
   */
  static async create(body: { username: string; password: string }): Promise<object> {
    return await UserModel.create({
        ...body,
        password: bcrypt.hash(body.password, 10)
    });
  }

  /**
   * @function update
   * @description Update user by id
   * @param {String} _id
   * @param {Object} body
   * @param {String} body.content
   * @returns {Promise<Object>}
   */
  static async update(_id: string, body: { username: string; password: string }): Promise<object> {
    return await UserModel.updateOne({ _id }, {
        ...body,
        password: bcrypt.hash(body.password, 10)
    });
  }

  /**
   * @function destroy
   * @description Destroy user by id
   * @param {String} _id
   * @returns {Promise<void>}
   */
  static async destroy(_id: string): Promise<void> {
    await UserModel.deleteOne({ _id
  }
}

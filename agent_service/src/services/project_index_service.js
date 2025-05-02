import ProjectIndexModel from "../mongodb/models/project_index_model.js";
import User from "../mongodb/models/user_model.js";
import dto from "../dto/project_index_dto.js";
import ClientError from "../errors/clientError.js";
import mongoose from "mongoose";

import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";

const allowedFields = [
  "_id",
  "name",
  "user",
  "created_at",
  "updated_at",
];

export default class ProjectIndexService {
  /**
   * @function find
   * @description Find project index by id
   * @param {string} _id - project index id
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - project index
   */
  static async find(_id, userId, fields = null) {
    idValidator(_id, "_id");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const projectIndex = await ProjectIndexModel.findOne({
      _id,
      user: userId,
    }).select(fields);
    if (!projectIndex)
      ClientError.notFound("project index not found");

    return dto(projectIndex);
  }

  /**
   * @function findByName
   * @description Find project index by name
   * @param {string} name - project index name
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - project index
   */
  static async findByName(name, userId, fields = null) {
    idValidator(name, "name");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const projectIndex = await ProjectIndexModel.findOne({
        name,
      user: userId,
    }).select(fields);
    if (!projectIndex)
      ClientError.notFound("project index not found");

    return dto(projectIndex);
  }

  /**
   * @function existByName
   * @description exist project index by name
   * @param {string} name - project index name
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - project index exist
   */
  static async existByName(name, userId, fields = null) {
    stringValidator(name, "name");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const projectIndex = await ProjectIndexModel.findOne({
        name,
      user: userId,
    }).select(fields);

    return { exist: !!projectIndex };
  }

  /**
   * @function findAll
   * @description Find all project indexes by user id
   * @param {number} page - Page number
   * @param {number} limit - Page size
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - project indexes
   */
  static async findAll(page, limit, userId, fields = null) {
    paginatorValidator(page, limit);
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const query = { user: userId };
    const projects = await ProjectIndexModel.find(query)
      .select(fields)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });
    const total = await ProjectIndexModel.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return {
      projects: projects.map(dto),
      page,
      limit,
      total,
      pages,
    };
  }

  /**
   * @function create
   * @description Create a project index
   * @param {object} body - Request body
   * @param {string} userId - User id
   * @return {Promise<void>} - Created project index 
   */
  static async create(body, userId) {
    objectValidator(body, "body");
    stringValidator(body?.name, "name");
    idValidator(userId, "userId");

    const user = await User.findOne({ _id: userId });
    if (!user) ClientError.notFound("user not found");

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const projectIndexItem = new ProjectIndexModel({
            name: body.name,
            user: user._id,
          });

      await projectIndexItem.save({ session });
      await session.commitTransaction();

      return dto(projectIndexItem);
    } catch (error) {
      await session.abortTransaction();
      console.error("Error creating project index", error);
      throw new Error("Error creating project index", error);
    } finally {
      await session.endSession();
    }
  }

  /**
   * @function destroy
   * @description Delete project index by id
   * @param {string} _id - project index id
   * @param {string} userId - User id
   * @return {Promise<void>}
   */
  static async destroy(_id, userId) {
    idValidator(_id, "_id");
    idValidator(userId, "userId");

    const projectIndex = await ProjectIndexModel.findOne({
      _id,
      user: userId,
    });
    if (!projectIndex)
      ClientError.notFound("project index not found");

    try {
      await projectIndex.deleteOne({ _id });
    } catch (error) {
      throw new Error("Error deleting project index", error);
    }
  }
}

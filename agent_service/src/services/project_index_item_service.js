import ProjectIndexItemModel from "../mongodb/models/project_index_item_model.js";
import ProjectIndexModel from "../mongodb/models/project_index_model.js";
import AgentService from "./agent_service.js";
import User from "../mongodb/models/user_model.js";
import dto from "../dto/project_index_item_dto.js";
import ClientError from "../errors/clientError.js";
import mongoose from "mongoose";

import { pipeline } from "@xenova/transformers";
import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";

const allowedFields = [
  "_id",
  "name",
  "path",
  "description",
  "hashCode",
  "lines",
  "language",
  //"embedding",
  "project_index",
  "user",
  "created_at",
  "updated_at",
];

const summarizeReponse = async (body) => {
  const preContent = `
      You are documenting a file, so you easier can find it later.

      file:
        name: ${body?.name};
        path: ${body?.path};
        description: ${body?.description};
        hashCode: ${body?.hashCode};
        lines: ${body?.lines};
        language: ${body?.language};
        content: ${body?.content};
        functions: ${body?.functions};
        classes: ${body?.classes};
        vars: ${body?.vars};

      output:
        summary: <insert summary>
        intent: <insert intent>
        keywords: <insert keywords>
    `;

  const response = await AgentService.noFuncPrompt(preContent, "user", []);
  return response?.content;
};

const chunkContent = (body, response) => {
  const content = `
      file:
        name: ${body?.name};
        path: ${body?.path};
        description: ${body?.description};
        hashCode: ${body?.hashCode};
        lines: ${body?.lines};
        language: ${body?.language};
        functions: ${body?.functions};
        classes: ${body?.classes};
        vars: ${body?.vars};

      content:
        summary: ${response};
    `;
  const chunkSize = 512;
  const contentChunks = [];

  for (let i = 0; i < content.length; i += chunkSize) {
    const chunk = content.slice(i, i + chunkSize);
    contentChunks.push(chunk);
  }

  return { chunkSize, contentChunks };
};

export default class ProjectIndexItemService {
  /**
   * @function find
   * @description Find project index item by id
   * @param {string} _id - project index item id
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - project index item
   */
  static async find(_id, userId, fields = null) {
    idValidator(_id, "_id");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const projectIndexItemModel = await ProjectIndexItemModel.findOne({
      _id,
      user: userId,
    }).select(fields);
    if (!projectIndexItemModel)
      ClientError.notFound("project index item not found");

    return dto(projectIndexItemModel);
  }

  /**
   * @function findAll
   * @description Find all project indexes by project index id and user id
   * @param {string} projectIndexId - project index id
   * @param {number} page - Page number
   * @param {number} limit - Page size
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - project indexes
   */
  static async findAll(projectIndexId, page, limit, userId, fields = null) {
    paginatorValidator(page, limit);
    idValidator(projectIndexId, "projectIndexId");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const query = { user: userId, project_index: projectIndexId };
    const items = await ProjectIndexItemModel.find(query)
      .select(fields)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });
    const total = await ProjectIndexItemModel.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return {
      items: items.map(dto),
      page,
      limit,
      total,
      pages,
    };
  }

  /**
   * @function create
   * @description Create a project index item
   * @param {object} body - Request body
   * @param {string} userId - User id
   * @return {Promise<void>} - Created project index items
   */
  static async create(body, userId) {
    objectValidator(body, "body");
    stringValidator(body?.name, "name");
    stringValidator(body?.path, "path");
    stringValidator(body?.description, "description");
    stringValidator(body?.hashCode, "hashCode");
    stringValidator(body?.lines, "lines");
    stringValidator(body?.language, "language");
    stringValidator(body?.content, "content");
    idValidator(body.projectIndexId, "projectIndexId");
    idValidator(userId, "userId");

    const user = await User.findOne({ _id: userId });
    if (!user) ClientError.notFound("user not found");

    const projectIndex = await ProjectIndexModel.findOne({
      _id: body.projectIndexId,
      user: userId,
    });
    if (!projectIndex) ClientError.notFound("project index not found");

    const embeddingDocs = [];
    const response = await summarizeReponse(body);
    const { contentChunks } = chunkContent(body, response);
    const extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      let index = 0;
      for (const chunk of contentChunks) {
        const trimmedChuck = chunk.trim();
        if (trimmedChuck.length === 0) continue; // Skip empty chunks

        // Generate embedding for this chunk
        const embeddings = await extractor([trimmedChuck], {
          pooling: "mean",
          normalize: true,
        });

        const projectIndexItem = new ProjectIndexItemModel({
          chunk_index: index,
          embedding: embeddings[0],
          path: body.path,
          name: body.name,
          hashCode: body.hashCode,
          lines: body.lines,
          language: body.language,
          description: trimmedChuck,
          project_index: projectIndex._id,
          user: user._id,
        });

        embeddingDocs.push(projectIndexItem);
        index++;
      }

      // Save all embeddings as part of the same transaction
      await ProjectIndexItemModel.insertMany(embeddingDocs, { session });

      // Commit the transaction
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error("Error creating project index item", error);
      throw new Error("Error creating project index item", error);
    } finally {
      await session.endSession();
    }

    return embeddingDocs.map(dto);
  }

  /**
   * @function destroy
   * @description Delete project index item by id
   * @param {string} _id - project index item id
   * @param {string} userId - User id
   * @return {Promise<void>}
   */
  static async destroy(_id, userId) {
    idValidator(_id, "_id");
    idValidator(userId, "userId");

    const projectIndexItemModel = await ProjectIndexItemModel.findOne({
      _id,
      user: userId,
    });
    if (!projectIndexItemModel)
      ClientError.notFound("project index item not found");

    try {
      await projectIndexItemModel.deleteOne({ _id });
    } catch (error) {
      throw new Error("Error deleting project index item", error);
    }
  }
}

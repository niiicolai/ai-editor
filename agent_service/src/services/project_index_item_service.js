import ProjectIndexItemModel from "../mongodb/models/project_index_item_model.js";
import ProjectIndexModel from "../mongodb/models/project_index_model.js";
import AgentService from "./agent_service.js";
import EmbeddingService from "./embedding_service.js";
import User from "../mongodb/models/user_model.js";
import dto from "../dto/project_index_item_dto.js";
import ClientError from "../errors/clientError.js";
import mongoose from "mongoose";

import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import { numberValidator } from "../validators/number_validator.js";
import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";

import { v4 as uuidV4 } from "uuid";
import {
  upsert,
  query,
  deleteMany
} from "../qdrant/collections/project_index_item_collection.js";


const summarizeReponse = async (body) => {
  const preContent = `
      You are documenting a file, analyze the content and give a description of the file's content

      file:
        name: ${body?.name};
        path: ${body?.path};
        language: ${body?.language};  
        content: ${body?.content};

      output:
        summary of the file and code: <insert summary>
        intent of the file and code: <insert intent>
        keywords to search the file and code: <insert keywords>
    `;

  const response = await AgentService.noFuncPrompt(preContent, "user", []);
  return response?.content;
};

const createContentEmbeddings = async (body, response) => {
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

  const embeddings = await EmbeddingService.createChunksAndVectorEmbeddings(
    content,
    2000
  );

  return { embeddings };
};

export default class ProjectIndexItemService {
  /**
   * @function find
   * @description Find project index item by id
   * @param {string} _id - project index item id
   * @param {string} userId - User id
   * @return {Promise<object>} - project index item
   */
  static async find(_id, userId) {
    idValidator(_id, "_id");
    idValidator(userId, "userId");

    const items = (
      await query(null, 1, {
        must: [
          { key: "id", match: { value: _id } },
          { key: "user", match: { value: userId } },
        ],
      })
    )?.points?.map((res) => {
      return { _id: res.id, ...res.payload };
    });
    if (!items || items.length)
      ClientError.notFound("project index item not found");

    return dto(items[0]);
  }

  /**
   * @function findAll
   * @description Find all project indexes by project index id and user id
   * @param {string} projectIndexId - project index id
   * @param {number} limit - Page size
   * @param {string} userId - User id
   * @return {Promise<object>} - project indexes
   */
  static async findAll(projectIndexId, limit, userId) {
    numberValidator(limit, "limit", {
      min: { enabled: true, value: 1 },
      max: { enabled: true, value: 100 }
    });
    idValidator(projectIndexId, "projectIndexId");
    idValidator(userId, "userId");

    const items = (
      await query(null, 1, {
        must: [
          { key: "project_index", match: { value: projectIndexId } },
          { key: "user", match: { value: userId } },
        ],
      })
    )?.points?.map((res) => {
      return { _id: res.id, ...res.payload };
    });

    return {
      items: items.map(dto),
      limit,
    };
  }

  static async search(queryInput, projectIndexId, userId, limit = 3) {
    const queryEmbedding = await EmbeddingService.createVectorEmbeddings([
      queryInput,
    ]);
    const results = await query(queryEmbedding[0].embedding, limit, {
      must: [
        { key: "project_index", match: { value: projectIndexId } },
        { key: "user", match: { value: userId } },
      ],
    });

    const payloads = results.points.map((res) => {
      return { _id: res.id, ...res.payload };
    });

    return payloads.map(dto);
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
    numberValidator(body?.lines, "lines");
    stringValidator(body?.language, "language");
    //stringValidator(body?.content, "content");
    idValidator(body.projectIndexId, "projectIndexId");
    idValidator(userId, "userId");

    const user = await User.findOne({ _id: userId });
    if (!user) ClientError.notFound("user not found");

    const projectIndex = await ProjectIndexModel.findOne({
      _id: body.projectIndexId,
      user: userId,
    });
    if (!projectIndex) ClientError.notFound("project index not found");

    const existingItems = (
      await query(null, 100, {
        must: [
          { key: "path", match: { value: body?.path } },
          { key: "project_index", match: { value: body.projectIndexId } },
          { key: "user", match: { value: userId } },
        ],
      })
    )?.points?.map((res) => {
      return { _id: res.id, ...res.payload };
    });

    if (existingItems.length > 0) {
      if (existingItems[0].hashCode == body?.hashCode) {
        return existingItems.map(dto);
      } else {
        await deleteMany(existingItems.map((e) => e._id));
      }
    }

    try {
      const response = await summarizeReponse(body);
      const { embeddings } = await createContentEmbeddings(body, response);
      const { points } = await upsert(
        embeddings.map((e, i) => {
          return {
            id: uuidV4(),
            vector: e.embedding,
            payload: {
              chunk_index: i,
              path: body.path,
              name: body.name,
              hashCode: body.hashCode,
              lines: body.lines,
              language: body.language,
              description: e.chunk,
              project_index: projectIndex._id,
              user: user._id,
              created_at: new Date(),
              updated_at: new Date(),
            },
          };
        })
      );

      return points
        .map((res) => {
          return { _id: res.id, ...res.payload };
        })
        .map(dto);
    } catch (error) {
      console.error("Error creating project index item", error);
      throw new Error("Error creating project index item", error);
    }
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
      await deleteMany([_id]);
    } catch (error) {
      throw new Error("Error deleting project index item", error);
    }
  }
}

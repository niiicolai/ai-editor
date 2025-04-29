import UserAgentSessionEmbedding from "../mongodb/models/user_agent_session_embedding_model.js";
import UserAgentSession from "../mongodb/models/user_agent_session_model.js";
import User from "../mongodb/models/user_model.js";
import dto from "../dto/user_agent_session_embedding_dto.js";
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
  "embedding",
  "meta",
  "user_agent_session",
  "user",
  "created_at",
  "updated_at",
];

export default class UserAgentSessionEmbeddingService {
  /**
   * @function find
   * @description Find user agent session embedding by id
   * @param {string} _id - User agent session embedding id
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - User file object
   */
  static async find(_id, userId, fields = null) {
    idValidator(_id, "_id");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const userAgentSessionEmbedding = await UserAgentSessionEmbedding.findOne({
      _id,
      user: userId,
    }).select(fields);
    if (!userAgentSessionEmbedding)
      ClientError.notFound("user agent session embedding not found");

    return dto(userAgentSessionEmbedding);
  }

  /**
   * @function findAll
   * @description Find all user agent session embeddings by session id and user id
   * @param {string} sessionId - User agent session id
   * @param {number} page - Page number
   * @param {number} limit - Page size
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - User agent session embddings
   */
  static async findAll(sessionId, page, limit, userId, fields = null) {
    paginatorValidator(page, limit);
    idValidator(sessionId, "sessionId");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const query = { user: userId, user_agent_session: sessionId };
    const embeddings = await UserAgentSessionEmbedding.find(query)
      .select(fields)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });
    const total = await UserAgentSessionEmbedding.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return {
      embeddings: embeddings.map(dto),
      page,
      limit,
      total,
      pages,
    };
  }

  /**
   * @function create
   * @description Create a new user agent session embedding
   * @param {object} body - Request body
   * @param {string} userId - User id
   * @return {Promise<void>} - Created user agent session embeddings
   */
  static async create(body, userId) {
    objectValidator(body, "body");
    stringValidator(body?.content, "content");
    stringValidator(body?.filename, "filename");
    stringValidator(body?.filepath, "filepath");
    idValidator(body.sessionId, "sessionId");
    idValidator(userId, "userId");

    const user = await User.findOne({ _id: userId });
    if (!user) ClientError.notFound("user not found");

    const userAgentSession = await UserAgentSession.findOne({
      _id: body.sessionId,
      user: userId,
    });
    if (!userAgentSession) ClientError.notFound("user agent session not found");

    const extractor = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    const sessionContent = body.content;

    const chunkSize = 512;
    const contentChunks = [];

    for (let i = 0; i < sessionContent.length; i += chunkSize) {
      const chunk = sessionContent.slice(i, i + chunkSize);
      contentChunks.push(chunk);
    }

    const embeddingDocs = [];

    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      

      for (const chunk of contentChunks) {
        const trimmedChuck = chunk.trim();
        if (trimmedChuck.length === 0) continue; // Skip empty chunks

        // Generate embedding for this chunk
        const embeddings = await extractor([trimmedChuck], {
          pooling: "mean",
          normalize: true,
        });

        const userAgentSessionMessage = new UserAgentSessionEmbedding({
          content: trimmedChuck,
          embedding: embeddings[0], // Get the embedding for the chunk
          meta: {
            filename: body.filename,
            filepath: body.filepath,
          },
          user_agent_session: userAgentSession._id,
          user: user._id,
        });

        embeddingDocs.push(userAgentSessionMessage);
      }

      // Save all embeddings as part of the same transaction
      await UserAgentSessionEmbedding.insertMany(embeddingDocs, { session });

      // Commit the transaction
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      console.error("Error creating user agent session embedding", error);
      throw new Error("Error creating user agent session embedding", error);
    } finally {
      await session.endSession();
    }

    return embeddingDocs.map(dto);
  }

  /**
   * @function update
   * @description Update user agent session message by id
   * @param {string} _id - User agent session message id
   * @param {object} body - Request body
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - Updated user agent session object
   */
  static async update(_id, body, userId, fields = null) {
    objectValidator(body, "body");
    idValidator(_id, "_id");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const userAgentSessionEmbedding = await UserAgentSessionEmbedding.findOne({
      _id,
      user: userId,
    });
    if (!userAgentSessionEmbedding)
      ClientError.notFound("user agent session embedding not found");

    try {
      if (body.content) userAgentSessionEmbedding.embedding = [];
      if (body.filename)
        userAgentSessionEmbedding.meta.filename = body.filename;
      if (body.filepath)
        userAgentSessionEmbedding.meta.filepath = body.filepath;
      await userAgentSessionEmbedding.save();

      return await this.find(
        userAgentSessionEmbedding._id.toString(),
        userId,
        fields
      );
    } catch (error) {
      console.error("Error updating user agent session embedding:", error);
      throw new Error("Error updating user agent session embedding", error);
    }
  }

  /**
   * @function destroy
   * @description Delete user agent session embedding by id
   * @param {string} _id - User agent session embedding id
   * @param {string} userId - User id
   * @return {Promise<void>}
   */
  static async destroy(_id, userId) {
    idValidator(_id, "_id");
    idValidator(userId, "userId");

    const userAgentSessionEmbedding = await UserAgentSessionEmbedding.findOne({
      _id,
      user: userId,
    });
    if (!userAgentSessionEmbedding)
      ClientError.notFound("user agent session embedding not found");

    try {
      await userAgentSessionEmbedding.deleteOne({ _id });
    } catch (error) {
      throw new Error("Error deleting user agent session embedding", error);
    }
  }
}

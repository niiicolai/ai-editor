import UserAgentSession from "../mongodb/models/user_agent_session_model.js";
import UserAgentSessionMessage from "../mongodb/models/user_agent_session_message_model.js";
import User from "../mongodb/models/user_model.js";
import dto from "../dto/user_agent_session_dto.js";
import ClientError from "../errors/client_error.js";

import { creatChatCompletion } from "../llm/index.js";
import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";
import mongoose from "mongoose";

const allowedFields = ["_id", "title", "user", "created_at", "updated_at"];

export default class UserAgentSessionService {
  /**
   * @function find
   * @description Find user agent session by id
   * @param {string} _id - User agent session id
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - User file object
   */
  static async find(_id, userId, fields = null) {
    idValidator(_id, "_id");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const userAgentSession = await UserAgentSession.findOne({
      _id,
      user: userId,
    }).select(fields.join(" "));
    if (!userAgentSession) ClientError.notFound("user agent session not found");

    return dto(userAgentSession);
  }

  /**
   * @function findAll
   * @description Find all user agent sessions by user id
   * @param {number} page - Page number
   * @param {number} limit - Page size
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - User agent session objects
   */
  static async findAll(page, limit, userId, fields = null) {
    paginatorValidator(page, limit);
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const userAgentSessions = await UserAgentSession.find({ user: userId })
      .select(fields.join(" "))
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });
    const total = await UserAgentSession.countDocuments({ user: userId });
    const pages = Math.ceil(total / limit);

    return {
      sessions: userAgentSessions.map(dto),
      page,
      limit,
      total,
      pages,
    };
  }

  /**
   * @function create
   * @description Create a new user agent session
   * @param {object} body - Request body
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - Created user agent session object
   */
  static async create(body, userId, fields = null) {
    objectValidator(body, "body");
    stringValidator(body.title, "body.title", {
      min: { enabled: true, value: 2 },
      max: { enabled: true, value: 100 },
      regex: null,
    });
    idValidator(userId, "userId");

    const user = await User.findOne({ _id: userId });
    if (!user) ClientError.notFound("user not found");

    try {
      const userAgentSession = new UserAgentSession({
        title: body.title,
        user: user._id,
      });
      await userAgentSession.save();

      return await this.find(userAgentSession._id.toString(), userId, fields);
    } catch (error) {
      console.error("Error creating user agent session:", error);
      throw new Error("Error creating user agent session", error);
    }
  }

  /**
   * @function update
   * @description Update user agent session by id
   * @param {string} _id - User agent session id
   * @param {object} body - Request body
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - Updated user agent session object
   */
  static async update(_id, body, userId, fields = null) {
    objectValidator(body, "body");
    stringValidator(body.title, "body.title", {
      min: { enabled: true, value: 2 },
      max: { enabled: true, value: 100 },
      regex: null,
    });
    idValidator(_id, "_id");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const userAgentSession = await UserAgentSession.findOne({
      _id,
      user: userId,
    });
    if (!userAgentSession) ClientError.notFound("user agent session not found");

    try {
      userAgentSession.title = body.title;
      await userAgentSession.save();

      return await this.find(userAgentSession._id.toString(), userId);
    } catch (error) {
      console.error("Error updating user agent session:", error);
      throw new Error("Error updating user agent session", error);
    }
  }

  static async updateWithLlmTitle(_id, content, userId, lastMessages = []) {
    stringValidator(content, "content", {
      min: { enabled: true, value: 1 },
      max: { enabled: true, value: 9800 },
      regex: null,
    });
    idValidator(_id, "_id");
    idValidator(userId, "userId");
    if (lastMessages.length > 100)
      ClientError.badRequest("lastMessages out of bounds. Max is 100");

    const userAgentSession = await UserAgentSession.findOne({
      _id,
      user: userId,
    });
    if (!userAgentSession) ClientError.notFound("user agent session not found");

    try {
      // This is to avoiding spamming the LLM in test if someone forgets to mock the request.
      const response =
        process.NODE_ENV === "test"
          ? { content: { message: "test message" } }
          : await creatChatCompletion(
              [
                ...lastMessages,
                {
                  role: "developer",
                  content: `Based on the following input, select a chat title: ${content}; Be creative. Do not put quotes around the title.`,
                },
              ],
              {
                model: "gpt-4o-mini",
                max_tokens: 10000,
                temperature: 0.3,
                useTools: false,
              }
            );

      if (response?.content?.message) {
        userAgentSession.title = response?.content?.message;
        await userAgentSession.save();
      }

      return await this.find(userAgentSession._id.toString(), userId);
    } catch (error) {
      console.error("Error updating user agent session:", error);
      throw new Error("Error updating user agent session", error);
    }
  }

  /**
   * @function destroy
   * @description Delete user agent session by id
   * @param {string} _id - User agent session id
   * @param {string} userId - User id
   * @return {Promise<void>}
   */
  static async destroy(_id, userId) {
    idValidator(_id, "_id");
    idValidator(userId, "userId");

    const userAgentSession = await UserAgentSession.findOne({
      _id,
      user: userId,
    });
    if (!userAgentSession) ClientError.notFound("user agent session not found");

    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await UserAgentSessionMessage.deleteMany(
        { user_agent_session: _id },
        { session, ordered: true }
      );
      await UserAgentSession.deleteOne({ _id }, { session });
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw new Error("Error deleting user agent session", error);
    } finally {
      await session.endSession();
    }
  }
}

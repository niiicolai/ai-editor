import UserAgentSessionMessage from "../mongodb/models/user_agent_session_message_model.js";
import UserAgentSession from "../mongodb/models/user_agent_session_model.js";
import User from "../mongodb/models/user_model.js";
import dto from "../dto/user_agent_session_message_dto.js";
import ClientError from "../errors/client_error.js";

import { objectValidator } from "../validators/object_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";

const allowedFields = [
  "_id",
  "content",
  "code",
  "clientFn",
  "markdown",
  "role",
  "state",
  "user_files",
  "user_agent_session",
  "user",
  "created_at",
  "updated_at",
];

export default class UserAgentSessionMessageService {
  /**
   * @function find
   * @description Find user agent session message by id
   * @param {string} _id - User agent session message id
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - User file object
   */
  static async find(_id, userId, fields = null) {
    idValidator(_id, "_id");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const userAgentSessionMessage = await UserAgentSessionMessage.findOne({
      _id,
      user: userId,
    }).select(fields.join(" "));
    if (!userAgentSessionMessage)
      ClientError.notFound("user agent session message not found");

    return dto(userAgentSessionMessage);
  }

  /**
   * @function findAll
   * @description Find all user agent session messages by session id and user id
   * @param {string} sessionId - User agent session id
   * @param {number} page - Page number
   * @param {number} limit - Page size
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - User agent session objects
   */
  static async findAll(sessionId, page, limit, userId, fields = null) {
    paginatorValidator(page, limit);
    idValidator(sessionId, "sessionId");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const userAgentSessionMessages = await UserAgentSessionMessage.find({
      user: userId,
      user_agent_session: sessionId,
      role: { $ne: "system" },
    })
      .select(fields.join(" "))
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });
    const total = await UserAgentSessionMessage.countDocuments({
      user: userId,
      user_agent_session: sessionId,
      role: { $ne: "system" },
    });
    const pages = Math.ceil(total / limit);

    return {
      messages: userAgentSessionMessages.map(dto),
      page,
      limit,
      total,
      pages,
    };
  }

  static async findHistory(sessionId, page, limit, userId, fields = null) {
    paginatorValidator(page, limit);
    idValidator(sessionId, "sessionId");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const userAgentSessionMessages = await UserAgentSessionMessage.find({
      user: userId,
      user_agent_session: sessionId,
    })
      .select(fields.join(" "))
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });

    return userAgentSessionMessages.map((m) => {
      return {
        _id: m._id,
        message: {
          role: m.role,
          content: `
                Message: ${m.content}
                ${m.code ? `Code: ${m.code}` : ""}
                ${
                  m.clientFn
                    ? `ClientFn:  ${m.clientFn?.name}(${m.clientFn?.args}) = ${m.clientFn?.result}`
                    : ""
                }
                `,
        },
      };
    });
  }

  /**
   * @function create
   * @description Create a new user agent session message
   * @param {object} body - Request body
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - Created user agent session object
   */
  static async create(body, userId, fields = null) {
    objectValidator(body, "body");
    stringValidator(body.role, "role");
    stringValidator(body?.context?.content, "context.content");
    idValidator(body.userAgentSessionId, "userAgentSessionId");
    idValidator(userId, "userId");

    const user = await User.findOne({ _id: userId });
    if (!user) ClientError.notFound("user not found");

    const userAgentSession = await UserAgentSession.findOne({
      _id: body.userAgentSessionId,
      user: userId,
    });
    if (!userAgentSession) ClientError.notFound("user agent session not found");

    try {
      /**
       * Create message
       */
      const userAgentSessionMessage = new UserAgentSessionMessage({
        content: body?.context?.content,
        clientFn: body?.context?.clientFn,
        code: body?.context?.code,
        role: body.role,
        state: body?.state || "pending",
        user_files: body.user_files,
        user_agent_session: userAgentSession._id,
        user: user._id,
      });
      await userAgentSessionMessage.save();

      return await this.find(
        userAgentSessionMessage._id.toString(),
        userId,
        fields
      );
    } catch (error) {
      console.error("Error creating user agent session message", error);
      throw new Error("Error creating user agent session message", error);
    }
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

    const userAgentSessionMessage = await UserAgentSessionMessage.findOne({
      _id,
      user: userId,
    });
    if (!userAgentSessionMessage)
      ClientError.notFound("user agent session message not found");

    try {
      if (body.content) userAgentSessionMessage.content = body.content;
      if (body.clientFn) userAgentSessionMessage.clientFn = body.clientFn;
      if (body.code) userAgentSessionMessage.code = body.code;
      if (body.state) userAgentSessionMessage.state = body.state;
      await userAgentSessionMessage.save();

      return await this.find(
        userAgentSessionMessage._id.toString(),
        userId,
        fields
      );
    } catch (error) {
      console.error("Error updating user agent session message:", error);
      throw new Error("Error updating user agent session message", error);
    }
  }

  /**
   * @function destroy
   * @description Delete user agent session message by id
   * @param {string} _id - User agent session message id
   * @param {string} userId - User id
   * @return {Promise<void>}
   */
  static async destroy(_id, userId) {
    idValidator(_id, "_id");
    idValidator(userId, "userId");

    const userAgentSessionMessage = await UserAgentSessionMessage.findOne({
      _id,
      user: userId,
    });
    if (!userAgentSessionMessage)
      ClientError.notFound("user agent session message not found");

    try {
      await UserAgentSessionMessage.deleteOne({ _id });
    } catch (error) {
      throw new Error("Error deleting user agent session message", error);
    }
  }
}

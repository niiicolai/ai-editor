import UserAgentSessionOperationModel from "../mongodb/models/user_agent_session_operation_model.js";
import UserAgentSessionModel from "../mongodb/models/user_agent_session_model.js";
import UserModel from "../mongodb/models/user_model.js";
import dto from "../dto/user_agent_session_operation_dto.js";
import ClientError from "../errors/client_error.js";

import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";
import { stringValidator } from "../validators/string_validator.js";
import { numberValidator } from "../validators/number_validator.js";
import { objectValidator } from "../validators/object_validator.js";

const allowedFields = [
  "_id",
  "name",
  "max_iterations",
  "state",
  "user_agent_session",
  "iterations",
  "user",
  "created_at",
  "updated_at",
];

export default class UserAgentSessionOperationService {
  /**
   * @function find
   * @description Find user agent session operation by id
   * @param {string} _id - User agent session id
   * @param {string} userId - User id
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - User file object
   */
  static async find(_id, userId, fields = null) {
    idValidator(_id, "_id");
    idValidator(userId, "userId");
    fields = fieldsValidator(fields, allowedFields);

    const userAgentSessionOperation =
      await UserAgentSessionOperationModel.findOne({
        _id,
        user: userId,
      })
      .select(fields.join(" "))
      .populate('iterations.user_agent_session_message');;
    if (!userAgentSessionOperation)
      ClientError.notFound("user agent session operation not found");

    return dto(userAgentSessionOperation);
  }

  /**
   * @function findAll
   * @description Find all user agent session operations by user id and sessionId
   * @param {number} page - Page number
   * @param {number} limit - Page size
   * @param {string} sessionId - Session id
   * @param {string} userId - User id
   * @param {string} state - operation state
   * @param {array} fields - Fields to return
   * @return {Promise<object>} - User agent session objects
   */
  static async findAll(page, limit, sessionId, userId, state, fields = null) {
    paginatorValidator(page, limit);
    idValidator(userId, "userId");
    idValidator(sessionId, "sessionId");
    fields = fieldsValidator(fields, allowedFields);

    const query = { user: userId, user_agent_session: sessionId };
    if (state) {
      stringValidator(state, "state", {
        min: { enabled: false, value: 0 },
        max: { enabled: false, value: 0 },
        regex: { enabled: true, value: /running|completed|error/ }
      })
      query.state = state;
    }

    const userAgentSessionOperations =
      await UserAgentSessionOperationModel.find(query)
        .select(fields.join(" "))
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ created_at: -1 })
        .populate('iterations.user_agent_session_message');
    const total = await UserAgentSessionOperationModel.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return {
      operations: userAgentSessionOperations.map(dto),
      page,
      limit,
      total,
      pages,
    };
  }

  static async create(body, sessionId, userId) {
    objectValidator(body, "body");
    stringValidator(body.name, "body.name", {
      min: { enabled: true, value: 2 },
      max: { enabled: true, value: 250 },
      regex: null,
    });
    stringValidator(body.state, "body.state", {
      min: { enabled: false, value: 0 },
      max: { enabled: false, value: 0 },
      regex: { enabled: true, value: /running|completed|error/ },
    });
    idValidator(sessionId, "sessionId");
    idValidator(userId, "userId");

    if (body?.max_iterations !== undefined && body?.max_iterations !== null) numberValidator(body.max_iterations, "body.max_iterations", {
      min: { enabled: true, value: 1 },
      max: { enabled: true, value: 10 },
      regex: null
    });

    const user = await UserModel.findOne({ _id: userId });
    if (!user) ClientError.notFound("user not found");

    const session = await UserAgentSessionModel.findOne({ _id: sessionId, user: userId });
    if (!session) ClientError.notFound("session not found");

    try {
      const operation = await UserAgentSessionOperationModel.create({
        name: body?.name,
        state: body?.state,
        max_iterations: body?.max_iterations,
        user_agent_session: session._id,
        iterations: body?.iterations,
        user: userId,
      });

      return dto(operation);
    } catch (error) {
      console.error("Error creating user agent session operation", error);
      throw new Error("Error creating user agent session operation", error);
    }
  }

  static async update(_id, body, userId) {
    objectValidator(body, "body");
    idValidator(_id, "_id");
    idValidator(userId, "userId");
    if (body.name) stringValidator(body.name, "body.name", {
      min: { enabled: true, value: 2 },
      max: { enabled: true, value: 250 },
      regex: null,
    });
    if (body.state) stringValidator(body.state, "body.state", {
      min: { enabled: false, value: 0 },
      max: { enabled: false, value: 0 },
      regex: { enabled: true, value: /running|completed|error/ },
    });

    const user = await UserModel.findOne({ _id: userId });
    if (!user) ClientError.notFound("user not found");

    const operation = await UserAgentSessionOperationModel.findOne({ _id, user: userId });
    if (!operation) ClientError.notFound("operation not found");

    try {
      if (body.name) operation.name = body.name;
      if (body.state) operation.state = body.state;
      if (body.iterations) operation.iterations = body.iterations;
      await operation.save();

      return dto(operation);
    } catch (error) {
      console.error("Error creating user agent session operation", error);
      throw new Error("Error creating user agent session operation", error);
    }
  }
}

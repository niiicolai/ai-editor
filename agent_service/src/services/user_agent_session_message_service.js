
import UserAgentSessionMessage from "../mongodb/models/user_agent_session_message_model.js";
import UserAgentSessionOperation from "../mongodb/models/user_agent_session_operation_model.js";
import UserAgentSession from "../mongodb/models/user_agent_session_model.js";
import User from "../mongodb/models/user_model.js";
import dto from "../dto/user_agent_session_message_dto.js";
import ClientError from '../errors/clientError.js';
import RootAgent from "../multi_agents/root_agent.js";

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

const rootAgent = new RootAgent();

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

        const userAgentSessionMessage = await UserAgentSessionMessage
            .findOne({ _id, user: userId })
            .select(fields);
        if (!userAgentSessionMessage) ClientError.notFound("user agent session message not found");

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

        const userAgentSessionMessages = await UserAgentSessionMessage
            .find({ user: userId, user_agent_session: sessionId, role: { $ne: "system" } })
            .select(fields)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await UserAgentSessionMessage.countDocuments({ user: userId, user_agent_session: sessionId, role: { $ne: "system" } });
        const pages = Math.ceil(total / limit);

        return {
            messages: userAgentSessionMessages.map(dto),
            page,
            limit,
            total,
            pages,
        };
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

        const userAgentSession = await UserAgentSession.findOne({ _id: body.userAgentSessionId, user: userId });
        if (!userAgentSession) ClientError.notFound("user agent session not found");

        const lastMessages = await UserAgentSessionMessage
            .find({ user_agent_session: userAgentSession._id })
            .limit(5)
            .sort({ created_at: -1 });

        try {
            /**
             * Setup session title
             */
            if (lastMessages.length == 0) {
                const response = await rootAgent.call({
                    content: `Based on the following input, select a chat title: ${body?.context?.content}; Output the response in the code field. Be creative. Do not put quotes around the title.`,
                    role: "system",
                    messages: [
                        { role: "developer", content: `The current file is ${body?.context?.currentFile?.name}` },
                        { role: "developer", content: `The directory state is ${JSON.stringify(body?.context?.directoryInfo)}` },
                    ]
                });
                userAgentSession.title = response.code;
                await userAgentSession.save();
            }

            /**
             * Create user message
             */
            const userAgentSessionMessageUser = new UserAgentSessionMessage({
                content: body?.context?.content,
                role: body.role,
                state: "completed",
                user_files: body.user_files,
                user_agent_session: userAgentSession._id,
                user: user._id,
            });
            await userAgentSessionMessageUser.save();

            /**
             * Create response
             */
            const response = await rootAgent.call({
                content: userAgentSessionMessageUser.content,
                role: userAgentSessionMessageUser.role,
                messages: [
                    ...lastMessages.map(m => {
                        return { role: m.role, content: m.content }
                    }),
                    { role: "developer", content: `The current file is ${body?.context?.currentFile?.name}` },
                    { role: "developer", content: `The directory state is ${JSON.stringify(body?.context?.directoryInfo)}` },
                ]
            });

            /**
             * Save response
             */
            const userAgentSessionMessageAI = new UserAgentSessionMessage({
                content: response.message,
                code: response.code,
                clientFn: response.clientFn,
                role: "assistant",
                state: "completed",
                user_agent_session: userAgentSession._id,
                user: user._id,
            });
            await userAgentSessionMessageAI.save();

            /**
             * Start operation if the response contains a client function
             * or update the active operation if any are running.
             */
            let activeOperation = await UserAgentSessionOperation.findOne({ state: 'running' });
            if (!activeOperation) {
                if (response.clientFn) {
                    activeOperation = await UserAgentSessionOperation.create({
                        name: body?.context?.content,
                        state: 'running',
                        user_agent_session: userAgentSession._id,
                        iterations: [{ user_agent_session_message: userAgentSessionMessageAI._id }]
                    })
                }
            } else {
                activeOperation.iterations.push({ user_agent_session_message: userAgentSessionMessageAI._id });
                await activeOperation.save();
            }

            return {
                msg: await this.find(userAgentSessionMessageUser._id.toString(), userId, fields),
                response: await this.find(userAgentSessionMessageAI._id.toString(), userId, fields)
            }
        } catch (error) {
            console.error("Error creating user agent session message", error);
            throw new Error("Error creating user agent session message", error);
        }
    }

    /**
     * @function createAgentResponse
     * @description Create a new user agent session message
     * @param {object} body - Request body
     * @param {string} userId - User id
     * @param {array} fields - Fields to return
     * @return {Promise<object>} - Created user agent session object
     */
    static async createAgentResponse(body, userId, fields = null) {
        objectValidator(body, "body");
        stringValidator(body.role, "role");
        stringValidator(body?.context?.content, "context.content");
        idValidator(body.userAgentSessionId, "userAgentSessionId");
        idValidator(userId, "userId");

        const user = await User.findOne({ _id: userId });
        if (!user) ClientError.notFound("user not found");

        const userAgentSession = await UserAgentSession.findOne({ _id: body.userAgentSessionId, user: userId });
        if (!userAgentSession) ClientError.notFound("user agent session not found");

        const lastMessages = await UserAgentSessionMessage
            .find({ user_agent_session: userAgentSession._id })
            .limit(5)
            .sort({ created_at: -1 });

        try {
            const activeOperation = await UserAgentSessionOperation.findOne({ state: 'running' });
            if (!activeOperation) {
                return;
            }

            const userAgentSessionMessageSystem = new UserAgentSessionMessage({
                content: body?.context?.content,
                role: "system",
                state: "completed",
                user_agent_session: userAgentSession._id,
                user: user._id,
            });
            await userAgentSessionMessageSystem.save();

            const response = await rootAgent.call({
                content: "You are working on this goal: " + activeOperation.name + "; " + body?.context?.content,
                role: body.role,
                messages: [
                    ...lastMessages.map(m => {
                        return { role: m.role, content: m.content }
                    }),
                    ...body?.context?.messages,
                ]
            });
            console.log("You are working on this goal: " + activeOperation.name + "; " + body?.context?.content)

            if (!response.clientFn) {
                activeOperation.state = 'completed'
                await activeOperation.save();
            }

            const userAgentSessionMessageAI = new UserAgentSessionMessage({
                content: response.message,
                code: response.code,
                clientFn: response.clientFn,
                role: "assistant",
                state: "completed",
                user_agent_session: userAgentSession._id,
                user: user._id,
            });
            await userAgentSessionMessageAI.save();

            activeOperation.iterations.push({ user_agent_session_message: userAgentSessionMessageAI._id });
            await activeOperation.save();

            if (activeOperation.iterations.length >= activeOperation.max_iterations) {
                const userAgentSessionMessageAIResult2 = new UserAgentSessionMessage({
                    content: "Reached active operation iteration max length. Please try again.",
                    role: "assistant",
                    state: "completed",
                    user_agent_session: userAgentSession._id,
                    user: user._id,
                });
                await userAgentSessionMessageAIResult2.save();
                activeOperation.state = 'completed'
                await activeOperation.save();
            }

            return {
                response: await this.find(userAgentSessionMessageAI._id.toString(), userId, fields)
            }
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
        stringValidator(body.content, "content");
        idValidator(_id, "_id");
        idValidator(userId, "userId");
        fields = fieldsValidator(fields, allowedFields);

        const userAgentSessionMessage = await UserAgentSessionMessage.findOne({ _id, user: userId });
        if (!userAgentSessionMessage) ClientError.notFound("user agent session message not found");

        try {
            userAgentSessionMessage.content = body.content;
            await userAgentSessionMessage.save();

            return await this.find(userAgentSessionMessage._id.toString(), userId, fields);
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

        const userAgentSessionMessage = await UserAgentSessionMessage.findOne({ _id, user: userId });
        if (!userAgentSessionMessage) ClientError.notFound("user agent session message not found");

        try {
            await UserAgentSessionMessage.deleteOne({ _id });
        } catch (error) {
            throw new Error("Error deleting user agent session message", error);
        }
    }
}

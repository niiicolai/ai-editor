import { WebsocketEvent } from "../event.js";
import UserAgentSessionMessageService from "../../services/user_agent_session_message_service.js";

export default class UserInputEvent extends WebsocketEvent {
    constructor() {
        super('user_input')
    }

    async execute(connection, reply, data) {
        if (!connection.userData?.user?._id)  {
            reply('error', { content: "User not found" });
            return;
        }
        if (!connection.userData?.sessionId)  {
            reply('error', { content: "SessionId not found" });
            return;
        }

        const sessionId = connection.userData.sessionId;
        const userId = connection.userData.user._id;
        const result = await UserAgentSessionMessageService.create({
            context: data,
            role: "user",
            userAgentSessionId: sessionId
        }, userId);

        reply('user_input_reply', result);
    }
}

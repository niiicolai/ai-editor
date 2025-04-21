import { WebsocketEvent } from "../event.js";
import UserAgentSessionMessageService from "../../services/user_agent_session_message_service.js";

export default class UserInputEvent extends WebsocketEvent {
    constructor() {
        super('client_function_result')
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
        console.log("client_function_result", data)
        const sessionId = connection.userData.sessionId;
        const userId = connection.userData.user._id;
        const result = await UserAgentSessionMessageService.createAgentResponse({
            context: { ...data, messages: [
                { role: "developer", content: "The user input contains the result of the function call" }
            ]},
            role: "user",
            userAgentSessionId: sessionId
        }, userId);

        reply('user_input_reply', result);
    }
}

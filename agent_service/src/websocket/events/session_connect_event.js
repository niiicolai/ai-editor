import { WebsocketEvent } from "../event.js";
import JwtService from "../../services/jwt_service.js";

export default class SessionConnectEvent extends WebsocketEvent {
    constructor() {
        super('session_connect')
    }

    async execute(connection, reply, data) {
        const user = await JwtService.verify(data.token);
        if (!user) {
            reply('error', { content: "Invalid authentication token" });
            return;
        }

        connection.userData = { user, sessionId: data.sessionId };
    }
}

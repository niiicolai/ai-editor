import { WebsocketEvent } from "../event.js";

export default class SessionLeaveEvent extends WebsocketEvent {
    constructor() {
        super('session_leave')
    }

    async execute(connection, reply, data) {
        if (!connection.userData?.user) {
            reply('error', { content: "User not found", code: 404 });
            return;
        }
        connection.userData = { user: connection.userData.user, sessionId: null };
    }
}

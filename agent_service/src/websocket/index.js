import 'dotenv/config'
import WebSocketServer from 'websocket';
import http from 'http';
import JwtService from '../services/jwt_service.js';
import UserAgentSessionMessageService from '../services/user_agent_session_message_service.js';
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";

export const setupWebsocket = async () => {
    const dir = path.resolve('src', 'websocket', 'events');
    const files = fs.readdirSync(dir);
    const events = [];
    for (const file of files) {
        try {
            const filePath = path.join(dir, file);
            const fileUrl = pathToFileURL(filePath).href;
            const eventModule = await import(fileUrl);
            events.push(new eventModule.default());
        } catch (error) {
            console.error('ERROR: Failed to load event:', file, error);
        }
    }

    const port = process.env.WEBSOCKET_PORT || 3001;
    const requestListeners = (req, res) => {
        res.writeHead(404)
        res.end()
    }

    const server = http.createServer(requestListeners);

    server.listen(port, () => {
        console.log(`INFO: WebSocket Server is listening on port ${port}`);
    });

    const wsServer = new WebSocketServer.server({
        httpServer: server,
        autoAcceptConnections: false
    });

    function originIsAllowed(origin) {
        return true;
    }

    wsServer.on('request', (request) => {

        if (!originIsAllowed(request.origin)) {
            request.reject();
            return;
        }

        try {
            const connection = request.accept('echo-protocol', request.origin);
            connection.userData = { user: null, channel: null };
            connection.on('message', async function (message) {
                if (message.type === 'utf8') {
                    const json = JSON.parse(message.utf8Data);
                    const reply = (event, payload) => connection.sendUTF(JSON.stringify({ event, payload }));
                    for (const event of events) {
                        if (event.event == json.event) {
                            await event.execute(connection, reply, json.data)
                        }
                    }
                }
            });

            connection.on('close', (reasonCode, description) => { });
        } catch (error) {
            console.error(error);
        }

    });
}

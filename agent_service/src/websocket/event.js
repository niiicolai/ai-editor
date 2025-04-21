

export class WebsocketEvent {
    constructor(event) {
        this.event = event;
    }
    async execute(connection, reply) {
        throw new Error("Not implemented");
    }
}

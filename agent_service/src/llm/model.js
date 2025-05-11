

export class Model {
    constructor(name) {
        this.name = name;
    }

    async creatChatCompletion(messages = [], options = {}) {
        throw new Error("not implemented!");
    }
}

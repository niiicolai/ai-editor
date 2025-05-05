

export class Model {
    constructor(name) {
        this.name = name;
    }

    async createVectorEmbeddings(chunks = []) {
        throw new Error("not implemented!");
    }
}


export default class Agent {
    constructor(options = { 
        name: null, 
        description: null, 
        instructions: null,
        model: null 
    }) {
        this.name = options.name;
        this.description = options.description;
        this.instructions = options.instructions;
        this.model = options.model;
    }

    async call(args) {
        throw new Error("Not implemented");
    }
}

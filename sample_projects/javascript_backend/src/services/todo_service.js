import TodoModel from "../mongodb/models/todo_model.js";

export class TodoService {
    /**
     * @function find
     * @description Find todo by id
     * @param {String} _id
     * @returns {Promise<Object>}
     */
    static async find(_id) {
        return await TodoModel.findOne({ _id });
    }
    
    /**
     * @function findAll
     * @description Find all todos
     * @returns {Promise<Object>}
     */
    static async findAll() {
        return await TodoModel.find();
    }
    
    /**
     * @function create
     * @description Create todo
     * @param {Object} body
     * @param {String} body.content
     * @returns {Promise<Object>}
     */
    static async create(body) {
        return await TodoModel.create(body);
    }

    /**
     * @function update
     * @description Update todo by id
     * @param {String} _id
     * @param {Object} body
     * @param {String} body.content
     * @returns {Promise<Object>}
     */
    static async update(_id, body) {
        return await TodoModel.updateOne({ _id }, body);
    }

    /**
     * @function destroy
     * @description Destroy todo by id
     * @param {String} _id
     * @returns {Promise<void>}
     */
    static async destroy(_id) {
        await TodoModel.deleteOne({ _id });
    }
}

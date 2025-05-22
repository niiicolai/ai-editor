import PageModel from "../mongodb/models/page_model.js";

export class PageService {
    
    /**
     * @function find
     * @description Find page by id
     * @param {String} _id
     * @returns {Promise<Object>}
     */
    static async find(_id) {
        return await PageModel.findOne({ _id });
    }
    
    /**
     * @function findAll
     * @description Find all pages
     * @returns {Promise<Object>}
     */
    static async findAll() {
        return await PageModel.find();
    }
    
    /**
     * @function create
     * @description Create page
     * @param {Object} body
     * @param {String} body.content
     * @returns {Promise<Object>}
     */
    static async create(body) {
        return await PageModel.create(body);
    }

    /**
     * @function update
     * @description Update page by id
     * @param {String} _id
     * @param {Object} body
     * @param {String} body.content
     * @returns {Promise<Object>}
     */
    static async update(_id, body) {
        return await PageModel.updateOne({ _id }, body);
    }

    /**
     * @function destroy
     * @description Destroy page by id
     * @param {String} _id
     * @returns {Promise<void>}
     */
    static async destroy(_id) {
        await PageModel.deleteOne({ _id });
    }

    /**
     * @function createAndFindByContent
     * @description Create a page and find it by content
     * @param {String} _id
     * @param {Object} body
     * @param {String} body.content
     * @returns {Promise<void>}
     */
    static createAndFindByContent(_id, body) {
        const create = async () => await PageModel.create(body);
        const find = async () => await PageModel.find({ content: body.content })
        const page = create().then(find);
        console.log(create)
        console.log(find)
        console.log(page)

        return { page };
    }
}

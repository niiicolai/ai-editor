import UserProductModel from '../mongodb/models/user_product_model.js';
import dto from "../dto/user_product_dto.js";
import ClientError from '../errors/clientError.js';

import { idValidator } from "../validators/id_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";

export default class UserProductService {
    /**
     * @function find
     * @description Get user product by id
     * @param {String} _id
     * @param {String} userId
     * @returns {Promise<Object>}
     */
    static async find(_id, userId) {
        idValidator(_id);

        const userProduct = await UserProductModel
            .findOne({ _id, user: userId });
        if (!product) ClientError.notFound("user product not found");

        return dto(userProduct);
    }

    /**
     * @function findAll
     * @description Paginate user products
     * @param {Number} page
     * @param {Number} limit
     * @param {String} userId
     * @returns {Promise<Object>}
     */
    static async findAll(page = 1, limit = 10, userId) {
        paginatorValidator(page, limit);

        const query = { user: userId };
        const userProducts = await UserProductModel
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await UserProductModel.countDocuments(query);
        const pages = Math.ceil(total / limit);

        return {
            products: userProducts.map(dto),
            page,
            limit,
            total,
            pages,
        };
    }
}

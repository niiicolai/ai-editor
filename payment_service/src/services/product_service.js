import ProductModel from '../mongodb/models/product_model.js';
import dto from "../dto/product_dto.js";
import ClientError from '../errors/clientError.js';

import { idValidator } from "../validators/id_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";

export default class ProductService {
    /**
     * @function find
     * @description Get product by id
     * @param {String} _id
     * @returns {Promise<Object>}
     */
    static async find(_id) {
        idValidator(_id);

        const product = await ProductModel
            .findOne({ _id, deleted_at: null });
        if (!product) ClientError.notFound("product not found");

        return dto(product);
    }

    /**
     * @function findAll
     * @description Paginate products
     * @param {Number} page
     * @param {Number} limit
     * @param {String} category
     * @returns {Promise<Object>}
     */
    static async findAll(page = 1, limit = 10, category) {
        paginatorValidator(page, limit);

        const query = {};
        if (category) query.category = category;
        const products = await ProductModel
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await ProductModel.countDocuments(query);
        const pages = Math.ceil(total / limit);

        return {
            products: products.map(dto),
            page,
            limit,
            total,
            pages,
        };
    }
}

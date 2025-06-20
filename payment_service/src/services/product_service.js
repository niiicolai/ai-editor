import ProductModel from '../mongodb/models/product_model.js';
import dto from "../dto/product_dto.js";
import ClientError from '../errors/client_error.js';

import { idValidator } from "../validators/id_validator.js";
import { paginatorValidator } from "../validators/paginator_validator.js";
import { objectValidator } from '../validators/object_validator.js';
import { stringValidator } from '../validators/string_validator.js';
import { numberValidator } from '../validators/number_validator.js';

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

        const query = { deleted_at: null };
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

    /**
     * @function create
     * @description create product
     * @param {Object} body
     * @returns {Promise<Object>}
     */
    static async create(body) {
        objectValidator(body, "body")
        stringValidator(body.title, "body.title", {
            min: { enabled: true, value: 2 },
            max: { enabled: true, value: 100 },
            regex: null
        })
        stringValidator(body.description, "body.description", {
            min: { enabled: true, value: 1 },
            max: { enabled: true, value: 1000 },
            regex: null
        })
        stringValidator(body.category, "body.category", {
            min: { enabled: true, value: 1 },
            max: { enabled: true, value: 100 },
            regex: null
        })
        numberValidator(body.noOfCredits, "body.noOfCredits", {
            min: { enabled: true, value: 1 },
            max: { enabled: true, value: 100000 },
            regex: null
        })
        numberValidator(body.price, "body.price", {
            min: { enabled: true, value: 1 },
            max: { enabled: true, value: 100000 },
            regex: null
        })
        stringValidator(body.stripePriceId, "body.stripePriceId")

        const titleExist = await ProductModel.findOne({ title: body.title, deleted_at: null });
        if (titleExist) ClientError.notFound("title already in use");

        const product = new ProductModel({
            title: body.title,
            description: body.description,
            category: body.category,
            noOfCredits: body.noOfCredits,
            price: body.price,
            stripePriceId: body.stripePriceId,
        });
        await product.save();

        return dto(product);
    }

    /**
     * @function update
     * @description update product
     * @param {String} _id
     * @param {Object} body
     * @returns {Promise<Object>}
     */
    static async update(_id, body) {
        objectValidator(body, "body")
        idValidator(_id, "_id")
        
        const product = await ProductModel.findOne({ _id, deleted_at: null });
        if (!product) ClientError.notFound("product not found");

        if (body.title) {
            stringValidator(body.title, "body.title", {
                min: { enabled: true, value: 2 },
                max: { enabled: true, value: 100 },
                regex: null
            })

            product.title = body.title;
        }
        if (body.description) {
            stringValidator(body.description, "body.description", {
                min: { enabled: true, value: 1 },
                max: { enabled: true, value: 1000 },
                regex: null
            })

            product.description = body.description;
        }
        if (body.category) {
            stringValidator(body.category, "body.category", {
                min: { enabled: true, value: 1 },
                max: { enabled: true, value: 100 },
                regex: null
            })
            
            product.category = body.category;
        }
        if (body.noOfCredits) {
            numberValidator(body.noOfCredits, "body.noOfCredits", {
                min: { enabled: true, value: 1 },
                max: { enabled: true, value: 100000 },
                regex: null
            })

            product.noOfCredits = body.noOfCredits;
        }
        if (body.price) {
            numberValidator(body.price, "body.price", {
                min: { enabled: true, value: 1 },
                max: { enabled: true, value: 100000 },
                regex: null
            })

            product.price = body.price;
        }
        if (body.stripePriceId) {
            stringValidator(body.stripePriceId, "body.stripePriceId")
            
            product.stripePriceId = body.stripePriceId;
        }

        await product.save();

        return dto(product);
    }

    /**
     * @function destroy
     * @description destroy product
     * @param {String} _id
     * @returns {Promise<Object>}
     */
    static async destroy(_id) {
        idValidator(_id, "_id")

        const product = await ProductModel.findOne({ _id, deleted_at: null });
        if (!product) ClientError.notFound("product not found");
        
        product.deleted_at = new Date();
        await product.save();
    }
}

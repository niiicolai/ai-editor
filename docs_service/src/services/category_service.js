import CategoryModel from "../mongodb/models/category_model.js";
import dto from "../dto/category_dto.js";
import ClientError from '../errors/client_error.js';

import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";
import { paginatorValidator } from '../validators/paginator_validator.js';

const allowedFields = [
    "_id",
    "name",
    "created_at",
    "updated_at",
];

export default class CategoryService {
    /**
     * @function find
     * @description Get category by id
     * @param {String} _id
     * @param {Array} fields
     * @param {String} fields.name
     * @param {String} fields.created_at
     * @param {String} fields.updated_at
     * @returns {Promise<Object>}
     */
    static async find(_id, fields = null) {
        idValidator(_id);
        fields = fieldsValidator(fields, allowedFields);

        const category = await CategoryModel
            .findOne({ _id })
            .select(fields.join(" "));
        if (!category) ClientError.notFound("category not found");

        return dto(category);
    }

    /**
     * @function findAll
     * @description Find all categories
     * @param {number} page - Page number
     * @param {number} limit - Page size
     * @param {array} fields - Fields to return
     * @return {Promise<object>}
     */
    static async findAll(page, limit, fields = null) {
        paginatorValidator(page, limit);
        fields = fieldsValidator(fields, allowedFields);

        const categories = await CategoryModel
            .find()
            .select(fields.join(" "))
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ created_at: -1 });
        const total = await CategoryModel.countDocuments();
        const pages = Math.ceil(total / limit);

        return {
            data: categories.map(dto),
            page,
            limit,
            total,
            pages,
        };
    }
}
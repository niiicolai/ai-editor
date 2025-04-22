import PageModel from "../mongodb/models/page_model.js";
import CategoryModel from "../mongodb/models/category_model.js";
import dto from "../dto/page_dto.js";
import ClientError from '../errors/clientError.js';

import { idValidator } from "../validators/id_validator.js";
import { fieldsValidator } from "../validators/fields_validator.js";
import { paginatorValidator } from '../validators/paginator_validator.js';

const allowedFields = [
    "_id",
    "name",
    "content",
    "category",
    "created_at",
    "updated_at",
];

export default class PageService {
    /**
     * @function find
     * @description Get page by id
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

        const page = await PageModel
            .findOne({ _id })
            .select(fields)
            .populate('category');
        if (!page) ClientError.notFound("page not found");

        return dto(page);
    }

    /**
     * @function findAll
     * @description Find all pages
     * @param {number} page - Page number
     * @param {number} limit - Page size
     * @param {string} category - Page category
     * @param {array} fields - Fields to return
     * @return {Promise<object>}
     */
    static async findAll(page, limit, category, fields = null) {
        paginatorValidator(page, limit);
        fields = fieldsValidator(fields, allowedFields);

        const params = {};
        if (category) {
            const cat = await CategoryModel.findOne({ name: category });
            if (!cat) ClientError.notFound("category not found");
            params.category = cat._id;
        }
        const pageDocs = await PageModel
            .find(params)
            .select(fields)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ created_at: -1 })
            .populate('category');
        const total = await PageModel.countDocuments(params);
        const pages = Math.ceil(total / limit);

        return {
            data: pageDocs.map(dto),
            page,
            limit,
            total,
            pages,
        };
    }

    static async findOrderedPages() {
        const page = 1;
        const limit = 1000;
        const pages = await PageModel
        .find()
        .select(allowedFields)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ created_at: 1 })
        .populate('category');
        
        // Group pages by category name
        const categoryMap = new Map();

        for (const page of pages) {
            if (!page.category) continue;
            const category = page.category;
            const name = category.name;

            if (!categoryMap.has(name)) {
                categoryMap.set(name, { category, pages: [] });
            }

            categoryMap.get(name).pages.push(dto(page));
        }

        const orderedPages = Array.from(categoryMap.values())
            .sort((a, b) => a.category.order - b.category.order)
            .map(({ category, pages }) => ({
                category_name: category.name,
                pages,
            }));

        return {
            data: orderedPages,
        };
    }
}
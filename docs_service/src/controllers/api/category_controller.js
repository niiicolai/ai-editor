import express from "express";
import CategoryService from "../../services/category_service.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
export const links = {
    get: { rel: "get category", method: "GET", href: "/category/{_id}" },
    getAll: { rel: "get categories", method: "GET", href: "/categories" },
};

/**
 * @openapi
 * '/api/v1/category/{_id}':
 *  get:
 *    tags:
 *     - Category Controller
 *    summary: Get category
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: Category _id
 *     - name: fields
 *       in: query
 *       description: Comma separated list of fields to return
 *     - name: discover
 *       in: query
 *       description: HATEOAS
 *       required: false
 *       schema:
 *        type: boolean
 *        default: false
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/categoryResponse'
 *          _links:
 *           $ref: '#/components/linksResponse'
 *      headers:
 *        $ref: '#/components/responseHeaders'
 *     400:
 *      $ref: '#/components/badRequestResponse'
 *     404:
 *      $ref: '#/components/notFoundResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.get("/category/:_id", [hateoas(links, links.get, [])], async (req, res) => {
    respond(req, res, async () => {
        const _id = req.params._id;
        const fields = req.query.fields?.split(",") || null;
        return await CategoryService.find(_id, fields);
    });
});

/**
 * @openapi
 * '/api/v1/categories':
 *  get:
 *    tags:
 *     - Category Controller
 *    summary: Get categories
 *    parameters:
 *     - name: fields
 *       in: query
 *       description: Comma separated list of fields to return
 *     - name: discover
 *       in: query
 *       description: HATEOAS
 *       required: false
 *       schema:
 *        type: boolean
 *        default: false
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/categoriesResponse'
 *          _links:
 *           $ref: '#/components/linksResponse'
 *      headers:
 *        $ref: '#/components/responseHeaders'
 *     400:
 *      $ref: '#/components/badRequestResponse'
 *     404:
 *      $ref: '#/components/notFoundResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.get("/categories", [hateoas(links, links.getAll, [])], async (req, res) => {
    respond(req, res, async () => {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const fields = req.query.fields?.split(",") || null;
        return await CategoryService.findAll(page, limit, fields);
    });
});

export default router;

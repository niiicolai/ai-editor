import express from "express";
import ProductService from "../../services/product_service.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
export const links = {
    get: { rel: "get product", method: "GET", href: "/product/{_id}" },
    getAll: { reg: "get all products", method: "GET", href: "/products" }
};

/**
 * @openapi
 * '/api/v1/product/{_id}':
 *  get:
 *    tags:
 *     - Product Controller
 *    summary: Get product by id
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: product id
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
 *           $ref: '#/components/productResponse'
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
router.get("/product/:_id", hateoas(links, links.get, []), async (req, res) => {
    respond(req, res, async () => {
        return await ProductService.find(req.params._id);
    });
});

/**
 * @openapi
 * '/api/v1/products':
 *  get:
 *    tags:
 *     - Product Controller
 *    summary: Get products
 *    parameters:
 *     - name: discover
 *       in: query
 *       description: HATEOAS
 *       required: false
 *       schema:
 *        type: boolean
 *        default: false
 *     - name: page
 *       in: query
 *       description: Page number
 *       required: false
 *       schema:
 *        type: integer
 *        default: 1
 *     - name: limit
 *       in: query
 *       description: Number of items per page
 *       required: false
 *       schema:
 *        type: integer
 *        default: 10
 *     - name: category
 *       in: query
 *       description: Product category
 *       required: false
 *       schema:
 *        type: string
 *        default: credit
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/productsResponse'
 *          _links:
 *           $ref: '#/components/linksResponse'
 *      headers:
 *        $ref: '#/components/responseHeaders'
 *     400:
 *      $ref: '#/components/badRequestResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.get(
    "/products",
    hateoas(links, links.getAll, []),
    async (req, res) => {
        respond(req, res, async () => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const category = req.query.category || null;
            return await ProductService.findAll(page, limit, category);
        });
    }
);

export default router;

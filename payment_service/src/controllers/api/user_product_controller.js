import express from "express";
import UserProductService from "../../services/user_product_service.js";
import { authentication } from "../middleware/authentication.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
export const links = {
    get: { rel: "get user product", method: "GET", href: "/user_product/{_id}" },
    getAll: { reg: "get all user products", method: "GET", href: "/user_products" },
    getCreditsInfo: { reg: "get credit info", method: "GET", href: "/credit_info" },
};

/**
 * @openapi
 * '/api/v1/user_product/{_id}':
 *  get:
 *    tags:
 *     - User Product Controller
 *    summary: Get user product by id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: User product id
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
 *           $ref: '#/components/userProductResponse'
 *          _links:
 *           $ref: '#/components/linksResponse'
 *      headers:
 *        $ref: '#/components/responseHeaders'
 *     400:
 *      $ref: '#/components/badRequestResponse'
 *     401:
 *      $ref: '#/components/unauthorizedResponse'
 *     404:
 *      $ref: '#/components/notFoundResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.get(
    "/user_product/:_id",
    [authentication, hateoas(links, links.get, [])],
    async (req, res) => {
        respond(req, res, async () => {
            return await UserProductService.find(req.params._id, req.user._id);
        });
    });

/**
 * @openapi
 * '/api/v1/user_products':
 *  get:
 *    tags:
 *     - User Product Controller
 *    summary: Get user products
 *    security:
 *     - bearerAuth: []
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
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/userProductsResponse'
 *          _links:
 *           $ref: '#/components/linksResponse'
 *      headers:
 *        $ref: '#/components/responseHeaders'
 *     400:
 *      $ref: '#/components/badRequestResponse'
 *     401:
 *      $ref: '#/components/unauthorizedResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.get(
    "/user_products",
    [authentication, hateoas(links, links.getAll, [])],
    async (req, res) => {
        respond(req, res, async () => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const userId = req.user._id;
            return await UserProductService.findAll(page, limit, userId);
        });
    }
);

/**
 * @openapi
 * '/api/v1/credit_info':
 *  get:
 *    tags:
 *     - User Product Controller
 *    summary: Get user credit information
 *    security:
 *     - bearerAuth: []
 *    parameters:
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
 *           $ref: '#/components/userCreditInfoResponse'
 *          _links:
 *           $ref: '#/components/linksResponse'
 *      headers:
 *        $ref: '#/components/responseHeaders'
 *     400:
 *      $ref: '#/components/badRequestResponse'
 *     401:
 *      $ref: '#/components/unauthorizedResponse'
 *     404:
 *      $ref: '#/components/notFoundResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.get(
    "/credit_info",
    [authentication, hateoas(links, links.getCreditsInfo, [])],
    async (req, res) => {
        respond(req, res, async () => {
            return await UserProductService.getCreditsInfo(req.user._id);
        });
    });

export default router;

import express from "express";
import ProductService from "../../services/product_service.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";
import { authentication } from "../middleware/authentication.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();
const links = {
    get: { rel: "get product", method: "GET", href: "/product/{_id}" },
    getAll: { rel: "get all products", method: "GET", href: "/products" },
    create: { rel: "create product", method: "POST", href: "/product" },
    update: { rel: "update product", method: "PATCH", href: "/product/{_id}" },
    delete: { rel: "delete product", method: "DELETE", href: "/product/{_id}" },
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
router.get("/product/:_id", hateoas(links, links.get, [links.create]), async (req, res) => {
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
    hateoas(links, links.getAll, [links.create]),
    async (req, res) => {
        respond(req, res, async () => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const category = req.query.category || null;
            return await ProductService.findAll(page, limit, category);
        });
    }
);

/**
 * @openapi
 * '/api/v1/product':
 *  post:
 *    tags:
 *     - Product Controller (admin)
 *    summary: Create product
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
*    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/productCreateInput'
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
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.post(
    "/product",
    [authentication, authorize("admin"), hateoas(links, links.create, [])],
    async (req, res) => {
        respond(req, res, async () => {
            return await ProductService.create(req.body);
        });
    }
);

/**
 * @openapi
 * '/api/v1/product/{_id}':
 *  patch:
 *    tags:
 *     - Product Controller (admin)
 *    summary: Update product
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
*    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/productUpdateInput'
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
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.patch(
    "/product/:_id",
    [authentication, authorize("admin"), hateoas(links, links.update, [links.create])],
    async (req, res) => {
        respond(req, res, async () => {
            return await ProductService.update(req.params._id, req.body);
        });
    }
);

/**
 * @openapi
 * '/api/v1/product/{_id}':
 *  delete:
 *    tags:
 *     - Product Controller (admin)
 *    summary: Delete product
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     204:
 *      description: No Content
 *      headers:
 *        $ref: '#/components/responseHeaders'
 *     400:
 *      $ref: '#/components/badRequestResponse'
 *     404:
 *      $ref: '#/components/notFoundResponse'
 *     401:
 *      $ref: '#/components/unauthorizedResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.delete("/product/:_id", [authentication, authorize("admin")], async (req, res) => {
  try {
    await ProductService.destroy(req.params._id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

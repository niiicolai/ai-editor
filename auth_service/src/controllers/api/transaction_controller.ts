import express from "express";
import TransactionService from "../../services/transaction_service.js";
import { authentication } from "../middleware/authentication.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();
const links = {
    get: { rel: "get transaction", method: "GET", href: "/transaction/{_id}" },
    getAll: { rel: "get all transactions", method: "GET", href: "/transactions" },
};

/**
 * @openapi
 * '/api/v1/transaction/{_id}':
 *  get:
 *    tags:
 *     - Transaction Controller (admin)
 *    summary: Get transaction by id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: Transaction id
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
 *           $ref: '#/components/transactionResponse'
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
    "/transaction/:_id",
    [authentication, authorize('admin'), hateoas(links, links.get, [])],
    async (req: any, res: any) => {
        respond(req, res, async () => {
            return await TransactionService.find(req.params._id);
        });
    });

/**
 * @openapi
 * '/api/v1/transactions':
 *  get:
 *    tags:
 *     - Transaction Controller (admin)
 *    summary: Get transactions
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
 *     - name: state
 *       in: query
 *       description: Transaction state
 *       required: false
 *       schema:
 *        type: string
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/transactionsResponse'
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
    "/transactions",
    [authentication, authorize('admin'), hateoas(links, links.getAll, [])],
    async (req: any, res: any) => {
        respond(req, res, async () => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const state = req.query.state || 'pending';
            return await TransactionService.findAll(page, limit, state);
        });
    }
);

export default router;

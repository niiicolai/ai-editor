import express from "express";
import CheckoutService from "../../services/checkout_service.js";
import ClientError from "../../errors/client_error.js";
import { authentication } from "../middleware/authentication.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const WEBSITE_URL = process.env.WEBSITE_URL;
if (!WEBSITE_URL) console.error('WEBSITE_URL should be set in the .env file');

const router = express.Router();
export const links = {
    get: { rel: "get checkout", method: "GET", href: "/checkout/{_id}" },
    getAll: { rel: "get all checkout", method: "GET", href: "/checkouts" },
    create: { rel: "create checkout", method: "POST", href: "/checkout" },
    update: { rel: "update checkout", method: "POST", href: "/checkout/{_id}" },
    getOrCreate: { rel: "get or create checkout", method: "POST", href: "/find_or_create_checkout" },
    startCheckout: { rel: "start checkout", method: "POST", href: "/start_checkout/{_id}" },
    successCheckout: { rel: "success checkout", method: "GET", href: "/checkout_success" },
    cancelCheckout: { rel: "cancel checkout", method: "GET", href: "/checkout_cancel" },
};

/**
 * @openapi
 * '/api/v1/checkout/{_id}':
 *  get:
 *    tags:
 *     - Checkout Controller
 *    summary: Get checkout by id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: Checkout id
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
 *           $ref: '#/components/checkoutResponse'
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
    "/checkout/:_id",
    [authentication, hateoas(links, links.get, [links.create])],
    async (req, res) => {
        respond(req, res, async () => {
            return await CheckoutService.find(req.params._id, req.user._id);
        });
    });

/**
 * @openapi
 * '/api/v1/checkouts':
 *  get:
 *    tags:
 *     - Checkout Controller
 *    summary: Get checkouts
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
 *       description: Checkout state
 *       required: false
 *       schema:
 *        type: string
 *        default: open
 *        enum:
 *          - open
 *          - pending
 *          - purchased
 *          - cancelled
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/checkoutsResponse'
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
    "/checkouts",
    [authentication, hateoas(links, links.getAll, [links.create])],
    async (req, res) => {
        respond(req, res, async () => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const state = req.query.state || 'open';
            const userId = req.user._id;
            return await CheckoutService.findAll(page, limit, userId, state);
        });
    }
);

/**
 * @openapi
 * '/api/v1/find_or_create_checkout':
 *  get:
 *    tags:
 *     - Checkout Controller
 *    summary: Get or create checkout
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
 *           $ref: '#/components/checkoutResponse'
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
    "/find_or_create_checkout",
    [authentication, hateoas(links, links.getOrCreate, [links.create])],
    async (req, res) => {
        respond(req, res, async () => {
            const userId = req.user._id;
            return await CheckoutService.findOrCreate(userId);
        });
    }
);


/**
 * @openapi
 * '/api/v1/checkout':
 *  post:
 *    tags:
 *     - Checkout Controller
 *    summary: Create checkout
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
 *          $ref: '#components/checkoutCreateInput'
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/checkoutResponse'
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
router.post(
    "/checkout",
    [authentication, hateoas(links, links.getAll, [links.create])],
    async (req, res) => {
        respond(req, res, async () => {
            const userId = req.user._id;
            return await CheckoutService.create(req.body, userId);
        });
    }
);

/**
 * @openapi
 * '/api/v1/checkout/{_id}':
 *  patch:
 *    tags:
 *     - Checkout Controller
 *    summary: Update checkout by id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: Checkout id
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
 *          $ref: '#components/checkoutUpdateInput'
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/checkoutResponse'
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
router.patch(
    "/checkout/:_id",
    [authentication, hateoas(links, links.getAll, [links.create])],
    async (req, res) => {
        respond(req, res, async () => {
            const _id = req.params._id;
            const userId = req.user._id;
            return await CheckoutService.update(_id, req.body, userId);
        });
    }
);

/**
 * @openapi
 * '/api/v1/start_checkout/{_id}':
 *  post:
 *    tags:
 *     - Checkout Controller
 *    summary: Start checkout by id
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: Checkout id
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     303:
 *      description: Redirect to checkout page
 *     400:
 *      $ref: '#/components/badRequestResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.post(
    "/start_checkout/:_id",
    [authentication],
    async (req, res) => {
        respond(req, res, async () => {
            const _id = req.params._id;
            const userId = req.user._id;
            return await CheckoutService.startCheckout(_id, userId);
        });
    }
);

/**
 * @openapi
 * '/api/v1/checkout_success':
 *  get:
 *    tags:
 *     - Checkout Controller
 *    summary: Checkout success callback
 *    responses:
 *     200:
 *      description: return success page
 *     400:
 *      $ref: '#/components/badRequestResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.get(
    "/checkout_success",
    //[authentication],
    async (req, res) => {
        try {
            const _id = req.query.session_id;
            const checkout = await CheckoutService.successCheckout(_id);
            res.redirect(`${WEBSITE_URL}/checkout/${checkout._id}`);
        } catch (error) {
            if (error instanceof ClientError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                console.error(error); // Log the error for debugging
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }
);

/**
 * @openapi
 * '/api/v1/checkout_cancel':
 *  get:
 *    tags:
 *     - Checkout Controller
 *    summary: Checkout cancel callback
 *    responses:
 *     200:
 *      description: return cancel page
 *     400:
 *      $ref: '#/components/badRequestResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.get(
    "/checkout_cancel",
    //[authentication],
    async (req, res) => {
        try {
            const _id = req.query.session_id;
            await CheckoutService.cancelCheckout(_id);
            res.redirect(`${WEBSITE_URL}/checkout/cancel`);
        } catch (error) {
            if (error instanceof ClientError) {
                res.status(error.statusCode).json({ error: error.message });
            } else {
                console.error(error); // Log the error for debugging
                res.status(500).json({ error: 'Internal Server Error' });
            }
        }
    }
);

export default router;

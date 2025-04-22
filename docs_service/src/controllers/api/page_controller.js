import express from "express";
import PageService from "../../services/page_service.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
export const links = {
    get: { rel: "get page", method: "GET", href: "/page/{_id}" },
    getAll: { rel: "get pages", method: "GET", href: "/pages" },
    getOrdered: { rel: "get pages ordered by category", method: "GET", href: "/ordered_pages" }
};

/**
 * @openapi
 * '/api/v1/page/{_id}':
 *  get:
 *    tags:
 *     - Page Controller
 *    summary: Get page
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: Page _id
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
 *           $ref: '#/components/pageResponse'
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
router.get("/page/:_id", [hateoas(links, links.get, [])], async (req, res) => {
    respond(req, res, async () => {
        const _id = req.params._id;
        const fields = req.query.fields?.split(",") || null;
        return await PageService.find(_id, fields);
    });
});

/**
 * @openapi
 * '/api/v1/pages':
 *  get:
 *    tags:
 *     - Page Controller
 *    summary: Get pages
 *    parameters:
 *     - name: category
 *       in: query
 *       description: Page category
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
 *           $ref: '#/components/pagesResponse'
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
router.get("/pages", [hateoas(links, links.getAll, [])], async (req, res) => {
    respond(req, res, async () => {
        const page = req.query.page || 1;
        const limit = req.query.limit || 10;
        const category = req.query.category || null;
        const fields = req.query.fields?.split(",") || null;
        return await PageService.findAll(page, limit, category, fields);
    });
});

/**
 * @openapi
 * '/api/v1/ordered_pages':
 *  get:
 *    tags:
 *     - Page Controller
 *    summary: Get pages ordered by category
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
 *           $ref: '#/components/orderedPagesResponse'
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
router.get("/ordered_pages", [hateoas(links, links.getOrdered, [])], async (req, res) => {
    respond(req, res, async () => {
        return await PageService.findOrderedPages();
    });
});

export default router;

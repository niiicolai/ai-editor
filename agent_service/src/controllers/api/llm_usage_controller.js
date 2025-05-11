import express from "express";
import LlmUsageService from "../../services/llm_usage_service.js";
import { authentication } from "../middleware/authentication.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
const links = {
  get: { rel: "get llm usage", method: "GET", href: "/llm_usage/{_id}" },
  getAll: { rel: "get all llm usages", method: "GET", href: "/llm_usages" },
};

/**
 * @openapi
 * '/api/v1/llm_usage/{_id}':
 *  get:
 *    tags:
 *     - LLM Usage Controller
 *    summary: Get llm usage by id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: llm usage id
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
 *           $ref: '#/components/llmUsageResponse'
 *          _links:
 *           $ref: '#/components/linksResponse'
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
router.get(
  "/llm_usage/:_id",
  [authentication, hateoas(links, links.get, [links.create])],
  async (req, res) => {
    respond(req, res, async () => {
      const _id = req.params._id;
      const user_id = req.user._id;
      const fields = req.query.fields?.split(",") || null;
      return await LlmUsageService.find(_id, user_id, fields);
    });
  }
);

/**
 * @openapi
 * '/api/v1/llm_usages':
 *  get:
 *    tags:
 *     - LLM Usage Controller
 *    summary: Get llm usages
 *    security:
 *     - bearerAuth: []
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
 *           $ref: '#/components/llmUsagesResponse'
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
  "/llm_usages",
  [authentication, hateoas(links, links.getAll, [])],
  async (req, res) => {
    respond(req, res, async () => {
      const user_id = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const fields = req.query.fields?.split(",") || null;
      return await LlmUsageService.findAll(page, limit, user_id, fields);
    });
  }
);


export default router;

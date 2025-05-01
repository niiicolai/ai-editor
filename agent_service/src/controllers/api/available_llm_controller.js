import express from "express";
import AvailableLLMService from "../../services/available_llm_service.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
const links = {
  get: { rel: "get available LLM", method: "GET", href: "/available_llm/{_id}" },
  getAll: { rel: "get all available LLMs", method: "GET", href: "/available_llms" },
};

/**
 * @openapi
 * '/api/v1/available_llm/{_id}':
 *  get:
 *    tags:
 *     - Available LLM Controller
 *    summary: Get available llm by id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: Available llm id
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
 *           $ref: '#/components/availableLlmResponse'
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
  "/available_llm/:_id",
  [hateoas(links, links.get, [])],
  async (req, res) => {
    respond(req, res, async () => {
      const _id = req.params._id;
      const fields = req.query.fields?.split(",") || null;
      return await AvailableLLMService.find(_id, fields);
    });
  }
);

/**
 * @openapi
 * '/api/v1/available_llms':
 *  get:
 *    tags:
 *     - Available LLM Controller
 *    summary: Get available LLMs
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
 *           $ref: '#/components/availableLlmsResponse'
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
  "/available_llms",
  [hateoas(links, links.getAll, [])],
  async (req, res) => {
    respond(req, res, async () => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const fields = req.query.fields?.split(",") || null;
      return await AvailableLLMService.findAll(page, limit, fields);
    });
  }
);

export default router;

import express from "express";
import LlmService from "../../services/llm_service.js";
import { authentication } from "../middleware/authentication.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
const links = {
  create: { rel: "create a LLM message", method: "POST", href: "/create_llm_message" },
};

/**
 * @openapi
 * '/api/v1/create_llm_message':
 *  post:
 *    tags:
 *     - LLM Controller
 *    summary: Create a LLM message
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *      - name: fields
 *        in: query
 *        description: Comma separated list of fields to return
 *      - name: discover
 *        in: query
 *        description: HATEOAS
 *        required: false
 *        schema:
 *         type: boolean
 *         default: false
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/llmMesageCreateInput'
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/llmMesageResponse'
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
router.post("/create_llm_message", [authentication, hateoas(links, links.create, [])], async (req, res) => {
  respond(req, res, async () => {
    const user_id = req.user._id;
    return await LlmService.createMessage(req.body, user_id);
  });
});

export default router;

import express from "express";
import UserAgentSessionMessageService from "../../services/user_agent_session_message_service.js";
import { authentication } from "../middleware/authentication.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
export const links = {
  get: { rel: "get user agent session message", method: "GET", href: "/user_agent_session_message/{_id}" },
  getAll: { rel: "get all user agent session messages", method: "GET", href: "/user_agent_session_messages" },
  create: { rel: "create user agent session message", method: "POST", href: "/user_agent_session_message" },
  update: { rel: "update user agent session message", method: "PATCH", href: "/user_agent_session_message/{_id}" },
  delete: { rel: "delete user agent session message", method: "DELETE", href: "/user_agent_session_message/{_id}" },
};

/**
 * @openapi
 * '/api/v1/user_agent_session_message/{_id}':
 *  get:
 *    tags:
 *     - User Agent Session Message Controller
 *    summary: Get user agent session message by id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: User agent session message id
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
 *           $ref: '#/components/userAgentSessionMessageResponse'
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
router.get("/user_agent_session_message/:_id", [authentication, hateoas(links, links.get, [links.create])], async (req, res) => {
  respond(req, res, async () => {
    const _id = req.params._id;
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await UserAgentSessionMessageService.find(_id, user_id, fields);
  });
});

/**
 * @openapi
 * '/api/v1/user_agent_session_messages':
 *  get:
 *    tags:
 *     - User Agent Session Message Controller
 *    summary: Get user agent session messages by session id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: user_agent_session_id
 *       in: query
 *       description: User agent session id
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
 *           $ref: '#/components/userAgentSessionMessagesResponse'
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
  "/user_agent_session_messages",
  [authentication, hateoas(links, links.getAll, [links.create])],
  async (req, res) => {
    respond(req, res, async () => {
      const session_id = req.query.user_agent_session_id;
      const user_id = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const fields = req.query.fields?.split(",") || null;
      return await UserAgentSessionMessageService.findAll(session_id, page, limit, user_id, fields);
    });
  }
);

/**
 * @openapi
 * '/api/v1/user_agent_session_message':
 *  post:
 *    tags:
 *     - User Agent Session Message Controller
 *    summary: Create user agent session message
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
 *        $ref: '#/components/userAgentSessionMessageCreateInput'
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/userAgentSessionMessageResponse'
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
router.post("/user_agent_session_message", [authentication, hateoas(links, links.create, [])], async (req, res) => {
  respond(req, res, async () => {
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await UserAgentSessionMessageService.create({...req.body, role: 'user'}, user_id, fields);
  });
});

/**
 * @openapi
 * '/api/v1/user_agent_session_message/{_id}':
 *  patch:
 *    tags:
 *     - User Agent Session Message Controller
 *    summary: Update user agent session message
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: User agent session message id
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
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/userAgentSessionMessageUpdateInput'
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/userAgentSessionMessageResponse'
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
router.patch("/user_agent_session_message/:_id", [authentication, hateoas(links, links.update, [links.create])], async (req, res) => {
  respond(req, res, async () => {
    const _id = req.params._id;
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await UserAgentSessionService.update(_id, user_id, req.body, fields);
  });
});

/**
 * @openapi
 * '/api/v1/user_agent_session_message/{_id}':
 *  delete:
 *    tags:
 *     - User Agent Session Message Controller
 *    summary: Delete user agent session message
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: User agent session message id
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
router.delete("/user_agent_session_message/:_id", [authentication], async (req, res) => {
  try {
    const _id = req.params._id;
    const user_id = req.user._id;
    await UserAgentSessionService.destroy(_id, user_id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

import express from "express";
import UserAgentSessionService from "../../services/user_agent_session_service.js";
import { authentication } from "../middleware/authentication.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
export const links = {
  get: { rel: "get user agent session", method: "GET", href: "/user_agent_session/{_id}" },
  getAll: { rel: "get all user agent sessions", method: "GET", href: "/user_agent_sessions" },
  create: { rel: "create user agent session", method: "POST", href: "/user_agent_session" },
  update: { rel: "update user agent session", method: "PATCH", href: "/user_agent_session/{_id}" },
  delete: { rel: "delete user agent session", method: "DELETE", href: "/user_agent_session/{_id}" },
};

/**
 * @openapi
 * '/api/v1/user_agent_session/{_id}':
 *  get:
 *    tags:
 *     - User Agent Session Controller
 *    summary: Get user agent session by id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
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
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/userAgentSessionResponse'
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
router.get("/user_agent_session/:_id", [authentication, hateoas(links, links.get, [links.create])], async (req, res) => {
  respond(req, res, async () => {
    const _id = req.params._id;
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await UserAgentSessionService.find(_id, user_id, fields);
  });
});

/**
 * @openapi
 * '/api/v1/user_agent_sessions':
 *  get:
 *    tags:
 *     - User Agent Session Controller
 *    summary: Get user agent sessions
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
 *           $ref: '#/components/userAgentSessionsResponse'
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
  "/user_agent_sessions",
  [authentication, hateoas(links, links.getAll, [links.create])],
  async (req, res) => {
    respond(req, res, async () => {
      const user_id = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const fields = req.query.fields?.split(",") || null;
      return await UserAgentSessionService.findAll(page, limit, user_id, fields);
    });
  }
);

/**
 * @openapi
 * '/api/v1/user_agent_session':
 *  post:
 *    tags:
 *     - User Agent Session Controller
 *    summary: Create user agent session
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
 *        $ref: '#/components/userAgentSessionCreateInput'
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/userAgentSessionResponse'
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
router.post("/user_agent_session", [authentication, hateoas(links, links.create, [])], async (req, res) => {
  respond(req, res, async () => {
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await UserAgentSessionService.create(req.body, user_id, fields);
  });
});

/**
 * @openapi
 * '/api/v1/user_agent_session/{_id}':
 *  patch:
 *    tags:
 *     - User Agent Session Controller
 *    summary: Update user agent session
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
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
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/userAgentSessionUpdateInput'
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/userAgentSessionResponse'
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
router.patch("/user_agent_session/:_id", [authentication, hateoas(links, links.update, [links.create])], async (req, res) => {
  respond(req, res, async () => {
    const _id = req.params._id;
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await UserAgentSessionService.update(_id, user_id, req.body, fields);
  });
});

/**
 * @openapi
 * '/api/v1/user_agent_session/{_id}':
 *  delete:
 *    tags:
 *     - User Agent Session Controller
 *    summary: Delete user agent session
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: User agent session id
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
router.delete("/user_agent_session/:_id", [authentication], async (req, res) => {
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

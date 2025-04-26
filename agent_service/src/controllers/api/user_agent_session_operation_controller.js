import express from "express";
import UserAgentSessionOperationService from "../../services/user_agent_session_operation_service.js";
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
 * '/api/v1/user_agent_session_operation/{_id}':
 *  get:
 *    tags:
 *     - User Agent Session Operation Controller
 *    summary: Get user agent session operation by id
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
 *           $ref: '#/components/userAgentSessionOperationResponse'
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
router.get("/user_agent_session_operation/:_id", [authentication, hateoas(links, links.get, [links.create])], async (req, res) => {
  respond(req, res, async () => {
    const _id = req.params._id;
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await UserAgentSessionOperationService.find(_id, user_id, fields);
  });
});

/**
 * @openapi
 * '/api/v1/user_agent_session_operations':
 *  get:
 *    tags:
 *     - User Agent Session Operation Controller
 *    summary: Get user agent session operations
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: fields
 *       in: query
 *       description: Comma separated list of fields to return
 *     - name: sessionId
 *       in: query
 *       description: User Agent Session Id
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
 *           $ref: '#/components/userAgentSessionOperationsResponse'
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
  "/user_agent_session_operations",
  [authentication, hateoas(links, links.getAll, [links.create])],
  async (req, res) => {
    respond(req, res, async () => {
      const user_id = req.user._id;
      const sessionId = req.query.sessionId;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const fields = req.query.fields?.split(",") || null;
      return await UserAgentSessionOperationService.findAll(page, limit, sessionId, user_id, fields);
    });
  }
);

export default router;

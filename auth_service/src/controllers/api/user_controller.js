import express from "express";
import UserService from "../../services/user_service.js";
import { authentication } from "../middleware/authentication.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
export const links = {
  get: { rel: "get user", method: "GET", href: "/user" },
  create: { rel: "create user", method: "POST", href: "/user" },
  login: { rel: "authenticate user", method: "POST", href: "/user/login" },
  update: { rel: "update user", method: "PATCH", href: "/user" },
  delete: { rel: "delete user", method: "DELETE", href: "/user" },
};

/**
 * @openapi
 * '/api/v1/user':
 *  get:
 *    tags:
 *     - User Controller
 *    summary: Get authenticated user
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
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/userResponse'
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
router.get("/user", [authentication, hateoas(links, links.get, [links.create])], async (req, res) => {
  respond(req, res, async () => {
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await UserService.find(user_id, fields);
  });
});

/**
 * @openapi
 * '/api/v1/user':
 *  post:
 *    tags:
 *     - User Controller
 *    summary: Create and authenticate user
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
 *        $ref: '#/components/userCreateInput'
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           type: object
 *           properties:
 *            user:
 *              $ref: '#/components/userResponse'
 *            token:
 *              $ref: '#/components/userTokenResponse'
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
router.post("/user", hateoas(links, links.create, []), async (req, res) => {
  respond(req, res, async () => {
    const fields = req.query.fields?.split(",") || null;
    return await UserService.create(req.body, fields);
  });
});

/**
 * @openapi
 * '/api/v1/user':
 *  patch:
 *    tags:
 *     - User Controller
 *    summary: Update authenticated user
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
 *    requestBody:
 *     required: true
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/userUpdateInput'
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/userResponse'
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
router.patch("/user", [authentication, hateoas(links, links.update, [links.create])], async (req, res) => {
  respond(req, res, async () => {
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await UserService.update(user_id, req.body, fields);
  });
});

/**
 * @openapi
 * '/api/v1/user':
 *  delete:
 *    tags:
 *     - User Controller
 *    summary: Delete authenticated user
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
router.delete("/user", [authentication], async (req, res) => {
  try {
    const user_id = req.user._id;
    await UserService.destroy(user_id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

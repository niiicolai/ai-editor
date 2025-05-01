import express from "express";
import ProjectIndexItemService from "../../services/project_index_item_service.js";
import { authentication } from "../middleware/authentication.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
export const links = {
  get: { rel: "get project index item", method: "GET", href: "/project_index_item/{_id}" },
  getAll: { rel: "get all project index items", method: "GET", href: "/project_index_items" },
  create: { rel: "create project index item", method: "POST", href: "/project_index_item" },
  delete: { rel: "delete project index item", method: "DELETE", href: "/project_index_item/{_id}" },
};

/**
 * @openapi
 * '/api/v1/project_index_item/{_id}':
 *  get:
 *    tags:
 *     - Project Index Item Controller
 *    summary: Get project index by id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: project index id
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
 *           $ref: '#/components/projectIndexItemResponse'
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
router.get("/project_index_item/:_id", [authentication, hateoas(links, links.get, [links.create])], async (req, res) => {
  respond(req, res, async () => {
    const _id = req.params._id;
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await ProjectIndexItemService.find(_id, user_id, fields);
  });
});

/**
 * @openapi
 * '/api/v1/project_index_items':
 *  get:
 *    tags:
 *     - Project Index Item Controller
 *    summary: Get project index items by project index id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: projectIndexId
 *       in: query
 *       description: project index id
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
 *           $ref: '#/components/projectIndexItemsResponse'
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
  "/project_index_items",
  [authentication, hateoas(links, links.getAll, [links.create])],
  async (req, res) => {
    respond(req, res, async () => {
      const user_id = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const fields = req.query.fields?.split(",") || null;
      const projectIndexId = req.query.projectIndexId || null;
      return await ProjectIndexItemService.findAll(projectIndexId, page, limit, user_id, fields);
    });
  }
);

/**
 * @openapi
 * '/api/v1/project_index_item':
 *  post:
 *    tags:
 *     - Project Index Item Controller
 *    summary: Create project index item
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
 *        $ref: '#/components/projectIndexItemCreateInput'
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/projectIndexResponse'
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
router.post("/project_index_item", [authentication, hateoas(links, links.create, [])], async (req, res) => {
  respond(req, res, async () => {
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await ProjectIndexItemService.create(req.body, user_id, fields);
  });
});

/**
 * @openapi
 * '/api/v1/project_index_item/{_id}':
 *  delete:
 *    tags:
 *     - Project Index Item Controller
 *    summary: Delete project index item
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: project index item id
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
router.delete("/project_index_item/:_id", [authentication], async (req, res) => {
  try {
    const _id = req.params._id;
    const user_id = req.user._id;
    await ProjectIndexItemService.destroy(_id, user_id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

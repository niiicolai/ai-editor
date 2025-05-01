import express from "express";
import ProjectIndexService from "../../services/project_index_service.js";
import { authentication } from "../middleware/authentication.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
export const links = {
  get: { rel: "get project index", method: "GET", href: "/project_index/{_id}" },
  getAll: { rel: "get all project indexes", method: "GET", href: "/project_indexes" },
  create: { rel: "create project index", method: "POST", href: "/project_index" },
  delete: { rel: "delete project index", method: "DELETE", href: "/project_index/{_id}" },
};

/**
 * @openapi
 * '/api/v1/project_index/{_id}':
 *  get:
 *    tags:
 *     - Project Index Controller
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
 *           $ref: '#/components/projectIndexResponse'
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
router.get("/project_index/:_id", [authentication, hateoas(links, links.get, [links.create])], async (req, res) => {
  respond(req, res, async () => {
    const _id = req.params._id;
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await ProjectIndexService.find(_id, user_id, fields);
  });
});

/**
 * @openapi
 * '/api/v1/project_index_by_name/{name}':
 *  get:
 *    tags:
 *     - Project Index Controller
 *    summary: Get project index by name
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: name
 *       in: path
 *       description: project index name
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
 *           $ref: '#/components/projectIndexResponse'
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
router.get("/project_index_by_name/:name", [authentication, hateoas(links, links.get, [links.create])], async (req, res) => {
    respond(req, res, async () => {
      const name = req.params.name;
      const user_id = req.user._id;
      const fields = req.query.fields?.split(",") || null;
      return await ProjectIndexService.findByName(name, user_id, fields);
    });
  });

  /**
 * @openapi
 * '/api/v1/project_index_exist_by_name/{name}':
 *  get:
 *    tags:
 *     - Project Index Controller
 *    summary: Get project index by name
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: name
 *       in: path
 *       description: project index name
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
 *           type: object
 *           properties:
 *            exist:
 *             type: boolean
 *             default: false
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
router.get("/project_index_exist_by_name/:name", [authentication, hateoas(links, links.get, [links.create])], async (req, res) => {
    respond(req, res, async () => {
      const name = req.params.name;
      const user_id = req.user._id;
      const fields = req.query.fields?.split(",") || null;
      return await ProjectIndexService.existByName(name, user_id, fields);
    });
  });

/**
 * @openapi
 * '/api/v1/project_indexes':
 *  get:
 *    tags:
 *     - Project Index Controller
 *    summary: Get project indexes
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
 *           $ref: '#/components/projectIndexesResponse'
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
  "/project_indexes",
  [authentication, hateoas(links, links.getAll, [links.create])],
  async (req, res) => {
    respond(req, res, async () => {
      const user_id = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const fields = req.query.fields?.split(",") || null;
      return await ProjectIndexService.findAll(page, limit, user_id, fields);
    });
  }
);

/**
 * @openapi
 * '/api/v1/project_index':
 *  post:
 *    tags:
 *     - Project Index Controller
 *    summary: Create project index
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
 *        $ref: '#/components/projectIndexCreateInput'
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
router.post("/project_index", [authentication, hateoas(links, links.create, [])], async (req, res) => {
  respond(req, res, async () => {
    const user_id = req.user._id;
    const fields = req.query.fields?.split(",") || null;
    return await ProjectIndexService.create(req.body, user_id, fields);
  });
});

/**
 * @openapi
 * '/api/v1/project_index/{_id}':
 *  delete:
 *    tags:
 *     - Project Index Controller
 *    summary: Delete project index
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: project index id
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
router.delete("/project_index/:_id", [authentication], async (req, res) => {
  try {
    const _id = req.params._id;
    const user_id = req.user._id;
    await ProjectIndexService.destroy(_id, user_id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

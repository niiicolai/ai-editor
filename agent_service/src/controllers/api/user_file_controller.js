import express from "express";
import multer from 'multer';
import UserFileService from "../../services/user_file_service.js";
import { authentication } from "../middleware/authentication.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";

const router = express.Router();
const uploadMiddleware = multer({ storage: multer.memoryStorage() }).single('file');
const links = {
  get: { rel: "get user file", method: "GET", href: "/user_file/{_id}" },
  getAll: { rel: "get all user files", method: "GET", href: "/user_files" },
  create: { rel: "create user file", method: "POST", href: "/user_file" },
  delete: { rel: "delete user file", method: "DELETE", href: "/user_file" },
};

/**
 * @openapi
 * '/api/v1/user_file/{_id}':
 *  get:
 *    tags:
 *     - User File Controller
 *    summary: Get user file by id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: User file id
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
 *           $ref: '#/components/userFileResponse'
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
  "/user_file/:_id",
  [authentication, hateoas(links, links.get, [links.create])],
  async (req, res) => {
    respond(req, res, async () => {
      const _id = req.params._id;
      const user_id = req.user._id;
      const fields = req.query.fields?.split(",") || null;
      return await UserFileService.find(_id, user_id, fields);
    });
  }
);

/**
 * @openapi
 * '/api/v1/user_files':
 *  get:
 *    tags:
 *     - User File Controller
 *    summary: Get user files
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
 *           $ref: '#/components/userFilesResponse'
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
  "/user_files",
  [authentication, hateoas(links, links.getAll, [links.create])],
  async (req, res) => {
    respond(req, res, async () => {
      const user_id = req.user._id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const fields = req.query.fields?.split(",") || null;
      return await UserFileService.findAll(page, limit, user_id, fields);
    });
  }
);

/**
 * @openapi
 * '/api/v1/user_file':
 *  post:
 *    tags:
 *     - User File Controller
 *    summary: Create user file
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
 *      multipart/form-data:
 *       schema:
 *        type: object
 *        properties:
 *         file:
 *          type: string
 *          format: binary
 *          description: File to upload
 *          required: true
 *         category:
 *          type: string
 *          description: File category
 *          enum:
 *          - cv
 *          - cover_letter
 *          - portfolio
 *          - other
 *          required: true
 *         title:
 *          type: string
 *          description: File title
 *          required: true
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *            $ref: '#/components/userFileResponse'
 *          _links:
 *            $ref: '#/components/linksResponse'
 *      headers:
 *        $ref: '#/components/responseHeaders'
 *     400:
 *      $ref: '#/components/badRequestResponse'
 *     413:
 *      $ref: '#/components/contentTooLargeResponse'
 *     404:
 *      $ref: '#/components/notFoundResponse'
 *     401:
 *      $ref: '#/components/unauthorizedResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.post(
  "/user_file",
  [authentication, uploadMiddleware, hateoas(links, links.create, [])],
  async (req, res) => {
    respond(req, res, async () => {
      const user_id = req.user._id;
      const file = req.file;
      const fields = req.query.fields?.split(",") || null;
      return await UserFileService.create(file, req.body, user_id, fields);
    });
  }
);

/**
 * @openapi
 * '/api/v1/user_file/{_id}':
 *  delete:
 *    tags:
 *     - User File Controller
 *    summary: Delete user file by id
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: User file id
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
router.delete("/user_file/:_id", [authentication], async (req, res) => {
  try {
    const _id = req.params._id;
    const user_id = req.user._id;
    await UserFileService.destroy(_id, user_id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;

import express from "express";
import JobService from "../../services/job_service.js";
import { authentication } from "../middleware/authentication.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";
import { authorize } from "../middleware/authorize.js";

const router = express.Router();
const links = {
    get: { rel: "get job", method: "GET", href: "/job/{_id}" },
    getAll: { rel: "get all jobs", method: "GET", href: "/jobs" },
};

/**
 * @openapi
 * '/api/v1/job/{_id}':
 *  get:
 *    tags:
 *     - Job Controller (admin)
 *    summary: Get job by id
 *    security:
 *     - bearerAuth: []
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: Job id
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
 *           $ref: '#/components/jobResponse'
 *          _links:
 *           $ref: '#/components/linksResponse'
 *      headers:
 *        $ref: '#/components/responseHeaders'
 *     400:
 *      $ref: '#/components/badRequestResponse'
 *     401:
 *      $ref: '#/components/unauthorizedResponse'
 *     404:
 *      $ref: '#/components/notFoundResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.get(
    "/job/:_id",
    [authentication, authorize('admin'), hateoas(links, links.get, [])],
    async (req: any, res: any) => {
        respond(req, res, async () => {
            return await JobService.find(req.params._id);
        });
    });

/**
 * @openapi
 * '/api/v1/jobs':
 *  get:
 *    tags:
 *     - Job Controller (admin)
 *    summary: Get jobs
 *    security:
 *     - bearerAuth: []
 *    parameters:
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
 *     - name: state
 *       in: query
 *       description: Job state
 *       required: false
 *       schema:
 *        type: string
 *        default: pending
 *        enum:
 *          - pending
 *          - completed
 *          - error
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/jobsResponse'
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
    "/jobs",
    [authentication, authorize('admin'), hateoas(links, links.getAll, [])],
    async (req: any, res: any) => {
        respond(req, res, async () => {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const state = req.query.state || 'open';
            return await JobService.findAll(page, limit, state);
        });
    }
);

export default router;

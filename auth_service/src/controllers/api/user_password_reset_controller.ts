import express from "express";
import UserPasswordResetService from "../../services/user_password_reset_service";
import { hateoas } from "../middleware/hateoas";
import { respond } from "../respond";

const router = express.Router();

export const links = {
  create: { rel: "create user password reset", method: "POST", href: "/user_password_reset" },
  update: { rel: "update user password reset", method: "PATCH", href: "/user_password_reset" },
};

/**
 * @openapi
 * '/api/v1/user_password_reset':
 *  post:
 *    tags:
 *     - User Password Reset Controller
 *    summary: Create user password reset
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
 *        $ref: '#/components/userPasswordResetCreateInput'
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
 *            $ref: '#/components/userPasswordResetResponse'
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
router.post("/user_password_reset", hateoas(links, links.create, []), async (req: any, res: any) => {
  respond(req, res, async () => {
    const fields = typeof req.query.fields === "string" ? req.query.fields.split(",") : [];
    return await UserPasswordResetService.create(req.body, fields);
  });
});

/**
 * @openapi
 * '/api/v1/user_password_reset/{_id}':
 *  patch:
 *    tags:
 *     - User Password Reset Controller
 *    summary: Update user password reset
 *    parameters:
 *     - name: _id
 *       in: path
 *       description: User password reset _id
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
 *        $ref: '#/components/userPasswordResetUpdateInput'
 *    responses:
 *     200:
 *      description: OK
 *      content:
 *       application/json:
 *        schema:
 *         type: object
 *         properties:
 *          data:
 *           $ref: '#/components/userPasswordResetResponse'
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
router.patch("/user_password_reset/:_id", [hateoas(links, links.update, [links.create])], async (req: any, res: any) => {
  respond(req, res, async () => {
    const _id = req.params._id;
    const fields = typeof req.query.fields === "string" ? req.query.fields.split(",") : [];
    return await UserPasswordResetService.update(_id, req.body, fields);
  });
});

export default router;

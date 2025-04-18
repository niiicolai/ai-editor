import express from "express";
import UserLoginService from "../../services/user_login_service.js";
import { hateoas } from "../middleware/hateoas.js";
import { respond } from "../respond.js";
import { links } from "./user_controller.js";

const router = express.Router();

/**
 * @openapi
 * '/api/v1/user/login':
 *  post:
 *    tags:
 *     - User Login Controller
 *    summary: Authenticate user
 *    parameters:
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
 *        $ref: '#/components/userLoginInput'
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
 *     401:
 *      $ref: '#/components/unauthorizedResponse'
 *     500:
 *      $ref: '#/components/internalServerErrorResponse'
 */
router.post("/user/login", hateoas(links, links.login, [links.create]), async (req, res) => {
  respond(req, res, async () => {
    return await UserLoginService.login(req.body);
  });
});

export default router;

import { UserService } from "../../services/user_service";
import { log } from "../../middleware/log";
import express from "express";

const router = express.Router();

router.get(
    "/todo/:_id", log, async (req: any, res: any) => {
        res.status(200).json(await UserService.find(req.params._id));
    });

router.get(
    "/todos", log, async (req: any, res: any) => {
        res.status(200).json(await UserService.findAll());
    });

router.post(
    "/todo", log, async (req: any, res: any) => {
        res.status(200).json(await UserService.create(req.body));
    });

router.put(
    "/todo/:_id", log, async (req: any, res: any) => {
        res.status(200).json(await UserService.update(req.params._id, req.body));
    });

router.delete(
    "/todo/:_id", log, async (req: any, res: any) => {
        await UserService.destroy(req.params._id);
        res.status(204).send();
    });

export default router;

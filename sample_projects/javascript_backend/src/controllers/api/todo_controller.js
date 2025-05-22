import { TodoService } from "../../services/todo_service.js";
import { log } from "../../middleware/log.js";
import express from "express";

const router = express.Router();

router.get(
    "/todo/:_id", log, async (req, res) => {
        res.status(200).json(await TodoService.find(req.params._id));
    });

router.get(
    "/todos", log, async (req, res) => {
        res.status(200).json(await TodoService.findAll());
    });

router.post(
    "/todo", log, async (req, res) => {
        res.status(200).json(await TodoService.create(req.body));
    });

router.put(
    "/todo/:_id", log, async (req, res) => {
        res.status(200).json(await TodoService.update(req.params._id, req.body));
    });

router.delete(
    "/todo/:_id", log, async (req, res) => {
        await TodoService.destroy(req.params._id);
        res.status(204).send();
    });

export default router;

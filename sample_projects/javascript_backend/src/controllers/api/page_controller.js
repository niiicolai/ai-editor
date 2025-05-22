import { PageService } from "../../services/page_service.js";
import { log } from "../../middleware/log.js";
import express from "express";

const router = express.Router();

router.get(
    "/page/:_id", log, async (req, res) => {
        res.status(200).json(await PageService.find(req.params._id));
    });

router.get(
    "/pages", log, async (req, res) => {
        res.status(200).json(await PageService.findAll());
    });

router.post(
    "/page", log, async (req, res) => {
        res.status(200).json(await PageService.create(req.body));
    });

router.put(
    "/page/:_id", log, async (req, res) => {
        res.status(200).json(await PageService.update(req.params._id, req.body));
    });

router.delete(
    "/page/:_id", log, async (req, res) => {
        await PageService.destroy(req.params._id);
        res.status(204).send();
    });

export default router;

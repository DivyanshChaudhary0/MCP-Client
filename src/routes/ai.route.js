import { Router } from "express";
import { postChat } from "../controllers/ai.controller.js";

const router = Router();

router.post("/", postChat);

export default router;

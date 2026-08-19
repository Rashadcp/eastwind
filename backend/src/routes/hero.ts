import { Router } from "express";
import { HeroController } from "../controllers/hero.controller.js";

const router = Router();
router.get("/", HeroController.getHero);
router.put("/", HeroController.updateHero);

export default router;

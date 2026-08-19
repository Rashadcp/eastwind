import { Router } from "express";
import { SolutionPageController } from "../controllers/solutionPage.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", SolutionPageController.get);
router.put("/", requireAdmin, SolutionPageController.update);

export default router;

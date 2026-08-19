import { Router } from "express";
import { AboutController } from "../controllers/about.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", AboutController.getAll);
router.get("/:section", AboutController.getBySection);
router.put("/:section", requireAdmin, AboutController.updateSection);

export default router;

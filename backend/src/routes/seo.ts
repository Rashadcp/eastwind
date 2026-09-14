import { Router } from "express";
import { SeoController } from "../controllers/seo.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", SeoController.getAll);
router.get("/:pageKey", SeoController.getByPageKey);
router.post("/", requireAdmin, SeoController.create);
router.put("/:pageKey", requireAdmin, SeoController.update);
router.delete("/:pageKey", requireAdmin, SeoController.delete);

export default router;

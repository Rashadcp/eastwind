import { Router } from "express";
import { BrandController } from "../controllers/brand.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", BrandController.getAll);
router.get("/:id", BrandController.getById);
router.post("/", requireAdmin, BrandController.create);
router.put("/:id", requireAdmin, BrandController.update);
router.delete("/:id", requireAdmin, BrandController.delete);

export default router;

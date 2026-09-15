import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { validateProduct } from "../middlewares/validation.middleware.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", ProductController.getAll);
router.get("/page-settings", ProductController.getPageSettings);
router.put("/page-settings", requireAdmin, ProductController.updatePageSettings);
router.put("/reorder", requireAdmin, ProductController.reorder);
router.get("/:id", ProductController.getById);
router.post("/", requireAdmin, validateProduct, ProductController.create);
router.put("/:id", requireAdmin, ProductController.update);
router.delete("/:id", requireAdmin, ProductController.delete);

export default router;

import { Router } from "express";
import { ProductCategoryController } from "../controllers/productCategory.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", ProductCategoryController.getAll);
router.post("/", requireAdmin, ProductCategoryController.create);
router.put("/", requireAdmin, ProductCategoryController.saveOrder);
router.put("/:id", requireAdmin, ProductCategoryController.update);
router.delete("/:id", requireAdmin, ProductCategoryController.delete);

export default router;

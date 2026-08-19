import { Router } from "express";
import { SuccessStoryController } from "../controllers/successStory.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.get("/", SuccessStoryController.getAll);
router.get("/:id", SuccessStoryController.getById);

// Admin authenticated routes
router.post("/", requireAdmin, SuccessStoryController.create);
router.put("/:id", requireAdmin, SuccessStoryController.update);
router.delete("/:id", requireAdmin, SuccessStoryController.delete);

export default router;

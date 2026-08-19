import { Router } from "express";
import { ContactSettingsController } from "../controllers/contactSettings.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", ContactSettingsController.getAll);
router.get("/:section", ContactSettingsController.getBySection);
router.put("/:section", requireAdmin, ContactSettingsController.updateSection);

export default router;

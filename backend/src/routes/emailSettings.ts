import { Router } from "express";
import { EmailSettingsController } from "../controllers/emailSettings.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", requireAdmin, EmailSettingsController.get);
router.put("/", requireAdmin, EmailSettingsController.update);

export default router;

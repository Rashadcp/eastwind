import { Router } from "express";
import { PrivacyPolicyController } from "../controllers/privacyPolicy.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", PrivacyPolicyController.get);
router.put("/", requireAdmin, PrivacyPolicyController.update);

export default router;

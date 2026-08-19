import { Router } from "express";
import { ServiceController } from "../controllers/service.controller.js";
import { validateService } from "../middlewares/validation.middleware.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", ServiceController.getAll);
router.get("/:id", ServiceController.getById);
router.post("/", requireAdmin, validateService, ServiceController.create);
router.put("/:id", requireAdmin, ServiceController.update);
router.delete("/:id", requireAdmin, ServiceController.delete);

export default router;

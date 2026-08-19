import { Router } from "express";
import { ApplicationController } from "../controllers/application.controller.js";
import { validateApplication } from "../middlewares/validation.middleware.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", ApplicationController.getAll);
router.get("/:id", ApplicationController.getById);
router.post("/", requireAdmin, validateApplication, ApplicationController.create);
router.put("/:id", requireAdmin, ApplicationController.update);
router.delete("/:id", requireAdmin, ApplicationController.delete);

export default router;

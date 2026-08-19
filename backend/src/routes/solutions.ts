import { Router } from "express";
import { SolutionController } from "../controllers/solution.controller.js";
import { validateSolution } from "../middlewares/validation.middleware.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", SolutionController.getAll);
router.get("/:id", SolutionController.getById);
router.post("/", requireAdmin, validateSolution, SolutionController.create);
router.put("/:id", requireAdmin, SolutionController.update);
router.delete("/:id", requireAdmin, SolutionController.delete);

export default router;

import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { requireAdmin } from "../middlewares/auth.middleware.js";

const router = Router();

// POST login - Public
router.post("/login", AuthController.login);

// POST verify OTP - Public
router.post("/verify-otp", AuthController.verifyOtp);

// POST change password - Protected
router.post("/change-password", requireAdmin, AuthController.changePassword);

// GET verify token - Protected
router.get("/verify", requireAdmin, (req, res) => {
  res.status(200).json({ valid: true, admin: (req as any).admin });
});

export default router;

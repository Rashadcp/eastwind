import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { AdminModel } from "../models/admin.model.js";
import { verifyPassword, hashPassword, generateSalt } from "../utils/hash.js";
import { JWT_SECRET } from "../config.js";

interface OtpEntry {
  otp: string;
  username: string;
  expiresAt: number;
}

const otpCache = new Map<string, OtpEntry>();

export class AuthController {
  /**
   * Admin Login endpoint. Validates username and password, generates OTP, and dispatches it via email.
   */
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        res.status(400).json({ error: "Username and password are required" });
        return;
      }

      const admin = await AdminModel.getByUsername(username);
      if (!admin) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const isPasswordValid = verifyPassword(password, admin.passwordHash, admin.salt);
      if (!isPasswordValid) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Generate final JWT token directly (valid for 8 hours, OTP bypassed)
      const token = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: "8h" });
      
      console.log(`[AUTH] Admin '${username}' logged in successfully (OTP bypassed).`);
      res.json({ token, username: admin.username });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin Verify OTP endpoint. Checks OTP code and signs final JWT.
   */
  static async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, otp } = req.body;
      if (!username || !otp) {
        res.status(400).json({ error: "Username and OTP are required" });
        return;
      }

      const entry = otpCache.get(username);
      if (!entry) {
        res.status(401).json({ error: "No active verification session found. Please re-login." });
        return;
      }

      if (Date.now() > entry.expiresAt) {
        otpCache.delete(username);
        res.status(401).json({ error: "Verification code has expired. Please request a new one." });
        return;
      }

      if (entry.otp !== otp.trim()) {
        res.status(401).json({ error: "Incorrect verification code. Please try again." });
        return;
      }

      // Valid OTP! Clear it from cache
      otpCache.delete(username);

      const admin = await AdminModel.getByUsername(username);
      if (!admin) {
        res.status(404).json({ error: "Admin user not found" });
        return;
      }

      // Generate final JWT token (valid for 8 hours)
      const token = jwt.sign({ username: admin.username }, JWT_SECRET, { expiresIn: "8h" });
      
      console.log(`Admin '${username}' completed OTP verification and logged in successfully.`);
      res.json({ token, username: admin.username });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Admin password change endpoint. Securely updates password inside db.
   */
  static async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        res.status(400).json({ error: "Current password and new password are required" });
        return;
      }

      // Read admin context injected by Auth Middleware
      const username = (req as any).admin?.username;
      if (!username) {
        res.status(401).json({ error: "Unauthorized auth context" });
        return;
      }

      const admin = await AdminModel.getByUsername(username);
      if (!admin) {
        res.status(404).json({ error: "Admin user not found" });
        return;
      }

      // Verify current password is correct
      const isCurrentValid = verifyPassword(currentPassword, admin.passwordHash, admin.salt);
      if (!isCurrentValid) {
        res.status(400).json({ error: "Incorrect current password" });
        return;
      }

      // Generate new salt and hash for the new password
      const newSalt = generateSalt();
      const newHash = hashPassword(newPassword, newSalt);

      // Save to database
      await AdminModel.updatePassword(username, newHash, newSalt);
      console.log(`Admin '${username}' changed password successfully.`);

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
    }
  }
}

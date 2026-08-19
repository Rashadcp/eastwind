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

      // Generate 6-digit verification code
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = Date.now() + 5 * 60 * 1000; // Code valid for 5 minutes

      // Store OTP in cache
      otpCache.set(username, { otp, username, expiresAt });

      // Setup SMTP transporter reading configurations
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || "smtp.gmail.com",
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER || "",
          pass: process.env.EMAIL_PASS || "",
        },
      });

      const mailOptions = {
        from: `"Eastwind Safety Console" <${process.env.EMAIL_USER || "no-reply@eastwindsafety.com"}>`,
        to: "harik2021a@gmail.com",
        subject: "Eastwind Administrative Portal - Secure OTP Verification Code",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #ea580c; text-align: center; text-transform: uppercase;">Eastwind Safety</h2>
            <hr style="border: none; border-top: 1px solid #cbd5e1; margin: 20px 0;" />
            <p>Hello Administrator,</p>
            <p>You have successfully entered valid authentication credentials for the Eastwind Admin Console.</p>
            <p>Use the following 6-digit OTP verification code to complete your login session:</p>
            <div style="background-color: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #0f172a; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #64748b; font-size: 11px;">This verification code is active for 5 minutes. If you did not request this login attempt, please change your password immediately.</p>
          </div>
        `,
      };

      // Dispatch mail asynchronously in background
      transporter.sendMail(mailOptions)
        .then((info) => {
          console.log(`[SMTP Mail] OTP email sent successfully to harik2021a@gmail.com. Message ID: ${info.messageId}`);
        })
        .catch((err) => {
          console.error("[SMTP Mail Error] Failed to send OTP email:", err);
        });

      // Always print verification code to terminal console for test validation convenience
      console.log(`\n==================================================`);
      console.log(`[DEMO VERIFICATION CODE]`);
      console.log(`OTP Code: ${otp}`);
      console.log(`Target Email: harik2021a@gmail.com`);
      console.log(`==================================================\n`);

      res.json({ otpRequired: true, username: admin.username });
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

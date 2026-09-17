import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { EmailSettings } from "../db.js";

const ENCRYPTION_ALGORITHM = "aes-256-gcm";

function encryptionKey(): Buffer | null {
  const secret = process.env.SMTP_CONFIG_ENCRYPTION_KEY;
  return secret ? crypto.createHash("sha256").update(secret).digest() : null;
}

export function decryptSmtpPassword(value?: string): string | null {
  if (!value) return null;
  const key = encryptionKey();
  if (!key) return null;
  try {
    const [ivHex, tagHex, encryptedHex] = value.split(":");
    if (!ivHex || !tagHex || !encryptedHex) return null;
    const decipher = crypto.createDecipheriv(ENCRYPTION_ALGORITHM, key, Buffer.from(ivHex, "hex"));
    decipher.setAuthTag(Buffer.from(tagHex, "hex"));
    return Buffer.concat([decipher.update(Buffer.from(encryptedHex, "hex")), decipher.final()]).toString("utf8");
  } catch {
    return null;
  }
}

function encryptSmtpPassword(value: string): string {
  const key = encryptionKey();
  if (!key) throw new Error("SMTP_CONFIG_ENCRYPTION_KEY is not configured on the server.");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${cipher.getAuthTag().toString("hex")}:${encrypted.toString("hex")}`;
}

export class EmailSettingsController {
  static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const settings = await EmailSettings.findOne({ id: "default" }).lean().exec();
      res.json({
        enquiryRecipientEmail: settings?.enquiryRecipientEmail || "",
        smtpHost: settings?.smtpHost || "smtp.gmail.com",
        smtpPort: settings?.smtpPort || 587,
        smtpSecure: settings?.smtpSecure || false,
        smtpUser: settings?.smtpUser || "",
        hasSmtpPassword: Boolean(settings?.smtpPasswordEncrypted)
      });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { enquiryRecipientEmail, smtpHost, smtpPort, smtpSecure, smtpUser, smtpPassword } = req.body;
      const recipient = String(enquiryRecipientEmail || "").trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipient)) {
        res.status(400).json({ error: "A valid enquiry recipient email is required." });
        return;
      }
      const host = String(smtpHost || "").trim();
      const port = Number(smtpPort);
      if (!host || !Number.isInteger(port) || port < 1 || port > 65535) {
        res.status(400).json({ error: "Enter a valid SMTP host and port." });
        return;
      }

      const update: Record<string, unknown> = {
        enquiryRecipientEmail: recipient,
        smtpHost: host,
        smtpPort: port,
        smtpSecure: Boolean(smtpSecure),
        smtpUser: String(smtpUser || "").trim()
      };
      if (typeof smtpPassword === "string" && smtpPassword.trim()) {
        update.smtpPasswordEncrypted = encryptSmtpPassword(smtpPassword.trim());
      }

      const settings = await EmailSettings.findOneAndUpdate(
        { id: "default" },
        { $set: update, $setOnInsert: { id: "default" } },
        { new: true, upsert: true }
      ).lean().exec();

      res.json({
        enquiryRecipientEmail: settings.enquiryRecipientEmail,
        smtpHost: settings.smtpHost,
        smtpPort: settings.smtpPort,
        smtpSecure: settings.smtpSecure,
        smtpUser: settings.smtpUser,
        hasSmtpPassword: Boolean(settings.smtpPasswordEncrypted)
      });
    } catch (error) {
      next(error);
    }
  }
}

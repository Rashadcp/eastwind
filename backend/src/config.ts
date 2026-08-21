import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Search for .env in current and parent directories
const envCandidates = [
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(__dirname, "../.env"),
  path.resolve(__dirname, "../../.env")
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    break;
  }
}

const baseDir = fs.existsSync(path.resolve(process.cwd(), "database.json"))
  ? process.cwd()
  : path.resolve(__dirname, "..");

export const PORT = process.env.PORT || 5000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
export const DB_FILE = path.resolve(baseDir, "database.json");
export const UPLOAD_DIR = path.resolve(baseDir, "uploads");
export const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_fallback_key";
export const MONGO_URI = process.env.MONGO_URI || "";

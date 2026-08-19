import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 5000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";
export const DB_FILE = path.join(process.cwd(), "database.json");
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
export const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_fallback_key";
export const MONGO_URI = process.env.MONGO_URI || "";

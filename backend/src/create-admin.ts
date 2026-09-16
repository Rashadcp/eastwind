import mongoose from "mongoose";
import { MONGO_URI } from "./config.js";
import { Admin } from "./db.js";
import { generateSalt, hashPassword } from "./utils/hash.js";

async function run() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.log("=================================================");
    console.log(" East Wind Safety - Admin Creation / Password Reset");
    console.log("=================================================");
    console.log("Usage:");
    console.log("  npm run create-admin <username> <password>");
    console.log("Example:");
    console.log("  npm run create-admin superadmin StrongP@ssw0rd123");
    console.log("=================================================");
    process.exit(1);
  }

  if (!MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI environment variable is missing from .env!");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    const salt = generateSalt();
    const passwordHash = hashPassword(password, salt);

    const existing = await Admin.findOne({ username });
    if (existing) {
      existing.passwordHash = passwordHash;
      existing.salt = salt;
      await existing.save();
      console.log(`[SUCCESS] Admin user '${username}' already exists. Password has been updated successfully.`);
    } else {
      await Admin.create({ username, passwordHash, salt });
      console.log(`[SUCCESS] New admin user '${username}' created successfully.`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Admin user creation failed:", error);
    process.exit(1);
  }
}

run();

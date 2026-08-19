import mongoose from "mongoose";
import app from "./app.js";
import { PORT, MONGO_URI } from "./config.js";
import { seedDatabase } from "./db.js";

async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI environment variable is missing inside configuration!");
    }
    
    console.log("Connecting to MongoDB Atlas Cluster...");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully!");

    // Run database verification and seeding
    await seedDatabase();

    // Boot Express Server
    app.listen(PORT, () => {
      console.log(`===============================================`);
      console.log(`  East Wind Safety Backend Server is running!`);
      console.log(`  Local URL:   http://localhost:${PORT}`);
      console.log(`  Health Check: http://localhost:${PORT}/health`);
      console.log(`===============================================`);
    });
  } catch (error) {
    console.error("Critical server boot crash:", error);
    process.exit(1);
  }
}

startServer();

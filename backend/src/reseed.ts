import mongoose from "mongoose";
import fs from "fs";
import { MONGO_URI, DB_FILE } from "./config.js";
import { Product, Solution, Application, Service, Admin } from "./db.js";

async function reseed() {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the configuration!");
    }

    console.log("Connecting to MongoDB Atlas Cluster for reseeding...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!");

    console.log("Dropping existing collections to clear stale/incomplete data...");
    try {
      await Product.collection.drop();
      console.log("Dropped products collection.");
    } catch (e) {
      console.log("Products collection did not exist or could not be dropped.");
    }

    try {
      await Solution.collection.drop();
      console.log("Dropped solutions collection.");
    } catch (e) {
      console.log("Solutions collection did not exist or could not be dropped.");
    }

    try {
      await Application.collection.drop();
      console.log("Dropped applications collection.");
    } catch (e) {
      console.log("Applications collection did not exist or could not be dropped.");
    }

    try {
      await Service.collection.drop();
      console.log("Dropped services collection.");
    } catch (e) {
      console.log("Services collection did not exist or could not be dropped.");
    }

    try {
      await Admin.collection.drop();
      console.log("Dropped admins collection.");
    } catch (e) {
      console.log("Admins collection did not exist or could not be dropped.");
    }

    console.log("Reading master database.json file...");
    if (!fs.existsSync(DB_FILE)) {
      throw new Error(`Master database.json file not found at ${DB_FILE}`);
    }

    const rawData = fs.readFileSync(DB_FILE, "utf-8");
    const seed = JSON.parse(rawData);

    if (seed.products && seed.products.length > 0) {
      console.log(`Inserting ${seed.products.length} Products...`);
      await Product.insertMany(seed.products);
    }
    if (seed.solutions && seed.solutions.length > 0) {
      console.log(`Inserting ${seed.solutions.length} Solutions...`);
      await Solution.insertMany(seed.solutions);
    }
    if (seed.applications && seed.applications.length > 0) {
      console.log(`Inserting ${seed.applications.length} Applications...`);
      await Application.insertMany(seed.applications);
    }
    if (seed.services && seed.services.length > 0) {
      console.log(`Inserting ${seed.services.length} Services...`);
      await Service.insertMany(seed.services);
    }
    if (seed.admin && seed.admin.length > 0) {
      console.log(`Inserting ${seed.admin.length} Admin User(s)...`);
      await Admin.insertMany(seed.admin);
    }

    console.log("=========================================");
    console.log(" MongoDB Atlas Database re-seeded successfully!");
    console.log("=========================================");
    process.exit(0);
  } catch (error) {
    console.error("Reseed failed:", error);
    process.exit(1);
  }
}

reseed();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { CORS_ORIGIN, UPLOAD_DIR } from "./config.js";

// MVC Middleware imports
import { requestLogger } from "./middlewares/logger.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

// MVC Routes imports
import productsRouter from "./routes/products.js";
import solutionsRouter from "./routes/solutions.js";
import applicationsRouter from "./routes/applications.js";
import servicesRouter from "./routes/services.js";
import uploadRouter from "./routes/upload.js";
import authRouter from "./routes/auth.js";
import aboutRouter from "./routes/about.js";
import contactSettingsRouter from "./routes/contactSettings.js";
import solutionsPageRouter from "./routes/solutionsPage.js";
import brandsRouter from "./routes/brands.js";
import successStoriesRouter from "./routes/successStories.js";
import heroRouter from "./routes/hero.js";
import { EnquiryController } from "./controllers/enquiry.controller.js";

const app = express();

// 1. Logger (executes first for all routes)
app.use(requestLogger);

// Security & Optimization
app.use(helmet({ crossOriginResourcePolicy: false })); // allow cross-origin images for frontend
app.use(compression());

// 2. CORS and Body Parsing
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// 3. Static directory serving (support both /uploads and /api/uploads for local & production reverse-proxy parity)
app.use("/uploads", express.static(UPLOAD_DIR));
app.use("/api/uploads", express.static(UPLOAD_DIR));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

import { cacheMiddleware } from "./utils/cache.js";

// 4. API Routes (Support both /api/* and direct /* prefix for flexible Nginx reverse proxy configs)
const routes: [string, any][] = [
  ["products", productsRouter],
  ["solutions", solutionsRouter],
  ["applications", applicationsRouter],
  ["services", servicesRouter],
  ["about", aboutRouter],
  ["contact-settings", contactSettingsRouter],
  ["solutions-page", solutionsPageRouter],
  ["brands", brandsRouter],
  ["success-stories", successStoriesRouter],
  ["hero", heroRouter],
];

// Add cache middleware to resource routes
routes.forEach(([path, router]) => {
  app.use(`/api/${path}`, cacheMiddleware(), router);
  app.use(`/${path}`, cacheMiddleware(), router);
});

// Non-cached auth and upload routes
app.use("/api/upload", uploadRouter);
app.use("/upload", uploadRouter);
app.use("/api/auth", authRouter);
app.use("/auth", authRouter);

app.post("/api/enquiry", EnquiryController.submitEnquiry);
app.post("/enquiry", EnquiryController.submitEnquiry);

// 5. Fallback 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// 6. Global Error Handler (must be registered last)
app.use(errorHandler);

export default app;

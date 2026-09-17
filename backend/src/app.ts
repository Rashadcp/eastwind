import path from "path";
import fs from "fs";
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
import productCategoriesRouter from "./routes/productCategories.js";
import privacyPolicyRouter from "./routes/privacyPolicy.js";
import seoRouter from "./routes/seo.js";
import emailSettingsRouter from "./routes/emailSettings.js";
import { EnquiryController } from "./controllers/enquiry.controller.js";
import { ContactSettingsModel } from "./models/contact.model.js";

const app = express();

// 1. Logger (executes first for all routes)
app.use(requestLogger);

// Security & Optimization (disable CSP so backend does not block Next.js frontend inline scripts)
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));
app.use(compression());

// 2. CORS and Body Parsing
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

// 3. Static directory serving (with long-lived browser caching for fast image loading)
const staticUploadOptions = {
  maxAge: "30d",
  immutable: true,
};
app.use("/uploads", express.static(UPLOAD_DIR, staticUploadOptions));
app.use("/api/uploads", express.static(UPLOAD_DIR, staticUploadOptions));

// Optional fallback for syncing media assets from an external origin if configured via environment variable (REMOTE_MEDIA_ORIGIN)
const remoteUploadFallback = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const filename = req.path.replace(/^\/+/, "");
    if (!filename || filename.includes("..")) return next();
    const localFilePath = path.resolve(UPLOAD_DIR, filename);

    if (fs.existsSync(localFilePath)) {
      return res.sendFile(localFilePath);
    }

    const remoteOrigin = (process.env.REMOTE_MEDIA_ORIGIN || "").trim().replace(/\/+$/, "");
    if (remoteOrigin) {
      const remoteUrl = `${remoteOrigin}/uploads/${encodeURIComponent(filename)}`;
      const remoteRes = await fetch(remoteUrl);
      if (remoteRes.ok && remoteRes.body) {
        const contentType = remoteRes.headers.get("content-type") || "image/webp";
        const buffer = Buffer.from(await remoteRes.arrayBuffer());
        fs.writeFileSync(localFilePath, buffer);
        res.setHeader("Content-Type", contentType);
        return res.sendFile(localFilePath);
      }
    }
  } catch (err) {
    // ignore
  }
  next();
};
app.use("/uploads", remoteUploadFallback);
app.use("/api/uploads", remoteUploadFallback);

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
  ["product-categories", productCategoriesRouter],
  ["privacy-policy", privacyPolicyRouter],
  ["seo", seoRouter],
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
app.use("/api/email-settings", emailSettingsRouter);
app.use("/email-settings", emailSettingsRouter);

app.post("/api/enquiry", EnquiryController.submitEnquiry);
app.post("/enquiry", EnquiryController.submitEnquiry);

app.get(["/api/footer", "/footer"], async (req, res) => {
  try {
    const footerDoc = await ContactSettingsModel.getBySection("footer");
    if (footerDoc) {
      return res.json({
        logoUrl: footerDoc.logoUrl || "/logo.png",
        companyName: "Eastwind Energy Arabia",
        ...footerDoc
      });
    }
  } catch {
    // Fallback if DB is unavailable
  }
  res.json({
    logoUrl: "/logo.png",
    companyName: "Eastwind Energy Arabia"
  });
});

// 5. Fallback 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// 6. Global Error Handler (must be registered last)
app.use(errorHandler);

export default app;

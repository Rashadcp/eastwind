import express from "express";
import cors from "cors";
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

// 2. CORS and Body Parsing
app.use(cors({
  origin: CORS_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 3. Static directory serving
app.use("/uploads", express.static(UPLOAD_DIR));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// 4. API Routes
app.use("/api/products", productsRouter);
app.use("/api/solutions", solutionsRouter);
app.use("/api/applications", applicationsRouter);
app.use("/api/services", servicesRouter);
app.use("/api/about", aboutRouter);
app.use("/api/contact-settings", contactSettingsRouter);
app.use("/api/solutions-page", solutionsPageRouter);
app.use("/api/brands", brandsRouter);
app.use("/api/success-stories", successStoriesRouter);
app.use("/api/hero", heroRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/auth", authRouter);
app.post("/api/enquiry", EnquiryController.submitEnquiry);

// 5. Fallback 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// 6. Global Error Handler (must be registered last)
app.use(errorHandler);

export default app;

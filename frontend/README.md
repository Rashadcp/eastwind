# Eastwind Energy Arabia - Web Platform

Enterprise web application for Eastwind Energy Arabia — Industrial Digitalization, Edge Wireless Data Acquisition, Predictive AI Analytics, Intrinsically Safe Mobility, and Fire & Rescue Engineering across the Middle East.

## Architecture

- **Frontend**: Next.js (App Router), React 19, Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Node.js & Express with TypeScript, MongoDB (Mongoose), Multer, Sharp image optimization, Fluent-FFmpeg.
- **Deployment Model**: Self-hosted on VPS / Dedicated Linux Server via PM2 & Nginx reverse proxy.

## Getting Started Locally

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

Server runs on `http://localhost:5000`.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Production Deployment (Self-Hosted VPS / PM2)

### Build and Start

```bash
# Build Backend
cd backend
npm run build
pm2 start dist/index.js --name "eastwind-backend"

# Build Frontend
cd ../frontend
npm run build
pm2 start npm --name "eastwind-frontend" -- start -- -p 3000

# Save PM2 state
pm2 save
```

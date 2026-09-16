# Production Deployment & Hosting Guide
**Project:** East Wind Safety (Full-Stack Next.js & Node.js Platform)  
**Version:** 1.0.0 Production Release  
**Target Environment:** Linux VPS / Cloud VM (Ubuntu 22.04 LTS / Debian 12 / AWS EC2 / DigitalOcean / Linode)

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Server Prerequisites & Initial Setup](#2-server-prerequisites--initial-setup)
3. [Database Configuration (MongoDB)](#3-database-configuration-mongodb)
4. [Environment Variables Setup](#4-environment-variables-setup)
5. [Administrator Account Management](#5-administrator-account-management)
6. [Project Deployment & Build Steps](#6-project-deployment--build-steps)
7. [Process Management with PM2](#7-process-management-with-pm2)
8. [Nginx Reverse Proxy & SSL Configuration](#8-nginx-reverse-proxy--ssl-configuration)
9. [Media & Uploads Handling](#9-media--uploads-handling)
10. [Automated Redeployment Script](#10-automated-redeployment-script)
11. [Troubleshooting & Maintenance Checklist](#11-troubleshooting--maintenance-checklist)

---

## 1. Architecture Overview

The platform consists of two decoupled services working seamlessly together:

```
                  Internet (HTTPS: 443)
                           │
                    ┌──────▼──────┐
                    │ Nginx Proxy │ (SSL Termination & Asset Caching)
                    └──────┬──────┘
             ┌─────────────┴─────────────┐
             │                           │
  Location: /api, /uploads        Location: / (All other traffic)
             │                           │
    ┌────────▼────────┐         ┌────────▼────────┐
    │ Express Backend │         │ Next.js Frontend│
    │   (Port 5000)   │         │   (Port 3000)   │
    └────────┬────────┘         └─────────────────┘
             │
     ┌───────▼───────┐
     │ MongoDB Atlas │
     └───────────────┘
```

- **Frontend:** Next.js 14+ with App Router (SSR, SSG, dynamic routes), runs locally on `http://localhost:3000`.
- **Backend:** Node.js (ES Modules, TypeScript, Express), runs locally on `http://localhost:5000`. Handles authentication, REST endpoints, media processing with Sharp and FFmpeg.
- **Database:** MongoDB (MongoDB Atlas recommended or self-hosted).
- **Process Manager:** PM2 managing both services with auto-restart, memory caps, and zero-downtime reloads via `ecosystem.config.cjs`.

---

## 2. Server Prerequisites & Initial Setup

Recommended Server Specs:
- **CPU:** 2 vCPUs minimum (for video/image compression and Next.js building).
- **RAM:** 2 GB minimum (4 GB recommended; if on 1–2 GB RAM, configure a 2 GB swapfile).
- **Storage:** 25 GB+ SSD.

### Step 2.1: Update Server Packages
Connect to your server via SSH:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl wget git build-essential nginx certbot python3-certbot-nginx ffmpeg
```

### Step 2.2: (Optional but Recommended) Add Swap Memory
If your server has 1GB or 2GB RAM, creating a swapfile prevents Next.js compilation from running out of memory:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Step 2.3: Install Node.js (v20 LTS)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Should display v20.x.x
npm -v  # Should display 10.x.x
```

### Step 2.4: Install PM2 Globally
```bash
sudo npm install -g pm2
```

---

## 3. Database Configuration (MongoDB)

You can use **MongoDB Atlas** (Cloud, free or dedicated tier, highly recommended) or install MongoDB locally on your VPS.

### Option A: MongoDB Atlas (Recommended)
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new Cluster (e.g. AWS Frankfurt / Bahrain / Mumbai depending on target audience).
3. Create a Database User:
   - Go to **Database Access** -> **Add New Database User**.
   - Select Password authentication (e.g., username `eastwind_user`, strong password).
4. Configure IP Access:
   - Go to **Network Access** -> **Add IP Address**.
   - Add your server's Public IP (or `0.0.0.0/0` with strong password protection).
5. Get Connection URI:
   - Click **Connect** -> **Drivers** -> Copy the connection string.
   - Format:
     ```
     mongodb+srv://eastwind_user:<PASSWORD>@cluster0.xxxx.mongodb.net/eastwind?retryWrites=true&w=majority
     ```

### How Database Seeding Works:
- The backend contains an automatic bootstrap routine in `backend/src/db.ts`.
- **First Launch:** When the backend connects to MongoDB for the first time, it detects empty collections and automatically imports all initial products, solutions, services, applications, brands, about content, contact configurations, and the default admin from `backend/database.json`.
- **Manual Force Re-seed:** If you ever need to reset the database to factory seed data:
  ```bash
  cd /var/www/eastwind/backend
  npm run reseed
  ```

---

## 4. Environment Variables Setup

### 4.1: Backend Environment (`backend/.env`)
Create `/var/www/eastwind/backend/.env`:
```bash
nano /var/www/eastwind/backend/.env
```
Paste and fill in the following:
```env
# Server Port
PORT=5000

# Allowed CORS Origin (Your production domain)
CORS_ORIGIN=https://eastwindsafety.com

# Cryptographic Secret for Admin JWT Tokens (Use 64+ random characters)
JWT_SECRET=c8f53a987d6e4b219034f8a123bc45de67890123456789abcdef0123456789ab

# MongoDB Atlas Connection URI
MONGO_URI=mongodb+srv://eastwind_user:YOUR_DB_PASSWORD@cluster0.xxxx.mongodb.net/eastwind?retryWrites=true&w=majority

# Optional: Media Fallback origin
# REMOTE_MEDIA_ORIGIN=https://eastwindsafety.com
```

> **Tip:** You can generate a random `JWT_SECRET` by running:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

---

### 4.2: Frontend Environment (`frontend/.env.production`)
Create `/var/www/eastwind/frontend/.env.production`:
```bash
nano /var/www/eastwind/frontend/.env.production
```
Paste and configure:
```env
# URL for Backend API
# Because Nginx proxies /api and /uploads to the backend, set this to your domain root:
NEXT_PUBLIC_API_URL=https://eastwindsafety.com

# Public Production Canonical Domain
NEXT_PUBLIC_SITE_URL=https://eastwindsafety.com
```

---

## 5. Administrator Account Management

### 5.1: Default Admin Credentials
When the database is seeded from `database.json`, the initial account created is:
- **Username:** `admin`
- **Default Password:** `admin123`

> [!CAUTION]
> You must change this password immediately after the first login or via the CLI script below.

### 5.2: Changing Admin Password from Web UI
1. Navigate to `https://eastwindsafety.com/admin/login`.
2. Login with current credentials.
3. Access Admin Settings -> Change Password to update your password securely.

### 5.3: Creating New Admins or Resetting Passwords via CLI
A dedicated standalone tool has been built into the backend. You can create a new admin or reset an existing admin's password at any time directly from the server terminal:

```bash
cd /var/www/eastwind/backend
npm run create-admin <username> <new_password>
```

**Examples:**
- Create or update `superadmin`:
  ```bash
  npm run create-admin superadmin "MyStr0ng!P@ssw0rd2026"
  ```
- Reset default `admin` password:
  ```bash
  npm run create-admin admin "BrandNewSecurePassword123"
  ```

Under the hood, passwords are encrypted with **PBKDF2 SHA-512** (10,000 iterations) with an independent cryptographically secure salt.

---

## 6. Project Deployment & Build Steps

### Step 6.1: Place Project on Server
Upload your `eastwind.zip` file or clone directly to `/var/www/eastwind`:
```bash
sudo mkdir -p /var/www/eastwind
sudo chown -R $USER:$USER /var/www/eastwind

# If transferring eastwind.zip:
sudo apt install -y unzip
unzip eastwind.zip -d /var/www/eastwind
```

### Step 6.2: Build Backend
```bash
cd /var/www/eastwind/backend
npm install --legacy-peer-deps
npm run build
```
This will compile TypeScript in `src/` to production JavaScript in `dist/`.

### Step 6.3: Build Frontend
```bash
cd /var/www/eastwind/frontend
npm install --legacy-peer-deps
npm run build
```
This will compile the Next.js production build in `.next/`.

### Step 6.4: Ensure Uploads Directory Exists
```bash
mkdir -p /var/www/eastwind/backend/uploads
chmod -R 775 /var/www/eastwind/backend/uploads
```

---

## 7. Process Management with PM2

The project root contains `ecosystem.config.cjs`, which defines and isolates both services:

```javascript
module.exports = {
  apps: [
    {
      name: "eastwind-backend",
      cwd: "./backend",
      script: "dist/index.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "eastwind-frontend",
      cwd: "./frontend",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 3000",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "600M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

### Step 7.1: Start Applications
From the project root (`/var/www/eastwind`):
```bash
cd /var/www/eastwind
pm2 start ecosystem.config.cjs
```

### Step 7.2: Verify Status
```bash
pm2 status
```
Both `eastwind-backend` and `eastwind-frontend` should show status `online`.

### Step 7.3: Check Logs
```bash
pm2 logs
# Or inspect individually:
pm2 logs eastwind-backend
pm2 logs eastwind-frontend
```

### Step 7.4: Enable Boot Persistence
Configure PM2 to automatically resurrect services if the server reboots:
```bash
pm2 save
pm2 startup
# (Copy-paste and run the command provided by `pm2 startup`)
```

---

## 8. Nginx Reverse Proxy & SSL Configuration

### Step 8.1: Create Nginx Configuration
Create `/etc/nginx/sites-available/eastwind`:
```bash
sudo nano /etc/nginx/sites-available/eastwind
```

Paste the following production-optimized configuration (replace `eastwindsafety.com` with your actual domain):

```nginx
# Rate limiting zone for API protection
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;

server {
    listen 80;
    listen [::]:80;
    server_name eastwindsafety.com www.eastwindsafety.com;

    # Allow large media / video / document uploads (up to 150MB)
    client_max_body_size 150M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # 1. Direct Static Uploads (High performance direct disk serving)
    location /uploads/ {
        alias /var/www/eastwind/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        access_log off;
        try_files $uri @backend_uploads;
    }

    location @backend_uploads {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 2. Backend API endpoints
    location /api/ {
        limit_req zone=api_limit burst=50 nodelay;
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 120s;
    }

    # 3. Next.js Static Cache
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        expires 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # 4. Frontend Next.js Web App
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Step 8.2: Enable Site and Test Nginx
```bash
sudo ln -sf /etc/nginx/sites-available/eastwind /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### Step 8.3: Install Free SSL Certificate via Let's Encrypt
Make sure your DNS A-records for `eastwindsafety.com` and `www.eastwindsafety.com` point to your server IP, then run:
```bash
sudo certbot --nginx -d eastwindsafety.com -d www.eastwindsafety.com
```
Follow prompts to enable HTTPS redirect. Certbot will automatically edit the Nginx configuration and configure auto-renewal via cron.

---

## 9. Media & Uploads Handling

- **Images:** Scaled and compressed using Sharp directly inside the backend.
- **Videos:** Automatically transcoded to web-optimized fast-start H.264 MP4 with FFmpeg.
- **Documents:** PDF, DOCX, XLSX files are stored with unique timestamps in `/var/www/eastwind/backend/uploads/`.
- **Backup:** Remember to back up the `/var/www/eastwind/backend/uploads/` directory alongside your MongoDB database.

---

## 10. Automated Redeployment Script

To make updating the production website fast and painless, create a file `/var/www/eastwind/deploy.sh`:

```bash
nano /var/www/eastwind/deploy.sh
```
Paste:
```bash
#!/usr/bin/env bash
set -e

echo "=== Pulling latest changes from Git ==="
git pull origin main

echo "=== Building Backend ==="
cd backend
npm install --legacy-peer-deps
npm run build

echo "=== Building Frontend ==="
cd ../frontend
npm install --legacy-peer-deps
npm run build

echo "=== Reloading PM2 Processes ==="
cd ..
pm2 reload ecosystem.config.cjs

echo "=== Deployment Completed Successfully ==="
```

Make it executable:
```bash
chmod +x /var/www/eastwind/deploy.sh
```

Whenever you push code changes to GitHub, deploy them on the server simply by running:
```bash
/var/www/eastwind/deploy.sh
```

---

## 11. Troubleshooting & Maintenance Checklist

| Issue | Likely Cause | Solution |
|---|---|---|
| **502 Bad Gateway (Frontend)** | `eastwind-frontend` PM2 process is stopped or crashed | Run `pm2 logs eastwind-frontend` to see the error. Check if `.next/` build exists; if not, run `npm run build` in `frontend/`. |
| **502 Bad Gateway (/api/*)** | `eastwind-backend` is stopped | Run `pm2 logs eastwind-backend`. Verify MongoDB connection string in `backend/.env`. |
| **MongoDB connection timeout** | Server IP not whitelisted in MongoDB Atlas | Go to MongoDB Atlas -> Network Access -> Add Server's Public IP. |
| **Uploads return 413 Entity Too Large** | Nginx default upload cap exceeded | Verify `client_max_body_size 150M;` is present in `/etc/nginx/sites-available/eastwind`. |
| **Forgot Admin Password** | Locked out of admin panel | Run `npm run create-admin admin <new_password>` inside `/var/www/eastwind/backend`. |
| **High CPU during video upload** | Video compression with FFmpeg | Normal during upload. Sharp concurrency is already constrained to 1 thread to protect server responsiveness. |
| **CORS error on API calls** | Domain mismatch | Check `CORS_ORIGIN` in `backend/.env`. Ensure it matches the protocol and domain (e.g., `https://eastwindsafety.com` without trailing slash). |

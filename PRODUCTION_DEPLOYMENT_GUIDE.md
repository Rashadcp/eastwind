# East Wind Safety — Production Deployment Guide
**Document Purpose:** Complete, step-by-step instructions for hosting the East Wind Safety platform on a production server.  
**Target Environment:** Ubuntu 22.04 LTS / Debian 12 / Cloud VPS (DigitalOcean, AWS EC2, Linode, Azure)  
**Production Domain:** `https://eastwind.sa`

---

## 📌 Executive Summary (For Non-Technical Managers)

> [!NOTE]
> **What this system needs to run:**
> 1. **A Domain Name** (e.g. `eastwind.sa` from GoDaddy, Namecheap, etc.)
> 2. **A Cloud Server (VPS)**: Ubuntu 22.04 with at least 2 GB RAM ($10–$20/month on DigitalOcean, AWS, or Linode).
> 3. **A Cloud Database**: Free or paid MongoDB Atlas cluster ([mongodb.com/atlas](https://www.mongodb.com/atlas)).

### How to Hand This Off to a Developer or Sysadmin:
Send them this single file (`PRODUCTION_DEPLOYMENT_GUIDE.md`) and the file **`eastwind.zip`**. Any web developer or Linux administrator can complete the deployment in under 30 minutes by following the numbered phases below.

### How to Access the Admin Dashboard Once Deployed:
* **Login URL:** `https://yourdomain.com/admin/login`
* **Default Username:** `admin`
* **Default Password:** `admin123` *(Change this immediately via Settings or Phase 4 below)*

---

## 🏗️ Architecture at a Glance

```
                  Visitors (HTTPS: 443)
                           │
                    ┌──────▼──────┐
                    │ Nginx Proxy │ (SSL Termination & Caching)
                    └──────┬──────┘
             ┌─────────────┴─────────────┐
             │                           │
       /api, /uploads                    / (All website pages)
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

---

## Phase 1: Server & Database Preparation

### 1.1: Prepare Cloud Server
Connect to your Ubuntu 22.04 server via SSH:
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential dependencies
sudo apt install -y curl wget git build-essential nginx certbot python3-certbot-nginx ffmpeg unzip

# Add 2GB Swap space (Prevents memory exhaustion during Next.js builds)
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 1.2: Install Node.js v20 LTS & PM2
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 Process Manager globally
sudo npm install -g pm2
```

### 1.3: Obtain MongoDB Connection String
1. Log into [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create or open your Cluster.
3. Under **Database Access**, create a user (e.g. `eastwind_user`) with a strong password.
4. Under **Network Access**, add your server's Public IP address (or `0.0.0.0/0`).
5. Click **Connect** $\rightarrow$ **Drivers** and copy your URI:
   ```
   mongodb+srv://eastwind_user:<PASSWORD>@cluster0.xxxx.mongodb.net/eastwind?retryWrites=true&w=majority
   ```

---

## Phase 2: Project Installation & Build

### 2.1: Extract Project Code
```bash
# Create target web directory
sudo mkdir -p /var/www/eastwind
sudo chown -R $USER:$USER /var/www/eastwind

# Transfer eastwind.zip to /var/www/eastwind and unzip
cd /var/www/eastwind
unzip eastwind.zip

# Ensure uploads directory has correct write permissions
mkdir -p /var/www/eastwind/backend/uploads
chmod -R 775 /var/www/eastwind/backend/uploads
```

### 2.2: Build the Backend
```bash
cd /var/www/eastwind/backend
npm install --legacy-peer-deps
npm run build
```
*(Compiles TypeScript in `src/` to production JavaScript in `dist/`)*

### 2.3: Build the Frontend
```bash
cd /var/www/eastwind/frontend
npm install --legacy-peer-deps
npm run build
```
*(Generates the optimized Next.js production build in `.next/`)*

---

## Phase 3: Environment Variables Configuration

### 3.1: Backend Config (`/var/www/eastwind/backend/.env`)
Create the file:
```bash
nano /var/www/eastwind/backend/.env
```
Paste the following values:
```env
# Port & Domain
PORT=5000
# Public frontend origin (no trailing slash).
CORS_ORIGIN=https://eastwind.sa

# Cryptographic Secret for Admin JWT Sessions (64 random characters)
JWT_SECRET=c8f53a987d6e4b219034f8a123bc45de67890123456789abcdef0123456789ab

# MongoDB Atlas Connection URI
MONGO_URI=mongodb+srv://eastwind_user:YOUR_DB_PASSWORD@cluster0.xxxx.mongodb.net/eastwind?retryWrites=true&w=majority
```

> [!TIP]
> Generate a random `JWT_SECRET` anytime by running:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 3.2: Frontend Config (`/var/www/eastwind/frontend/.env.production`)
Create the file:
```bash
nano /var/www/eastwind/frontend/.env.production
```
Paste:
```env
# Backend API URL (Proxied via Nginx root)
NEXT_PUBLIC_API_URL=https://eastwind.sa

# Local backend address used by the Next.js server/rewrite proxy
INTERNAL_BACKEND_URL=http://127.0.0.1:5000
BACKEND_PORT=5000

# Canonical Public Website URL
NEXT_PUBLIC_SITE_URL=https://eastwind.sa
```

---

## Phase 4: Administrator Account Management

### Method A: From Your Web Browser (Easiest — No Code)
1. Open `https://yourdomain.com/admin/login` in your browser.
2. Log in using the default credentials:
   - **Username:** `admin`
   - **Password:** `admin123`
3. Click **Settings** in the left sidebar menu.
4. Enter your current password and your new secure password, then click **Update Password**.

### Method B: From the Server Terminal (CLI Tool)
A dedicated management script is built directly into the backend. Run this on your server anytime:
```bash
cd /var/www/eastwind/backend
npm run create-admin <username> <password>
```

**Examples:**
```bash
# 1. Create a brand-new superadmin:
npm run create-admin superadmin "SecureP@ssw0rd2026!"

# 2. Reset a forgotten password for the default admin:
npm run create-admin admin "BrandNewPassword123"
```
*(Passwords are encrypted with high-security PBKDF2 SHA-512 and saved straight into MongoDB)*.

---

## Phase 5: Process Management (PM2)

Both backend and frontend services are configured in `ecosystem.config.cjs` with memory caps and auto-restarts.

### 5.1: Start Both Services
From `/var/www/eastwind`:
```bash
cd /var/www/eastwind
pm2 start ecosystem.config.cjs
```

### 5.2: Check Status & Live Logs
```bash
# Verify both apps are 'online'
pm2 status

# View live system logs
pm2 logs
```

### 5.3: Enable Auto-Start on Server Reboot
```bash
pm2 save
pm2 startup
# (Copy and run the single command displayed by pm2 startup)
```

---

## Phase 6: Nginx Reverse Proxy & SSL (HTTPS)

### 6.1: Create Nginx Site Configuration
Create `/etc/nginx/sites-available/eastwind`:
```bash
sudo nano /etc/nginx/sites-available/eastwind
```

Paste the following production configuration (replace `eastwind.sa` with your actual domain):

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;

server {
    listen 80;
    listen [::]:80;
    server_name eastwind.sa www.eastwind.sa;

    # Allow up to 150MB for video and document uploads
    client_max_body_size 150M;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript image/svg+xml;

    # 1. High-Performance Static Media Serving
    location /uploads/ {
        alias /var/www/eastwind/backend/uploads/;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000, immutable";
        access_log off;
        try_files $uri @backend_uploads;
    }

    location @backend_uploads {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 2. Backend REST API Endpoints
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
        proxy_read_timeout 120s;
    }

    # 3. Next.js Static Asset Cache
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3000;
        expires 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }

    # 4. Next.js Frontend Application
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6.2: Enable Site in Nginx
```bash
sudo ln -sf /etc/nginx/sites-available/eastwind /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

### 6.3: Install Free SSL Certificate (Let's Encrypt)
Make sure your domain's DNS A-records point to your server IP, then run:
```bash
sudo certbot --nginx -d eastwind.sa -d www.eastwind.sa
```
*Certbot will automatically install the certificate, enable the HTTPS padlock, and configure automatic 90-day renewals.*

---

## Phase 7: Ongoing Maintenance & Troubleshooting

### 7.1: Automated 1-Command Redeployment
Whenever you push code updates to GitHub, deploy them seamlessly on the server using `/var/www/eastwind/deploy.sh`:

```bash
#!/usr/bin/env bash
set -e
cd /var/www/eastwind
git pull origin main

cd backend && npm install --legacy-peer-deps && npm run build
cd ../frontend && npm install --legacy-peer-deps && npm run build
cd .. && pm2 reload ecosystem.config.cjs
echo "Deployment successful!"
```

### 7.2: Quick Troubleshooting Reference

| Symptom | Cause | Solution |
|---|---|---|
| **502 Bad Gateway (Website)** | Next.js frontend is stopped | Run `pm2 status`. Check logs: `pm2 logs eastwind-frontend`. Run `npm run build` in `frontend/`. |
| **502 Bad Gateway (`/api/*`)** | Express backend is stopped | Check logs: `pm2 logs eastwind-backend`. Check `MONGO_URI` in `backend/.env`. |
| **MongoDB connection timeout** | Server IP not whitelisted | In MongoDB Atlas $\rightarrow$ Network Access $\rightarrow$ Add server IP. |
| **413 Request Entity Too Large** | Nginx upload limit exceeded | Ensure `client_max_body_size 150M;` is present in Nginx config. |
| **Forgot Admin Password** | Locked out of admin | Run `npm run create-admin admin <new_password>` in `backend/`. |
| **CORS Error in Browser** | Domain mismatch | Check `CORS_ORIGIN` in `backend/.env` (must match exact domain with `https://`). |

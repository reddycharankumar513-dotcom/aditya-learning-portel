# LEARNOVA — 100% Free Tier (₹0 Zero Rupee) Production Deployment Guide

> **Guaranteed Zero Cost:** This guide explains how to deploy LEARNOVA to production using 100% free tier services and free domain subdomains without spending a single rupee.

---

## 1. Zero-Cost Production Stack Overview

```
                          +------------------------------------------+
                          |            Client Browsers               |
                          +--------------------+---------------------+
                                               |
                          HTTPS (Free SSL)     |     HTTPS (Free SSL)
                                               v
+------------------------------------------+       +------------------------------------------+
|          Frontend Web App                |       |             Backend REST API             |
|   Vercel Free Tier (Edge Network)        | ----> |       Render.com Web Service Free        |
|   Domain: https://learnova.vercel.app    |       |   Domain: https://learnova-api.onrender.com |
|   (or aditya-learning-portel.vercel.app) |       |       (or DuckDNS: learnova.duckdns.org) |
|   Cost: ₹0 / forever                     |       |       Cost: ₹0 / forever                 |
+------------------------------------------+       +--------------------+---------------------+
                                                                        |
                                                   TLS 1.2+ Encrypted   |
                                                                        v
                                                   +------------------------------------------+
                                                   |             MongoDB Atlas                |
                                                   |          M0 Free Sandbox Cluster         |
                                                   |          Storage: 512MB / RAM: Shared    |
                                                   |          Cost: ₹0 / forever              |
                                                   +------------------------------------------+
```

| Layer | Provider & Plan | Free Domain / Subdomain | Monthly Cost |
| :--- | :--- | :--- | :--- |
| **Frontend** | **Vercel Hobby** (Edge CDN) | `https://learnova.vercel.app` (or existing `https://aditya-learning-portel.vercel.app`) | **₹0 / month** |
| **Backend** | **Render.com** (Free Web Service) OR **AWS EC2 Free Tier** | `https://learnova-api.onrender.com` OR `https://learnova.duckdns.org` | **₹0 / month** |
| **Free Dynamic DNS** | **DuckDNS** (Free DNS service) | `learnova.duckdns.org` (Free point to any server IP) | **₹0 / month** |
| **Database** | **MongoDB Atlas M0** | Cloud cluster with TLS & IP access list | **₹0 / month** |
| **Object Storage** | **Cloudflare R2** (10 GB free) OR **AWS S3 Free Tier** (5 GB) | S3-compatible presigned URLs | **₹0 / month** |
| **SSL / HTTPS** | **Let's Encrypt / Vercel / Render** | Automatic managed SSL with auto-renewal | **₹0 / month** |
| **Total Cost** | **100% Free Services** | **Zero Rupees (₹0)** | **₹0** |

---

## 2. Step 1: Free Database Setup on MongoDB Atlas (M0 Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Click **Create Deployment** $\rightarrow$ select **M0 (Shared Free)** tier.
3. Choose Cloud Provider: **AWS** $\rightarrow$ Region: **Mumbai (`ap-south-1`)** for lowest latency.
4. Name the cluster (e.g. `learnova-cluster`). Click **Create**.
5. **Database User Security:**
   - Go to **Database Access** $\rightarrow$ Click **Add New Database User**.
   - Username: `learnova_app`
   - Password: Generate a secure 24-character password.
   - Built-in Role: **Read and write to any database** (or restrict to `learnova_platform`).
   - Click **Add User**.
6. **Network Firewall Locking:**
   - Go to **Network Access** $\rightarrow$ Click **Add IP Address**.
   - If using Render / PaaS without a dedicated static IP: Allow your backend server host IP or set the specific CIDR block.
   - Click **Confirm**.
7. **Get Connection String:**
   - Go to **Clusters** $\rightarrow$ Click **Connect** $\rightarrow$ Choose **Drivers (Node.js)**.
   - Copy connection string:
     ```
     mongodb+srv://learnova_app:<password>@learnova-cluster.xxxxx.mongodb.net/learnova_platform?retryWrites=true&w=majority
     ```

---

## 3. Step 2: Free Backend Deployment on Render.com

Render gives you a free Docker or Node.js web service with an automatic free HTTPS domain (`*.onrender.com`).

1. Sign up at [Render.com](https://render.com/) with your GitHub account.
2. Click **New +** $\rightarrow$ Select **Web Service**.
3. Select your repository: `reddycharankumar513-dotcom/aditya-learning-portel`.
4. Configure service settings:
   - **Name:** `learnova-api` (Generates `https://learnova-api.onrender.com`)
   - **Region:** Singapore or Frankfurt (fastest free regions).
   - **Branch:** `main` (or `master`)
   - **Root Directory:** `server`
   - **Runtime:** `Node` OR `Docker` (Render automatically detects `server/Dockerfile`).
   - If choosing Node:
     - **Build Command:** `npm ci && npm run build`
     - **Start Command:** `npm run start`
   - **Instance Type:** **Free** (0.5 CPU, 512 MB RAM — 100% free).
5. **Add Environment Variables in Render Dashboard:**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://learnova_app:<password>@learnova-cluster.xxxxx.mongodb.net/learnova_platform?retryWrites=true&w=majority
   JWT_SECRET=your_32_character_cryptographic_secret_here
   JWT_EXPIRES_IN=7d
   CLIENT_URL=https://aditya-learning-portel.vercel.app
   ALLOWED_ORIGINS=https://aditya-learning-portel.vercel.app,https://learnova.vercel.app,http://localhost:5173
   RAZORPAY_KEY_ID=rzp_test_LearnovaDemo2026
   RAZORPAY_KEY_SECRET=learnova_rzp_secret_key_mock_987654
   RAZORPAY_WEBHOOK_SECRET=learnova_webhook_secret_key_123456
   ```
6. Click **Create Web Service**.
7. Wait 2–3 minutes for the build to finish. Once live, test the health check in your browser:
   ```
   https://learnova-api.onrender.com/api/health
   ```
   Expected response:
   ```json
   {
     "status": "healthy",
     "platform": "LEARNOVA",
     "tagline": "Learn. Build. Prove. Get Hired.",
     "database": { "isConnected": true }
   }
   ```

---

## 4. Step 3: Free Custom Domain with DuckDNS (Optional Alternative)

If you want a dedicated free custom domain name like `learnova.duckdns.org` pointing to your server:

1. Visit [DuckDNS.org](https://www.duckdns.org/) and log in via GitHub/Google.
2. Under **sub domains**, type `learnova` and click **add domain**.
3. DuckDNS immediately reserves `learnova.duckdns.org` for you for free.
4. Enter your backend host IP address and click **update ip**.
5. DuckDNS provides automated shell scripts to keep your dynamic IP updated automatically.

---

## 5. Step 4: Frontend Production Deployment on Vercel

The frontend is already configured to deploy on Vercel with zero cost on the Hobby tier.

1. Go to your [Vercel Dashboard](https://vercel.com/).
2. Select the `aditya-learning-portel` project (or import the repository if creating fresh).
3. Go to **Settings $\rightarrow$ Environment Variables**.
4. Add the following variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://learnova-api.onrender.com` (your free backend URL from Step 2)
5. Under **Deployments**, click **Redeploy** so Vite injects the backend URL into the production bundle.
6. Open your free Vercel production URL:
   ```
   https://aditya-learning-portel.vercel.app/
   ```
7. Verify that:
   - The interactive 3D hero loads smoothly.
   - Signing in with Demo Student (`student@aditya-ed.org` / `Student@123456`) authenticates against the live MongoDB backend.
   - AI Mock Interviews generate questions and grade answers.
   - Resume ATS Analyzer scores uploaded text and provides XYZ bullet point recommendations.
   - Employer talent portal and applicant tracker operate seamlessly.

---

## 6. Zero-Rupee Cost Summary

| Item | Cost in USD | Cost in INR |
| :--- | :--- | :--- |
| Vercel Frontend Hosting | \$0.00 | **₹0.00** |
| Render.com Backend Hosting | \$0.00 | **₹0.00** |
| MongoDB Atlas M0 Cloud Database | \$0.00 | **₹0.00** |
| Free Subdomain (`*.vercel.app` & `*.onrender.com`) | \$0.00 | **₹0.00** |
| Automatic Let's Encrypt SSL Certificates | \$0.00 | **₹0.00** |
| GitHub Actions CI/CD (2,000 free min/month) | \$0.00 | **₹0.00** |
| **Total Monthly Spend** | **\$0.00** | **₹0.00 (Zero Rupees)** |

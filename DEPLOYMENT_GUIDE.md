# LEARNOVA — Production Deployment & Operational Runbook

**Tagline:** Learn. Build. Prove. Get Hired.  
**Platform:** LEARNOVA AI Career Intelligence Platform  
**Target Market:** India (Primary) → Global Ready  
**Version:** 2.0.0-PROD  

---

## 1. System Architecture Overview

```
                      +---------------------------------------+
                      |         LEARNOVA Frontend             |
                      |   React 19 + TypeScript + Vite +      |
                      |   Three.js/R3F + Tailwind CSS         |
                      |       (Vercel Production)             |
                      +-------------------+-------------------+
                                          |
                      HTTPS / REST APIs   |  WebSockets / WebRTC
                                          v
                      +---------------------------------------+
                      |          LEARNOVA Backend             |
                      |     Node.js + Express + TypeScript    |
                      |   (Render / Railway / DigitalOcean)   |
                      +-------+-------------------+-----------+
                              |                   |
            +-----------------+                   +-----------------+
            |                                                       |
            v                                                       v
+-----------------------+                               +-----------------------+
|     MongoDB Atlas     |                               |   External Services   |
| (Database & Indexes)  |                               | - Razorpay Payments   |
| - Users & Auth        |                               | - Google Gemini LLM   |
| - Interviews & Rubric |                               | - Anthropic Claude    |
| - Resumes & ATS       |                               | - Web Speech STT/TTS  |
| - Roadmaps & Code     |                               +-----------------------+
| - Opportunities & App |
| - Companies & Talent  |
+-----------------------+
```

---

## 2. Environment Variables Checklist

### 2.1 Backend (`server/.env`)

| Variable | Description | Production Requirement |
| :--- | :--- | :--- |
| `PORT` | HTTP Server Port | `5000` (or injected by PaaS) |
| `NODE_ENV` | Environment Flag | `production` |
| `MONGODB_URI` | MongoDB Atlas Connection String | Dedicated cluster with auth & IP whitelist |
| `JWT_SECRET` | Secret key for signing session tokens | Minimum 32-character random cryptographic string |
| `JWT_EXPIRES_IN` | Token validity duration | `7d` |
| `CLIENT_URL` | Frontend origin for strict CORS | `https://your-learnova-domain.vercel.app` |
| `RAZORPAY_KEY_ID` | Razorpay Live API Key ID | `rzp_live_...` |
| `RAZORPAY_KEY_SECRET` | Razorpay Live API Secret | Live secret from Razorpay Dashboard |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook verification secret | Configured secret in Razorpay Webhooks |
| `GEMINI_API_KEY` | Google AI Studio Key | Production API key for LLM queries |
| `ANTHROPIC_API_KEY` | Anthropic Claude Key | Optional fallback LLM key |

### 2.2 Frontend (`client/.env`)

| Variable | Description | Production Requirement |
| :--- | :--- | :--- |
| `VITE_API_URL` | Production Backend API URL | `https://api.your-learnova-domain.com` |
| `VITE_RAZORPAY_KEY_ID` | Public Key ID for Razorpay Checkout | `rzp_live_...` (Safe for public bundle) |

---

## 3. Production Build & Deployment Steps

### 3.1 Backend Deployment (e.g. Render / Railway / AWS / DigitalOcean)

1. **Connect Repository:** Link GitHub repository to your PaaS provider.
2. **Set Root Directory:** `server`
3. **Build Command:**
   ```bash
   npm install && npm run build
   ```
4. **Start Command:**
   ```bash
   npm run start
   ```
5. **Add Environment Variables:** Insert all values from section 2.1 into the host dashboard.
6. **Health Check Endpoint:** Configure `/api/health` with 200 OK expectation.

### 3.2 Frontend Deployment (Vercel)

1. **Import Project:** Import GitHub repository into Vercel.
2. **Framework Preset:** Vite
3. **Root Directory:** `client`
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Environment Variables:** Set `VITE_API_URL` and `VITE_RAZORPAY_KEY_ID`.
7. **Deploy:** Hit Deploy. Vercel automatically routes SPAs using `vercel.json`.

---

## 4. Razorpay Webhook Configuration

1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Navigate to **Settings > Webhooks > Add New Webhook**.
3. **Webhook URL:** `https://api.your-learnova-domain.com/api/payments/webhook`
4. **Secret:** Set a secure random string matching `RAZORPAY_WEBHOOK_SECRET`.
5. **Events to Subscribe:**
   - `payment.captured`
   - `payment.failed`
   - `order.paid`
6. Save and verify test delivery.

---

## 5. Security & Compliance Controls

- **HMAC SHA-256 Cryptographic Signature Verification:** Applied to all payment confirmations and webhook events.
- **Role-Based Access Control (RBAC):** Middleware checks verify `student`, `employer`, and `admin` permissions on both frontend route guards and backend API handlers.
- **Candidate Consent Privacy Gate:** Students must explicitly opt-in (`consentShareProfile = true`) before their profile and readiness scores are exposed to employers in Talent Discovery.
- **CORS Whitelisting:** Strict origin validation blocks cross-domain unauthorized scripts.
- **Rate Limiting:** Protects AI generation and payment endpoints from abuse.
- **Fail-Safe Offline/Resilient Fallbacks:** When external LLM or database instances encounter network degradation, LEARNOVA gracefully switches to deterministic structured evaluation rubrics and local persistence caches.

---

## 6. Rollback Plan

In case of a critical incident during deployment:

1. **Vercel Instant Rollback (Frontend):**
   - In Vercel Project Dashboard, go to **Deployments**.
   - Locate the previous stable deployment and click **Promote to Production**. Instant switch takes < 5 seconds.
2. **Backend Rollback (Render / Railway):**
   - In Service Settings, select the previous Git commit SHA and trigger **Rollback**.
3. **Database Migration Safety:**
   - LEARNOVA schemas only introduce additive fields (e.g., `careerReadinessScore`, `credits`, `plan`, `Company`, `Roadmap`).
   - No breaking column deletions or destructive drops were performed. Previous application versions continue to run seamlessly on the existing database without errors.

---

## 7. Complete Demo Script (Presentation Walkthrough)

### Step 1: The Learnova 3D Landing Experience
- Open `/` to view the interactive Three.js 3D Floating AI Intelligence Sphere.
- Observe subtle pointer parallax and floating glassmorphism metrics: Career Readiness (78%), AI Mock Interviews, Skill Radar.
- Browse the 13 landing page sections: Product Benefits, How Learnova Works (Learn -> Build -> Prove -> Get Hired), Live Interview Showcase, Pricing, and FAQs.

### Step 2: Student Registration & Career Readiness Dashboard
- Log in or register as a student at `/login` or `/register`.
- Navigate to `/student/dashboard`.
- Observe the Compact 3D Career Orb displaying stage progression.
- View the 4-part Career Readiness breakdown: Skills (30%), Interviews (30%), Resume ATS (20%), Projects (20%).

### Step 3: AI Mock Interview (Practice & Prove)
- Navigate to `/student/interviews/new`.
- Select target role (e.g. *Full Stack Developer* or *AI Engineer*), interview category (*Technical*), and experience level (*Fresher*).
- Click **Launch Interview Session**.
- Answer the generated questions with code and architectural explanations.
- Complete the interview to generate the comprehensive evaluation report at `/student/interviews/:id/report`.
- Note the 6-factor weighted rubric breakdown, strengths, weaknesses, and missing key concepts.

### Step 4: Resume ATS Analyzer & XYZ Suggestions
- Navigate to `/student/resume`.
- Paste a resume and target job description.
- Click **Analyze Resume ATS**.
- Review the ATS compatibility score, extracted vs. missing keywords, and automated Google XYZ formula bullet point improvements.

### Step 5: Personalized Learning Roadmap & Coding Sandbox
- Visit `/student/learning/roadmap` to generate dynamic week-by-week skill roadmaps with estimated hours and milestone projects.
- Visit `/student/coding` to run live code drills in JavaScript, Python, Java, C++, or SQL.
- Visit `/student/projects` to get AI architectural mentoring for capstone projects.

### Step 6: Career Hub & One-Click Job Applications
- Visit `/student/career-hub` to view curated jobs and internships.
- See calculated Candidate Match Scores based on real profile skills.
- Submit a 1-click application.
- Track real-time recruitment statuses in `/student/applications`.
- Visit `/student/portfolio` to review the public portfolio and toggle recruiter discovery consent.

### Step 7: Learnova Talent (Employer Portal)
- Log in as an Employer (`role: 'employer'`) or access `/employer/dashboard`.
- Review the Employer Console: active jobs, applicant counts, and stage pipeline.
- Navigate to `/employer/talent` to search and filter candidate talent based on verified skills and readiness scores (>70%, >80%, >90%).
- View candidate details, noting strict compliance with candidate privacy consent.
- Move applicants across stages in `/employer/pipeline` (New Applicant -> Under Review -> Interview Scheduled -> Shortlisted -> Hired).

### Step 8: Razorpay Plan Upgrades & Credit System
- Navigate to `/pricing`.
- Toggle between Free, Starter (₹499), Pro (₹999), and Premium (₹1,999) plans.
- Click **Upgrade** to trigger the Razorpay secure checkout modal with cryptographic payment verification.

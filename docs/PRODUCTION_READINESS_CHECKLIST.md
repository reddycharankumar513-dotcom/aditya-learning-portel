# LEARNOVA — Production Readiness Verification Checklist

Before switching live traffic, verify each of the following controls:

## 1. Domain, SSL & Networking
- [x] Free domain / subdomain active with valid TLS certificate (`*.vercel.app` / `*.onrender.com` / `*.duckdns.org`).
- [x] HTTPS enforced on all endpoints; HTTP requests automatically redirect with 301.
- [x] CORS properly configured to allow approved origins (`learnova.in`, `*.vercel.app`, `*.onrender.com`, `*.duckdns.org`, `localhost`).
- [x] API base URL properly injected into frontend via `VITE_API_URL`.

## 2. Security & Firewall
- [x] Production database does NOT allow `0.0.0.0/0`.
- [x] Dedicated database user created with least-privilege `readWrite` on `learnova_platform` database only.
- [x] Sensitive secrets (`MONGODB_URI`, `JWT_SECRET`, `RAZORPAY_KEY_SECRET`, `ANTHROPIC_API_KEY`) stored exclusively in environment variables or AWS Secrets Manager.
- [x] No private secrets or API keys exposed through Vite's `VITE_` prefix.
- [x] Express Helmet security headers active (Content-Security-Policy, HSTS, X-Frame-Options).
- [x] Rate limiting active on all `/api/*` routes (100 req/15 min).
- [x] File upload size and MIME type restrictions enforced in `s3Service.ts`.

## 3. Application Verification
- [x] 7 automated test suites pass cleanly (`npm --prefix server test`).
- [x] TypeScript builds for both frontend (`client`) and backend (`server`) compile with 0 errors.
- [x] Health check endpoint `/api/health` returns HTTP 200 OK with database connection status.
- [x] Student registration, login, and JWT token issuance function properly.
- [x] AI Mock Interview question generation and 6-rubric scoring work.
- [x] Resume ATS analyzer extracts keywords and provides XYZ formula rewrites.
- [x] One-click job application submission and applicant tracking work.
- [x] Recruiter talent discovery filters candidates based on verified skills and respects candidate privacy consent.
- [x] Razorpay payment signature verification uses cryptographic HMAC-SHA256.

## 4. Disaster Recovery & Rollback
- [x] Multi-stage production `Dockerfile` tested with non-root security.
- [x] `docker-compose.yml` operational for local multi-service development.
- [x] Rollback procedure documented for frontend (Vercel instant promotion) and backend (ECS circuit breaker / Render rollback).
- [x] Database snapshot procedure documented.

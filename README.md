# ADITYA — AI-Powered Education, Technology Training & Career Development Platform

> **"Learn. Build. Innovate. Succeed."**

A complete, modern, responsive full-stack educational web application designed with a premium technology startup aesthetic. ADITYA provides specialized training curriculums in Artificial Intelligence, Machine Learning, Data Science, Software Development, Cloud Computing, and Career Preparation, integrated with a 24/7 Claude-powered interactive AI Learning Tutor.

---

## 🚀 Key Highlights & Architectural Overview

- **Design Aesthetic:** Premium tech startup visual identity featuring clean slate backgrounds, dark navy typography, electric blue primary accents (`#2563EB`), vibrant violet highlights (`#7C3AED`), cyan accents (`#06B6D4`), subtle gradients, rounded cards, and smooth micro-interactions.
- **Frontend:** Built with React 19, TypeScript, Vite, Tailwind CSS, Lucide React icons, and React Router v7. Includes full responsive mobile navigation drawer, interactive course catalogs, module syllabus progress trackers, portfolio managers, and an interactive Claude AI workspace.
- **Backend:** Node.js, Express.js REST API with modular controllers, services, Mongoose models, and strict role-based access control.
- **Database:** MongoDB Atlas / local MongoDB with schemas for Users, Courses, Modules, Enrollments, AI Conversations, Internships, Applications, Portfolio Projects, and Contact Inquiries.
- **Authentication & Security:** Secure registration, bcrypt password hashing, signed JSON Web Tokens (JWT), role-based middleware (`student`, `instructor`, `admin`), password reset tokens, Helmet security headers, CORS origin protection, and rate limiting.
- **24/7 AI Tutor:** Powered by the Claude API (`claude-3-5-sonnet-20241022`) via backend proxy endpoints. Features adaptive depth levels (Beginner, Intermediate, Advanced), syntax highlighting with one-click code copy, session history persistence, and a built-in pedagogical rule engine fallback.

---

## 📋 All 23 Platform Pages Implemented

| # | Page | Route | Description |
|---|------|-------|-------------|
| 1 | **Home** | `/` | Hero with platform visual, About preview, Program tracks, 6-step learning workflow, Capstone showcases, AI Tutor teaser, and FAQ. |
| 2 | **About Us** | `/about` | Mission, vision, 5 core educational pillars, and institutional transparency notices. |
| 3 | **Programs** | `/programs` | Full directory across AI/ML, Data Science, Software Development, Cloud & DevOps, and Career tracks with category filters. |
| 4 | **Courses Catalog** | `/courses` | Real-time search, category filtering, difficulty toggles (Beginner/Intermediate/Advanced), and instant course enrollment. |
| 5 | **Course Details** | `/courses/:slug` | Detailed curriculum overview, learning objectives, prerequisites, expandable syllabus lessons, and progress tracking. |
| 6 | **AI Tutor** | `/ai-tutor` | Full-screen Claude AI workspace with prompt suggestions, level selector, session management, and copyable code blocks. |
| 7 | **Internships** | `/internships` | Technical apprentice and fellow opportunities with eligibility criteria, deadline tracking, and application modal. |
| 8 | **Careers** | `/careers` | Engineering interview drills, ATS resume optimization guidelines, system design preparation, and mock interview tools. |
| 9 | **Contact** | `/contact` | Inquiry form categorized by topic (Courses, Support, Partnerships), validated and logged directly into MongoDB. |
| 10 | **Register** | `/register` | Secure registration with educational background, country, and multi-select learning interests. |
| 11 | **Login** | `/login` | Email/password authentication with quick demo one-click credential autofill buttons. |
| 12 | **Forgot Password** | `/forgot-password` | Requests a secure, expiring password reset token. |
| 13 | **Reset Password** | `/reset-password` | Token verification form to update user password securely. |
| 14 | **Student Dashboard** | `/dashboard` | Protected hub showing live enrollment stats, active courses, recommendations, portfolio manager, and activities. |
| 15 | **My Courses** | `/dashboard/my-courses` | Overview of all enrolled courses filtered by in-progress/completed with progress bars. |
| 16 | **Learning Path** | `/dashboard/learning-path` | 5-phase sequential milestone roadmap from foundations to production capstone deployment. |
| 17 | **Student Profile** | `/profile` | Profile settings to update learning goals, background, and recommendation interests. |
| 18 | **Admin Dashboard** | `/admin` | Protected operational hub with aggregated counts (users, courses, enrollments, apps, inquiries) and inquiry review table. |
| 19 | **Manage Courses** | `/admin/courses` | Create new courses, toggle publication status, review syllabus counts, and delete courses. |
| 20 | **Manage Internships** | `/admin/internships` | Create technical opportunities, view candidate submissions, and update review statuses. |
| 21 | **Manage Users** | `/admin/users` | Audit registered user directory, search by name/email, and assign administrator roles. |
| 22 | **Privacy Policy** | `/privacy` | Data retention guidelines, student privacy rights, and AI interaction data handling. |
| 23 | **Terms & Conditions** | `/terms` | Educational scope, code of conduct, and AI pedagogical disclaimers. |
| 24 | **Not Found (404)** | `*` | Custom 404 recovery page with links to homepage and course catalog. |

---

## 🔑 Demo Accounts for Immediate Testing

For ease of evaluation, the database includes pre-seeded demo accounts:

### 1. Student Demo Account
- **Email:** `student@aditya-ed.org`
- **Password:** `Student@123456`
- **Role:** `student`
- **Pre-loaded with:** Active course enrollments, module completion progress, and portfolio projects.

### 2. Administrator Demo Account
- **Email:** `admin@aditya-ed.org`
- **Password:** `Admin@123456`
- **Role:** `admin`
- **Access to:** `/admin`, `/admin/courses`, `/admin/internships`, and `/admin/users`.

*(You can also use the one-click "Demo Student" / "Demo Admin" autofill buttons on the `/login` page).*

---

## 🛠️ Technology Stack

```
aditya-platform/
├── client/                     # Frontend (React 19 + TypeScript + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, Footer, Hero, CourseCard, AITutorChat, etc.)
│   │   ├── context/            # AuthContext (JWT management & session state)
│   │   ├── pages/              # 23 full platform views
│   │   ├── services/           # Typed API clients (Auth, Course, AI, Enrollment, Admin)
│   │   └── types/              # TypeScript interface definitions
│   └── tailwind.config.js      # ADITYA custom brand design tokens
└── server/                     # Backend (Node.js + Express + TypeScript)
    ├── src/
    │   ├── config/             # Database connection & environment parsing
    │   ├── controllers/        # REST route controllers
    │   ├── middleware/         # JWT verification, Role checks, Rate limiting, Error handler
    │   ├── models/             # Mongoose schemas (User, Course, Enrollment, AIConversation, etc.)
    │   ├── routes/             # Express API endpoint groups
    │   ├── seeds/              # Initial curriculum & demo accounts seeder
    │   └── services/           # Claude API integration & rule-based recommendations
    └── dist/                   # Compiled production server bundle
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
- **Node.js:** v18.0.0 or later (v20+ or v24+ recommended)
- **npm:** v9.0.0 or later
- **MongoDB:** Local MongoDB daemon or free MongoDB Atlas cluster

### 1. Clone & Install Dependencies

From the project root:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

Or from the root directory using the automated npm script:
```bash
npm run install:all
```

---

## 🗄️ MongoDB Configuration Instructions

### Option A: Local MongoDB (Default)
If you have MongoDB installed locally, ensure the service is running. The default connection URI in `server/.env` is:
```env
MONGODB_URI=mongodb://localhost:27017/aditya_platform
```

### Option B: MongoDB Atlas (Cloud)
1. Navigate to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign in.
2. Create a free **M0 Sandbox** cluster.
3. Under **Database Access**, create a database user (e.g., `aditya_admin`) with a secure password.
4. Under **Network Access**, add IP address `0.0.0.0/0` (allow access from anywhere) or your current IP.
5. In your cluster dashboard, click **Connect** -> **Drivers** -> Copy the connection string.
6. In `server/.env`, set:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/aditya_platform?retryWrites=true&w=majority
```

---

## 🤖 Claude API Configuration Instructions

The AI Learning Tutor connects to Anthropic's official Claude API via a secured backend proxy endpoint (`/api/ai/chat`), keeping your API credentials completely hidden from client code:

1. Obtain an API key from the [Anthropic Console](https://console.anthropic.com/).
2. In `server/.env`, configure:
```env
ANTHROPIC_API_KEY=sk-ant-api03-...your-key-here...
```
3. Restart the backend server. The AI Tutor will automatically use `claude-3-5-sonnet-20241022`.
4. *Graceful Fallback:* If no `ANTHROPIC_API_KEY` is provided or if network limits are reached, ADITYA automatically activates its built-in pedagogical rule engine, ensuring students can explore coding explanations, algorithmic breakdowns, and study plans during evaluations.

---

## 📄 Environment Variable Reference

### Server (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/aditya_platform
JWT_SECRET=aditya_jwt_secret_dev_key_2026_secured
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=your_anthropic_api_key_here
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`):
```env
# Optional in development (Vite automatically proxies /api to http://localhost:5000)
# In production, set to your hosted backend URL:
VITE_API_URL=
```

---

## 🏃 Running the Application

### Method 1: Running in Two Terminals

**Terminal 1 (Backend Server):**
```bash
cd server
npm run dev
# Server will listen on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Vite will serve the UI on http://localhost:5173
```

### Method 2: Production Build & Run
```bash
# Build client
cd client
npm run build

# Build server
cd ../server
npm run build

# Start production server
npm start
```

---

## 🧪 Testing Instructions

### 1. Verify Health Check
Open PowerShell or your browser:
```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
```
Expected output:
```json
{
  "status": "healthy",
  "platform": "ADITYA",
  "database": { "isConnected": true },
  "aiTutor": { "configured": false, "model": "Claude 3.5 Sonnet (with intelligent pedagogical fallback)" }
}
```

### 2. Verify Authentication Flow
- Visit `http://localhost:5173/login`.
- Click **"Demo Student"** and sign in.
- Verify redirect to `/dashboard` showing enrolled tracks and personalized course recommendations.
- Click **"Demo Admin"** on login and sign in.
- Click the user avatar menu -> **"Admin Portal"** to verify access to `/admin`, `/admin/courses`, `/admin/internships`, and `/admin/users`.

### 3. Verify Course Enrollment & Progress Tracking
- Navigate to `http://localhost:5173/courses`.
- Select any course (e.g. *Generative AI & LLM Systems*).
- Click **"Enroll in Course"**.
- Expand a syllabus module and click **"Mark Module as Completed"**.
- Verify that your progress percentage updates immediately and persists to MongoDB.

### 4. Verify AI Tutor
- Navigate to `http://localhost:5173/ai-tutor`.
- Click the suggested prompt: *"Explain neural networks in simple terms"*.
- Switch the target depth to **Beginner** or **Advanced**.
- Verify formatted markdown response with syntax-highlighted code blocks and the copy code button.

### 5. Verify Contact Form
- Navigate to `http://localhost:5173/contact`.
- Fill in the form and submit.
- Sign in as Admin (`admin@aditya-ed.org`), navigate to `/admin`, and observe the new inquiry logged in the table with status management.

---

## 🚢 Deployment Steps

### 1. Frontend Deployment (Vercel)
1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com/), click **Add New Project** and select your repository.
3. Configure the Root Directory to `client`.
4. Framework Preset: **Vite**.
5. Set Environment Variable: `VITE_API_URL=https://your-backend-api-domain.com`.
6. Click **Deploy**.

### 2. Backend Deployment (Render, Railway, or AWS)
1. Select your repository in your hosting dashboard.
2. Configure Root Directory to `server`.
3. Build Command: `npm install && npm run build`.
4. Start Command: `npm start`.
5. Set Environment Variables:
   - `NODE_ENV=production`
   - `PORT=5000` (or provider's dynamic port)
   - `MONGODB_URI=mongodb+srv://...` (your MongoDB Atlas connection string)
   - `JWT_SECRET=your_production_random_secret_string`
   - `ANTHROPIC_API_KEY=sk-ant-...`
   - `CLIENT_URL=https://your-vercel-frontend-domain.vercel.app`
6. Deploy the service.

---

## 📌 Configured vs. Remaining Real-World Settings

- **Configured & Ready:**
  - Full client application with all 23 views.
  - End-to-end REST API architecture with JWT authentication.
  - Role-based authorization (`student`, `admin`).
  - Course enrollment and module completion tracking.
  - Rule-based course recommendation algorithm with transparent rationale.
  - Student project portfolio manager.
  - Technical internship postings and candidate submission tracking.
  - Contact inquiry persistence and admin status updates.
  - Pedagogical AI Tutor engine with code blocks.

- **Optional External Configurations:**
  - **Live Claude Inference:** Add your `ANTHROPIC_API_KEY` in `server/.env` to enable real-time Anthropic Claude API generation (the platform operates gracefully with its built-in pedagogical engine if omitted).
  - **Email Service (SMTP / SendGrid):** In production, hook up an email transport to dispatch the generated password reset tokens directly to student inboxes.
  - **Cloud Object Storage (AWS S3 / Cloudinary):** For student resume PDF uploads in production, add an S3 pre-signed URL workflow to store document attachments.

---

**ADITYA — Learn. Build. Innovate. Succeed.**

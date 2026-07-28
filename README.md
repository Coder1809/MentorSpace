# MentorSpace — Premier 1-on-1 Tech Mentorship Platform

MentorSpace is a modern, two-role mentorship platform connecting students with senior tech mentors for 1-on-1 online sessions across software engineering, system design, AI/ML, DevOps, and competitive programming.

---

## 🌟 Key Features & Platform Highlights

- **Centered & Balanced Landing Hero**: Re-architected landing hero with centered typography, domain badges, instant action CTAs, and verified platform metrics.
- **Brand-Consistent SVG Favicon**: Custom Graduation Cap logo favicon (`favicon.svg`) matching MentorSpace branding across browsers and tab bars.
- **Strict 2-Role Security Model**: Platform access is exclusively partitioned for **Student** and **Mentor** workspaces with role-based JWT guards (`authenticate`, `authorizeStudent`, `authorizeMentor`).
- **Comprehensive Mentor Onboarding & Profiles**: Full mentor registration workflow capturing Professional Title, Company, Primary Specialization, Key Skills, Years of Experience, Bio/About, Session Fee (₹), Spoken Languages, Availability Schedule, Profile Photo, and LinkedIn link—persisted in MongoDB without default or dummy values.
- **Interactive 2-Step Booking Flow**:
  1. **Schedule & Topic**: Date selection calendar with visual date highlighting, time slot selection (Morning/Afternoon/Evening), and goal description validation.
  2. **Review & Pay Summary**: Real-time session fee breakdown and interactive Razorpay checkout popup.
- **HMAC Signature Verified Razorpay Payments**: Server-side Razorpay order creation (`POST /api/payment/create-order`) and HMAC SHA-256 digital signature verification (`POST /api/payment/verify`) with digital transaction receipt generation.
- **Responsive Sidebar Calendar**: Perfectly aligned and styled DatePicker calendar inside the mentor and student sidebar console without text clipping or grid misalignment.
- **Dedicated About Page & Section**: Comprehensive `/about` page and `#about` landing section covering Platform Mission, Vision, Features, Student Benefits, Mentor Benefits, and Company Story.
- **Domain-Based Mentor Discovery**: Filter and search verified tech mentors across 10 specialized engineering domains:
  - React, Node.js, Java, Python, Machine Learning, DevOps, UI/UX, Data Structures, Competitive Programming, and Cloud Architecture.
- **Mentor Console & Session Lifecycle**: Real-time request approvals (`Pending` → `Accepted` → `Completed` / `Rejected`) and instant availability toggle (`Active` / `Away`).

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite 6, TailwindCSS, Lucide Icons, Zustand, React Hook Form, Zod
- **UI Design System**: Sage Green Palette (`#4CAF7D`, `#2e7d52`, `#DDF4E7`), Glassmorphism, Google Fonts (`Outfit` + `Plus Jakarta Sans`)
- **Backend**: Node.js, Express 5, MongoDB (Mongoose 8), Crypto (HMAC SHA-256)
- **Security & Payments**: JWT Authentication, Bcrypt Password Hashing, Razorpay SDK integration

---

## 🚀 Setup & Execution Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally at `mongodb://127.0.0.1:27017`

### 2. Environment Variables

Root `.env`:
```env
PORT=8000
MONGO_URL=mongodb://127.0.0.1:27017/mentorspace
JWT_SECRET=mentorspace_jwt_secret_key_2026
RAZORPAY_KEY_ID=rzp_test_TImK53NPdBihRw
RAZORPAY_KEY_SECRET=wx3HHLMfmYXPvO9dbxCTILK2
RATE_LIMIT_ENABLED=true
RATE_LIMIT_LOGIN=100:15
RATE_LIMIT_REGISTER=100:15
RATE_LIMIT_PAYMENT=100:15
```

Client `.env` (`client/.env`):
```env
VITE_RAZORPAY_KEY_ID=rzp_test_TImK53NPdBihRw
```

### 3. Installation & Database Seeding

```bash
# Install root & workspace dependencies
npm install

# Seed Database with 10 Mentors across 10 domains, 5 Students, sample appointments & transactions
npm run seed

# Run automated test suite
npm test
```

### 4. Running the Application

#### Option A: Using 1 Terminal (Recommended ⭐)
```bash
# Runs Express backend server (port 8000) & Vite frontend app (port 5173) concurrently
npm run dev
```

#### Option B: Using 2 Terminals
- **Terminal 1 (Backend Server)**: `npm run dev:server`
- **Terminal 2 (Frontend Client)**: `npm run dev:client`

---

## 🔑 Default Seed Credentials

Default Password for all sample accounts: **`Admin123@`**

### Mentor Accounts (10 Tech Domains)
| Domain | Mentor Name | Email | Status |
|---|---|---|---|
| **React** | Sarah Chen | `sarahchen@mentorspace.com` | Active |
| **Node.js** | Michael Chang | `michaelchang@mentorspace.com` | Active |
| **Java** | David Miller | `davidmiller@mentorspace.com` | Active |
| **Python** | Elena Rostova | `elenarostova@mentorspace.com` | Active |
| **Machine Learning** | Dr. Andrew Kim | `dr.andrewkim@mentorspace.com` | Active |
| **DevOps** | James Wilson | `jameswilson@mentorspace.com` | Active |
| **UI/UX** | Emma Watson | `emmawatson@mentorspace.com` | Active |
| **Data Structures** | Priya Sharma | `priyasharma@mentorspace.com` | Active |
| **Competitive Programming** | Vikram Malhotra | `vikrammalhotra@mentorspace.com` | Active |
| **Cloud** | Robert Taylor | `roberttaylor@mentorspace.com` | Active |

### Student Accounts (5 Sample Students)
| Student Name | Email | Password |
|---|---|---|
| **Rahul Verma** | `rahul@student.com` | `Admin123@` |
| **Ananya Gupta** | `ananya@student.com` | `Admin123@` |
| **Karan Patel** | `karan@student.com` | `Admin123@` |
| **Sneha Reddy** | `sneha@student.com` | `Admin123@` |
| **Devansh Shah** | `devansh@student.com` | `Admin123@` |

---

## 📡 API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register new user with full role attributes (`role`: `"student"` or `"mentor"`)
- `POST /api/auth/login` — Login user (returns JWT token with `userId` and `role`)
- `POST /api/auth/logout` — Logout user session

### User (`/api/user`)
- `GET /api/user` — Get authenticated user details (`authenticate` middleware)

### Mentors (`/api/mentor`)
- `GET /api/mentor` — List all active tech mentors (Public)
- `GET /api/mentor/:id` — Get single mentor profile details (Public)
- `GET /api/mentor/profile` — Self mentor profile details (`authenticate`, `authorizeMentor`)
- `PUT /api/mentor/profile` — Update self mentor profile, availability & details (`authenticate`, `authorizeMentor`)
- `PUT /api/mentor/:id` — Update mentor profile by ID (`authenticate`, `authorizeMentor`)

### Students (`/api/student`)
- `GET /api/student` — Get student profile (`authenticate`, `authorizeStudent`)
- `POST /api/student` — Upsert student profile (`authenticate`, `authorizeStudent`)

### Appointments (`/api/appointment`)
- `GET /api/appointment` — Get appointments for logged-in user (`authenticate`)
- `POST /api/appointment` — Book mentorship session (`authenticate`, `authorizeStudent`)
- `PUT /api/appointment/:id` — Update appointment status (`authenticate`, `authorizeMentor`)

### Payments (`/api/payment`)
- `POST /api/payment/create-order` — Create Razorpay order (`authenticate`, `authorizeStudent`)
- `POST /api/payment/verify` — Verify Razorpay HMAC signature & finalize appointment (`authenticate`, `authorizeStudent`)
- `GET /api/payment` — Get verified transaction history (`authenticate`)

---

## 🧪 Production Build

Verify client build:
```bash
npm run build
```

---

## 📄 License
ISC License

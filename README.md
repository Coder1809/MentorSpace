# MentorSpace

> **A 1-on-1 Mentorship & Advisory Platform** connecting aspiring software engineers, students, and professionals with verified senior industry mentors for personalized guidance across frontend, backend, AI/ML, system design, and competitive programming.

🔗 **Live Client:** [https://mentor-space-phi.vercel.app](https://mentor-space-phi.vercel.app)  
📡 **Live Backend API:** [https://mentorspace-backend-p9t8.onrender.com](https://mentorspace-backend-p9t8.onrender.com)

---

## 1. Project Overview & Architecture

MentorSpace solves the guidance gap in tech education by providing a structured, secure, and frictionless marketplace for booking 1-on-1 mentorship sessions.

### High-Level Architecture Diagram

```
┌───────────────────────────────────────────────────────────┐
│                   React 18 Single Page App                │
│       (Vite + Tailwind CSS + Lucide Icons + Axios)        │
└───────────────┬───────────────────────────▲───────────────┘
                │ HTTP Requests (REST)      │ JSON Responses
                ▼                           │
┌───────────────────────────────────────────┴───────────────┐
│                 Express.js REST API Server                │
│    ├── JWT Authentication & Role Guards (Student/Mentor)  │
│    ├── Express Rate Limiting & Security Middlewares       │
│    ├── Razorpay SDK & HMAC-SHA256 Signature Verification  │
│    └── Mongoose ORM Layer                                 │
└───────────────┬───────────────────────────▲───────────────┘
                │ Queries & Updates         │ Documents
                ▼                           │
┌───────────────────────────────────────────┴───────────────┐
│                     MongoDB Database                      │
│        (Users, Mentors, Students, Appointments, Payments) │
└───────────────────────────────────────────────────────────┘
```

---

## 2. Core Features & User Workflows

### A. Student / Mentee Experience
- **Domain-Based Mentor Discovery:** Filter mentors across 10+ core tech specializations (React, Node.js, Python, Java, AI/ML, System Design, DevOps, Cloud Architecture, etc.).
- **Rich Mentor Profiles:** View verified experience, industry background, pricing rates, bio, rating metrics, and scheduled availability.
- **Interactive Slot Booking:** Visual calendar picker for selecting available date and time slots with session objective notes.
- **Razorpay Checkout:** Secure in-app checkout with automated order generation and cryptographically verified payment receipts.
- **Student Dashboard:** Manage upcoming and past appointments, access meeting links, and track booking statuses.

### B. Mentor Workspace
- **Mentor Console:** Dedicated dashboard to view incoming session requests with status transitions (`Pending` → `Accepted` / `Completed` / `Rejected`).
- **Availability Management:** Toggle active status, configure weekly availability slots, and set custom pricing.
- **Earnings & Analytics:** Track completed sessions, student feedback, and revenue metrics.

---

## 3. Data Models & Database Schema

The database is structured into 5 core collections with relational references:

```
┌─────────────────┐       1:1       ┌──────────────────┐
│      User       ├─────────────────┤  Mentor/Student  │
│ (Auth & Role)   │                 │ (Role Profiles)  │
└────────┬────────┘                 └────────┬─────────┘
         │                                   │
         │ 1:N                               │ 1:N
┌────────▼────────┐                 ┌────────▼─────────┐
│   Appointment   │◄────────────────┤     Payment      │
│(Booking Status) │                 │(Razorpay Orders) │
└─────────────────┘                 └──────────────────┘
```

1. **User (`userModel.js`)**: Base credentials, email, hashed password (bcrypt), role (`student` | `mentor`), and profile avatar.
2. **Mentor (`mentorModel.js`)**: References `User`, includes bio, company, experience years, domain tags, hourly rate, availability slots, and ratings.
3. **Student (`studentModel.js`)**: References `User`, educational details, career goals, and enrolled appointment IDs.
4. **Appointment (`appointmentModel.js`)**: Tracks session lifecycle between a student and mentor (`status: PENDING | ACCEPTED | COMPLETED | CANCELLED`), date, timeSlot, session notes, and meeting link.
5. **Payment (`paymentModel.js`)**: Records Razorpay `orderId`, `paymentId`, signature hash, amount (INR), currency, and status (`created | captured | failed`).

---

## 4. API Endpoints Specification

### Authentication & User
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new student or mentor | No |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (JWT) |
| `GET` | `/api/user` | Fetch basic user details | Yes (JWT) |

### Mentors & Discovery
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/mentor/all` | List all active mentors with filters | No |
| `GET` | `/api/mentor/:id` | Get detailed mentor profile & slots | No |
| `PUT` | `/api/mentor/profile` | Update mentor bio, pricing, and domains | Yes (Mentor) |

### Appointments & Booking
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/appointment/book` | Book a new mentorship session | Yes (Student) |
| `GET` | `/api/appointment/student` | Get logged-in student's bookings | Yes (Student) |
| `GET` | `/api/appointment/mentor` | Get incoming bookings for mentor | Yes (Mentor) |
| `PATCH` | `/api/appointment/:id/status` | Accept, reject, or complete session | Yes (Mentor/Student) |

### Payments & Razorpay
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/payment/create-order` | Initialize Razorpay payment order | Yes (Student) |
| `POST` | `/api/payment/verify` | Verify HMAC-SHA256 payment signature | Yes (Student) |

---

## 5. Technology Stack

- **Frontend:**
  - React 18 / React 19 (Hooks, Suspense, Lazy Routing)
  - Vite (Fast HMR & Optimized Bundling)
  - React Router v7 (Client-side routing with role-based `ProtectedRoute` wrappers)
  - Tailwind CSS (Modern responsive design system)
  - Lucide React (Clean iconography)
  - Axios (Centralized API client with JWT bearer interceptor)
- **Backend:**
  - Node.js (ES Modules syntax)
  - Express.js (Modular route controllers & middleware architecture)
  - MongoDB & Mongoose (Schema validation, indexes, and document relations)
  - JSON Web Tokens (`jsonwebtoken`) & `bcrypt` password hashing
  - Razorpay Node SDK & Node `crypto` for cryptographic verification
  - `express-rate-limit` for DDoS & brute-force mitigation

---

## 6. Getting Started & Local Development

### Prerequisites
- **Node.js**: `v20.20.2` (use `nvm use 20.20.2`)
- **MongoDB**: Running locally on `mongodb://127.0.0.1:27017` or MongoDB Atlas URI

### 1. Environment Configuration

**Root / Server (`.env`):**
```env
PORT=5001
MONGO_URL=mongodb://127.0.0.1:27017/mentorspace
JWT_SECRET=mentorspace_jwt_secret_key_2026
RAZORPAY_KEY_ID=rzp_test_TImK53NPdBihRw
RAZORPAY_KEY_SECRET=wx3HHLMfmYXPvO9dbxCTILK2
RATE_LIMIT_ENABLED=true
RATE_LIMIT_LOGIN=100:15
RATE_LIMIT_REGISTER=100:15
RATE_LIMIT_PAYMENT=100:15
```

**Client (`client/vite.config.js` or `client/.env`):**
```env
VITE_API_URL=http://localhost:5001/api
VITE_RAZORPAY_KEY_ID=rzp_test_TImK53NPdBihRw
```

---

### 2. Installation & Running

#### Step A: Backend Server (Terminal 1)
```bash
cd server
npm install
npm run seed     # Seeds 15 realistic mentors, students, and profiles
npm start        # Starts server on http://localhost:5001
```

#### Step B: Frontend Client (Terminal 2)
```bash
cd client
npm install
npm run dev      # Starts client on http://localhost:5173 (or 5174)
```

---

## 7. Sample Seed Credentials

All seeded test accounts use the universal password: **`Admin123@`**

| Role | Email | Domain / Description |
|---|---|---|
| **Mentor** | `sarahchen@mentorspace.com` | Frontend / React Senior Engineer |
| **Mentor** | `alexkumar@mentorspace.com` | Backend / Node.js & Distributed Systems |
| **Mentor** | `davidmiller@mentorspace.com` | DevOps & Cloud Infrastructure |
| **Mentor** | `drandrewkim@mentorspace.com` | AI/ML & Computer Vision Specialist |
| **Student** | `rahul@student.com` | CS Student exploring Full-Stack Careers |
| **Student** | `ananya@student.com` | Frontend Engineering Aspirant |

---

## 8. License

Distributed under the ISC License. Designed and developed by **Sasank Reddy**.


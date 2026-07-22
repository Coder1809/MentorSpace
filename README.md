# MentorSpace — Premier 1-on-1 Tech Mentorship Platform

MentorSpace is a modern, two-role mentorship platform connecting students with senior tech mentors for 1-on-1 online sessions across software engineering, system design, AI/ML, DevOps, and competitive programming.

---

## 🌟 Key Features & Architecture

- **Strict 2-Role Security Model**: Platform roles are exclusively **Student** and **Mentor** (No Admin role).
- **Public & Domain-Based Mentor Discovery**: Browse verified mentors across 10 specialized tech domains:
  - React, Node.js, Java, Python, Machine Learning, DevOps, UI/UX, Data Structures, Competitive Programming, and Cloud.
- **Interactive Razorpay Payment Checkout**: Integrated Razorpay order creation (`POST /api/payment/create-order`), interactive popup modal (`new window.Razorpay(options).open()`), and HMAC SHA-256 server signature verification (`POST /api/payment/verify`). Zero transactions are generated on payment cancellation or before verification.
- **Unified Premium Dark Theme**: Built with a sleek midnight slate design system (`#090d16`), glassmorphism cards, glowing status badges, and Google Fonts (`Outfit` for display headings & `Plus Jakarta Sans` for UI).
- **Self-Healing Profile Architecture**: Automated profile creation and recovery for mentor and student accounts via `/api/mentor/profile` and `/api/student`.
- **Student Dashboard**: Book sessions, track scheduled appointments, view verified Razorpay transaction receipts, and manage learning goals.
- **Mentor Console**: Review incoming session requests, accept or reject bookings, update session lifecycle states (`Pending` -> `Accepted` -> `Completed` / `Rejected`), and toggle status availability (`Active` / `Away`).
- **Role-Based Security Guards**: Every protected API route enforces strict role-based access control (`authenticate`, `authorizeStudent`, `authorizeMentor`) returning `401 Unauthorized` and `403 Forbidden` on unauthorized access.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS, Lucide Icons, Zustand, React-Hook-Form, Zod
- **Design System**: Midnight Slate Palette, Glassmorphism, Google Fonts (`Outfit` + `Plus Jakarta Sans`)
- **Backend**: Node.js, Express 5, MongoDB (Mongoose), Crypto (HMAC SHA-256)
- **Security & Payments**: JWT Authentication, Bcrypt Password Hashing, Razorpay SDK

---

## 🚀 Setup & Execution Guide

### 1. Prerequisites
- Node.js (v18+)
- MongoDB running locally on `mongodb://127.0.0.1:27017`

### 2. Environment Variables

Root `.env`:
```env
PORT=8000
MONGO_URL=mongodb://127.0.0.1:27017/mentorspace
JWT_SECRET=mentorspace_jwt_secret_key_2026
RAZORPAY_KEY_ID=rzp_test_dummy_key_id
RAZORPAY_KEY_SECRET=dummy_key_secret
```

Client `.env` (`client/.env`):
```env
VITE_RAZORPAY_KEY_ID=rzp_test_dummy_key_id
```

### 3. Installation & Database Seeding

```bash
# Install dependencies
npm install

# Seed Database with 10 Mentors across 10 domains, 5 Students, sample appointments & transactions
npm run seed

# Run automated 2-role API test suite
npm test
```

### 4. Running the Application

#### Option A: Using 1 Terminal (Recommended ⭐)
```bash
# Runs backend server (port 8000) & frontend Vite app (port 5173) concurrently
npm run dev
```

#### Option B: Using 2 Terminals
- **Terminal 1 (Backend Server)**: `npm run dev:server`
- **Terminal 2 (Frontend Client)**: `npm run dev:client`

---

## 🔑 Default Seed Credentials

Default Password for all sample accounts: **`Admin123@`**

### Mentor Accounts (10 Domains)
| Domain | Email | Password | Status |
|---|---|---|---|
| **React** | `sarahchen@mentorspace.com` | `Admin123@` | Active |
| **Node.js** | `michaelchang@mentorspace.com` | `Admin123@` | Active |
| **Java** | `davidmiller@mentorspace.com` | `Admin123@` | Active |
| **Python** | `elenarostova@mentorspace.com` | `Admin123@` | Active |
| **Machine Learning** | `dr.andrewkim@mentorspace.com` | `Admin123@` | Active |
| **DevOps** | `jameswilson@mentorspace.com` | `Admin123@` | Active |
| **UI/UX** | `emmawatson@mentorspace.com` | `Admin123@` | Active |
| **Data Structures** | `priyasharma@mentorspace.com` | `Admin123@` | Active |
| **Competitive Programming** | `vikrammalhotra@mentorspace.com` | `Admin123@` | Active |
| **Cloud** | `roberttaylor@mentorspace.com` | `Admin123@` | Active |

### Student Accounts (5 Students)
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
- `POST /api/auth/register` — Register new user (`role`: `"student"` or `"mentor"`)
- `POST /api/auth/login` — Login user (returns JWT token containing `userId` and `role`)
- `POST /api/auth/logout` — Logout user

### User (`/api/user`)
- `GET /api/user` — Get authenticated user details (`authenticate` middleware)

### Mentors (`/api/mentor`)
- `GET /api/mentor` — List all active tech mentors (Public)
- `GET /api/mentor/:id` — Get single mentor details (Public)
- `GET /api/mentor/profile` — Self mentor profile details (`authenticate`, `authorizeMentor`)
- `PUT /api/mentor/profile` — Update self mentor profile & availability (`authenticate`, `authorizeMentor`)
- `PUT /api/mentor/:id` — Update mentor profile by ID (`authenticate`, `authorizeMentor`)

### Students (`/api/student`)
- `GET /api/student` — Get student profile (`authenticate`, `authorizeStudent`)
- `POST /api/student` — Upsert student profile (`authenticate`, `authorizeStudent`)

### Appointments (`/api/appointment`)
- `GET /api/appointment` — Get appointments for logged-in user (`authenticate`)
- `POST /api/appointment` — Book session (`authenticate`, `authorizeStudent`)
- `PUT /api/appointment/:id` — Update appointment status (`authenticate`, `authorizeMentor`)

### Payments (`/api/payment`)
- `POST /api/payment/create-order` — Create Razorpay order (`authenticate`, `authorizeStudent`)
- `POST /api/payment/verify` — Verify Razorpay HMAC signature & create appointment (`authenticate`, `authorizeStudent`)
- `GET /api/payment` — Get payment transaction history (`authenticate`)

---

## 🧪 Automated Testing & Production Build

Run the automated 2-role system test suite:
```bash
npm test
```
The test suite validates registration, login, JWT verification, self-healing profile endpoints, public mentor listing, Razorpay order creation, HMAC payment signature verification, appointment status lifecycle, and `403 Forbidden` security blocks.

Build the client bundle for production:
```bash
npm run build
```

---

## 📄 License
ISC License

# MentorSpace — Premier 1-on-1 Tech Mentorship Platform

MentorSpace is a modern, two-role mentorship platform connecting students with senior tech mentors for 1-on-1 online sessions across software engineering, system design, AI/ML, DevOps, and competitive programming.

🔗 **Live Link:** [https://mentor-space-phi.vercel.app/](https://mentor-space-phi.vercel.app/)

---

## 🌟 Key Features

- **Strict 2-Role Security Model** — Platform access is exclusively partitioned for **Student** and **Mentor** workspaces with role-based JWT authorization guards (`authenticate`, `authorizeStudent`, `authorizeMentor`).
- **Domain-Based Mentor Discovery** — Filter and search verified tech mentors across 10 specialized engineering domains (React, Node.js, Java, Python, ML, DevOps, UI/UX, Data Structures, Competitive Programming, Cloud).
- **HMAC SHA-256 Verified Payments** — Server-side Razorpay order creation (`POST /api/payment/create-order`) and HMAC SHA-256 digital signature verification (`POST /api/payment/verify`) with digital transaction receipt generation.
- **Interactive 2-Step Booking Flow** — Date selection calendar with visual date highlighting, time-slot scheduling (Morning/Afternoon/Evening), and goal description validation.
- **Mentor Console & Session Lifecycle** — Real-time session request management (`Pending` → `Accepted` → `Completed` / `Rejected`) and availability toggles.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite 6, Tailwind CSS, Lucide Icons, Axios
- **Backend:** Node.js (v20.20.2), Express 5, MongoDB (Mongoose 8), Crypto (HMAC SHA-256)
- **Security & Payments:** JWT Authentication, Password Hashing, Razorpay SDK integration

---

## 🚀 Setup & Detailed Execution Guide

### 1. Prerequisites
- **Node.js**: Version `20.20.2` (use `nvm use 20.20.2`)
- **MongoDB**: Running locally at `mongodb://127.0.0.1:27017` or a valid MongoDB Atlas URI
- **Git**: Installed on your system

---

### 2. Environment Variables Setup

#### Root / Server Environment Variables (`.env` or `server/.env`)
Create a `.env` file in the root directory:
```env
PORT=8000
MONGO_URL=mongodb://127.0.0.1:27017/mentorspace
JWT_SECRET=mentorspace_jwt_secret_key_2026
RAZORPAY_KEY_ID=rzp_test_TImK53NPdBihRw
RAZORPAY_KEY_SECRET=wx3HHLMfmYXPvO9dbxCTILK2
RATE_LIMIT_ENABLED=true
```

#### Client Environment Variables (`client/.env`)
Create a `.env` file inside the `client` directory:
```env
VITE_RAZORPAY_KEY_ID=rzp_test_TImK53NPdBihRw
```

---

### 3. Step-by-Step Installation & Execution

```bash
# Clone and navigate to project root
cd MentorSpace

# Use Node v20.20.2
nvm use 20.20.2

# Install root & workspace dependencies
npm install

# Seed Database with 10 Mentors across 10 domains & sample student accounts
npm run seed

# Start Express backend (port 8000) & Vite frontend (port 5173) concurrently
npm run dev
```

---

### 4. Default Seed Credentials
Default Password for all sample accounts: **`Admin123@`**

- **Sample Mentor Email:** `sarahchen@mentorspace.com` (React Domain)
- **Sample Student Email:** `rahul@student.com`

---

## 📡 API Endpoints Summary

| Module | Endpoint | Description |
|--------|----------|-------------|
| Auth | `POST /api/auth/register` | Register new user with role (`student` or `mentor`) |
| Auth | `POST /api/auth/login` | Login user and retrieve JWT token |
| Mentors | `GET /api/mentor` | List all active mentors by domain |
| Mentors | `GET /api/mentor/:id` | Get detailed mentor profile |
| Appointments | `POST /api/appointment` | Book 1-on-1 mentorship session |
| Appointments | `PUT /api/appointment/:id` | Update session status (`accepted`, `completed`, `rejected`) |
| Payments | `POST /api/payment/create-order` | Generate Razorpay order ID |
| Payments | `POST /api/payment/verify` | Verify HMAC SHA-256 signature and issue digital receipt |

---

## 📄 License
ISC License

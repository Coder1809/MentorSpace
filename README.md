# MentorSpace

A 1-on-1 mentorship platform connecting students with senior tech mentors for online guidance sessions across engineering, AI/ML, system design, and competitive programming.

🔗 **Live Application:** [https://mentor-space-phi.vercel.app](https://mentor-space-phi.vercel.app)  
📡 **Backend API:** [https://mentorspace-backend-p9t8.onrender.com](https://mentorspace-backend-p9t8.onrender.com)

---

## Features

- **2-Role Architecture**: Distinct student and mentor workspaces with role-based JWT authorization guards.
- **Domain Discovery**: Filter mentors across 10 engineering domains (React, Node.js, Java, Python, ML, DevOps, etc.).
- **Interactive Booking**: 2-step booking flow with visual calendar selection, time slot scheduling, and reason inputs.
- **Razorpay Payments**: Server-side order creation and HMAC SHA-256 digital signature verification with receipts.
- **Mentor Console**: Manage incoming appointment requests (`Pending` → `Accepted` / `Completed` / `Rejected`) and availability toggles.

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, Axios, React Hook Form, Zod
- **Backend:** Node.js, Express 5, MongoDB (Mongoose), Razorpay SDK, Crypto (HMAC SHA-256), JWT
- **Hosting:** MongoDB Atlas, Vercel (Frontend), Render (Backend)

---

## Default Seed Test Accounts

Default password for all sample accounts: **`Admin123@`**

- **Mentor:** `sarahchen@mentorspace.com` (React Domain)
- **Mentor:** `alexkumar@mentorspace.com` (Backend Domain)
- **Student:** `rahul@student.com`

---

## Getting Started

### Prerequisites
- Node.js (`v20.20.2`)
- MongoDB running locally or a MongoDB Atlas URI
- Git

### 1. Environment Variables

**Server (`.env`):**
```env
PORT=8000
MONGO_URL=mongodb://127.0.0.1:27017/mentorspace
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RATE_LIMIT_ENABLED=true
```

**Client (`client/.env`):**
```env
VITE_API_URL=http://localhost:8000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

### 2. Run Locally

```bash
# Install dependencies
npm install

# Seed database with sample mentors and tracks
npm run seed

# Run backend (port 8000) and frontend (port 5173) concurrently
npm run dev
```

App runs at `http://localhost:5173`.

---

## API Summary

- `POST /api/auth/register` — Register student or mentor
- `POST /api/auth/login` — Login user & return JWT token
- `GET /api/user` — Get authenticated user details
- `GET /api/mentor` — List active mentors
- `GET /api/mentor/:id` — Get mentor profile
- `POST /api/appointment` — Book mentorship appointment
- `PUT /api/appointment/:id` — Update appointment status
- `GET /api/services` — List structured tracks
- `POST /api/payment/create-order` — Create Razorpay order
- `POST /api/payment/verify` — Verify HMAC signature & issue receipt

---

## License

ISC License

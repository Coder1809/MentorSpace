import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Lazy load page components
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const SignupPage = React.lazy(() => import("./pages/SignupPage"));
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const Home = React.lazy(() => import("./pages/Home"));
const Profile = React.lazy(() => import("./pages/Account"));
const SidebarLayout = React.lazy(() => import("./components/SidebarLayout"));
const ProtectedRoute = React.lazy(() => import("./components/ProtectedRoute"));
const Mentors = React.lazy(() => import("./pages/Mentors"));
const Support = React.lazy(() => import("./pages/Support"));
const Services = React.lazy(() => import("./pages/Services"));
const Transactions = React.lazy(() => import("./pages/Transactions"));

// Mentor nested pages
const MentorHome = React.lazy(() => import("./pages/mentor/MentorHome"));
const MentorAppointments = React.lazy(
  () => import("./pages/mentor/Appointments")
);
const Error = React.lazy(() => import("./pages/Error"));

// Loading component with spinner
const LoadingSpinner = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f8fafc",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: "50px",
          height: "50px",
          border: "4px solid #e2e8f0",
          borderTop: "4px solid #4f46e5",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
          margin: "0 auto 16px",
        }}
      />
      <p style={{ color: "#475569", fontSize: "14px", fontWeight: "600" }}>
        Loading MentorSpace...
      </p>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  </div>
);

const App = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Student-only routes */}
        <Route
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute roles={["student"]}>
                <SidebarLayout />
              </ProtectedRoute>
            </Suspense>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/services" element={<Services />} />
          <Route path="/transactions" element={<Transactions />} />
        </Route>

        {/* Protected Mentor-only routes */}
        <Route
          path="/mentor"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute roles={["mentor"]}>
                <SidebarLayout />
              </ProtectedRoute>
            </Suspense>
          }
        >
          <Route path="" element={<MentorHome />} />
          <Route path="appointments" element={<MentorAppointments />} />
        </Route>

        {/* Protected Dual-role routes (Accessible by both Student and Mentor) */}
        <Route
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProtectedRoute roles={["student", "mentor"]}>
                <SidebarLayout />
              </ProtectedRoute>
            </Suspense>
          }
        >
          <Route path="/account" element={<Profile />} />
          <Route path="/support" element={<Support />} />
        </Route>

        {/* Public auth & error routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </Suspense>
  );
};

export default App;

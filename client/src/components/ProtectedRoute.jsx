import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { api } from "@/utils/api";
import { useUserStore } from "@/store/userStore";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children, roles = [] }) => {
  const [status, setStatus] = useState({ loading: true, allowed: false });
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setStatus({ loading: false, allowed: false });
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get("/user");
        const user = res.data.data;

        if (user) {
          setUser({ name: user.name, role: user.role, email: user.email });
          localStorage.setItem("role", user.role);
        }

        if (roles.length === 0 || roles.includes(user.role)) {
          setStatus({ loading: false, allowed: true });
        } else {
          setStatus({ loading: false, allowed: false });
        }
      } catch (err) {
        setStatus({ loading: false, allowed: false });
      }
    };

    verify();
  }, [roles, setUser]);

  if (status.loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-background text-foreground">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-600 mb-3" />
        <p className="text-sm font-semibold text-slate-500">Restoring your session...</p>
      </div>
    );
  }

  if (!status.allowed) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;

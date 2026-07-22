import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { api } from "@/utils/api";
import { useUserStore } from "@/store/userStore";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, GraduationCap, ArrowLeft } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verify, setVerify] = useState(true);

  const setUser = useUserStore((state) => state.setUser);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.data.role);
      setUser(res.data.data);
      toast.success("Login Successful!");
      if (res.data.data.role === "mentor") {
        navigate("/mentor", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          err.message ||
          "Login Failed",
        { theme: "dark" }
      );
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setVerify(false);

      try {
        const res = await api.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = res.data.data;
        setUser(userData);
        localStorage.setItem("role", userData.role);

        if (location.pathname === "/login") {
          if (userData.role === "mentor") {
            navigate("/mentor", { replace: true });
          } else {
            navigate("/home", { replace: true });
          }
        }
      } catch {
        setVerify(false);
      }
    };

    verifyToken();
  }, [navigate, location.pathname, setUser]);

  if (verify) return null;

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#090d16] text-slate-100 selection:bg-indigo-500">
      <div className="absolute top-6 left-6 z-50">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-300 hover:text-white hover:bg-white/5 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="glass-card border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <CardContent className="p-0 space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-white">Welcome Back</h1>
              <p className="text-sm text-slate-400">Sign in to your MentorSpace account</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-semibold">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="student@mentorspace.io"
                          className="bg-slate-900/60 border-white/10 text-white rounded-xl h-11 focus:border-indigo-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-semibold">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          className="bg-slate-900/60 border-white/10 text-white rounded-xl h-11 focus:border-indigo-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full btn-gradient font-bold h-12 rounded-xl text-base mt-2"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center text-sm text-slate-400 pt-2">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-indigo-400 hover:underline font-bold">
                    Sign up
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <ToastContainer limit={4} theme="dark" />
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { api } from "@/utils/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, GraduationCap, ArrowLeft, UserCheck } from "lucide-react";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    cnfpass: z.string().min(6),
    role: z.enum(["student", "mentor"]).default("student"),
  })
  .refine((data) => data.password === data.cnfpass, {
    message: "Passwords do not match",
    path: ["cnfpass"],
  });

export default function SignupPage() {
  const navigate = useNavigate();
  const [verify, setVerify] = useState(true);

  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      cnfpass: "",
      role: "student",
    },
  });

  const selectedRole = form.watch("role");

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/register", data);
      navigate("/login", {
        state: { message: "Registration successful! Please log in to continue." },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          err.message ||
          "Registration Failed",
        { theme: "dark" }
      );
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setVerify(false);

      try {
        await api.get("/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        navigate("/home", { replace: true });
      } catch {
        setVerify(false);
      }
    };

    verifyToken();
  }, [navigate]);

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

      <div className="w-full max-w-lg relative z-10 my-8">
        <Card className="glass-card border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          <CardContent className="p-0 space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-white">Create Account</h1>
              <p className="text-sm text-slate-400">Join MentorSpace as a Student or Tech Mentor</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Role Selector Tabs */}
                <div className="space-y-2">
                  <FormLabel className="text-slate-300 font-semibold">Select Account Role</FormLabel>
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-900/80 rounded-2xl border border-white/10">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => form.setValue("role", "student")}
                      className={`rounded-xl font-bold py-2.5 ${
                        selectedRole === "student"
                          ? "bg-indigo-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      🎓 Student
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => form.setValue("role", "mentor")}
                      className={`rounded-xl font-bold py-2.5 ${
                        selectedRole === "mentor"
                          ? "bg-purple-600 text-white shadow-md"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      ⚡ Tech Mentor
                    </Button>
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-semibold">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Alex Morgan"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 font-semibold">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="alex@example.com"
                          className="bg-slate-900/60 border-white/10 text-white rounded-xl h-11 focus:border-indigo-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <FormField
                    control={form.control}
                    name="cnfpass"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 font-semibold">Confirm Password</FormLabel>
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
                </div>

                <Button
                  type="submit"
                  className="w-full btn-gradient font-bold h-12 rounded-xl text-base mt-2"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Creating Account...
                    </>
                  ) : (
                    `Register as ${selectedRole === "mentor" ? "Mentor" : "Student"}`
                  )}
                </Button>

                <div className="text-center text-sm text-slate-400 pt-2">
                  Already have an account?{" "}
                  <Link to="/login" className="text-indigo-400 hover:underline font-bold">
                    Sign in
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

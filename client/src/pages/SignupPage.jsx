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
import { Loader2, GraduationCap, ArrowLeft } from "lucide-react";

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
    username: z.string().min(3, "Full Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    cnfpass: z.string().min(6, "Confirm password is required"),
    role: z.enum(["student", "mentor"]).default("student"),
    // Optional / Mentor specific fields
    title: z.string().optional(),
    specialization: z.string().optional(),
    skills: z.string().optional(),
    experience: z.string().optional(),
    company: z.string().optional(),
    bio: z.string().optional(),
    sessionFee: z.coerce.number().optional(),
    languages: z.string().optional(),
    availability: z.string().optional(),
    profilePhoto: z.string().optional(),
    linkedin: z.string().optional(),
  })
  .refine((data) => data.password === data.cnfpass, {
    message: "Passwords do not match",
    path: ["cnfpass"],
  })
  .refine(
    (data) => {
      if (data.role === "mentor") {
        return (
          !!data.title?.trim() &&
          !!data.specialization?.trim() &&
          !!data.experience?.trim() &&
          !!data.bio?.trim()
        );
      }
      return true;
    },
    {
      message: "Please complete required mentor profile information",
      path: ["specialization"],
    }
  );

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
      title: "",
      specialization: "",
      skills: "",
      experience: "",
      company: "",
      bio: "",
      sessionFee: 1499,
      languages: "English",
      availability: "Weekdays 6 PM - 9 PM",
      profilePhoto: "",
      linkedin: "",
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
        { theme: "light" }
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
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#FAFBF8] text-[#1F2937] selection:bg-[#4CAF7D]">
      <div className="absolute top-6 left-6 z-50">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 text-gray-600 hover:text-[#1F2937] hover:bg-[#DDF4E7]/40 font-semibold">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="w-full max-w-lg relative z-10 my-8">
        <Card className="sage-card border border-[#E5E7EB] rounded-3xl p-8 shadow-xl space-y-6 bg-white">
          <CardContent className="p-0 space-y-6">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 bg-[#4CAF7D] rounded-2xl flex items-center justify-center shadow-md shadow-[#4CAF7D]/20">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-extrabold text-[#1F2937]">Create Account</h1>
              <p className="text-sm text-gray-600">Join MentorSpace as a Student or Tech Mentor</p>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Role Selector Tabs */}
                <div className="space-y-2">
                  <FormLabel className="text-gray-700 font-semibold">Select Account Role</FormLabel>
                  <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#FAFBF8] rounded-2xl border border-[#E5E7EB]">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => form.setValue("role", "student")}
                      className={`rounded-xl font-bold py-2.5 ${
                        selectedRole === "student"
                          ? "bg-[#4CAF7D] text-white shadow-md"
                          : "text-gray-600 hover:text-[#1F2937] hover:bg-[#DDF4E7]/40"
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
                          ? "bg-[#2e7d52] text-white shadow-md"
                          : "text-gray-600 hover:text-[#1F2937] hover:bg-[#DDF4E7]/40"
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
                      <FormLabel className="text-gray-700 font-semibold">Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Alex Morgan"
                          className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-11 focus:border-[#4CAF7D]"
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
                      <FormLabel className="text-gray-700 font-semibold">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="alex@example.com"
                          className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-11 focus:border-[#4CAF7D]"
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
                        <FormLabel className="text-gray-700 font-semibold">Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-11 focus:border-[#4CAF7D]"
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
                        <FormLabel className="text-gray-700 font-semibold">Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-11 focus:border-[#4CAF7D]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Mentor Profile Fields */}
                {selectedRole === "mentor" && (
                  <div className="space-y-4 pt-3 border-t border-[#E5E7EB] animate-in fade-in-50 duration-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2e7d52] uppercase tracking-wider">
                      <span>⚡ Tech Mentor Professional Details</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-xs">
                              Professional Title
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Senior Tech Lead"
                                className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-10 text-sm focus:border-[#4CAF7D]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-xs">
                              Company / Organization
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Google / Microsoft / FAANG"
                                className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-10 text-sm focus:border-[#4CAF7D]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-xs">
                              Primary Specialization
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. React / Node.js / System Design"
                                className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-10 text-sm focus:border-[#4CAF7D]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="experience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-xs">
                              Years of Experience
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. 6+ years"
                                className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-10 text-sm focus:border-[#4CAF7D]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-xs">
                              Key Skills (comma separated)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="React, Node.js, System Design, DSA"
                                className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-10 text-sm focus:border-[#4CAF7D]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sessionFee"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-xs">
                              Session Fee (₹)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="1499"
                                className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-10 text-sm focus:border-[#4CAF7D]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="languages"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-xs">
                              Languages Spoken
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="English, Hindi"
                                className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-10 text-sm focus:border-[#4CAF7D]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="availability"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-xs">
                              Availability Schedule
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Weekdays 6 PM - 9 PM"
                                className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-10 text-sm focus:border-[#4CAF7D]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-semibold text-xs">
                            Bio / About Yourself
                          </FormLabel>
                          <FormControl>
                            <textarea
                              placeholder="Share your technical background, mentoring approach, and how you assist students..."
                              className="w-full bg-[#FAFBF8] border border-[#E5E7EB] text-[#1F2937] rounded-xl p-3 text-sm min-h-[80px] focus:outline-none focus:border-[#4CAF7D]"
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
                        name="profilePhoto"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-xs">
                              Profile Photo URL (optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/avatar.jpg"
                                className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-10 text-sm focus:border-[#4CAF7D]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-semibold text-xs">
                              LinkedIn Profile (optional)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://linkedin.com/in/username"
                                className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl h-10 text-sm focus:border-[#4CAF7D]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full btn-sage font-bold h-12 rounded-xl text-base mt-2"
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

                <div className="text-center text-sm text-gray-600 pt-2">
                  Already have an account?{" "}
                  <Link to="/login" className="text-[#2e7d52] hover:underline font-bold">
                    Sign in
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <ToastContainer limit={4} theme="light" />
    </div>
  );
}

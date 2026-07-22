import { api } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  UserCog,
  Award,
  UsersRound,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const Home = () => {
  const [details, setDetails] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [totalMentorsCount, setTotalMentorsCount] = useState(0);
  const [totalSessionsCount, setTotalSessionsCount] = useState(0);
  const [showNoStudentAlert, setShowNoStudentAlert] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/student");
        setDetails(res.data.data);

        const [appointmentsRes, mentorsRes] = await Promise.all([
          api.get("/appointment"),
          api.get("/mentor"),
        ]);

        const allAppointments = appointmentsRes.data.data || [];
        setTotalSessionsCount(allAppointments.length);
        setTotalMentorsCount((mentorsRes.data.data || []).length);

        const pendingAppointments = allAppointments.filter(
          (appointment) => appointment.status === "Pending" || appointment.status === "Accepted"
        );
        setNextAppointment(pendingAppointments[0]);
      } catch (err) {
        setShowNoStudentAlert(true);
      }
    };

    checkUser();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {showNoStudentAlert && (
        <Alert className="sage-card border-[#4CAF7D]/40 text-[#1F2937] rounded-3xl p-6 bg-white">
          <Info className="h-5 w-5 text-[#4CAF7D] shrink-0" />
          <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <AlertTitle className="font-bold text-base text-[#1F2937]">
                Student Profile Activation Required
              </AlertTitle>
              <AlertDescription className="text-sm text-gray-600">
                Complete your student profile preferences to discover recommended mentors and book live 1-on-1 sessions.
              </AlertDescription>
            </div>
            <Link to="/account">
              <Button className="btn-sage font-bold rounded-xl shrink-0">
                Complete Profile Now
              </Button>
            </Link>
          </div>
        </Alert>
      )}

      {details && (
        <>
          {/* Hero Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-[#DDF4E7] p-8 sm:p-10 border border-[#4CAF7D]/30 shadow-sm">
            <div className="relative z-10 space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#4CAF7D]/30 text-[#2e7d52] text-xs font-bold tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                Student Mentorship Workspace
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1F2937]">
                Welcome back, <span className="gradient-text-sage">{details.name || "Student"}</span> 👋
              </h1>

              <p className="text-gray-700 text-base sm:text-lg font-medium leading-relaxed">
                Connect 1-on-1 with senior engineers from top tech companies for code reviews, mock interviews, system design, and career roadmap planning.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link to="/mentors">
                  <Button className="btn-sage font-bold px-6 py-3 rounded-2xl flex items-center gap-2 text-base">
                    Find a Mentor <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button variant="outline" className="border-[#4CAF7D]/40 bg-white hover:bg-[#FAFBF8] text-[#1F2937] font-bold px-6 py-3 rounded-2xl text-base shadow-sm">
                    Mentorship Tracks
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Metric Overview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB]">
              <CardContent className="p-0 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Verified Mentors</p>
                  <h3 className="text-3xl font-extrabold text-[#1F2937] mt-1">{totalMentorsCount || 12}</h3>
                  <span className="text-xs text-[#2e7d52] font-semibold flex items-center gap-1 mt-1">
                    <Zap className="w-3.5 h-3.5 text-[#4CAF7D]" /> Across 10 Tech Domains
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#DDF4E7] border border-[#4CAF7D]/30 text-[#2e7d52] flex items-center justify-center font-bold">
                  <UsersRound className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB]">
              <CardContent className="p-0 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Booked Sessions</p>
                  <h3 className="text-3xl font-extrabold text-[#1F2937] mt-1">{totalSessionsCount}</h3>
                  <span className="text-xs text-[#2e7d52] font-semibold flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#4CAF7D]" /> Signature Verified
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#DDF4E7] border border-[#4CAF7D]/30 text-[#2e7d52] flex items-center justify-center font-bold">
                  <CalendarDays className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB]">
              <CardContent className="p-0 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Session Format</p>
                  <h3 className="text-2xl font-extrabold text-[#1F2937] mt-1">1-on-1 Live</h3>
                  <span className="text-xs text-[#2e7d52] font-semibold flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5 text-[#4CAF7D]" /> 45 - 60 mins duration
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#DDF4E7] border border-[#4CAF7D]/30 text-[#2e7d52] flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB]">
              <CardContent className="p-0 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Student Profile</p>
                  <h3 className="text-2xl font-extrabold text-[#2e7d52] mt-1">Active</h3>
                  <span className="text-xs text-gray-500 font-semibold truncate block max-w-[140px] mt-1">
                    {details.email}
                  </span>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] flex items-center justify-center font-bold">
                  <UserCog className="w-6 h-6" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB] group">
              <Link to="/mentors" className="flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#4CAF7D] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <UsersRound className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-xl text-[#1F2937]">Find Mentors</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Browse verified mentors across React, Node.js, System Design, AI/ML, and DSA.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-[#2e7d52] font-bold text-sm group-hover:gap-2 transition-all">
                  Browse Directory <ArrowRight className="ml-1 w-4 h-4" />
                </div>
              </Link>
            </Card>

            <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB] group">
              <Link to="/services" className="flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#2e7d52] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-xl text-[#1F2937]">Mentorship Tracks</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Explore curated mock interview tracks, architecture audits, and resume review packages.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-[#2e7d52] font-bold text-sm group-hover:gap-2 transition-all">
                  View Tracks <ArrowRight className="ml-1 w-4 h-4" />
                </div>
              </Link>
            </Card>

            <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB] group">
              <Link to="/account" className="flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#10B981] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                    <UserCog className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-xl text-[#1F2937]">Profile & History</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Update student preferences, tech stack goals, and review past booked sessions.
                  </p>
                </div>
                <div className="pt-2 flex items-center text-[#2e7d52] font-bold text-sm group-hover:gap-2 transition-all">
                  Manage Account <ArrowRight className="ml-1 w-4 h-4" />
                </div>
              </Link>
            </Card>
          </div>

          {/* Upcoming Session Highlight */}
          {nextAppointment && (
            <Card className="sage-card rounded-3xl p-6 sm:p-8 border border-[#4CAF7D]/30 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E5E7EB] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4CAF7D] text-white flex items-center justify-center font-bold">
                    <CalendarDays className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-[#1F2937]">Upcoming Mentorship Session</h3>
                    <p className="text-xs text-gray-500">Scheduled 1-on-1 Session</p>
                  </div>
                </div>
                <Badge className="badge-mint px-3.5 py-1 text-xs font-bold rounded-full">
                  {nextAppointment.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Mentor</p>
                  <p className="font-bold text-[#1F2937] flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-[#4CAF7D] shrink-0" />
                    {nextAppointment.mentorID?.name || "Mentor"}
                  </p>
                  <p className="text-xs text-[#2e7d52] font-medium">
                    {nextAppointment.mentorID?.specialization || "Tech Mentor"}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</p>
                  <p className="font-bold text-[#1F2937] flex items-center gap-1.5">
                    <CalendarDays className="h-4 w-4 text-[#4CAF7D] shrink-0" />
                    {format(new Date(nextAppointment.date), "dd MMM yyyy")}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Time Slot</p>
                  <p className="font-bold text-[#1F2937] flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#4CAF7D] shrink-0" />
                    {nextAppointment.timeSlot}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Goal / Topic</p>
                  <p className="font-bold text-[#1F2937] flex items-center gap-1.5 truncate">
                    <Award className="h-4 w-4 text-[#F59E0B] shrink-0" />
                    {nextAppointment.reason}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import {
  CalendarCheck,
  Code,
  CheckCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  User,
} from "lucide-react";

const MentorHome = () => {
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [mentorProfile, setMentorProfile] = useState(null);

  const fetchMentorData = async () => {
    try {
      const [apptsRes, profileRes] = await Promise.all([
        api.get("/appointment"),
        api.get("/mentor/profile"),
      ]);
      const appts = apptsRes.data.data || [];
      setAppointmentsCount(appts.length);
      setPendingCount(appts.filter((a) => a.status === "Pending").length);
      setMentorProfile(profileRes.data.data);
    } catch (err) {
      console.error("Error fetching mentor dashboard data", err);
    }
  };

  useEffect(() => {
    fetchMentorData();
  }, []);

  const toggleStatus = async () => {
    if (!mentorProfile) return;
    const nextStatus = mentorProfile.status === "Active" ? "Away" : "Active";
    try {
      const res = await api.put("/mentor/profile", {
        ...mentorProfile,
        status: nextStatus,
      });
      setMentorProfile(res.data.data);
      toast.success(`Availability status updated to ${nextStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#DDF4E7] p-8 sm:p-10 border border-[#4CAF7D]/30 shadow-sm">
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#4CAF7D]/30 text-[#2e7d52] text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            Verified Mentor Workspace
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1F2937]">
            Welcome back, <span className="gradient-text-sage">{mentorProfile?.name || "Mentor"}</span> 👋
          </h1>
          <p className="text-gray-700 text-base sm:text-lg max-w-2xl font-medium leading-relaxed">
            Review student booking requests, manage session approvals, and guide emerging engineers in 1-on-1 mentorship sessions.
          </p>
          <div className="pt-2 flex flex-wrap gap-4">
            <Link to="/mentor/appointments">
              <Button className="btn-sage font-bold px-6 py-3 rounded-2xl flex items-center gap-2 text-base">
                View Booking Requests ({pendingCount} Pending) <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/account">
              <Button variant="outline" className="border-[#4CAF7D]/40 bg-white hover:bg-[#FAFBF8] text-[#1F2937] font-bold px-6 py-3 rounded-2xl text-base shadow-sm">
                Edit Profile & Specialization
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB]">
          <Link to="/mentor/appointments">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Bookings</p>
                <h3 className="text-3xl font-extrabold text-[#D97706] mt-1">{pendingCount}</h3>
                <span className="text-xs text-[#2e7d52] font-bold flex items-center gap-1 mt-1">
                  Review requests <ArrowRight className="w-3 h-3" />
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB]">
          <Link to="/mentor/appointments">
            <CardContent className="p-0 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Scheduled Sessions</p>
                <h3 className="text-3xl font-extrabold text-[#1F2937] mt-1">{appointmentsCount}</h3>
                <span className="text-xs text-[#2e7d52] font-bold flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Total Managed
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#DDF4E7] border border-[#4CAF7D]/30 text-[#2e7d52] flex items-center justify-center font-bold">
                <CalendarCheck className="w-6 h-6" />
              </div>
            </CardContent>
          </Link>
        </Card>

        <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB]">
          <CardContent className="p-0 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Availability Status</p>
              <h3 className={`text-2xl font-extrabold mt-1 ${mentorProfile?.status === "Active" ? "text-[#2e7d52]" : "text-red-600"}`}>
                {mentorProfile?.status || "Active"}
              </h3>
              <button
                onClick={toggleStatus}
                className="text-xs text-[#4CAF7D] font-bold hover:underline mt-1 block"
              >
                Switch to {mentorProfile?.status === "Active" ? "Away" : "Active"}
              </button>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-[#DDF4E7] border border-[#4CAF7D]/30 text-[#2e7d52] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shortcut Tools */}
      <div className="space-y-4">
        <h2 className="text-2xl font-extrabold text-[#1F2937]">Mentor Console Controls</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB] group">
            <Link to="/mentor/appointments" className="space-y-3 block">
              <div className="w-12 h-12 rounded-2xl bg-[#4CAF7D] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <CalendarCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#1F2937]">Session Approvals</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Review student requests, accept scheduled session slots, or mark sessions completed.
              </p>
              <span className="text-xs text-[#2e7d52] font-bold flex items-center gap-1 pt-2">
                Open Requests <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </Card>

          <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB] group">
            <Link to="/account" className="space-y-3 block">
              <div className="w-12 h-12 rounded-2xl bg-[#2e7d52] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#1F2937]">Profile Settings</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Update your tech specialization (React, Node, System Design, ML), bio, and experience.
              </p>
              <span className="text-xs text-[#2e7d52] font-bold flex items-center gap-1 pt-2">
                Edit Profile <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </Card>

          <Card className="sage-card sage-card-hover rounded-3xl p-6 border border-[#E5E7EB] group">
            <Link to="/mentor/appointments" className="space-y-3 block">
              <div className="w-12 h-12 rounded-2xl bg-[#10B981] text-white flex items-center justify-center font-bold group-hover:scale-110 transition-transform">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-[#1F2937]">Completed Sessions</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Track conducted sessions and maintain a complete log of guided 1-on-1 interactions.
              </p>
              <span className="text-xs text-[#2e7d52] font-bold flex items-center gap-1 pt-2">
                View History <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MentorHome;

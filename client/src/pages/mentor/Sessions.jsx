import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  FileText,
  UserCircle2,
  Loader2,
  CheckCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointment");
      const all = res.data.data || [];
      // Filter to Accepted + Completed only (not Pending, not Rejected)
      const filtered = all.filter(
        (a) => a.status === "Accepted" || a.status === "Completed"
      );
      setSessions(filtered);
    } catch (err) {
      console.error("Failed to fetch sessions", err);
      toast.error("Error loading sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleMarkComplete = async (id) => {
    try {
      await api.put(`/appointment/${id}`, { status: "Completed" });
      toast.success("Session marked as Completed");
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update session");
    }
  };

  const handleCancel = async (id) => {
    try {
      await api.put(`/appointment/${id}`, { status: "Cancelled" });
      toast.success("Session cancelled");
      fetchSessions();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel session");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-mint text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
          Session Management
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937]">
          Upcoming & <span className="gradient-text-sage">Completed Sessions</span>
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage accepted mentorship sessions and track completed session history.
        </p>
      </div>

      {/* Session Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-[#4CAF7D]" />
              <p className="text-gray-500 font-bold text-sm">Loading sessions...</p>
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="col-span-full text-center py-16 sage-card rounded-3xl border border-[#E5E7EB] space-y-2 bg-white">
            <CalendarDays className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="font-bold text-lg text-[#1F2937]">No sessions yet</h3>
            <p className="text-gray-500 text-sm">
              Accepted and completed mentorship sessions will appear here.
            </p>
          </div>
        ) : (
          sessions.map((appt) => (
            <Card
              key={appt._id}
              className="sage-card sage-card-hover rounded-3xl border border-[#E5E7EB] flex flex-col justify-between overflow-hidden bg-white"
            >
              <CardHeader className="flex flex-row items-center justify-between gap-2 p-6 border-b border-[#E5E7EB] bg-[#FAFBF8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#4CAF7D] text-white flex items-center justify-center font-extrabold shadow-md">
                    <UserCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-extrabold text-[#1F2937]">
                      {appt.studentID?.name || "Student"}
                    </CardTitle>
                    <p className="text-xs text-gray-500 font-medium">Mentorship Student</p>
                  </div>
                </div>
                <Badge
                  className={`font-bold px-3 py-1 text-xs rounded-full ${
                    appt.status === "Completed"
                      ? "badge-mint"
                      : "bg-[#DDF4E7] text-[#2e7d52] border border-[#4CAF7D]/30"
                  }`}
                >
                  {appt.status}
                </Badge>
              </CardHeader>

              <CardContent className="p-6 text-xs space-y-3.5">
                <div className="flex items-center gap-2.5 text-gray-700">
                  <CalendarDays className="w-4 h-4 text-[#4CAF7D] shrink-0" />
                  <p>
                    <span className="font-bold text-[#1F2937]">Date:</span>{" "}
                    {format(new Date(appt.date), "dd MMM yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 text-gray-700">
                  <Clock className="w-4 h-4 text-[#2e7d52] shrink-0" />
                  <p>
                    <span className="font-bold text-[#1F2937]">Timeslot:</span>{" "}
                    {appt.timeSlot}
                  </p>
                </div>
                <div className="flex items-start gap-2.5 text-gray-700">
                  <FileText className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
                  <p className="line-clamp-2">
                    <span className="font-bold text-[#1F2937]">Goal / Topic:</span>{" "}
                    {appt.reason || "N/A"}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 gap-3 border-t border-[#E5E7EB]">
                {appt.status === "Accepted" ? (
                  <>
                    <Button
                      size="sm"
                      className="w-1/2 bg-[#10B981] hover:bg-[#059669] text-white font-bold rounded-xl h-10 shadow-md"
                      onClick={() => handleMarkComplete(appt._id)}
                    >
                      <CheckCheck className="w-4 h-4 mr-1.5" />
                      Mark Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-1/2 text-red-600 border-red-200 bg-red-50 hover:bg-red-100 font-bold rounded-xl h-10"
                      onClick={() => handleCancel(appt._id)}
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <div className="w-full text-center py-2">
                    <span className="text-xs font-bold text-[#2e7d52] flex items-center justify-center gap-1.5">
                      <CheckCheck className="w-4 h-4" />
                      Session Completed
                    </span>
                  </div>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Sessions;

import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  FileText,
  UserCircle2,
  Loader2,
  CheckCircle,
  XCircle,
  Sparkles,
  Filter,
  CheckCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "react-toastify";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointment");
      setAppointments(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
      toast.error("Error loading mentorship sessions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/appointment/${id}`, { status });
      toast.success(`Session status updated to ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error("Failed to update session status");
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.date);
    const matchesDate = date
      ? apptDate.toDateString() === date.toDateString()
      : true;
    const matchesTimeSlot =
      timeSlot && timeSlot !== "all" ? appt.timeSlot === timeSlot : true;
    return matchesDate && matchesTimeSlot;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-bold mb-2 border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            Mentor Appointments Console
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
            Scheduled <span className="gradient-text">Mentorship Requests</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Review student booking requests, accept appointments, or mark sessions completed.
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card p-4 rounded-2xl border border-white/10 flex flex-wrap items-center gap-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-indigo-400" /> Filter Sessions:
        </span>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="border-white/10 bg-slate-900/60 text-white font-bold text-xs rounded-xl">
              <CalendarDays className="w-4 h-4 text-indigo-400 mr-2" />
              {date ? format(date, "dd MMM yyyy") : "All Dates"}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0 bg-slate-950 border border-white/10 text-white">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {date && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDate(null)}
            className="text-xs font-bold text-slate-400 hover:text-white"
          >
            Clear Date Filter
          </Button>
        )}

        <Select onValueChange={setTimeSlot} defaultValue="all">
          <SelectTrigger className="w-36 border-white/10 bg-slate-900/60 text-white font-bold text-xs rounded-xl">
            <Clock className="mr-2 h-3.5 w-3.5 text-indigo-400" />
            <SelectValue placeholder="Time Slot" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-white/10 text-white">
            <SelectItem value="all">All Slots</SelectItem>
            <SelectItem value="Morning">Morning</SelectItem>
            <SelectItem value="Afternoon">Afternoon</SelectItem>
            <SelectItem value="Evening">Evening</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
              <p className="text-slate-400 font-bold text-sm">Loading session requests...</p>
            </div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="col-span-full text-center py-16 glass-card rounded-3xl border border-white/10 space-y-2">
            <CalendarDays className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="font-bold text-lg text-white">No sessions found</h3>
            <p className="text-slate-400 text-sm">No mentorship appointments match your selected date/timeslot filters.</p>
          </div>
        ) : (
          filteredAppointments.map((appt) => (
            <Card
              key={appt._id}
              className="glass-card glass-card-hover rounded-3xl border border-white/10 flex flex-col justify-between overflow-hidden"
            >
              <CardHeader className="flex flex-row items-center justify-between gap-2 p-6 border-b border-white/10 bg-slate-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold shadow-md">
                    <UserCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-extrabold text-white">
                      {appt.studentID?.name || "Student"}
                    </CardTitle>
                    <p className="text-xs text-slate-400 font-medium">Mentorship Student</p>
                  </div>
                </div>
                <Badge
                  className={`font-bold px-3 py-1 text-xs rounded-full ${
                    appt.status === "Completed"
                      ? "badge-glowing"
                      : appt.status === "Accepted"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : appt.status === "Rejected" || appt.status === "Cancelled"
                      ? "bg-red-500/15 text-red-400 border border-red-500/30"
                      : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  }`}
                >
                  {appt.status}
                </Badge>
              </CardHeader>

              <CardContent className="p-6 text-xs space-y-3.5">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <CalendarDays className="w-4 h-4 text-indigo-400 shrink-0" />
                  <p>
                    <span className="font-bold text-white">Date:</span>{" "}
                    {format(new Date(appt.date), "dd MMM yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Clock className="w-4 h-4 text-purple-400 shrink-0" />
                  <p>
                    <span className="font-bold text-white">Timeslot:</span>{" "}
                    {appt.timeSlot}
                  </p>
                </div>
                <div className="flex items-start gap-2.5 text-slate-300">
                  <FileText className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                  <p className="line-clamp-2">
                    <span className="font-bold text-white">Goal / Topic:</span>{" "}
                    {appt.reason || "N/A"}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0 gap-3 border-t border-white/10">
                {appt.status === "Pending" ? (
                  <>
                    <Button
                      size="sm"
                      className="w-1/2 btn-gradient font-bold rounded-xl h-10"
                      onClick={() => handleStatusUpdate(appt._id, "Accepted")}
                    >
                      <CheckCircle className="w-4 h-4 mr-1.5" />
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-1/2 text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 font-bold rounded-xl h-10"
                      onClick={() => handleStatusUpdate(appt._id, "Rejected")}
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Reject
                    </Button>
                  </>
                ) : appt.status === "Accepted" ? (
                  <>
                    <Button
                      size="sm"
                      className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-10 shadow-md"
                      onClick={() => handleStatusUpdate(appt._id, "Completed")}
                    >
                      <CheckCheck className="w-4 h-4 mr-1.5" />
                      Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-1/2 text-red-400 border-red-500/30 bg-red-500/10 hover:bg-red-500/20 font-bold rounded-xl h-10"
                      onClick={() => handleStatusUpdate(appt._id, "Rejected")}
                    >
                      <XCircle className="w-4 h-4 mr-1.5" />
                      Reject
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs font-bold rounded-xl h-10 border-white/10 text-slate-300 hover:bg-white/5"
                    onClick={() => handleStatusUpdate(appt._id, appt.status === "Completed" ? "Accepted" : "Completed")}
                  >
                    Toggle Status ({appt.status})
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;

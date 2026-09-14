import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/utils/api";
import { format } from "date-fns";
import { toast } from "react-toastify";
import {
  CalendarDays,
  Clock,
  GraduationCap,
  FileText,
  Sparkles,
  Star,
  Loader2,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import RatingDialog from "@/components/dialogs/RatingDialog";

const StudentAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [ratedAppointments, setRatedAppointments] = useState(new Set());

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointment");
      const appts = res.data.data || [];
      setAppointments(appts);

      // Check which appointments have been rated
      const ratedSet = new Set();
      for (const appt of appts) {
        if (appt.status === "Completed") {
          try {
            const ratingRes = await api.get(`/rating/appointment/${appt._id}`);
            if (ratingRes.data.data) {
              ratedSet.add(appt._id);
            }
          } catch {
            // Ignore errors for individual rating checks
          }
        }
      }
      setRatedAppointments(ratedSet);
    } catch (err) {
      console.error("Error fetching appointments:", err);
      toast.error("Error fetching your appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleRateClick = (appt) => {
    setSelectedAppointment(appt);
    setRatingOpen(true);
  };

  const handleRatingSubmitted = () => {
    if (selectedAppointment) {
      setRatedAppointments((prev) => new Set([...prev, selectedAppointment._id]));
    }
    setRatingOpen(false);
    setSelectedAppointment(null);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Completed":
        return "badge-mint";
      case "Accepted":
        return "bg-[#DDF4E7] text-[#2e7d52] border border-[#4CAF7D]/30";
      case "Rejected":
      case "Cancelled":
        return "bg-red-50 text-red-600 border border-red-200";
      default:
        return "badge-gold";
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full badge-mint text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
            Session Tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1F2937] tracking-tight">
            My <span className="gradient-text-sage">Appointments</span>
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Track your booked mentorship sessions, view session status, and rate completed sessions.
          </p>
        </div>
      </div>

      {/* Refund Information Banner if any appointment is declined or cancelled */}
      {appointments.some(
        (appt) =>
          appt.status === "Rejected" ||
          appt.status === "Cancelled" ||
          appt.refundStatus === "Refund Initiated"
      ) && (
        <div className="rounded-3xl border border-amber-200/80 bg-[#FFFBEB] p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-amber-950">
                Session Declined or Cancelled — 100% Refund Initiated
              </h3>
              <p className="text-xs sm:text-sm text-amber-800/90 mt-0.5 leading-relaxed max-w-2xl">
                When a mentor declines your booking request, your money is never lost. A full 100% refund is automatically initiated and will be credited back to your original payment method within 5–7 business days.
              </p>
            </div>
          </div>
          <Link to="/transactions" className="shrink-0">
            <Button
              variant="outline"
              className="border-amber-300 bg-white hover:bg-amber-100 text-amber-900 font-bold rounded-xl text-xs h-9 px-4 shadow-sm"
            >
              View Payment Receipts
            </Button>
          </Link>
        </div>
      )}

      {/* Table */}
      <div className="sage-card rounded-3xl border border-[#E5E7EB] shadow-sm overflow-hidden bg-white p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#4CAF7D]" />
            <p className="text-gray-500 font-bold text-sm">Loading your appointments...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-[#FAFBF8] border-b border-[#E5E7EB]">
              <TableRow>
                <TableHead className="font-bold text-gray-700">Mentor</TableHead>
                <TableHead className="font-bold text-gray-700">Date</TableHead>
                <TableHead className="font-bold text-gray-700">Slot</TableHead>
                <TableHead className="font-bold text-gray-700">Goal / Topic</TableHead>
                <TableHead className="font-bold text-gray-700">Status & Refund</TableHead>
                <TableHead className="font-bold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-16 text-gray-500 italic text-sm">
                    <CalendarDays className="w-10 h-10 mx-auto text-gray-400 mb-2" />
                    No appointments found. Book a mentorship session to get started.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appt) => (
                  <TableRow key={appt._id} className="hover:bg-[#FAFBF8] border-b border-[#E5E7EB]">
                    <TableCell className="font-bold text-[#1F2937] text-sm">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-[#4CAF7D] shrink-0" />
                        <div>
                          <p className="font-bold">{appt.mentorID?.name || "Mentor"}</p>
                          <p className="text-xs text-[#2e7d52] font-medium">
                            {appt.mentorID?.specialization || "Tech Mentor"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-gray-700 text-sm">
                      {format(new Date(appt.date), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="font-bold text-[#2e7d52] text-sm">
                      {appt.timeSlot}
                    </TableCell>
                    <TableCell className="font-medium text-[#1F2937] text-sm max-w-[200px] truncate">
                      {appt.reason}
                    </TableCell>
                    <TableCell className="min-w-[220px]">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Badge
                            className={`font-bold text-xs px-3 py-1 rounded-full ${getStatusBadgeClass(
                              appt.status
                            )}`}
                          >
                            {appt.status === "Rejected" ? "Declined" : appt.status}
                          </Badge>
                          {(appt.refundStatus === "Refund Initiated" ||
                            appt.status === "Rejected" ||
                            appt.status === "Cancelled") && (
                            <Badge className="bg-emerald-50 text-[#2e7d52] border border-[#4CAF7D]/30 font-bold text-xs px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <RotateCcw className="w-3 h-3 text-[#4CAF7D]" />
                              ₹{appt.refundAmount || 1499} Refund Initiated
                            </Badge>
                          )}
                        </div>
                        {appt.refundMessage ? (
                          <p className="text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200/60 rounded-lg p-2 leading-relaxed font-medium">
                            {appt.refundMessage}
                          </p>
                        ) : (appt.status === "Rejected" || appt.status === "Cancelled") ? (
                          <p className="text-[11px] text-amber-900 bg-amber-50/80 border border-amber-200/60 rounded-lg p-2 leading-relaxed font-medium">
                            Booking was declined by mentor. A full refund of ₹{appt.refundAmount || 1499} has been initiated to your original payment method (5–7 business days).
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>
                      {appt.status === "Completed" && !ratedAppointments.has(appt._id) ? (
                        <Button
                          size="sm"
                          onClick={() => handleRateClick(appt)}
                          className="btn-sage font-bold rounded-xl text-xs px-4 h-8 shadow-sm"
                        >
                          <Star className="w-3.5 h-3.5 mr-1" />
                          Rate Mentor
                        </Button>
                      ) : appt.status === "Completed" && ratedAppointments.has(appt._id) ? (
                        <span className="text-xs font-bold text-[#2e7d52] flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                          Rated
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 font-medium">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>


      {/* Rating Dialog */}
      {selectedAppointment && (
        <RatingDialog
          open={ratingOpen}
          setOpen={setRatingOpen}
          appointment={selectedAppointment}
          onRatingSubmitted={handleRatingSubmitted}
        />
      )}
    </div>
  );
};

export default StudentAppointments;

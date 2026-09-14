import React, { useState, useEffect, useCallback } from "react";
import { api } from "@/utils/api";
import { Link } from "react-router-dom";
import {
  Bell,
  CheckCheck,
  RotateCcw,
  CalendarX2,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await api.get("/notification");
      if (res.data && res.data.success) {
        setNotifications(res.data.data || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      // Quietly handle errors to not disrupt user experience
      console.error("Error loading notifications:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    // Poll every 30 seconds for live updates
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (isOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      await api.put("/notification/read");
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed marking all notifications read:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkSingleRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await api.put(`/notification/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed marking notification read:", err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "appointment_rejected":
      case "appointment_cancelled":
        return <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />;
      case "appointment_accepted":
        return <CalendarCheck className="w-4 h-4 text-[#2e7d52] shrink-0" />;
      case "refund_initiated":
        return <RotateCcw className="w-4 h-4 text-emerald-600 shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#4CAF7D] shrink-0" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          aria-label="View notifications"
          className="relative p-2 rounded-xl text-gray-600 hover:text-[#4CAF7D] hover:bg-[#F3F4F6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4CAF7D]/30"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-extrabold text-white shadow-sm ring-2 ring-white animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[360px] sm:w-[420px] p-0 rounded-2xl bg-white shadow-xl border border-[#E5E7EB] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#E5E7EB] bg-[#FAFBF8]">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-[#1F2937]">Notifications</h4>
            {unreadCount > 0 && (
              <Badge className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount} new
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllRead}
              disabled={loading}
              className="text-xs h-7 px-2 text-gray-500 hover:text-[#4CAF7D] font-semibold flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <ScrollArea className="max-h-[380px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#FAFBF8] border border-[#E5E7EB] flex items-center justify-center text-gray-400 mb-2">
                <Bell className="w-5 h-5 text-gray-300" />
              </div>
              <p className="text-sm font-semibold text-gray-700">No notifications yet</p>
              <p className="text-xs text-gray-500 mt-1 max-w-[220px]">
                You will be notified when mentors update your bookings or refunds are initiated.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F3F4F6]">
              {notifications.map((item) => (
                <div
                  key={item._id}
                  onClick={() => !item.read && handleMarkSingleRead(item._id)}
                  className={`p-4 transition-colors cursor-pointer flex gap-3 ${
                    item.read
                      ? "bg-white hover:bg-[#FAFBF8]"
                      : "bg-[#FFFBEB]/40 hover:bg-[#FFFBEB]/70"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border ${
                      item.type === "appointment_rejected" ||
                      item.type === "appointment_cancelled"
                        ? "bg-amber-50 border-amber-200"
                        : item.type === "appointment_accepted"
                        ? "bg-[#DDF4E7] border-[#4CAF7D]/30"
                        : "bg-gray-100 border-gray-200"
                    }`}
                  >
                    {getNotificationIcon(item.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-xs font-bold leading-tight ${
                          item.read ? "text-gray-800" : "text-[#1F2937]"
                        }`}
                      >
                        {item.title}
                      </p>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#4CAF7D] shrink-0 mt-1" />
                      )}
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.message}
                    </p>

                    {item.refundAmount > 0 && (
                      <div className="pt-1 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#2e7d52] border border-[#4CAF7D]/30">
                          ₹{item.refundAmount.toLocaleString("en-IN")} Refund In Progress
                        </span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-gray-400 font-medium">
                        {item.createdAt
                          ? formatDistanceToNow(new Date(item.createdAt), {
                              addSuffix: true,
                            })
                          : "Recently"}
                      </span>

                      <Link
                        to="/appointments"
                        onClick={() => setOpen(false)}
                        className="text-[11px] font-semibold text-[#4CAF7D] hover:underline inline-flex items-center gap-0.5"
                      >
                        View Sessions
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-2.5 border-t border-[#E5E7EB] bg-[#FAFBF8] flex items-center justify-between px-4">
            <Link
              to="/appointments"
              onClick={() => setOpen(false)}
              className="text-xs font-bold text-[#4CAF7D] hover:text-[#3d8c64]"
            >
              My Appointments
            </Link>
            <Link
              to="/transactions"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-700"
            >
              Payment History
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

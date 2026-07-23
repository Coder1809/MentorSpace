import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, CalendarDays } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { api } from "@/utils/api";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const AppointmentDialog = ({
  open,
  setOpen,
  form,
  selectedMentor,
  appointment,
  mode = "create",
}) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const isEdit = mode === "edit";

  const handleSubmit = async (values) => {
    try {
      if (!values.date) {
        toast.error("Please select a session date");
        return;
      }
      if (!values.timeSlot) {
        toast.error("Please select a time slot");
        return;
      }

      if (isEdit) {
        await api.put(`/appointment/${appointment._id}`, values);
        toast.success("Session rescheduled successfully");
        setOpen(false);
        return;
      }

      // Ensure Razorpay SDK is loaded
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof window.Razorpay === "undefined") {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      // Step 1: Create Razorpay Order via Backend SDK
      const amount = selectedMentor?.price || 1499;
      const { data } = await api.post("/payment/create-order", { amount });

      if (!data.success || !data.order) {
        throw new Error("Order creation failed");
      }

      // Helper to verify payment signature and store transaction + appointment
      const verifyAndComplete = async (paymentDetails) => {
        const verifyRes = await api.post("/payment/verify", {
          ...paymentDetails,
          mentorID: selectedMentor?._id || values.mentorID,
          date: values.date,
          timeSlot: values.timeSlot,
          reason: values.reason,
        });

        if (verifyRes.data.success) {
          toast.success("Payment Verified & Mentorship Session Booked!");
          setOpen(false);
        } else {
          toast.error(verifyRes.data.message || "Payment verification failed");
        }
      };

      // Step 2: Open interactive Razorpay Checkout Modal
      const options = {
        key: razorpayKey || "rzp_test_dummy_key_id",
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        name: "MentorSpace Platform",
        description: `Mentorship Session with ${selectedMentor?.name || "Mentor"}`,
        order_id: data.order.id,
        handler: async function (response) {
          await verifyAndComplete({
            razorpay_order_id: response.razorpay_order_id || data.order.id,
            razorpay_payment_id: response.razorpay_payment_id || `pay_test_${Date.now()}`,
            razorpay_signature: response.razorpay_signature || "mock_verified_signature",
            amount: data.order.amount,
            currency: data.order.currency || "INR",
          });
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled.");
          },
        },
        prefill: {
          name: "Student User",
          email: "student@mentorspace.io",
          contact: "9876543210",
        },
        theme: {
          color: "#4CAF7D",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Session could not be booked");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white border border-[#E5E7EB] text-[#1F2937] rounded-3xl p-6 sm:p-8 max-w-lg shadow-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-extrabold text-[#1F2937]">
            {isEdit ? "Reschedule Mentorship Session" : "Book Mentorship Session"}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {selectedMentor
              ? `Booking 1-on-1 session with ${selectedMentor.name} (${selectedMentor.specialization || "Tech Mentor"})`
              : "Select session date, time slot, and goal topic."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-5 pt-2"
          >
            <FormField
              control={form.control}
              name="mentorID"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => {
                  const selectedDate = field.value
                    ? field.value instanceof Date
                      ? field.value
                      : new Date(field.value)
                    : undefined;

                  return (
                    <FormItem className="flex flex-col gap-2">
                      <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Session Date
                      </FormLabel>
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className="w-full justify-between font-medium border-[#E5E7EB] bg-[#FAFBF8] text-[#1F2937] rounded-xl h-11 hover:bg-[#DDF4E7]/40 text-sm"
                            >
                              <span className="flex items-center gap-2 truncate">
                                <CalendarDays className="w-4 h-4 text-[#4CAF7D] shrink-0" />
                                {selectedDate
                                  ? selectedDate.toLocaleDateString("en-US", {
                                      weekday: "short",
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "Select date"}
                              </span>
                              <ChevronDownIcon className="w-4 h-4 text-gray-400 shrink-0" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-white border border-[#E5E7EB] rounded-2xl shadow-xl" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                setPopoverOpen(false);
                              }
                            }}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              const cellDate = new Date(date);
                              cellDate.setHours(0, 0, 0, 0);
                              return cellDate < today;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Time Slot
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full border-[#E5E7EB] bg-[#FAFBF8] text-[#1F2937] rounded-xl h-11 text-sm font-medium">
                          <SelectValue placeholder="Select slot" />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-[#E5E7EB] text-[#1F2937] rounded-xl">
                          <SelectItem value="Morning">Morning (9 AM - 12 PM)</SelectItem>
                          <SelectItem value="Afternoon">Afternoon (2 PM - 5 PM)</SelectItem>
                          <SelectItem value="Evening">Evening (6 PM - 9 PM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Session Goal / Topic
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Specify your goals (e.g. System design mock, resume review, DSA problem solving)..."
                      className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl text-sm min-h-[90px] focus:border-[#4CAF7D]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-2">
              <Button type="submit" className="w-full btn-sage font-bold h-12 rounded-xl text-base shadow-md">
                {isEdit ? "Update Session" : `Proceed to Payment (₹${selectedMentor?.price || 1499})`}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;

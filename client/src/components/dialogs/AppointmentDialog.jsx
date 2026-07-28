import React, { useState, useEffect } from "react";
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
import {
  ChevronDownIcon,
  CalendarDays,
  Check,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  UserCheck,
  Clock,
  IndianRupee,
} from "lucide-react";
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
  const [step, setStep] = useState(1);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const isEdit = mode === "edit";

  // Watch form fields to ensure immediate reactive UI updates
  const watchedDate = form.watch("date");
  const watchedTimeSlot = form.watch("timeSlot");
  const watchedReason = form.watch("reason");

  const handleNextStep = async (e) => {
    if (e) e.preventDefault();
    const isValid = await form.trigger(["date", "timeSlot", "reason"]);
    const values = form.getValues();

    if (!values.date) {
      toast.error("Please select a session date");
      return;
    }
    if (!values.timeSlot) {
      toast.error("Please select a time slot");
      return;
    }
    if (!values.reason || !values.reason.trim()) {
      toast.error("Please enter a session goal / topic");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (values) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);

      if (!values.date || !values.timeSlot || !values.reason?.trim()) {
        toast.error("Please complete all session details");
        setStep(1);
        setIsSubmitting(false);
        return;
      }

      if (isEdit) {
        await api.put(`/appointment/${appointment._id}`, values);
        toast.success("Session rescheduled successfully");
        setIsSubmitting(false);
        setOpen(false);
        return;
      }

      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof window === "undefined" || !window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        setIsSubmitting(false);
        return;
      }

      // Amount in rupees — backend multiplies by 100 to convert to paise
      const amount = selectedMentor?.price || 1499;
      const { data: orderData } = await api.post("/payment/create-order", { amount });

      if (!orderData.success || !orderData.order?.id) {
        throw new Error(orderData.message || "Order creation failed");
      }

      const orderId = orderData.order.id;
      const orderAmount = orderData.order.amount; // paise from Razorpay

      const verifyAndComplete = async (paymentResponse) => {
        try {
          const { data: verifyData } = await api.post("/payment/verify", {
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            amount: orderAmount,
            currency: orderData.order.currency || "INR",
            mentorID: selectedMentor?._id,
            date: values.date,
            timeSlot: values.timeSlot,
            reason: values.reason,
          });

          if (verifyData.success) {
            toast.success("Payment Verified & Mentorship Session Booked!");
            setIsSubmitting(false);
            setOpen(false);
          } else {
            toast.error(verifyData.message || "Payment verification failed");
            setIsSubmitting(false);
          }
        } catch (verifyErr) {
          toast.error(verifyErr.response?.data?.message || "Payment verification failed");
          setIsSubmitting(false);
        }
      };

      const options = {
        key: razorpayKey,
        amount: orderAmount,
        currency: orderData.order.currency || "INR",
        order_id: orderId,
        name: "MentorSpace Platform",
        description: `Mentorship Session with ${selectedMentor?.name || "Mentor"}`,
        handler: async function (response) {
          await verifyAndComplete(response);
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled.");
            setIsSubmitting(false);
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

      // Close dialog modal first to release Radix focus trap for Razorpay iframe
      setOpen(false);

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        toast.error(`Payment failed: ${response.error.description}`);
        setIsSubmitting(false);
      });
      rzp.open();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Session could not be booked");
      console.error("Checkout Error:", err);
      setIsSubmitting(false);
    }
  };

  // Block dialog close while payment is actively processing
  const handleOpenChange = (newOpen) => {
    if (isSubmitting && !newOpen) return;
    setOpen(newOpen);
  };

  const formValues = form.watch();
  const selectedDateObj = formValues.date
    ? formValues.date instanceof Date
      ? formValues.date
      : new Date(formValues.date)
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="bg-white border border-[#E5E7EB] text-[#1F2937] rounded-3xl p-6 sm:p-8 max-w-lg shadow-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-extrabold text-[#1F2937] flex items-center justify-between">
            <span>{isEdit ? "Reschedule Session" : "Book Mentorship Session"}</span>
            <span className="text-xs px-3 py-1 rounded-full badge-mint font-bold">
              Step {step} of 2
            </span>
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {selectedMentor
              ? `1-on-1 mentorship with ${selectedMentor.name} (${selectedMentor.specialization || "Tech Mentor"})`
              : "Select date, time slot, and session goal."}
          </DialogDescription>

          {/* Stepper Progress Bar */}
          {!isEdit && (
            <div className="flex items-center justify-between gap-2 p-3 bg-[#FAFBF8] border border-[#E5E7EB] rounded-2xl text-xs font-bold mt-2">
              <div
                className={`flex items-center gap-2 cursor-pointer ${
                  step === 1 ? "text-[#2e7d52]" : "text-gray-600"
                }`}
                onClick={() => setStep(1)}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all ${
                    step === 1
                      ? "bg-[#4CAF7D] text-white shadow-md"
                      : "bg-[#DDF4E7] text-[#2e7d52]"
                  }`}
                >
                  {step > 1 ? <Check className="w-4 h-4" /> : "1"}
                </div>
                <span>1. Schedule & Topic</span>
              </div>

              <div className="flex-1 h-0.5 bg-[#E5E7EB] mx-2" />

              <div
                className={`flex items-center gap-2 ${
                  step === 2 ? "text-[#2e7d52]" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-extrabold transition-all ${
                    step === 2
                      ? "bg-[#4CAF7D] text-white shadow-md"
                      : "bg-gray-100 text-gray-400 border border-gray-200"
                  }`}
                >
                  2
                </div>
                <span>2. Review & Pay</span>
              </div>
            </div>
          )}
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

            {step === 1 ? (
              /* STEP 1: SCHEDULE & TOPIC */
              <div className="space-y-4 animate-in fade-in-50 duration-200">
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

                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      const tomorrow = new Date(today);
                      tomorrow.setDate(tomorrow.getDate() + 1);

                      const dayAfter = new Date(today);
                      dayAfter.setDate(dayAfter.getDate() + 2);

                      // Formats date to YYYY-MM-DD for native date input
                      const formatDateForInput = (d) => {
                        if (!d || isNaN(d.getTime())) return "";
                        const year = d.getFullYear();
                        const month = String(d.getMonth() + 1).padStart(2, "0");
                        const day = String(d.getDate()).padStart(2, "0");
                        return `${year}-${month}-${day}`;
                      };

                      const handleNativeDateChange = (e) => {
                        const val = e.target.value;
                        if (!val) return;
                        const [y, m, d] = val.split("-").map(Number);
                        const selected = new Date(y, m - 1, d);
                        field.onChange(selected);
                      };

                      return (
                        <FormItem className="flex flex-col gap-2 col-span-full">
                          <FormLabel className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
                            <span>Session Date</span>
                            {selectedDate && (
                              <span className="text-[#2e7d52] font-extrabold text-xs bg-[#DDF4E7] px-2.5 py-0.5 rounded-full border border-[#4CAF7D]/30">
                                {selectedDate.toLocaleDateString("en-US", {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </span>
                            )}
                          </FormLabel>

                          {/* Quick Preset Buttons */}
                          <div className="flex flex-wrap items-center gap-2 pb-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => field.onChange(today)}
                              className={`rounded-xl text-xs font-bold transition-all h-8 ${
                                selectedDate && selectedDate.toDateString() === today.toDateString()
                                  ? "bg-[#4CAF7D] text-white border-[#4CAF7D] shadow-sm"
                                  : "bg-[#FAFBF8] border-[#E5E7EB] text-gray-700 hover:bg-[#DDF4E7]/40"
                              }`}
                            >
                              Today ({today.toLocaleDateString("en-US", { month: "short", day: "numeric" })})
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => field.onChange(tomorrow)}
                              className={`rounded-xl text-xs font-bold transition-all h-8 ${
                                selectedDate && selectedDate.toDateString() === tomorrow.toDateString()
                                  ? "bg-[#4CAF7D] text-[#2e7d52] border-[#4CAF7D] bg-[#DDF4E7] shadow-sm"
                                  : "bg-[#FAFBF8] border-[#E5E7EB] text-gray-700 hover:bg-[#DDF4E7]/40"
                              }`}
                            >
                              Tomorrow ({tomorrow.toLocaleDateString("en-US", { month: "short", day: "numeric" })})
                            </Button>

                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => field.onChange(dayAfter)}
                              className={`rounded-xl text-xs font-bold transition-all h-8 ${
                                selectedDate && selectedDate.toDateString() === dayAfter.toDateString()
                                  ? "bg-[#4CAF7D] text-[#2e7d52] border-[#4CAF7D] bg-[#DDF4E7] shadow-sm"
                                  : "bg-[#FAFBF8] border-[#E5E7EB] text-gray-700 hover:bg-[#DDF4E7]/40"
                              }`}
                            >
                              In 2 Days ({dayAfter.toLocaleDateString("en-US", { month: "short", day: "numeric" })})
                            </Button>
                          </div>

                          {/* Custom Date Input (Full Calendar Picker) */}
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              Custom Calendar Date
                            </label>
                            <div className="relative flex items-center">
                              <input
                                type="date"
                                min={formatDateForInput(today)}
                                value={formatDateForInput(selectedDate)}
                                onChange={handleNativeDateChange}
                                className="w-full bg-[#FAFBF8] border border-[#E5E7EB] text-[#1F2937] rounded-xl h-11 px-3 text-sm font-semibold focus:outline-none focus:border-[#4CAF7D] cursor-pointer"
                              />
                            </div>
                          </div>
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
                  {isEdit ? (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full btn-sage font-bold h-12 rounded-xl text-base shadow-md"
                    >
                      {isSubmitting ? "Updating..." : "Update Session"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      className="w-full btn-sage font-bold h-12 rounded-xl text-base shadow-md flex items-center justify-center gap-2"
                    >
                      Proceed to Payment Summary <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              /* STEP 2: REVIEW & PAY SUMMARY */
              <div className="space-y-5 animate-in fade-in-50 duration-200">
                <div className="p-4 rounded-2xl bg-[#FAFBF8] border border-[#E5E7EB] space-y-4">
                  <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-[#4CAF7D]" /> Assigned Mentor
                    </span>
                    <span className="font-extrabold text-[#1F2937] text-sm">
                      {selectedMentor?.name || "Mentor"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1">
                      <span className="text-gray-500 font-bold uppercase text-[10px] block">
                        Selected Date
                      </span>
                      <span className="font-extrabold text-[#1F2937] flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-[#4CAF7D]" />
                        {selectedDateObj
                          ? selectedDateObj.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })
                          : "Not selected"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-gray-500 font-bold uppercase text-[10px] block">
                        Time Slot
                      </span>
                      <span className="font-extrabold text-[#1F2937] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#2e7d52]" />
                        {formValues.timeSlot || "Not selected"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs border-t border-[#E5E7EB] pt-3">
                    <span className="text-gray-500 font-bold uppercase text-[10px] block">
                      Session Topic / Goal
                    </span>
                    <p className="font-medium text-gray-700 bg-white p-2.5 rounded-xl border border-[#E5E7EB] leading-relaxed">
                      {formValues.reason || "N/A"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-3 text-base">
                    <span className="font-extrabold text-[#1F2937]">Total Session Fee</span>
                    <span className="font-extrabold text-[#2e7d52] text-xl flex items-center">
                      <IndianRupee className="w-5 h-5 text-[#4CAF7D]" />
                      {selectedMentor?.price || 1499}
                    </span>
                  </div>
                </div>



                <div className="flex gap-3 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep(1)}
                    disabled={isSubmitting}
                    className="w-1/3 border-[#E5E7EB] text-gray-700 hover:bg-[#FAFBF8] font-bold h-12 rounded-xl text-sm"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back
                  </Button>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 btn-sage font-bold h-12 rounded-xl text-base shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      "Launching Razorpay..."
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Pay ₹{selectedMentor?.price || 1499} via Razorpay
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;

import React from "react";
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
import { ChevronDownIcon } from "lucide-react";
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
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const isEdit = mode === "edit";

  const handleSubmit = async (values) => {
    try {
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
      const amount = 1499; // Standard 1-on-1 Mentorship Fee
      const { data } = await api.post("/payment/create-order", { amount });

      if (!data.success || !data.order) {
        throw new Error("Order creation failed");
      }

      // Helper to verify payment signature and store transaction + appointment
      const verifyAndComplete = async (paymentDetails) => {
        const verifyRes = await api.post("/payment/verify", {
          ...paymentDetails,
          mentorID: values.mentorID,
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
          color: "#4f46e5",
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Reschedule Mentorship Session" : "Book Mentorship Session"}
          </DialogTitle>
          <DialogDescription>
            {selectedMentor
              ? `Booking session with Mentor ${selectedMentor.name} (${selectedMentor.specialization || "Tech Mentor"})`
              : "Select session date, time slot, and topic."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="mentorID"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 w-1/2">
                    <FormLabel>Session Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full justify-between font-normal"
                          >
                            {field.value
                              ? field.value.toLocaleDateString()
                              : "Select date"}
                            <ChevronDownIcon />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          captionLayout="dropdown"
                          onSelect={(date) => field.onChange(date)}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 w-1/2">
                    <FormLabel>Time Slot</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning">Morning</SelectItem>
                          <SelectItem value="Afternoon">Afternoon</SelectItem>
                          <SelectItem value="Evening">Evening</SelectItem>
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
                <FormItem>
                  <FormLabel>Session Goal / Discussion Topic</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Specify your goals (e.g. System design mock, resume review, DSA problem solving)..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end">
              <Button type="submit" className="font-semibold bg-indigo-600 hover:bg-indigo-700 text-white">
                {isEdit ? "Update Session" : "Confirm Booking"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;

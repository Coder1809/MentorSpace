import React from "react";
import { Mail, MapPin, Headphones, HelpCircle, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Support = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="sage-card rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 bg-white">
        <CardContent className="p-0 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-[#1F2937]">
              MentorSpace <span className="gradient-text-sage">Help & Support</span>
            </h1>
            <p className="text-gray-600 text-sm">
              Have questions about booking sessions, Razorpay payment verification, or mentor onboarding? We're here to help.
            </p>
          </div>

          <Separator className="bg-[#E5E7EB]" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FAFBF8] border border-[#E5E7EB]">
              <Headphones className="text-[#4CAF7D] w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-[#1F2937] text-sm">Student Support Hotline</p>
                <p className="text-xs text-gray-500">+91 98765-43210</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FAFBF8] border border-[#E5E7EB]">
              <Mail className="text-[#2e7d52] w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-[#1F2937] text-sm">Email Support</p>
                <p className="text-xs text-gray-500">support@mentorspace.io</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FAFBF8] border border-[#E5E7EB]">
              <MessageSquare className="text-[#10B981] w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-[#1F2937] text-sm">Mentor Onboarding</p>
                <p className="text-xs text-gray-500">mentors@mentorspace.io</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#FAFBF8] border border-[#E5E7EB]">
              <MapPin className="text-[#F59E0B] w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-[#1F2937] text-sm">Headquarters</p>
                <p className="text-xs text-gray-500">MentorSpace Tech Hub, Bangalore</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="sage-card rounded-3xl border border-[#E5E7EB] p-6 sm:p-8 space-y-6 bg-white">
        <CardContent className="p-0 space-y-6">
          <div className="flex items-center gap-2 justify-center text-center">
            <HelpCircle className="w-6 h-6 text-[#4CAF7D]" />
            <h2 className="text-2xl font-extrabold text-[#1F2937]">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="item-1" className="border-b border-[#E5E7EB]">
              <AccordionTrigger className="text-[#1F2937] font-bold text-sm hover:no-underline hover:text-[#4CAF7D]">
                How do 1-on-1 mentorship sessions work?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-xs leading-relaxed">
                Select your preferred mentor from the directory, choose a date, timeslot, and goal topic. Complete payment via Razorpay, and join your scheduled live session.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-[#E5E7EB]">
              <AccordionTrigger className="text-[#1F2937] font-bold text-sm hover:no-underline hover:text-[#4CAF7D]">
                How are payments verified?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-xs leading-relaxed">
                All session payments are authorized via Razorpay interactive checkout. Backend HMAC SHA-256 signatures are verified before session bookings are confirmed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-[#E5E7EB]">
              <AccordionTrigger className="text-[#1F2937] font-bold text-sm hover:no-underline hover:text-[#4CAF7D]">
                Can I reschedule or request a status update?
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 text-xs leading-relaxed">
                Yes, mentors can accept or reschedule requests from their appointment console, and students can view session statuses under My Appointments.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default Support;

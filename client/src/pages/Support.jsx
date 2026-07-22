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
      <Card className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8">
        <CardContent className="p-0 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-extrabold text-white">
              MentorSpace <span className="gradient-text">Help & Support</span>
            </h1>
            <p className="text-slate-400 text-sm">
              Have questions about booking sessions, Razorpay payment verification, or mentor onboarding? We're here to help.
            </p>
          </div>

          <Separator className="bg-white/10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
              <Headphones className="text-indigo-400 w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">Student Support Hotline</p>
                <p className="text-xs text-slate-400">+91 98765-43210</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
              <Mail className="text-emerald-400 w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">Email Support</p>
                <p className="text-xs text-slate-400">support@mentorspace.io</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
              <MessageSquare className="text-purple-400 w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">Mentor Onboarding</p>
                <p className="text-xs text-slate-400">mentors@mentorspace.io</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-slate-900/60 border border-white/5">
              <MapPin className="text-amber-400 w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-white text-sm">Headquarters</p>
                <p className="text-xs text-slate-400">MentorSpace Tech Hub, Bangalore</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="glass-card rounded-3xl border border-white/10 p-6 sm:p-8 space-y-6">
        <CardContent className="p-0 space-y-6">
          <div className="flex items-center gap-2 justify-center text-center">
            <HelpCircle className="w-6 h-6 text-indigo-400" />
            <h2 className="text-2xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-2">
            <AccordionItem value="item-1" className="border-b border-white/10">
              <AccordionTrigger className="text-white font-bold text-sm hover:no-underline hover:text-indigo-400">
                How do 1-on-1 mentorship sessions work?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 text-xs leading-relaxed">
                Select your preferred mentor from the directory, choose a date, timeslot, and goal topic. Complete payment via Razorpay, and join your scheduled live session.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-b border-white/10">
              <AccordionTrigger className="text-white font-bold text-sm hover:no-underline hover:text-indigo-400">
                How are payments verified?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 text-xs leading-relaxed">
                All session payments are authorized via Razorpay interactive checkout. Backend HMAC SHA-256 signatures are verified before session bookings are confirmed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-b border-white/10">
              <AccordionTrigger className="text-white font-bold text-sm hover:no-underline hover:text-indigo-400">
                Can I reschedule or request a status update?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 text-xs leading-relaxed">
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

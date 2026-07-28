import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Sparkles,
  Target,
  Eye,
  Award,
  Users,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  Code,
  Calendar,
  Building,
  ArrowLeft,
} from "lucide-react";

export default function About() {
  const studentBenefits = [
    "Personalized 1-on-1 feedback on code and architecture.",
    "Real-world mock technical interviews with FAANG engineers.",
    "Tailored career roadmaps for software engineering roles.",
    "Direct Q&A with experienced industry leaders.",
  ];

  const mentorBenefits = [
    "Monetize technical expertise on flexible schedules.",
    "Empower emerging engineers and future tech leaders.",
    "Build personal brand as a verified industry mentor.",
    "Hassle-free Razorpay payout authorization.",
  ];

  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-[#4CAF7D]" />,
      title: "Seamless 1-on-1 Booking",
      desc: "Select dates, time slots, and goals to connect instantly with verified software mentors.",
    },
    {
      icon: <Users className="w-6 h-6 text-[#4CAF7D]" />,
      title: "Verified Tech Mentors",
      desc: "Connect with vetted engineers specializing in System Design, DSA, Full-Stack, and AI/ML.",
    },
    {
      icon: <Code className="w-6 h-6 text-[#4CAF7D]" />,
      title: "Multi-Week Tracks",
      desc: "Structured multi-week programs with week-by-week learning roadmaps and milestone reviews.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#4CAF7D]" />,
      title: "Secure Signature Verification",
      desc: "Razorpay integration with HMAC digital signatures ensuring safe, transparent transactions.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFBF8] text-[#1F2937] selection:bg-[#4CAF7D] selection:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#4CAF7D] flex items-center justify-center text-white shadow-md shadow-[#4CAF7D]/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-[#1F2937]">
                MentorSpace
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" className="text-gray-600 hover:text-[#1F2937] hover:bg-[#DDF4E7]/40 font-semibold gap-2">
                  <ArrowLeft className="w-4 h-4" /> Home
                </Button>
              </Link>
              <Link to="/register">
                <Button className="btn-sage font-bold rounded-xl px-5 py-2.5">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-mint text-xs font-bold tracking-wide uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#2e7d52]" />
            About MentorSpace Platform
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#1F2937]">
            Empowering the Next Generation of <span className="gradient-text-sage">Tech Leaders</span>
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            MentorSpace is the premier 1-on-1 tech mentorship platform bridging the gap between aspiring engineers and verified senior tech leaders.
          </p>
        </div>

        {/* Mission & Vision Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="sage-card p-8 rounded-3xl border border-[#E5E7EB] space-y-4 bg-white shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#DDF4E7] text-[#2e7d52] flex items-center justify-center font-bold">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#1F2937]">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To democratize access to high-caliber engineering mentorship. We believe everyone deserves personalized, 1-on-1 guidance from engineers who have built and scaled systems at top tech companies.
            </p>
          </div>

          <div className="sage-card p-8 rounded-3xl border border-[#E5E7EB] space-y-4 bg-white shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] text-[#92400E] border border-[#FCD34D] flex items-center justify-center font-bold">
              <Eye className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-extrabold text-[#1F2937]">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To create an interconnected global community where knowledge transfer is instant, transparent, and actionable—enabling students to master complex technical domains faster than ever before.
            </p>
          </div>
        </div>

        {/* Company Story */}
        <div className="sage-card p-10 rounded-3xl border border-[#4CAF7D]/30 bg-[#FAFBF8] space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#4CAF7D] text-white flex items-center justify-center font-bold">
              <Building className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#1F2937]">Our Story</h2>
          </div>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Founded in 2026 by senior software architects and educators, MentorSpace started with a simple realization: standard video courses and bootcamps lack the tailored feedback needed to master system design, complex data structures, and production-grade software engineering. By providing interactive 1-on-1 booking, role-based consoles, and verified HMAC payment processing, MentorSpace connects thousands of learners directly with mentors for personalized growth.
          </p>
        </div>

        {/* Platform Features Grid */}
        <div className="space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold text-[#1F2937]">Core Platform Features</h2>
            <p className="text-gray-600 text-sm">Everything built into MentorSpace for students and mentors.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, idx) => (
              <div key={idx} className="sage-card p-6 rounded-3xl border border-[#E5E7EB] bg-white space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-[#DDF4E7] flex items-center justify-center">
                  {f.icon}
                </div>
                <h4 className="font-extrabold text-base text-[#1F2937]">{f.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Why Join Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Students */}
          <div className="sage-card p-8 rounded-3xl border border-[#E5E7EB] bg-white space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4CAF7D] text-white flex items-center justify-center font-bold">
                🎓
              </div>
              <h3 className="text-xl font-extrabold text-[#1F2937]">Why Students Use MentorSpace</h3>
            </div>

            <div className="space-y-3">
              {studentBenefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#4CAF7D] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <Link to="/mentors" className="block pt-2">
              <Button className="btn-sage w-full font-bold h-12 rounded-xl text-sm">
                Explore Mentors & Book Session <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Mentors */}
          <div className="sage-card p-8 rounded-3xl border border-[#E5E7EB] bg-white space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2e7d52] text-white flex items-center justify-center font-bold">
                ⚡
              </div>
              <h3 className="text-xl font-extrabold text-[#1F2937]">Why Mentors Join MentorSpace</h3>
            </div>

            <div className="space-y-3">
              {mentorBenefits.map((b, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-[#2e7d52] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </div>
              ))}
            </div>

            <Link to="/register" className="block pt-2">
              <Button className="btn-sage w-full font-bold h-12 rounded-xl text-sm shadow-md">
                Register as Tech Mentor <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E7EB] py-8 bg-white text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-[#1F2937]">
            <GraduationCap className="w-5 h-5 text-[#4CAF7D]" />
            MentorSpace Platform © 2026
          </div>
          <div>Premier 1-on-1 Mentorship for Engineers</div>
        </div>
      </footer>
    </div>
  );
}

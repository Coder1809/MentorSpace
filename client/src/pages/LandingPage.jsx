import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Users,
  Code,
  GraduationCap,
  Shield,
  Clock,
  CreditCard,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Terminal,
  Award,
  Star,
  Check,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-[#4CAF7D]" />,
      title: "Seamless 1-on-1 Booking",
      description:
        "Schedule mentorship sessions effortlessly. Select a date, time slot, and topic to connect with top engineers.",
    },
    {
      icon: <Users className="w-6 h-6 text-[#4CAF7D]" />,
      title: "Verified Industry Mentors",
      description:
        "Connect with experienced engineers specializing in System Design, DSA, Full-Stack Web Dev, and AI/ML.",
    },
    {
      icon: <Code className="w-6 h-6 text-[#4CAF7D]" />,
      title: "Domain-Specific Tracks",
      description:
        "Targeted guidance for Web Development, Competitive Programming, Machine Learning, and Mock Interviews.",
    },
    {
      icon: <Award className="w-6 h-6 text-[#4CAF7D]" />,
      title: "Career Acceleration",
      description:
        "Actionable code reviews, portfolio audits, and interview preparation to land offers at top product companies.",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-[#4CAF7D]" />,
      title: "Instant Razorpay Checkout",
      description:
        "Hassle-free payment authorization with HMAC signature verification and digital payment receipts.",
    },
    {
      icon: <Shield className="w-6 h-6 text-[#4CAF7D]" />,
      title: "Role-Based Dashboards",
      description:
        "Dedicated student and mentor workspaces protected by robust JWT token security and profile hydration.",
    },
  ];

  const stats = [
    {
      number: "10,000+",
      label: "Mentorship Sessions",
      icon: <GraduationCap className="w-5 h-5 text-[#4CAF7D]" />,
    },
    {
      number: "500+",
      label: "Verified Tech Mentors",
      icon: <Users className="w-5 h-5 text-[#4CAF7D]" />,
    },
    {
      number: "99.4%",
      label: "Satisfaction Score",
      icon: <Award className="w-5 h-5 text-[#4CAF7D]" />,
    },
    {
      number: "24/7",
      label: "Live Platform Access",
      icon: <Clock className="w-5 h-5 text-[#4CAF7D]" />,
    },
  ];

  const domains = [
    "Full Stack React / Node",
    "System Design & Architecture",
    "DSA & Competitive Programming",
    "Machine Learning & AI",
    "DevOps & Cloud Security",
    "UI/UX & Product Design",
  ];

  return (
    <div className="min-h-screen bg-[#FAFBF8] text-[#1F2937] selection:bg-[#4CAF7D] selection:text-white">
      {/* Navigation Bar */}
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

            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
              <a href="#features" className="hover:text-[#4CAF7D] transition-colors">
                Features
              </a>
              <a href="#domains" className="hover:text-[#4CAF7D] transition-colors">
                Domains
              </a>
              <a href="#how-it-works" className="hover:text-[#4CAF7D] transition-colors">
                How It Works
              </a>
              <a href="#about" className="hover:text-[#4CAF7D] transition-colors">
                About
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-600 hover:text-[#1F2937] hover:bg-[#DDF4E7]/40 font-semibold">
                  Sign In
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-mint text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#2e7d52]" />
                Premier 1-on-1 Tech Mentorship
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-[#1F2937]">
                Accelerate Your Tech Career with{" "}
                <span className="gradient-text-sage">Personal Mentors</span>
              </h1>

              <p className="text-gray-600 text-base sm:text-lg leading-relaxed max-w-xl">
                Connect directly with senior engineers and tech leaders for 1-on-1 code reviews, mock interviews, system design guidance, and career roadmap planning.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/register">
                  <Button className="btn-sage font-bold text-base px-8 py-6 rounded-2xl flex items-center gap-3">
                    Find Your Mentor
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/mentors">
                  <Button variant="outline" className="border-[#E5E7EB] bg-white hover:bg-[#DDF4E7]/40 text-[#1F2937] font-bold text-base px-8 py-6 rounded-2xl shadow-sm">
                    Browse Mentors
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-gray-500">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#4CAF7D]" />
                  Verified Experts
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#4CAF7D]" />
                  Instant Booking
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#4CAF7D]" />
                  Secure Razorpay
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="relative">
              <div className="sage-card p-6 md:p-8 rounded-3xl relative space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#DDF4E7] border border-[#4CAF7D]/30 flex items-center justify-center text-[#2e7d52] font-bold">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1F2937] text-base">System Design Mock Session</h4>
                      <p className="text-xs text-gray-500">1-on-1 Live Guidance</p>
                    </div>
                  </div>
                  <Badge className="badge-mint text-xs font-bold px-3 py-1">
                    Active
                  </Badge>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-xl bg-[#FAFBF8] border border-[#E5E7EB] space-y-2">
                    <div className="flex justify-between font-semibold text-gray-700">
                      <span>Topic Covered:</span>
                      <span className="text-[#2e7d52] font-bold">Distributed Caching & Sharding</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-700">
                      <span>Mentor:</span>
                      <span className="text-gray-900 font-bold">Sarah Chen (Ex-FAANG Lead)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-[#DDF4E7]/40 border border-[#4CAF7D]/20 text-center">
                      <p className="text-xs text-gray-500">Session Fee</p>
                      <p className="text-xl font-extrabold text-[#2e7d52] mt-1">₹1,499</p>
                    </div>
                    <div className="p-4 rounded-xl bg-[#FEF3C7]/60 border border-[#FCD34D] text-center">
                      <p className="text-xs text-gray-500">Rating</p>
                      <p className="text-xl font-extrabold text-[#92400E] mt-1 flex items-center justify-center gap-1">
                        4.95 <Star className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 border-y border-[#E5E7EB] bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-extrabold text-[#1F2937]">{stat.number}</div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Focus Section */}
      <section id="domains" className="py-20 max-w-7xl mx-auto px-6 text-center space-y-12">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#1F2937]">Popular Mentorship Domains</h2>
          <p className="text-gray-600 text-sm">
            Choose specialized mentorship tailored to your technical domain and career goals.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {domains.map((domain, idx) => (
            <div key={idx} className="tech-pill px-5 py-3 rounded-2xl text-sm font-bold shadow-sm hover:scale-105 transition-transform cursor-pointer">
              {domain}
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t border-[#E5E7EB] max-w-7xl mx-auto px-6 space-y-12 bg-white">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#1F2937]">Engineered for Maximum Career Growth</h2>
          <p className="text-gray-600 text-sm">
            Everything you need for seamless 1-on-1 learning, booking, and career acceleration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="sage-card sage-card-hover p-8 rounded-3xl space-y-4 text-left border border-[#E5E7EB]">
              <div className="w-12 h-12 rounded-2xl bg-[#DDF4E7] border border-[#4CAF7D]/30 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-[#1F2937]">{feat.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section id="how-it-works" className="py-20 max-w-7xl mx-auto px-6 space-y-16 text-center">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-[#1F2937]">How MentorSpace Works</h2>
          <p className="text-gray-600 text-sm">Get started in 3 simple steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="sage-card p-8 rounded-3xl space-y-4 text-left relative">
            <div className="w-10 h-10 rounded-xl bg-[#4CAF7D] text-white font-extrabold flex items-center justify-center">1</div>
            <h4 className="text-lg font-bold text-[#1F2937]">Browse Mentors</h4>
            <p className="text-gray-600 text-sm">Explore verified mentor profiles, specializations, and reviews across various tech domains.</p>
          </div>

          <div className="sage-card p-8 rounded-3xl space-y-4 text-left relative">
            <div className="w-10 h-10 rounded-xl bg-[#2e7d52] text-white font-extrabold flex items-center justify-center">2</div>
            <h4 className="text-lg font-bold text-[#1F2937]">Book & Pay Securely</h4>
            <p className="text-gray-600 text-sm">Select date, slot, and goal topic. Pay via Razorpay interactive checkout popup.</p>
          </div>

          <div className="sage-card p-8 rounded-3xl space-y-4 text-left relative">
            <div className="w-10 h-10 rounded-xl bg-[#10B981] text-white font-extrabold flex items-center justify-center">3</div>
            <h4 className="text-lg font-bold text-[#1F2937]">Join 1-on-1 Session</h4>
            <p className="text-gray-600 text-sm">Receive personalized feedback, code analysis, and actionable career guidance.</p>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer id="contact" className="border-t border-[#E5E7EB] pt-16 pb-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <div className="sage-card p-12 rounded-3xl border border-[#E5E7EB] max-w-4xl mx-auto space-y-6 bg-[#FAFBF8]">
            <h2 className="text-3xl font-extrabold text-[#1F2937]">Ready to Level Up Your Tech Skills?</h2>
            <p className="text-gray-600 max-w-xl mx-auto text-sm">
              Join thousands of students and engineers learning directly from industry experts on MentorSpace.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link to="/register">
                <Button className="btn-sage font-bold px-8 py-6 rounded-2xl text-base">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-[#E5E7EB] text-xs text-gray-500 gap-4">
            <div className="flex items-center gap-2 font-bold text-[#1F2937]">
              <GraduationCap className="w-5 h-5 text-[#4CAF7D]" />
              MentorSpace Platform © 2026
            </div>
            <div>Designed for Students & Industry Mentors</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

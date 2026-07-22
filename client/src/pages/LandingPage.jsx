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
  Phone,
  Mail,
  MapPin,
  Terminal,
  Cpu,
  BookOpen,
  Award,
  Star,
  Check,
} from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-indigo-400" />,
      title: "Seamless 1-on-1 Booking",
      description:
        "Schedule mentorship sessions effortlessly. Select a date, time slot, and topic to connect with top engineers.",
      gradient: "from-indigo-500/20 to-purple-500/20",
    },
    {
      icon: <Users className="w-6 h-6 text-purple-400" />,
      title: "Verified Industry Mentors",
      description:
        "Connect with experienced engineers specializing in System Design, DSA, Full-Stack Web Dev, and AI/ML.",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      icon: <Code className="w-6 h-6 text-amber-400" />,
      title: "Domain-Specific Tracks",
      description:
        "Targeted guidance for Web Development, Competitive Programming, Machine Learning, and Mock Interviews.",
      gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      icon: <Award className="w-6 h-6 text-emerald-400" />,
      title: "Career Acceleration",
      description:
        "Actionable code reviews, portfolio audits, and interview preparation to land offers at top product companies.",
      gradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      icon: <CreditCard className="w-6 h-6 text-blue-400" />,
      title: "Instant Razorpay Checkout",
      description:
        "Hassle-free payment authorization with HMAC signature verification and digital payment receipts.",
      gradient: "from-blue-500/20 to-indigo-500/20",
    },
    {
      icon: <Shield className="w-6 h-6 text-rose-400" />,
      title: "Role-Based Dashboards",
      description:
        "Dedicated student and mentor workspaces protected by robust JWT token security and profile hydration.",
      gradient: "from-rose-500/20 to-purple-500/20",
    },
  ];

  const stats = [
    {
      number: "10,000+",
      label: "Mentorship Sessions",
      icon: <GraduationCap className="w-5 h-5 text-indigo-400" />,
    },
    {
      number: "500+",
      label: "Verified Tech Mentors",
      icon: <Users className="w-5 h-5 text-purple-400" />,
    },
    {
      number: "99.4%",
      label: "Satisfaction Score",
      icon: <Award className="w-5 h-5 text-emerald-400" />,
    },
    {
      number: "24/7",
      label: "Live Platform Access",
      icon: <Clock className="w-5 h-5 text-amber-400" />,
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
    <div className="min-h-screen bg-[#090d16] text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#090d16]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                MentorSpace
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-300">
              <a href="#features" className="hover:text-indigo-400 transition-colors">
                Features
              </a>
              <a href="#domains" className="hover:text-indigo-400 transition-colors">
                Domains
              </a>
              <a href="#how-it-works" className="hover:text-indigo-400 transition-colors">
                How It Works
              </a>
              <a href="#about" className="hover:text-indigo-400 transition-colors">
                About
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/5 font-semibold">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="btn-gradient font-bold rounded-xl px-5 py-2.5">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                Premier 1-on-1 Tech Mentorship
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Accelerate Your Tech Career with{" "}
                <span className="gradient-text">Personal Mentors</span>
              </h1>

              <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
                Connect directly with senior engineers and tech leaders for 1-on-1 code reviews, mock interviews, system design guidance, and career roadmap planning.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/register">
                  <Button className="btn-gradient font-bold text-base px-8 py-6 rounded-2xl flex items-center gap-3">
                    Find Your Mentor
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/mentors">
                  <Button variant="outline" className="border-white/15 bg-white/5 hover:bg-white/10 text-white font-bold text-base px-8 py-6 rounded-2xl">
                    Browse Mentors
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Verified Experts
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Instant Booking
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  Secure Razorpay
                </div>
              </div>
            </div>

            {/* Hero Visual Card */}
            <div className="relative">
              <div className="glass-card p-6 md:p-8 rounded-3xl relative border border-white/10 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                      <Terminal className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-base">System Design Mock Session</h4>
                      <p className="text-xs text-slate-400">1-on-1 Live Guidance</p>
                    </div>
                  </div>
                  <Badge className="badge-glowing text-xs font-bold px-3 py-1">
                    Active
                  </Badge>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-2">
                    <div className="flex justify-between font-semibold text-slate-300">
                      <span>Topic Covered:</span>
                      <span className="text-indigo-400">Distributed Caching & Sharding</span>
                    </div>
                    <div className="flex justify-between font-semibold text-slate-300">
                      <span>Mentor:</span>
                      <span className="text-purple-400">Sarah Chen (Ex-FAANG Lead)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-center">
                      <p className="text-xs text-slate-400">Session Fee</p>
                      <p className="text-xl font-extrabold text-indigo-300 mt-1">₹1,499</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-center">
                      <p className="text-xs text-slate-400">Rating</p>
                      <p className="text-xl font-extrabold text-emerald-400 mt-1 flex items-center justify-center gap-1">
                        4.95 <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
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
      <section className="py-12 border-y border-white/10 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-center">{stat.icon}</div>
                <div className="text-3xl font-extrabold text-white">{stat.number}</div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Domain Focus Section */}
      <section id="domains" className="py-20 max-w-7xl mx-auto px-6 text-center space-y-12">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white">Popular Mentorship Domains</h2>
          <p className="text-slate-400 text-sm">
            Choose specialized mentorship tailored to your technical domain and career goals.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {domains.map((domain, idx) => (
            <div key={idx} className="tech-tag px-5 py-3 rounded-2xl text-sm font-bold shadow-md hover:scale-105 transition-transform cursor-pointer">
              {domain}
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 border-t border-white/10 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white">Engineered for Maximum Career Growth</h2>
          <p className="text-slate-400 text-sm">
            Everything you need for seamless 1-on-1 learning, booking, and career acceleration.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => (
            <div key={idx} className="glass-card glass-card-hover p-8 rounded-3xl space-y-4 text-left border border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-white">{feat.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section id="how-it-works" className="py-20 border-t border-white/10 max-w-7xl mx-auto px-6 space-y-16 text-center">
        <div className="space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white">How MentorSpace Works</h2>
          <p className="text-slate-400 text-sm">Get started in 3 simple steps.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass-card p-8 rounded-3xl space-y-4 text-left relative">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-extrabold flex items-center justify-center">1</div>
            <h4 className="text-lg font-bold text-white">Browse Mentors</h4>
            <p className="text-slate-400 text-sm">Explore verified mentor profiles, specializations, and reviews across various tech domains.</p>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4 text-left relative">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center">2</div>
            <h4 className="text-lg font-bold text-white">Book & Pay Securely</h4>
            <p className="text-slate-400 text-sm">Select date, slot, and goal topic. Pay via Razorpay interactive checkout popup.</p>
          </div>

          <div className="glass-card p-8 rounded-3xl space-y-4 text-left relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center">3</div>
            <h4 className="text-lg font-bold text-white">Join 1-on-1 Session</h4>
            <p className="text-slate-400 text-sm">Receive personalized feedback, code analysis, and actionable career guidance.</p>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <footer id="contact" className="border-t border-white/10 pt-16 pb-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          <div className="glass-card p-12 rounded-3xl border border-white/10 max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-extrabold text-white">Ready to Level Up Your Tech Skills?</h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Join thousands of students and engineers learning directly from industry experts on MentorSpace.
            </p>
            <div className="flex justify-center gap-4 pt-2">
              <Link to="/register">
                <Button className="btn-gradient font-bold px-8 py-6 rounded-2xl text-base">
                  Get Started Now
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/10 text-xs text-slate-500 gap-4">
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <GraduationCap className="w-5 h-5 text-indigo-500" />
              MentorSpace Platform © 2026
            </div>
            <div>Designed for Students & Industry Mentors</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

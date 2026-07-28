import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  Clock,
  Check,
  Sparkles,
  IndianRupee,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp,
  UserCheck,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartSheet from "@/components/CartSheet";
import { Link } from "react-router-dom";

const CATEGORIES = [
  "All",
  "Web Development",
  "System Design",
  "DSA",
  "Machine Learning",
  "DevOps",
  "UI/UX",
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedTrackId, setExpandedTrackId] = useState(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data.data || []);
      } catch (err) {
        toast.error("Error fetching mentorship tracks");
      }
    };

    fetchServices();
  }, []);

  const toggleMilestones = (id) => {
    setExpandedTrackId((prev) => (prev === id ? null : id));
  };

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-mint text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#2e7d52]" />
          Structured Multi-Week Learning Programs
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1F2937]">
          Structured <span className="gradient-text-sage">Mentorship Tracks</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Comprehensive multi-session programs with week-by-week learning roadmaps, 1-on-1 code reviews, and assigned senior mentor leads.
        </p>

        {/* Differentiating Notice Banner */}
        <div className="sage-card p-4 rounded-2xl border border-[#4CAF7D]/30 bg-[#FAFBF8] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-left max-w-2xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#DDF4E7] text-[#2e7d52] flex items-center justify-center font-bold shrink-0">
              💡
            </div>
            <div>
              <p className="font-extrabold text-[#1F2937]">Looking for a single 1-on-1 session?</p>
              <p className="text-gray-500">Mentorship Tracks are complete multi-week programs. For single sessions, visit Mentors.</p>
            </div>
          </div>
          <Link to="/mentors">
            <Button size="sm" variant="outline" className="border-[#4CAF7D]/40 text-[#2e7d52] font-bold rounded-xl shrink-0">
              Browse Mentors <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Button
                key={cat}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full font-bold text-xs px-4 py-2 transition-all ${
                  isActive
                    ? "btn-sage shadow-md"
                    : "border-[#E5E7EB] bg-white text-gray-700 hover:text-[#1F2937] hover:bg-[#DDF4E7]/40"
                }`}
              >
                {cat}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((track) => {
          const inCart = cart.some((item) => item._id === track._id);
          const isExpanded = expandedTrackId === track._id;
          const milestones = track.milestones || [];
          const skills = track.skillsCovered || [];

          return (
            <Card
              key={track._id}
              className="sage-card sage-card-hover rounded-3xl overflow-hidden border border-[#E5E7EB] flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-5">
                {/* Track Header Badges & Pricing */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className="badge-mint text-xs font-bold px-3 py-1 rounded-full">
                        {track.category || "Track"}
                      </Badge>
                      <Badge className="bg-[#FEF3C7] border border-[#FCD34D] text-[#92400E] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                        Structured Program
                      </Badge>
                    </div>
                    <h3 className="text-xl font-extrabold text-[#1F2937] pt-1 leading-snug">
                      {track.name}
                    </h3>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-2xl font-extrabold text-[#1F2937] flex items-center justify-end">
                      <IndianRupee className="w-5 h-5 text-[#4CAF7D]" />
                      {track.price}
                    </span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">
                      Full Program Fee
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-xs leading-relaxed bg-[#FAFBF8] p-4 rounded-2xl border border-[#E5E7EB]">
                  {track.description}
                </p>

                {/* Program Key Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAFBF8] border border-[#E5E7EB] space-y-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#4CAF7D]" /> Duration
                    </span>
                    <span className="font-extrabold text-[#1F2937]">
                      {track.durationWeeks ? `${track.durationWeeks} Weeks` : track.duration || "4 Weeks"}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAFBF8] border border-[#E5E7EB] space-y-0.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-[#2e7d52]" /> 1-on-1 Sessions
                    </span>
                    <span className="font-extrabold text-[#1F2937]">
                      {track.totalSessions ? `${track.totalSessions} Live Sessions` : "8 Sessions"}
                    </span>
                  </div>
                </div>

                {/* Lead Mentor Info */}
                <div className="flex items-center gap-2.5 text-xs text-gray-700 bg-[#FAFBF8] p-3 rounded-xl border border-[#E5E7EB]">
                  <UserCheck className="w-4 h-4 text-[#4CAF7D] shrink-0" />
                  <span className="font-semibold text-gray-600 truncate">
                    Lead Mentor: <strong className="text-[#1F2937]">{track.mentorDetails || "Senior FAANG Architect"}</strong>
                  </span>
                </div>

                {/* Skills Covered Pills */}
                {skills.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Skills Covered:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-[#DDF4E7]/60 text-[#2e7d52] border border-[#4CAF7D]/30 text-[11px] font-bold"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Expandable Milestone Roadmap */}
                {milestones.length > 0 && (
                  <div className="border-t border-[#E5E7EB] pt-3">
                    <button
                      onClick={() => toggleMilestones(track._id)}
                      className="w-full flex items-center justify-between text-xs font-bold text-[#2e7d52] hover:underline"
                    >
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-[#4CAF7D]" />
                        {isExpanded ? "Hide Milestone Roadmap" : `View Learning Roadmap (${milestones.length} Modules)`}
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 space-y-2 text-xs bg-[#FAFBF8] p-3.5 rounded-2xl border border-[#E5E7EB] animate-in fade-in-50 duration-200">
                        {milestones.map((m, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-gray-700">
                            <span className="w-5 h-5 rounded-full bg-[#4CAF7D] text-white text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="font-medium text-gray-600 leading-snug">{m}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>

              {/* Action / Enrollment Button */}
              <div className="p-6 pt-0">
                <Button
                  onClick={() => {
                    addToCart(track);
                    toast.success(`${track.name} added to cart!`);
                  }}
                  disabled={inCart}
                  className={`w-full font-bold rounded-2xl h-11 text-sm transition-all ${
                    inCart
                      ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                      : "btn-sage shadow-md"
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-[#4CAF7D]" />
                      Enrolled in Track Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Enroll in Track (₹{track.price})
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Floating Cart Launcher Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 z-40">
          <Button
            onClick={() => setSheetOpen(true)}
            className="btn-sage font-bold rounded-full h-14 px-6 shadow-xl flex items-center gap-3 animate-bounce"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>View Enrolled Tracks ({cart.length})</span>
          </Button>
        </div>
      )}

      {/* Cart Sheet Drawer */}
      <CartSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
};

export default Services;

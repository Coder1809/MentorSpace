import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Award,
  Calendar,
  CheckCircle,
  IndianRupee,
  Search,
  Sparkles,
  Star,
  UsersRound,
  GraduationCap,
} from "lucide-react";
import AppointmentDialog from "@/components/dialogs/AppointmentDialog";

const CATEGORIES = [
  "All",
  "React",
  "Node.js",
  "Java",
  "Python",
  "Machine Learning",
  "DevOps",
  "UI/UX",
  "Data Structures",
  "Competitive Programming",
  "Cloud",
];

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [open, setOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);

  const form = useForm({
    defaultValues: {
      date: undefined,
      timeSlot: "",
      reason: "",
    },
  });

  const fetchMentors = async () => {
    try {
      const res = await api.get("/mentor");
      const list = res.data.data || [];
      setMentors(list);
    } catch (err) {
      console.error("Error fetching mentors:", err);
      toast.error(err.response?.data?.message || "Error fetching mentor directory");
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const filteredMentors = mentors.filter((m) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (m.name || "").toLowerCase().includes(term) ||
      (m.specialization || "").toLowerCase().includes(term) ||
      (m.bio || "").toLowerCase().includes(term);

    const matchesCategory =
      selectedCategory === "All" ||
      (m.specialization || "").toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const handleOpenDialog = (mentor) => {
    setSelectedMentor(mentor);
    form.reset({
      date: undefined,
      timeSlot: "",
      reason: "",
    });
    setOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full badge-mint text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#2e7d52]" />
          Verified Industry Experts
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#1F2937]">
          Find Your <span className="gradient-text-sage">Tech Mentor</span>
        </h1>
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
          Book 1-on-1 mentorship sessions with senior engineers for code reviews, mock interviews, system design, and career roadmap guidance.
        </p>

        {/* Search Input */}
        <div className="relative max-w-lg mx-auto pt-2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search by mentor name, specialization, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 rounded-2xl h-12 bg-white border-[#E5E7EB] text-[#1F2937] shadow-sm focus:border-[#4CAF7D] text-sm"
          />
        </div>

        {/* Domain Filter Pills */}
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

      {/* Mentors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMentors.length === 0 ? (
          <div className="col-span-full text-center py-16 sage-card rounded-3xl border border-[#E5E7EB] space-y-3">
            <UsersRound className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="font-bold text-lg text-[#1F2937]">No mentors found</h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search query or selecting a different tech domain.
            </p>
          </div>
        ) : (
          filteredMentors.map((mentor) => (
            <Card
              key={mentor._id}
              className="sage-card sage-card-hover rounded-3xl overflow-hidden border border-[#E5E7EB] flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#4CAF7D] text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-[#4CAF7D]/20">
                      {mentor.name
                        ? mentor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        : "M"}
                    </div>
                    <div>
                      <h3 className="text-lg font-extrabold text-[#1F2937] leading-snug">
                        {mentor.name}
                      </h3>
                      <p className="text-xs font-bold text-[#2e7d52]">
                        {mentor.specialization || "Tech Mentor"}
                      </p>
                    </div>
                  </div>
                  <Badge className="badge-mint font-bold text-xs px-2.5 py-1 rounded-full shrink-0">
                    {mentor.status || "Active"}
                  </Badge>
                </div>

                {/* Bio */}
                <p className="text-gray-600 text-xs leading-relaxed line-clamp-3 bg-[#FAFBF8] p-4 rounded-2xl border border-[#E5E7EB]">
                  {mentor.bio ||
                    "Senior Software Engineer specializing in scalable web systems, clean architecture, and technical interview preparation."}
                </p>

                {/* Rating & Experience */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-[#FAFBF8] border border-[#E5E7EB] flex items-center gap-2">
                    <Star className="w-4 h-4 text-[#F59E0B] fill-[#F59E0B] shrink-0" />
                    <div>
                      <p className="font-extrabold text-[#1F2937]">4.9 / 5.0</p>
                      <p className="text-[10px] text-gray-500 font-semibold">Student Rating</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#FAFBF8] border border-[#E5E7EB] flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#4CAF7D] shrink-0" />
                    <div>
                      <p className="font-extrabold text-[#1F2937]">{mentor.experience || "5+ Years"}</p>
                      <p className="text-[10px] text-gray-500 font-semibold">Industry Exp.</p>
                    </div>
                  </div>
                </div>

                {/* Pricing & Booking */}
                <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                  <div>
                    <span className="text-2xl font-extrabold text-[#1F2937] flex items-center">
                      <IndianRupee className="w-5 h-5 text-[#4CAF7D]" />
                      {mentor.price || 1499}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold uppercase">per session</span>
                  </div>

                  <Button
                    onClick={() => handleOpenDialog(mentor)}
                    className="btn-sage font-bold rounded-xl px-5 h-10 text-xs shadow-md"
                  >
                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                    Book Session
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Interactive Booking Dialog Modal */}
      {selectedMentor && (
        <AppointmentDialog
          open={open}
          setOpen={setOpen}
          form={form}
          selectedMentor={selectedMentor}
        />
      )}
    </div>
  );
};

export default Mentors;

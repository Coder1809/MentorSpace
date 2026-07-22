import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  User,
  GraduationCap,
  Loader2,
  Code,
  Sparkles,
  Award,
  CalendarCheck,
  Search,
  IndianRupee,
  Star,
  Zap,
} from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import AppointmentDialog from "@/components/dialogs/AppointmentDialog";

const schema = z.object({
  mentorID: z.string(),
  date: z.date().refine((d) => d >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Date cannot be in the past",
  }),
  reason: z.string().min(1, { message: "Session goal/topic cannot be empty" }),
  timeSlot: z.enum(["Morning", "Afternoon", "Evening"], {
    errorMap: () => ({ message: "Select a valid time slot" }),
  }),
});

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      mentorID: "",
      date: new Date(),
      reason: "",
      timeSlot: "Morning",
    },
  });

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        setLoading(true);
        const res = await api.get("/mentor");
        setMentors(res.data.data || []);
      } catch (err) {
        toast.error("Failed to fetch mentors");
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const categories = [
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

  const filteredMentors = mentors.filter((mentor) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (mentor.specialization || "").toLowerCase().includes(selectedCategory.toLowerCase());
    const matchesSearch =
      searchQuery === "" ||
      (mentor.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mentor.specialization || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (mentor.bio || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          Verified Industry Mentors
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          Find Your <span className="gradient-text">Tech Mentor</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Connect 1-on-1 with senior engineers from top product companies for code reviews, mock interviews, system design, and career growth.
        </p>
      </div>

      {/* Search & Category Filter Section */}
      <div className="space-y-6">
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by mentor name, skill, or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 bg-slate-900/80 border-white/10 text-white rounded-2xl h-12 shadow-lg focus:border-indigo-500 text-sm"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <Button
                key={category}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full font-bold text-xs px-4 py-2 transition-all ${
                  isActive
                    ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 border-0"
                    : "border-white/10 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {category}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Mentor Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-slate-400 font-semibold text-sm">Loading verified mentors...</p>
        </div>
      ) : filteredMentors.length === 0 ? (
        <div className="text-center py-16 space-y-3 glass-card rounded-3xl p-8 border border-white/10 max-w-md mx-auto">
          <GraduationCap className="w-12 h-12 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No Mentors Found</h3>
          <p className="text-xs text-slate-400">
            No active mentors matched your current filter. Try adjusting your search query or domain category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card
              key={mentor._id}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-6">
                {/* Header Profile Info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-14 w-14 rounded-2xl border-2 border-indigo-500/30 shadow-md">
                      <AvatarFallback className="rounded-2xl bg-indigo-600 text-white font-extrabold text-lg">
                        {mentor.name?.substring(0, 2).toUpperCase() || "MT"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-extrabold text-white text-lg leading-snug">
                        {mentor.name}
                      </h3>
                      <p className="text-xs font-semibold text-indigo-400 flex items-center gap-1 mt-0.5">
                        <Code className="w-3.5 h-3.5" />
                        {mentor.specialization || "Tech Mentor"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`px-3 py-1 text-xs font-bold rounded-full ${
                      mentor.status === "Active"
                        ? "badge-glowing"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                    }`}
                  >
                    {mentor.status || "Active"}
                  </Badge>
                </div>

                {/* Bio Snippet */}
                <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 bg-slate-900/40 p-3.5 rounded-xl border border-white/5">
                  "{mentor.bio || "Senior software engineer guiding students in technical growth and interviews."}"
                </p>

                {/* Key Attributes */}
                <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Experience</span>
                    <p className="text-white font-extrabold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-purple-400" />
                      {mentor.experience || "5+ years"}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Rating</span>
                    <p className="text-amber-400 font-extrabold flex items-center gap-1">
                      4.95 <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full btn-gradient font-bold rounded-2xl h-11 text-sm shadow-lg shadow-indigo-600/30 transition-all"
                  onClick={() => {
                    setSelectedMentor(mentor);
                    form.reset({
                      mentorID: mentor._id,
                      date: new Date(),
                      reason: "",
                      timeSlot: "Morning",
                    });
                    setOpen(true);
                  }}
                  disabled={mentor.status === "Away" || form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Opening Payment...
                    </>
                  ) : (
                    <>
                      <CalendarCheck className="w-4 h-4 mr-2" />
                      Book Session (₹1,499)
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

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

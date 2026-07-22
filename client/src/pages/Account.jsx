import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/utils/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Siren, Loader2, Sparkles, CheckCircle, UserCheck, ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { useUserStore } from "@/store/userStore";

const studentSchema = z.object({
  name: z.string().min(1, "Name is required").max(40),
  age: z.coerce.number().min(1, "Must be at least 1").max(120, "Too old"),
  gender: z.enum(["Male", "Female"]),
  phone: z.string().min(10).max(10).regex(/^[0-9]+$/, "Only digits allowed"),
  description: z.string().min(1, "Goals / Description is required"),
});

const mentorSchema = z.object({
  name: z.string().min(1, "Name is required").max(40),
  age: z.coerce.number().min(1, "Must be at least 1").max(120, "Too old"),
  gender: z.enum(["Male", "Female"]),
  phone: z.string().min(10).max(10).regex(/^[0-9]+$/, "Only digits allowed"),
  specialization: z.string().min(1, "Specialization is required"),
  experience: z.string().min(1, "Experience is required"),
  bio: z.string().min(1, "Bio is required"),
  status: z.enum(["Active", "Away"]),
});

const Account = () => {
  const [details, setDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);

  const { user } = useUserStore();
  const currentRole = user?.role || localStorage.getItem("role") || "student";
  const isMentor = currentRole === "mentor";

  const form = useForm({
    resolver: zodResolver(isMentor ? mentorSchema : studentSchema),
    defaultValues: isMentor
      ? {
          name: "",
          age: 30,
          gender: "Male",
          phone: "9999999999",
          specialization: "React",
          experience: "5+ years",
          bio: "",
          status: "Active",
        }
      : {
          name: "",
          age: 22,
          gender: "Male",
          phone: "9999999999",
          description: "",
        },
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      if (isMentor) {
        const res = await api.get("/mentor/profile");
        setDetails(res.data.data || {});
      } else {
        const res = await api.get("/student");
        setDetails(res.data.data || {});
      }

      const appoint = await api.get("/appointment");
      setAppointments(appoint.data.data || []);
    } catch (err) {
      if (err.response?.status !== 404) {
        toast.error(err.response?.data?.message || "Error fetching your profile");
      } else {
        setAlert(true);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentRole]);

  useEffect(() => {
    if (details) {
      if (isMentor) {
        form.reset({
          name: details.name || "",
          age: details.age || 30,
          gender: details.gender || "Male",
          phone: details.phone || "9999999999",
          specialization: details.specialization || "React",
          experience: details.experience || "5+ years",
          bio: details.bio || "",
          status: details.status || "Active",
        });
      } else {
        form.reset({
          name: details.name || "",
          age: details.age || 22,
          gender: details.gender || "Male",
          phone: details.phone || "9999999999",
          description: details.description || "",
        });
      }
    }
  }, [details, isMentor]);

  const onSubmit = async (data) => {
    try {
      if (isMentor) {
        const res = await api.put("/mentor/profile", data);
        setDetails(res.data.data);
        toast.success("Mentor profile updated successfully!");
      } else {
        const res = await api.post("/student", data);
        setDetails(res.data.data);
        toast.success("Student profile updated successfully!");
      }
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.errors?.[0] || "Failed to update profile");
    }
  };

  const toggleMentorStatus = async () => {
    if (!isMentor) return;
    const newStatus = details.status === "Active" ? "Away" : "Active";
    try {
      const res = await api.put("/mentor/profile", { ...details, status: newStatus });
      setDetails(res.data.data);
      toast.success(`Availability status set to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {alert && !isMentor && (
        <Alert className="glass-card border-amber-500/40 text-amber-300 rounded-3xl p-6">
          <Siren className="h-6 w-6 text-amber-400 shrink-0" />
          <div className="w-full">
            <AlertTitle className="font-bold text-white">Student Record Not Found</AlertTitle>
            <AlertDescription className="text-sm text-slate-300">
              Complete your student profile below to start booking mentorship sessions.
            </AlertDescription>
          </div>
        </Alert>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
          <p className="text-slate-400 font-bold text-sm">Loading profile data...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Profile Overview Card & Edit Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card rounded-3xl p-6 border border-white/10 text-center space-y-6 flex flex-col items-center justify-center">
              <Avatar className="w-28 h-28 border-4 border-indigo-500/30 shadow-xl">
                <AvatarFallback className="text-2xl font-extrabold bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                  {details.name
                    ? details.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                    : isMentor
                    ? "M"
                    : "S"}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-1">
                <h1 className="text-2xl font-extrabold text-white">
                  {details.name || (isMentor ? "Mentor" : "Student")}
                </h1>
                <p className="text-xs font-bold text-indigo-400">
                  {isMentor ? details.specialization || "Tech Mentor" : "Student Account"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  className={`font-bold text-xs px-3.5 py-1 rounded-full ${
                    isMentor
                      ? details.status === "Active"
                        ? "badge-glowing"
                        : "bg-slate-800 text-slate-400 border border-slate-700"
                      : "bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                  }`}
                >
                  {isMentor ? `Status: ${details.status || "Active"}` : "Role: Student"}
                </Badge>

                {isMentor && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={toggleMentorStatus}
                    className="border-white/10 bg-slate-900/60 hover:bg-white/10 text-white font-bold text-xs rounded-full px-3"
                  >
                    Toggle {details.status === "Active" ? "Away" : "Active"}
                  </Button>
                )}
              </div>
            </Card>

            {/* Profile Details Card */}
            <Card className="glass-card rounded-3xl p-8 border border-white/10 lg:col-span-2 space-y-6 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-indigo-400" /> Account Details
                  </h2>

                  <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                      <Button className="btn-gradient font-bold rounded-xl text-xs px-4">
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-950 border border-white/10 text-white rounded-3xl p-6 max-w-lg">
                      <DialogTitle className="text-xl font-extrabold">
                        {isMentor ? "Update Mentor Profile" : "Update Student Profile"}
                      </DialogTitle>
                      <DialogDescription className="text-xs text-slate-400">
                        Update your public information and mentorship availability.
                      </DialogDescription>

                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-300 font-semibold text-xs">Full Name</FormLabel>
                                <FormControl>
                                  <Input className="bg-slate-900 border-white/10 text-white rounded-xl h-10 text-sm" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="phone"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-slate-300 font-semibold text-xs">Phone Number</FormLabel>
                                  <FormControl>
                                    <Input className="bg-slate-900 border-white/10 text-white rounded-xl h-10 text-sm" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name="gender"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-slate-300 font-semibold text-xs">Gender</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="bg-slate-900 border-white/10 text-white rounded-xl h-10 text-sm">
                                        <SelectValue placeholder="Select Gender" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="bg-slate-900 border-white/10 text-white">
                                      <SelectItem value="Male">Male</SelectItem>
                                      <SelectItem value="Female">Female</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          {isMentor ? (
                            <>
                              <div className="grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name="specialization"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-slate-300 font-semibold text-xs">Domain Specialization</FormLabel>
                                      <FormControl>
                                        <Input placeholder="React / System Design" className="bg-slate-900 border-white/10 text-white rounded-xl h-10 text-sm" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name="experience"
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-slate-300 font-semibold text-xs">Experience</FormLabel>
                                      <FormControl>
                                        <Input placeholder="5+ years" className="bg-slate-900 border-white/10 text-white rounded-xl h-10 text-sm" {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel className="text-slate-300 font-semibold text-xs">Mentor Bio</FormLabel>
                                    <FormControl>
                                      <Textarea placeholder="Senior Software Engineer..." className="bg-slate-900 border-white/10 text-white rounded-xl text-sm" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </>
                          ) : (
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-slate-300 font-semibold text-xs">Learning Goals / Bio</FormLabel>
                                  <FormControl>
                                    <Textarea placeholder="Targeting Full Stack Engineering offers..." className="bg-slate-900 border-white/10 text-white rounded-xl text-sm" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}

                          <DialogFooter className="pt-4">
                            <Button type="submit" className="btn-gradient font-bold w-full rounded-xl">
                              Save Changes
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Phone</span>
                    <p className="font-bold text-white">{details.phone || "Not set"}</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-1">
                    <span className="text-xs font-bold text-slate-400 uppercase">Gender</span>
                    <p className="font-bold text-white">{details.gender || "Not set"}</p>
                  </div>

                  {isMentor ? (
                    <>
                      <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase">Experience</span>
                        <p className="font-bold text-indigo-400">{details.experience || "5+ years"}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase">Specialization</span>
                        <p className="font-bold text-purple-400">{details.specialization || "Tech Mentor"}</p>
                      </div>
                    </>
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-900/50 border border-white/5 space-y-1 md:col-span-2">
                      <span className="text-xs font-bold text-slate-400 uppercase">Learning Target</span>
                      <p className="font-bold text-indigo-300">{details.description || "Full Stack Engineering & Career Growth"}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Session History Table */}
          <div className="glass-card rounded-3xl border border-white/10 shadow-2xl overflow-hidden p-6 space-y-4">
            <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" /> Session History & Bookings
            </h3>

            <Table>
              <TableHeader className="bg-slate-900/80 border-b border-white/10">
                <TableRow>
                  <TableHead className="font-bold text-slate-300">Date</TableHead>
                  <TableHead className="font-bold text-slate-300">Slot</TableHead>
                  <TableHead className="font-bold text-slate-300">Goal / Topic</TableHead>
                  <TableHead className="font-bold text-slate-300">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {appointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-slate-400 italic text-sm">
                      No session records found.
                    </TableCell>
                  </TableRow>
                ) : (
                  appointments.map((appt) => (
                    <TableRow key={appt._id} className="hover:bg-white/5 border-b border-white/5">
                      <TableCell className="font-semibold text-slate-300 text-sm">
                        {format(new Date(appt.date), "dd MMM yyyy")}
                      </TableCell>
                      <TableCell className="font-bold text-indigo-400 text-sm">
                        {appt.timeSlot}
                      </TableCell>
                      <TableCell className="font-medium text-white text-sm">
                        {appt.reason}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`font-bold text-xs px-3 py-1 rounded-full ${
                            appt.status === "Completed"
                              ? "badge-glowing"
                              : appt.status === "Accepted"
                              ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {appt.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;

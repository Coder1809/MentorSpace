import * as React from "react";
import {
  DollarSign,
  Home,
  UsersRound,
  CalendarCheck,
  GraduationCap,
  User,
  Clock,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import { useUserStore } from "@/store/userStore";

const mentorspaceInfo = {
  name: "MentorSpace",
  desc: "1-on-1 Mentorship Platform",
};

const sidebarConfig = {
  mentor: [
    { title: "Dashboard", url: "/mentor", icon: Home },
    { title: "Booking Requests", url: "/mentor/appointments", icon: CalendarCheck },
    { title: "Sessions", url: "/mentor/appointments", icon: Clock },
    { title: "Profile", url: "/account", icon: User },
  ],
  student: [
    { title: "Home", url: "/home", icon: Home },
    { title: "Mentors Directory", url: "/mentors", icon: UsersRound },
    { title: "Packages & Tracks", url: "/services", icon: BookOpen },
    { title: "My Appointments", url: "/account", icon: CalendarCheck },
    { title: "Transactions", url: "/transactions", icon: DollarSign },
    { title: "Profile", url: "/account", icon: User },
  ],
};

export function AppSidebar() {
  const location = useLocation();
  const { user } = useUserStore();
  const path = location.pathname;

  const role = user?.role || localStorage.getItem("role") || "student";
  const currentMenu = role === "mentor" || path.startsWith("/mentor") ? "mentor" : "student";
  const items = sidebarConfig[currentMenu] || sidebarConfig.student;

  return (
    <Sidebar className="border-r border-[#E5E7EB] bg-white">
      <SidebarHeader className="border-[#E5E7EB] h-16 border-b px-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" className="hover:bg-transparent">
              <Link to={currentMenu === "mentor" ? "/mentor" : "/home"} className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-xl bg-[#4CAF7D] text-white flex items-center justify-center font-bold shadow-md shadow-[#4CAF7D]/20">
                  <GraduationCap className="h-5 w-5 text-white" />
                  <AvatarFallback className="rounded-xl bg-[#4CAF7D] text-white font-extrabold">
                    MS
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-extrabold text-[#1F2937] flex items-center gap-1">
                    {mentorspaceInfo.name} <Sparkles className="w-3 h-3 text-[#F4C95D]" />
                  </span>
                  <span className="truncate text-xs font-semibold text-[#4CAF7D]">
                    {role === "mentor" ? "Mentor Console" : "Student Platform"}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <DatePicker />
        <SidebarSeparator className="my-3 mx-2" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item, idx) => {
                const isActive = path === item.url || (item.url !== "/mentor" && item.url !== "/home" && path.startsWith(item.url));
                return (
                  <SidebarMenuItem key={`${item.title}-${idx}`}>
                    <SidebarMenuButton
                      asChild
                      className={`p-3.5 rounded-xl font-bold transition-all text-sm ${
                        isActive
                          ? "bg-[#DDF4E7] text-[#2d6a4f] shadow-sm border border-[#4CAF7D]/20"
                          : "hover:bg-[#DDF4E7]/60 hover:text-[#4CAF7D] text-gray-600"
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-[#E5E7EB]">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

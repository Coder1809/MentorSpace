import { Calendar } from "@/components/ui/calendar"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"

export function DatePicker() {
  return (
    <SidebarGroup className="px-2 py-1">
      <SidebarGroupContent className="flex justify-center">
        <Calendar className="w-full border-none shadow-none bg-transparent p-1" />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

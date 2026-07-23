import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-white border border-[#E5E7EB] rounded-2xl shadow-sm", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-bold text-[#1F2937]",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-white p-0 opacity-70 hover:opacity-100 border-[#E5E7EB] hover:bg-[#FAFBF8]"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex justify-between",
        head_cell:
          "text-gray-500 rounded-md w-9 font-semibold text-[0.8rem] text-center",
        row: "flex w-full mt-2 justify-between",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-[#DDF4E7] [&:has([aria-selected])]:rounded-lg",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-lg"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-9 p-0 font-medium text-[#1F2937] hover:bg-[#DDF4E7]/60 hover:text-[#2e7d52] aria-selected:opacity-100 rounded-lg transition-colors"
        ),
        day_range_start:
          "day-range-start aria-selected:bg-[#4CAF7D] aria-selected:text-white",
        day_range_end:
          "day-range-end aria-selected:bg-[#4CAF7D] aria-selected:text-white",
        day_selected:
          "!bg-[#4CAF7D] !text-white hover:!bg-[#3F996A] hover:!text-white focus:!bg-[#4CAF7D] focus:!text-white font-bold rounded-lg shadow-sm",
        day_today: "bg-[#DDF4E7] text-[#2e7d52] font-bold rounded-lg",
        day_outside:
          "day-outside text-gray-300 opacity-50 aria-selected:text-gray-300",
        day_disabled: "text-gray-300 opacity-40 cursor-not-allowed pointer-events-none",
        day_range_middle:
          "aria-selected:bg-[#DDF4E7] aria-selected:text-[#2e7d52]",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ className, ...props }) => (
          <ChevronLeft className={cn("size-4 text-[#1F2937]", className)} {...props} />
        ),
        IconRight: ({ className, ...props }) => (
          <ChevronRight className={cn("size-4 text-[#1F2937]", className)} {...props} />
        ),
      }}
      {...props} />
  );
}

export { Calendar }

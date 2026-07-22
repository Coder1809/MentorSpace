import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { Slide, ToastContainer } from "react-toastify";
import { format } from "date-fns";

export default function SidebarLayout() {
  const date = new Date();
  const formattedDate = format(date, "EEEE, MMMM d, yyyy");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#FAFBF8] text-[#1F2937]">
        <header className="sticky top-0 z-40 flex items-center justify-between h-16 border-b border-[#E5E7EB] bg-white/90 backdrop-blur-xl px-6">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 text-gray-600 hover:text-[#4CAF7D]" />
            <Separator orientation="vertical" className="h-4 bg-[#E5E7EB]" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-gray-600 font-semibold text-sm">
                    {formattedDate}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full badge-mint text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#4CAF7D] animate-pulse" />
              MentorSpace Live Platform
            </div>
          </div>
        </header>

        <main className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        <ToastContainer
          position="top-center"
          autoClose={4000}
          limit={4}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="light"
          transition={Slide}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}

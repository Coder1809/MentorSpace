import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertOctagon, ArrowLeft, Home } from "lucide-react";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFBF8] text-[#1F2937] p-6 selection:bg-[#4CAF7D]">
      <div className="sage-card max-w-lg w-full rounded-3xl p-8 sm:p-12 text-center border border-[#E5E7EB] space-y-6 bg-white shadow-xl">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-red-50 border border-red-200 mx-auto">
          <AlertOctagon className="w-10 h-10 text-red-500" />
        </div>

        <h1 className="text-3xl font-extrabold text-[#1F2937]">
          Page Not Found
        </h1>

        <p className="text-sm text-gray-600 leading-relaxed">
          We couldn't locate the page you were looking for. Try returning to the dashboard or exploring verified mentors.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-[#E5E7EB] bg-white hover:bg-[#FAFBF8] text-[#1F2937] font-bold rounded-xl w-full sm:w-auto shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          <Link to="/" className="w-full sm:w-auto">
            <Button className="btn-sage font-bold rounded-xl w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-[#E5E7EB] text-xs text-gray-500">
          Error Code: <span className="font-mono text-[#2e7d52]">ERR_404_PAGE_NOT_FOUND</span>
        </div>
      </div>
    </div>
  );
};

export default Error;

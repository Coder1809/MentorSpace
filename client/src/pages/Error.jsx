import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertOctagon, ArrowLeft, Home, Mail } from "lucide-react";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090d16] text-slate-100 p-6 selection:bg-indigo-500">
      <div className="glass-card max-w-lg w-full rounded-3xl p-8 sm:p-12 text-center border border-white/10 space-y-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/15 border border-red-500/30 mx-auto">
          <AlertOctagon className="w-10 h-10 text-red-400" />
        </div>

        <h1 className="text-3xl font-extrabold text-white">
          Page Not Found
        </h1>

        <p className="text-sm text-slate-400 leading-relaxed">
          We couldn't locate the page you were looking for. Try returning to the dashboard or exploring verified mentors.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="border-white/10 bg-slate-900/60 hover:bg-white/10 text-white font-bold rounded-xl w-full sm:w-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          <Link to="/" className="w-full sm:w-auto">
            <Button className="btn-gradient font-bold rounded-xl w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>

        <div className="pt-4 border-t border-white/10 text-xs text-slate-500">
          Error Code: <span className="font-mono text-indigo-400">ERR_404_PAGE_NOT_FOUND</span>
        </div>
      </div>
    </div>
  );
};

export default Error;

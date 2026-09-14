import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/utils/api";

const RatingDialog = ({ open, setOpen, appointment, onRatingSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5 stars");
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/rating", {
        appointmentID: appointment._id,
        rating,
        review: review.trim(),
      });

      toast.success("Rating submitted successfully!");
      setRating(0);
      setReview("");
      onRatingSubmitted();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to submit rating"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayRating = hoveredRating || rating;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white border border-[#E5E7EB] text-[#1F2937] rounded-3xl p-6 sm:p-8 max-w-md shadow-xl">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-extrabold text-[#1F2937]">
            Rate Your Session
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            How was your mentorship session with{" "}
            <span className="font-bold text-[#2e7d52]">
              {appointment?.mentorID?.name || "your mentor"}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-2">
          {/* Star Rating */}
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-10 h-10 transition-colors ${
                      star <= displayRating
                        ? "fill-[#F59E0B] text-[#F59E0B]"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-bold text-gray-600">
              {displayRating === 0 && "Select a rating"}
              {displayRating === 1 && "Poor"}
              {displayRating === 2 && "Fair"}
              {displayRating === 3 && "Good"}
              {displayRating === 4 && "Very Good"}
              {displayRating === 5 && "Excellent"}
            </p>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
              Review (optional)
            </label>
            <Textarea
              placeholder="Share your experience with this mentor..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              maxLength={500}
              className="bg-[#FAFBF8] border-[#E5E7EB] text-[#1F2937] rounded-xl text-sm min-h-[80px] focus:border-[#4CAF7D]"
            />
            <p className="text-[10px] text-gray-400 text-right">
              {review.length}/500
            </p>
          </div>
        </div>

        <DialogFooter className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="w-full btn-sage font-bold h-12 rounded-xl text-base shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Submitting...
              </>
            ) : (
              `Submit ${rating > 0 ? `${rating}-Star` : ""} Rating`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RatingDialog;

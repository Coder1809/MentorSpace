import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/store/cartStore";
import {
  X,
  Trash2,
  ShoppingCart,
  Clock,
  IndianRupee,
  BadgeInfo,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/utils/api";
const favicon = "/favicon.png";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const CartSheet = ({ open, onOpenChange }) => {
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const handleCheckout = async () => {
    onOpenChange(false);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded || typeof window === "undefined" || !window.Razorpay) {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      const amount = getTotal();
      const { data } = await api.post("/payment/create-order", { amount });

      if (!data.success || (!data.orderId && !data.order?.id)) {
        throw new Error(data.message || "Order creation failed");
      }

      const orderId = data.orderId || data.order.id;
      const orderAmount = data.amount || data.order.amount;

      const options = {
        key: razorpayKey || "rzp_test_TGnrGPYdo2QcRT",
        amount: orderAmount, // in paise
        currency: data.currency || "INR",
        order_id: orderId,
        name: "MentorSpace Platform",
        description: "Mentorship Session Package Fee",
        image: favicon,
        handler: async function (response) {
          await api.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id || orderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amount: orderAmount,
            currency: data.currency || "INR",
            items: cart,
          });
          useCartStore.getState().clearCart();
          toast.success("Payment Verified & Mentorship Session Confirmed!");
        },
        modal: {
          ondismiss: function () {
            toast.info("Payment cancelled.");
          },
        },
        prefill: {
          name: "Student User",
          email: "student@mentorspace.io",
          contact: "9876543210",
        },
        theme: {
          color: "#4CAF7D",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || err.message || "Payment failed. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[350px] sm:w-[400px] flex flex-col max-h-screen bg-white text-[#1F2937] border-l border-[#E5E7EB]"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-extrabold text-[#1F2937] flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#4CAF7D]" />
            Selected Mentorship Sessions
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="mt-4 flex-1 overflow-y-auto px-2">
          {cart.length === 0 ? (
            <div className="text-center mt-8 text-gray-500">
              <ShoppingCart className="mx-auto mb-2 w-10 h-10 text-gray-300" />
              <p className="italic text-sm">No sessions selected yet</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex items-start justify-between gap-4 mb-4 p-4 border border-[#E5E7EB] rounded-2xl shadow-sm bg-[#FAFBF8]"
              >
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 text-base font-bold text-[#1F2937]">
                    <BadgeInfo className="w-4 h-4 text-[#4CAF7D]" />
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2 text-[#2e7d52] font-bold">
                    <IndianRupee className="w-4 h-4" />
                    {item.price}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 font-medium text-xs">
                    <Clock className="w-4 h-4 text-[#4CAF7D]" />
                    {item.duration || "45 minutes"}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 border border-red-200 hover:bg-red-50 hover:text-red-600 transition-all rounded-lg"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </ScrollArea>

        {cart.length > 0 && (
          <SheetFooter className="pt-4 flex flex-col gap-3 border-t border-[#E5E7EB] mt-4">
            <div className="flex text-xl justify-between items-center font-extrabold text-[#1F2937]">
              <span>Total Fee</span>
              <span>₹{getTotal()}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-1/2 text-red-600 border-red-200 hover:bg-red-50 font-bold rounded-xl"
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Clear
              </Button>
              <Button onClick={handleCheckout} className="w-1/2 btn-sage font-bold rounded-xl">
                Proceed to Pay
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;

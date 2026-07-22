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
      if (!isLoaded || typeof window.Razorpay === "undefined") {
        toast.error("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      const amount = getTotal();
      const { data } = await api.post("/payment/create-order", { amount });

      if (!data.success || !data.order) throw new Error("Order creation failed");

      const options = {
        key: razorpayKey || "rzp_test_dummy_key_id",
        amount: data.order.amount,
        currency: data.order.currency || "INR",
        name: "MentorSpace Platform",
        description: "Mentorship Session Package Fee",
        image: favicon,
        order_id: data.order.id,
        handler: async function (response) {
          await api.post("/payment/verify", {
            razorpay_order_id: response.razorpay_order_id || data.order.id,
            razorpay_payment_id: response.razorpay_payment_id || `pay_test_${Date.now()}`,
            razorpay_signature: response.razorpay_signature || "mock_signature",
            amount: data.order.amount,
            currency: data.order.currency || "INR",
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
          color: "#4f46e5",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[350px] sm:w-[400px] flex flex-col max-h-screen"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Selected Mentorship Sessions
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="mt-4 flex-1 overflow-y-auto px-2">
          {cart.length === 0 ? (
            <div className="text-center mt-8 text-slate-500 dark:text-slate-400">
              <ShoppingCart className="mx-auto mb-2 w-10 h-10 text-slate-400" />
              <p className="italic">No sessions selected yet</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex items-start justify-between gap-4 mb-4 p-4 border rounded-xl shadow-sm bg-slate-50 dark:bg-slate-900/40"
              >
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 text-base font-semibold text-slate-800 dark:text-white">
                    <BadgeInfo className="w-4 h-4 text-indigo-600" />
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <IndianRupee className="w-4 h-4" />
                    {item.price}
                  </div>
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium">
                    <Clock className="w-4 h-4" />
                    {item.duration || "45 minutes"}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item._id)}
                  className="text-destructive border border-destructive/30 shadow-sm hover:bg-destructive hover:text-white transition-all rounded-md"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </ScrollArea>

        {cart.length > 0 && (
          <SheetFooter className="pt-4 flex flex-col gap-3 border-t mt-4">
            <div className="flex text-xl justify-between items-center font-semibold text-slate-900 dark:text-slate-100">
              <span>Total Fee</span>
              <span>₹{getTotal()}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-1/2 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Clear
              </Button>
              <Button onClick={handleCheckout} className="w-1/2 font-semibold bg-indigo-600 hover:bg-indigo-700 text-white">
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

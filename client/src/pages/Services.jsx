import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ShoppingCart, Clock, Check, Sparkles, IndianRupee, BookOpen, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartSheet from "@/components/CartSheet";

const CATEGORIES = [
  "All",
  "Web Development",
  "Competitive Programming",
  "Machine Learning",
  "System Design",
  "DSA",
  "Resume Review",
  "Mock Interview",
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sheetOpen, setSheetOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data.data || []);
      } catch (err) {
        toast.error("Error fetching mentorship services");
      }
    };

    fetchServices();
  }, []);

  const filteredServices =
    selectedCategory === "All"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          Structured Mentorship Packages
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
          Mentorship Tracks & <span className="gradient-text">Mock Interviews</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          Select custom mentorship tracks designed to fast-track your coding skills, system design knowledge, and career opportunities.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <Button
                key={cat}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full font-bold text-xs px-4 py-2 transition-all ${
                  isActive
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30 border-0"
                    : "border-white/10 bg-slate-900/60 text-slate-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {cat}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => {
          const inCart = cart.some((item) => item._id === service._id);
          return (
            <Card
              key={service._id}
              className="glass-card glass-card-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between"
            >
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <Badge className="tech-tag text-xs font-bold px-3 py-1 rounded-full">
                      {service.category || "General"}
                    </Badge>
                    <h3 className="text-lg font-extrabold text-white pt-2 leading-snug">
                      {service.name}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white flex items-center justify-end">
                      <IndianRupee className="w-5 h-5 text-emerald-400" />
                      {service.price}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">per session</span>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed bg-slate-900/40 p-4 rounded-2xl border border-white/5">
                  {service.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                  <Clock className="w-4 h-4" />
                  <span>Duration: {service.duration || "45 minutes"}</span>
                </div>
              </CardContent>

              <div className="p-6 pt-0">
                <Button
                  onClick={() => {
                    addToCart(service);
                    toast.success(`${service.name} added to session cart!`);
                  }}
                  disabled={inCart}
                  className={`w-full font-bold rounded-2xl h-11 text-sm transition-all ${
                    inCart
                      ? "bg-slate-800 text-slate-400 border border-slate-700 cursor-not-allowed"
                      : "btn-gradient shadow-lg shadow-indigo-600/30"
                  }`}
                >
                  {inCart ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-emerald-400" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Session Cart
                    </>
                  )}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Floating Cart Launcher Button */}
      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 z-40">
          <Button
            onClick={() => setSheetOpen(true)}
            className="btn-gradient font-bold rounded-full h-14 px-6 shadow-2xl shadow-indigo-500/50 flex items-center gap-3 animate-bounce"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>View Cart ({cart.length})</span>
          </Button>
        </div>
      )}

      {/* Cart Sheet Drawer */}
      <CartSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
};

export default Services;

import React from "react";
import { useShop } from "../context/ShopContext";
import { ArrowRight, Tag, Sparkles, ShieldCheck, Truck } from "lucide-react";

export default function Hero() {
  const { setSelectedCategory } = useShop();

  // Scroll smoothly down to the products anchor section
  const handleScrollToCatalog = () => {
    const el = document.getElementById("catalog-main-anchor");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleShopSpecial = (cat) => {
    setSelectedCategory(cat);
    handleScrollToCatalog();
  };

  return (
    <div id="brainybaiz-hero" className="relative overflow-hidden bg-[#fcfcfc] py-10 sm:py-12 border-b border-[#e5e5e5]">
      
      {/* Editorial Decorative Background Accent */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 h-[30rem] w-[30rem] rounded-full bg-slate-100/30 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Core Editorial Top Banner */}
        <div className="mb-10 overflow-hidden rounded-3xl bg-[#1a1a1a] px-8 py-10 md:px-12 md:py-12 relative flex items-center shadow-lg">
          <div className="relative z-10 max-w-lg space-y-4">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-[#ff4e00]/20 px-3 py-1 text-[10px] font-bold tracking-widest uppercase text-[#ff4e00]">
              <Tag className="h-3 w-3" />
              <span>MEGA SALE • UP TO 60% OFF</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-3xl font-black italic tracking-tight text-white sm:text-4xl md:text-5xl leading-none">
              The Infinite Collection
            </h1>

            {/* Description */}
            <p className="max-w-md text-xs sm:text-sm text-white/70 leading-relaxed uppercase tracking-widest">
              Curated by Principal Engineers for the Modern Dev
            </p>

            {/* Interactive Call-to-actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={handleScrollToCatalog}
                className="group flex items-center gap-2 rounded-full bg-[#ff4e00] px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest text-white shadow-lg shadow-[#ff4e00]/20 hover:bg-black transition-colors"
              >
                <span>Explore Shop</span>
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => handleShopSpecial("laptops")}
                className="rounded-full bg-white/10 border border-white/20 text-white px-5 py-2.5 text-[10px] uppercase font-bold tracking-widest hover:bg-white hover:text-[#1a1a1a] transition-all"
              >
                Hot Tech Deals
              </button>
            </div>

          </div>

          <div className="absolute right-[-5%] bottom-[-20%] md:bottom-auto md:top-0 h-full w-1/2 bg-gradient-to-l from-[#ff4e00]/10 to-transparent flex items-center justify-center pointer-events-none">
            <span className="text-[120px] md:text-[160px] font-serif font-black text-white/5 select-none uppercase tracking-tighter">B.B</span>
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 py-6 border-t border-[#e5e5e5]">
          
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[#fa4e00]">
              <ShieldCheck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">Protected Payments</h4>
              <p className="text-[10px] text-[#999]">Verified Secured Sandbox</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[#fa4e00]">
              <Truck className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">Free Over $150</h4>
              <p className="text-[10px] text-[#999]">Express Global Delivery</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f3f3f3] text-[#fa4e00]">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">Premium Curation</h4>
              <p className="text-[10px] text-[#999]">Sourced Premium Brands</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

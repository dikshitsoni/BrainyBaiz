import React from "react";
import { ShopProvider } from "./context/ShopContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Catalog from "./components/Catalog";
import CartDrawer from "./components/CartDrawer";
import CheckoutModal from "./components/CheckoutModal";

export default function App() {
  return (
    <ShopProvider>
      <div className="min-h-screen bg-[#fcfcfc] font-sans antialiased text-[#1a1a1a]">
        
        {/* Sticky Header Navigation */}
        <Navbar />

        {/* Feature Hero Banner */}
        <Hero />

        {/* Interactive Main Catalog Grid & Sidebar Filters */}
        <main className="relative pb-24">
          <Catalog />
        </main>

        {/* Slide-out side Shopping Cart container */}
        <CartDrawer />

        {/* Multi-step checkout modal verification */}
        <CheckoutModal />

        {/* Humble, Professional Footer */}
        <footer className="border-t border-[#e5e5e5] bg-white py-8 text-center text-[10px] uppercase tracking-widest text-[#999]">
          <p>© 2026 BrainyBaiz</p>
        </footer>

      </div>
    </ShopProvider>
  );
}

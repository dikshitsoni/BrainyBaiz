import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { Search, ShoppingBag, ChevronDown, Menu, Sparkles, X } from "lucide-react";

export default function Navbar() {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    handleSearch,
    cartItemCount,
    setCartOpen,
    resetFilters
  } = useShop();

  const [localQuery, setLocalQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Trigger search on typing with custom input event
  const onChangeSearch = (e) => {
    const val = e.target.value;
    setLocalQuery(val);
    handleSearch(val);
  };

  // Clear query helper
  const handleClearSearch = () => {
    setLocalQuery("");
    handleSearch("");
  };

  const handleCategorySelect = (slug) => {
    setSelectedCategory(slug);
    setDropdownOpen(false);
  };

  const selectCategoryName = selectedCategory
    ? categories.find(c => c.slug === selectedCategory)?.name || selectedCategory
    : "All Categories";

  return (
    <header id="brainybaiz-navbar" className="sticky top-0 z-40 w-full border-b border-[#e5e5e5] bg-[#fcfcfc]/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* LOGO & BRAND */}
          <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={resetFilters}>
            <span className="font-serif text-2xl font-black tracking-tighter uppercase text-[#1a1a1a]">
              Brainy<span className="text-[#ff4e00]">Baiz</span>
            </span>
          </div>

          {/* SEARCH BAR */}
          <div className="relative flex max-w-md flex-1 items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <Search className="h-3.5 w-3.5 text-[#999]" />
            </div>
            <input
              type="text"
              value={localQuery || searchQuery}
              onChange={onChangeSearch}
              placeholder="Search products..."
              className="w-full rounded-full border border-none bg-[#f3f3f3] py-2 pl-10 pr-10 text-xs text-[#1a1a1a] outline-none transition-all placeholder:italic placeholder:text-[#999] focus:ring-1 focus:ring-black"
            />
            {(localQuery || searchQuery) && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#999] hover:text-[#1a1a1a]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* ACTIONS CONTAINER */}
          <div className="flex items-center gap-6">
            
            {/* DYNAMIC CATEGORY DROPDOWN */}
            <div className="relative hidden md:block">
              <button
                id="category-dropdown-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1.5 px-1 py-2 text-[11px] font-bold uppercase tracking-widest text-[#666] hover:text-[#1a1a1a] transition-colors"
              >
                <span>{selectCategoryName}</span>
                <ChevronDown className={`h-3 w-3 text-[#999] transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-[#e5e5e5] bg-[#fcfcfc] p-2 shadow-lg z-50">
                    <div className="max-h-64 overflow-y-auto scrollbar-thin">
                      <button
                        onClick={() => handleCategorySelect("")}
                        className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-xs font-bold uppercase tracking-wider ${
                          !selectedCategory
                            ? "bg-[#f3f3f3] text-[#ff4e00]"
                            : "text-[#666] hover:bg-[#f3f3f3] hover:text-[#1a1a1a]"
                        }`}
                      >
                        All Categories
                      </button>
                      <div className="my-1 border-t border-[#e5e5e5]" />
                      {categories.map((cat) => (
                        <button
                          key={cat.slug}
                          onClick={() => handleCategorySelect(cat.slug)}
                          className={`flex w-full items-center rounded-lg px-3 py-2 text-left text-xs ${
                            selectedCategory === cat.slug
                              ? "bg-[#f3f3f3] text-[#ff4e00] font-bold"
                              : "text-[#666] hover:bg-[#f3f3f3] hover:text-[#1a1a1a]"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* QUICK LINK TO ALL */}
            <button
              onClick={resetFilters}
              className="hidden sm:block text-[11px] font-bold uppercase tracking-widest text-[#666] hover:text-black border-b-2 border-transparent hover:border-black pb-0.5 transition-all"
            >
              Shop All
            </button>

            {/* CART ICON WITH BADGE */}
            <button
              id="navbar-cart-trigger"
              onClick={() => setCartOpen(true)}
              className="group relative flex h-9 w-9 items-center justify-center rounded-full bg-black text-white hover:bg-[#ff4e00] transition-all focus:outline-none"
            >
              <ShoppingBag className="h-4.5 w-4.5 transition-transform group-hover:scale-105" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#ff4e00] text-[10px] font-bold text-white ring-2 ring-[#fcfcfc] animate-scale">
                  {cartItemCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}

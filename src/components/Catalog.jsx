import React from "react";
import { useShop } from "../context/ShopContext";
import { Star, ArrowUpDown, Grid, RefreshCw, AlertCircle, ShoppingCart } from "lucide-react";

export default function Catalog() {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    loading,
    error,
    resetFilters,
    addToCart
  } = useShop();

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug === selectedCategory ? "" : slug);
  };

  // Convert decimal to high-contrast rating stars
  const renderStars = (rating) => {
    const rounded = Math.round(rating);
    return (
      <div className="flex items-center gap-0.5 text-amber-500">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-2.5 w-2.5 ${i < rounded ? "fill-current" : "text-slate-200"}`}
          />
        ))}
        <span className="ml-1 text-[10px] font-mono text-[#999]">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <section id="catalog-main-anchor" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-[#fcfcfc]">
      
      {/* Title Header with Category Name */}
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-[#e5e5e5] pb-5">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1a1a1a] sm:text-3xl">
            {selectedCategory ? (
              <>
                Collection: <span className="italic font-normal text-[#ff4e00]">{categories.find((c) => c.slug === selectedCategory)?.name}</span>
              </>
            ) : (
              "Recent Findings"
            )}
          </h2>
          <p className="mt-1 text-xs uppercase tracking-widest text-[#999] font-mono">
            — Showing {products.length} {products.length === 1 ? "Premium Item" : "Premium Items"}
          </p>
        </div>

        {/* Filters and Client-Side Sorter */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-[#999]" />
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent border-none text-[10px] font-bold uppercase tracking-widest focus:ring-0 cursor-pointer text-[#1a1a1a]"
            >
              <option value="default">Sort: Popularity</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated Ratings</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        
        {/* SIDEBAR FOR CATEGORIES (Desktop) */}
        <aside className="hidden lg:block shrink-0">
          <div className="sticky top-24 rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-xs">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-[#999]">
              Browse Categories
            </h3>
            
            <button
              onClick={() => setSelectedCategory("")}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                !selectedCategory
                  ? "bg-[#f3f3f3] text-[#ff4e00]"
                  : "text-[#666] hover:bg-[#f3f3f3] hover:text-[#1a1a1a]"
              }`}
            >
              <span>All Collections</span>
              <span className="text-[10px] font-mono opacity-60">/20</span>
            </button>

            <div className="mt-2 space-y-1 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
              {categories.map((cat, idx) => {
                const isActive = selectedCategory === cat.slug;
                const mockCount = (19 - (idx * 3) % 17).toString().padStart(2, "0");
                return (
                  <button
                    key={cat.slug}
                    onClick={() => handleCategoryClick(cat.slug)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all text-left ${
                      isActive
                        ? "bg-[#f3f3f3] text-[#ff4e00] font-bold"
                        : "text-[#666] hover:bg-[#f3f3f3] hover:text-[#1a1a1a]"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] font-mono opacity-50">/{mockCount}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT CATALOG GRID CONTAINER */}
        <div className="lg:col-span-3">
          
          {/* HORIZONTAL CATEGORY SCROLLER (Mobile-friendly) */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-3 lg:hidden scrollbar-none">
            <button
              onClick={() => setSelectedCategory("")}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                !selectedCategory
                  ? "bg-black text-white"
                  : "bg-[#f3f3f3] text-[#666] hover:bg-slate-200"
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-black text-white"
                      : "bg-[#f3f3f3] text-[#666] hover:bg-slate-200"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* ASYNC STATE: ERROR OCCURRED */}
          {error && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-[#ff4e00]" />
              <h3 className="mt-4 text-sm font-bold text-[#1a1a1a] uppercase tracking-wider">Catalogue Lookup Failed</h3>
              <p className="mt-2 text-xs text-rose-600">{error}</p>
              <button
                onClick={resetFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#ff4e00] transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Catalog Load</span>
              </button>
            </div>
          )}

          {/* ASYNC STATE: LOADING SKELETON GRID */}
          {loading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl border border-[#eee] bg-white p-4">
                  <div className="aspect-square w-full rounded-xl bg-[#f8f8f8]" />
                  <div className="mt-4 space-y-3">
                    <div className="h-4 w-2/3 rounded bg-[#f3f3f3]" />
                    <div className="h-3 w-full rounded bg-[#f3f3f3]" />
                    <div className="h-9 w-full rounded-lg bg-[#f3f3f3] pt-2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* NO PRODUCTS FOUND */}
          {!loading && !error && products.length === 0 && (
            <div className="rounded-2xl border border-[#e5e5e5] bg-[#fcfcfc] py-16 text-center">
              <p className="text-[#999] text-xs uppercase tracking-widest">No matching items resolved.</p>
              <button
                onClick={resetFilters}
                className="mt-4 rounded-full border border-[#e5e5e5] bg-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a] hover:bg-black hover:text-white transition-all"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* LOADED PRODUCTS GRID */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                // Calculate original retail value dynamically based on discount percentage
                const originalPrice = product.discountPercentage
                  ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
                  : product.price.toFixed(2);

                return (
                  <div
                    key={product.id}
                    className="group relative flex flex-col justify-between rounded-2xl border border-[#eee] bg-white p-3 transition-all hover:border-black hover:shadow-xl"
                  >
                    
                    {/* Discount Badge */}
                    {product.discountPercentage && (
                      <div className="absolute top-5 right-5 z-10 rounded-full bg-black text-white text-[9px] px-2 py-0.5 font-bold">
                        -{Math.round(product.discountPercentage)}%
                      </div>
                    )}

                    {/* Image Frame */}
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-[#f8f8f8] relative flex items-center justify-center p-2">
                      <img
                        src={product.thumbnail}
                        alt={product.title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-contain opacity-90 transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Product Details info */}
                    <div className="mt-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-[9px] font-bold text-[#fafafa] bg-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                            {product.category}
                          </span>
                          {renderStars(product.rating)}
                        </div>

                        <div className="flex justify-between items-start gap-1 font-serif mt-1">
                          <h4 className="text-sm font-bold text-[#1a1a1a] line-clamp-1 group-hover:text-[#ff4e00] transition-colors">
                            {product.title}
                          </h4>
                          <span className="text-sm font-mono font-bold text-[#1a1a1a] shrink-0">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        
                        <p className="mt-1 text-[11px] text-[#999] line-clamp-1">
                          {product.description}
                        </p>
                      </div>

                      {product.stock <= 5 && (
                        <span className="text-[9px] font-bold text-[#ff4e00] animate-pulse mt-1">
                          Only {product.stock} items left in storage!
                        </span>
                      )}
                    </div>

                    {/* Purchase and values footer */}
                    <div className="mt-3.5 pt-2 border-t border-[#fcfcfc]">
                      <button
                        onClick={() => addToCart(product)}
                        id={`add-to-cart-${product.id}`}
                        className="mt-auto w-full py-2 bg-[#f3f3f3] hover:bg-black hover:text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                      >
                        Add to Cart
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

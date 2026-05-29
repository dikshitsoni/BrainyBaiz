import React, { createContext, useState, useEffect, useContext } from "react";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  // Products and Categories data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sorting state - "default" | "price-asc" | "price-desc" | "rating"
  const [sortBy, setSortBy] = useState("default");

  // Loading & Error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cart state
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("brainybaiz_cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // UI Drawer/Modal state
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("shipping"); // "shipping" | "payment" | "success"
  const [orderTrackingNumber, setOrderTrackingNumber] = useState("");

  // Save cart to localstorage whenever it changes
  useEffect(() => {
    localStorage.setItem("brainybaiz_cart", JSON.stringify(cart));
  }, [cart]);

  // Fetch Category List on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://dummyjson.com/products/category-list");
        if (!res.ok) throw new Error("Failed to load categories");
        const data = await res.json();
        // Capitalize category names for visual elegance
        const formatted = data.map(cat => ({
          slug: cat,
          name: cat.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
        }));
        setCategories(formatted);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Central fetch products mechanism
  const fetchProducts = async (categorySlug = "", query = "") => {
    setLoading(true);
    setError(null);
    try {
      let url = "https://dummyjson.com/products?limit=20";
      
      if (categorySlug) {
        url = `https://dummyjson.com/products/category/${categorySlug}`;
      } else if (query) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Could not retrieve product listings. Please try again.");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      setError(err.message || "An error occurred while fetching products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Trigger fetch on category change
  useEffect(() => {
    // If we select a category, search query stays empty or is cleared to preserve API behavior
    if (selectedCategory) {
      setSearchQuery("");
      fetchProducts(selectedCategory, "");
    } else {
      fetchProducts("", searchQuery);
    }
  }, [selectedCategory]);

  // Live search handler (or manual form submit)
  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedCategory(""); // Clear active category filter when search occurs
    fetchProducts("", query);
  };

  // Reset all filters to show default catalog
  const resetFilters = () => {
    setSelectedCategory("");
    setSearchQuery("");
    setSortBy("default");
    fetchProducts("", "");
  };

  // Derived sorted products
  const sortedProducts = React.useMemo(() => {
    const productsCopy = [...products];
    if (sortBy === "price-asc") {
      return productsCopy.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      return productsCopy.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      return productsCopy.sort((a, b) => b.rating - a.rating);
    }
    return productsCopy; // Default (API sorting)
  }, [products, sortBy]);

  // Cart operations
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
    // Dynamically open cart drawer briefly on add as premium user feedback
    setCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, amt) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + amt;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculations
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const estimatedShipping = cartSubtotal > 150 ? 0 : cartSubtotal > 0 ? 9.99 : 0;
  const estimatedTax = cartSubtotal * 0.08; // 8% tax rate
  const cartTotal = cartSubtotal + estimatedShipping + estimatedTax;

  // Checkout workflow
  const startCheckout = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
    setCheckoutStep("shipping");
  };

  const completeCheckout = (shippingDetails) => {
    // Generate a high-contrast random tracking number e.g. BBZ-48293-2026
    const trackingNo = `BBZ-${Math.floor(100000 + Math.random() * 900000)}-2026`;
    setOrderTrackingNumber(trackingNo);
    setCheckoutStep("success");
    clearCart(); // Clear cart after success
  };

  return (
    <ShopContext.Provider
      value={{
        products: sortedProducts,
        rawProducts: products,
        categories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        handleSearch,
        sortBy,
        setSortBy,
        loading,
        error,
        resetFilters,
        
        // Cart state
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartItemCount,
        cartSubtotal,
        estimatedShipping,
        estimatedTax,
        cartTotal,

        // Drawer/Checkout modal state
        cartOpen,
        setCartOpen,
        checkoutOpen,
        setCheckoutOpen,
        checkoutStep,
        setCheckoutStep,
        orderTrackingNumber,
        startCheckout,
        completeCheckout
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShop must be used within a ShopProvider");
  }
  return context;
}

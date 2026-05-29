import React from "react";
import { useShop } from "../context/ShopContext";
import { X, Trash2, Plus, Minus, CreditCard, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    updateQuantity,
    removeFromCart,
    cartSubtotal,
    estimatedShipping,
    estimatedTax,
    cartTotal,
    startCheckout
  } = useShop();

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Drawer Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-[#1a1a1a]/40 backdrop-blur-xs"
          />

          {/* Sliding Drawer Container */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-[#fcfcfc] shadow-2xl border-l border-[#e5e5e5]"
          >
            {/* Header */}
            <div className="flex h-16 items-center justify-between border-b border-[#e5e5e5] px-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4.5 w-4.5 text-[#1a1a1a]" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[#1a1a1a]">Your Bag</h2>
              </div>
              <button
                id="close-cart-drawer"
                onClick={() => setCartOpen(false)}
                className="rounded-full p-1 hover:bg-[#f3f3f3] text-[#999] hover:text-[#1a1a1a] transition-colors"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Cart Items Container */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {cart.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f3f3f3] text-[#999] mb-4">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#1a1a1a]">Your bag is empty</h3>
                  <p className="mt-2 text-[11px] text-[#999] max-w-xs uppercase tracking-wider mb-6">
                    Connect with premium styles. Discover fresh DummyJSON catalogue selections.
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="rounded-full bg-black px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#ff4e00] transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex gap-4 border-b border-[#e5e5e5]/40 pb-4 last:border-0 last:pb-0"
                    >
                      {/* Product Thumbnail Pic */}
                      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#e5e5e5] bg-[#f8f8f8]">
                        <img
                          src={item.product.thumbnail}
                          alt={item.product.title}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-contain p-1"
                        />
                      </div>

                      {/* Item Info and actions */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1 font-serif">
                            <h4 className="text-xs font-bold text-[#1a1a1a] line-clamp-1">
                              {item.product.title}
                            </h4>
                            <span className="text-xs font-mono font-bold text-[#1a1a1a] shrink-0">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <span className="text-[10px] font-mono text-[#999]">
                            ${item.product.price} each
                          </span>
                        </div>

                        {/* Quantity Counter & Delete */}
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-1 rounded-full border border-[#e5e5e5] bg-[#f3f3f3] p-0.5">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="flex h-5 w-5 items-center justify-center rounded-full text-[#666] hover:bg-white hover:shadow-xs transition-all active:scale-90"
                            >
                              <Minus className="h-2.5 w-2.5" />
                            </button>
                            <span className="w-6 text-center text-xs font-mono font-bold text-[#1a1a1a]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="flex h-5 w-5 items-center justify-center rounded-full text-[#666] hover:bg-white hover:shadow-xs transition-all active:scale-90"
                            >
                              <Plus className="h-2.5 w-2.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="rounded-full p-1.5 text-[#999] hover:bg-rose-50 hover:text-rose-600 transition-colors"
                            title="Remove from cart"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bottom Calculations Drawer Box */}
            {cart.length > 0 && (
              <div className="border-t border-[#e5e5e5] bg-white p-6 space-y-4">
                <div className="space-y-1.5 text-xs text-[#666] font-medium uppercase tracking-wider">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-mono font-bold text-[#1a1a1a]">${cartSubtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    {estimatedShipping === 0 ? (
                      <span className="font-mono font-bold text-emerald-600">FREE SHIPPING</span>
                    ) : (
                      <span className="font-mono font-bold text-[#1a1a1a]">${estimatedShipping.toFixed(2)}</span>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <span>Estimated Sales Tax (8%)</span>
                    <span className="font-mono font-bold text-[#1a1a1a]">${estimatedTax.toFixed(2)}</span>
                  </div>

                  {estimatedShipping > 0 && (
                    <div className="rounded-lg bg-orange-50 p-2 text-center text-[10px] text-[#ff4e00] font-bold uppercase tracking-wider">
                      💡 Add <span className="font-mono">${(150 - cartSubtotal).toFixed(2)}</span> more to unlock **FREE SHIPPING**!
                    </div>
                  )}
                </div>

                <div className="border-t border-[#e5e5e5] pt-3 flex justify-between items-center text-sm">
                  <span className="font-bold text-[#1a1a1a] uppercase tracking-widest">Grand Total</span>
                  <span className="font-mono font-black text-[#ff4e00] text-lg">${cartTotal.toFixed(2)}</span>
                </div>

                {/* Checkout Trigger button */}
                <button
                  onClick={startCheckout}
                  id="checkout-trigger-btn"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-md hover:bg-[#ff4e00] transition-colors cursor-pointer outline-none"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Proceed to Safe Checkout</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

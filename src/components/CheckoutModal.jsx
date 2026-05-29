import React, { useState } from "react";
import { useShop } from "../context/ShopContext";
import { X, CreditCard, Truck, CheckCircle2, AlertCircle, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function CheckoutModal() {
  const {
    checkoutOpen,
    setCheckoutOpen,
    checkoutStep,
    setCheckoutStep,
    orderTrackingNumber,
    completeCheckout,
    cartTotal,
    cart
  } = useShop();

  // SHIPPING STEP FORM VALUES
  const [shippingForm, setShippingForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    phone: ""
  });
  
  const [shippingErrors, setShippingErrors] = useState({});
  const [shippingTouched, setShippingTouched] = useState({});

  // PAYMENT STEP FORM VALUES
  const [paymentForm, setPaymentForm] = useState({
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: ""
  });

  const [paymentErrors, setPaymentErrors] = useState({});
  const [paymentTouched, setPaymentTouched] = useState({});

  const [processing, setProcessing] = useState(false);

  // VALIDATORS
  const validateShippingField = (name, val) => {
    switch (name) {
      case "fullName":
        return val.trim().length >= 3 ? "" : "Full name must be at least 3 characters.";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? "" : "Please enter a valid email address.";
      case "address":
        return val.trim().length >= 8 ? "" : "Please enter a valid shipping address.";
      case "city":
        return val.trim().length >= 2 ? "" : "Please enter a valid city name.";
      case "zipCode":
        return /^\d{5,6}$/.test(val) ? "" : "Zip code must be 5-6 digits.";
      case "phone":
        return /^\+?[\d\s-]{8,}$/.test(val) ? "" : "Please enter a valid phone number.";
      default:
        return "";
    }
  };

  const validatePaymentField = (name, val) => {
    switch (name) {
      case "cardName":
        return val.trim().length >= 3 ? "" : "Name on card is required.";
      case "cardNumber":
        return /^\d{16}$/.test(val.replace(/\s/g, "")) ? "" : "Card number must be 16 digits.";
      case "cardExpiry":
        return /^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(val) ? "" : "MM/YY expiry is required.";
      case "cardCvc":
        return /^\d{3}$/.test(val) ? "" : "CVC must be 3 digits.";
      default:
        return "";
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShippingForm(prev => ({ ...prev, [name]: value }));
    if (shippingTouched[name]) {
      setShippingErrors(prev => ({ ...prev, [name]: validateShippingField(name, value) }));
    }
  };

  const handleShippingBlur = (e) => {
    const { name, value } = e.target;
    setShippingTouched(prev => ({ ...prev, [name]: true }));
    setShippingErrors(prev => ({ ...prev, [name]: validateShippingField(name, value) }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    
    // Auto-formatting card inputs
    let formattedVal = value;
    if (name === "cardNumber") {
      formattedVal = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === "cardExpiry") {
      formattedVal = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substring(0, 5);
    } else if (name === "cardCvc") {
      formattedVal = value.replace(/\D/g, '').substring(0, 3);
    }

    setPaymentForm(prev => ({ ...prev, [name]: formattedVal }));
    if (paymentTouched[name]) {
      setPaymentErrors(prev => ({ ...prev, [name]: validatePaymentField(name, formattedVal) }));
    }
  };

  const handlePaymentBlur = (e) => {
    const { name, value } = e.target;
    setPaymentTouched(prev => ({ ...prev, [name]: true }));
    setPaymentErrors(prev => ({ ...prev, [name]: validatePaymentField(name, value) }));
  };

  // ADVANCE FROM SHIPPING TO PAYMENT
  const onSubmitShipping = (e) => {
    e.preventDefault();
    const errors = {};
    Object.keys(shippingForm).forEach(key => {
      const err = validateShippingField(key, shippingForm[key]);
      if (err) errors[key] = err;
    });

    if (Object.keys(errors).length > 0) {
      setShippingErrors(errors);
      setShippingTouched(
        Object.keys(shippingForm).reduce((acc, k) => ({ ...acc, [k]: true }), {})
      );
      return;
    }

    setCheckoutStep("payment");
  };

  // COMPLETE ORDER PAYMENT
  const onSubmitPayment = (e) => {
    e.preventDefault();
    const errors = {};
    Object.keys(paymentForm).forEach(key => {
      const err = validatePaymentField(key, paymentForm[key]);
      if (err) errors[key] = err;
    });

    if (Object.keys(errors).length > 0) {
      setPaymentErrors(errors);
      setPaymentTouched(
        Object.keys(paymentForm).reduce((acc, k) => ({ ...acc, [k]: true }), {})
      );
      return;
    }

    // Trigger loading spinner simulation
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      completeCheckout(shippingForm);
    }, 1800);
  };

  const handleClose = () => {
    setCheckoutOpen(false);
  };

  // Helper styles based on validity
  const getFieldClass = (name, form, errors, touched) => {
    const defaultStyle = "w-full rounded-lg border py-2 px-3 text-xs text-[#1a1a1a] outline-none transition-all placeholder:italic placeholder:text-[#999] bg-[#fdbfdb]/5";
    if (!touched[name]) return `${defaultStyle} border-[#eee] focus:border-black`;
    if (errors[name]) return `${defaultStyle} border-rose-300 focus:border-rose-500`;
    return `${defaultStyle} border-emerald-300 focus:border-emerald-500`;
  };

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <>
          {/* Modal Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={checkoutStep !== "success" ? handleClose : undefined}
            className="fixed inset-0 z-50 bg-[#1a1a1a]/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          >
            {/* Modal Glass Panel */}
            <motion.div
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl rounded-2xl border border-[#e5e5e5] bg-[#fcfcfc] p-6 shadow-2xl md:p-8"
            >
              
              {/* Dismiss button */}
              {checkoutStep !== "success" && (
                <button
                  onClick={handleClose}
                  className="absolute top-6 right-6 rounded-full p-1 text-[#999] hover:bg-[#f3f3f3] hover:text-[#1a1a1a] transition-colors"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              )}

              {/* Progress Stepper indicators */}
              <div className="mb-8 flex items-center justify-center gap-2 max-w-sm mx-auto">
                <div className="flex flex-1 flex-col items-center">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                    checkoutStep === "shipping" ? "bg-black text-white" : "bg-emerald-500 text-white"
                  }`}>
                    {checkoutStep === "shipping" ? "1" : "✓"}
                  </div>
                  <span className={`mt-1.5 text-[8px] font-black tracking-widest uppercase ${checkoutStep === "shipping" ? "text-black" : "text-[#999]"}`}>Shipping</span>
                </div>
                
                <div className={`h-[1px] flex-1 transition-all ${checkoutStep === "shipping" ? "bg-[#e5e5e5]" : "bg-emerald-500"}`} />

                <div className="flex flex-1 flex-col items-center">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                    checkoutStep === "payment" ? "bg-[#ff4e00] text-white" : checkoutStep === "success" ? "bg-emerald-500 text-white" : "bg-[#f3f3f3] text-[#999]"
                  }`}>
                    {checkoutStep === "success" ? "✓" : "2"}
                  </div>
                  <span className={`mt-1.5 text-[8px] font-black tracking-widest uppercase ${checkoutStep === "payment" ? "text-black" : "text-[#999]"}`}>Payment</span>
                </div>

                <div className={`h-[1px] flex-1 transition-all ${checkoutStep === "success" ? "bg-emerald-500" : "bg-[#e5e5e5]"}`} />

                <div className="flex flex-1 flex-col items-center">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold transition-all ${
                    checkoutStep === "success" ? "bg-black text-white" : "bg-[#f3f3f3] text-[#999]"
                  }`}>
                    3
                  </div>
                  <span className={`mt-1.5 text-[8px] font-black tracking-widest uppercase ${checkoutStep === "success" ? "text-black" : "text-[#999]"}`}>Confirm</span>
                </div>
              </div>

              {/* STEP 1: SHIPPING INFORMATION */}
              {checkoutStep === "shipping" && (
                <form onSubmit={onSubmitShipping} className="space-y-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#1a1a1a] flex items-center gap-1.5">
                      <Truck className="h-4 w-4 text-[#ff4e00]" />
                      <span>Delivery Information</span>
                    </h3>
                    <p className="text-[10px] text-[#999] uppercase tracking-wider mt-0.5">Provide address details for express courier transit.</p>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#666]">Full Name</label>
                      <input
                        type="text"
                        name="fullName"
                        value={shippingForm.fullName}
                        onChange={handleShippingChange}
                        onBlur={handleShippingBlur}
                        placeholder="John Doe"
                        className={getFieldClass("fullName", shippingForm, shippingErrors, shippingTouched)}
                      />
                      {shippingTouched.fullName && shippingErrors.fullName && (
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-medium">
                          <AlertCircle className="h-3 w-3" /> {shippingErrors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#666]">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={shippingForm.email}
                        onChange={handleShippingChange}
                        onBlur={handleShippingBlur}
                        placeholder="john@example.com"
                        className={getFieldClass("email", shippingForm, shippingErrors, shippingTouched)}
                      />
                      {shippingTouched.email && shippingErrors.email && (
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-medium">
                          <AlertCircle className="h-3 w-3" /> {shippingErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#666]">Street Address</label>
                    <input
                      type="text"
                      name="address"
                      value={shippingForm.address}
                      onChange={handleShippingChange}
                      onBlur={handleShippingBlur}
                      placeholder="123 Luxury Avenue Apartments"
                      className={getFieldClass("address", shippingForm, shippingErrors, shippingTouched)}
                    />
                    {shippingTouched.address && shippingErrors.address && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-medium">
                        <AlertCircle className="h-3 w-3" /> {shippingErrors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#666]">City</label>
                      <input
                        type="text"
                        name="city"
                        value={shippingForm.city}
                        onChange={handleShippingChange}
                        onBlur={handleShippingBlur}
                        placeholder="San Francisco"
                        className={getFieldClass("city", shippingForm, shippingErrors, shippingTouched)}
                      />
                      {shippingTouched.city && shippingErrors.city && (
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-medium">
                          <AlertCircle className="h-3 w-3" /> {shippingErrors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#666]">Postal / ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={shippingForm.zipCode}
                        onChange={handleShippingChange}
                        onBlur={handleShippingBlur}
                        placeholder="94105"
                        className={getFieldClass("zipCode", shippingForm, shippingErrors, shippingTouched)}
                      />
                      {shippingTouched.zipCode && shippingErrors.zipCode && (
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-medium">
                          <AlertCircle className="h-3 w-3" /> {shippingErrors.zipCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#666]">Phone Contact</label>
                    <input
                      type="text"
                      name="phone"
                      value={shippingForm.phone}
                      onChange={handleShippingChange}
                      onBlur={handleShippingBlur}
                      placeholder="(555) 123-4567"
                      className={getFieldClass("phone", shippingForm, shippingErrors, shippingTouched)}
                    />
                    {shippingTouched.phone && shippingErrors.phone && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-medium">
                        <AlertCircle className="h-3 w-3" /> {shippingErrors.phone}
                      </p>
                    )}
                  </div>

                  <div className="mt-8 flex justify-between border-t border-[#e5e5e5] pt-6 items-center">
                    <span className="text-xs uppercase tracking-wider text-[#666]">
                      Invoice total: <strong className="text-[#1a1a1a] font-mono font-bold ml-1">${cartTotal.toFixed(2)}</strong>
                    </span>
                    <button
                      type="submit"
                      className="group flex items-center gap-2 rounded-lg bg-black px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#ff4e00] transition-colors cursor-pointer"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: SECURE PAYMENT DETAILS */}
              {checkoutStep === "payment" && (
                <form onSubmit={onSubmitPayment} className="space-y-4">
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#1a1a1a] flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4 text-[#ff4e00]" />
                      <span>Secure Payment Method</span>
                    </h3>
                    <p className="text-[10px] text-[#999] uppercase tracking-wider mt-0.5">Safe, fully tokenized sandbox transaction shield.</p>
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#666]">Name on Card</label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentForm.cardName}
                      onChange={handlePaymentChange}
                      onBlur={handlePaymentBlur}
                      placeholder="JOHN DOE"
                      className={getFieldClass("cardName", paymentForm, paymentErrors, paymentTouched)}
                    />
                    {paymentTouched.cardName && paymentErrors.cardName && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-medium">
                        <AlertCircle className="h-3 w-3" /> {paymentErrors.cardName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#666]">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentForm.cardNumber}
                      onChange={handlePaymentChange}
                      onBlur={handlePaymentBlur}
                      placeholder="4000 1234 5678 9010"
                      className={getFieldClass("cardNumber", paymentForm, paymentErrors, paymentTouched)}
                    />
                    {paymentTouched.cardNumber && paymentErrors.cardNumber && (
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-medium">
                        <AlertCircle className="h-3 w-3" /> {paymentErrors.cardNumber}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#666]">Expiration Date</label>
                      <input
                        type="text"
                        name="cardExpiry"
                        value={paymentForm.cardExpiry}
                        onChange={handlePaymentChange}
                        onBlur={handlePaymentBlur}
                        placeholder="MM / YY"
                        className={getFieldClass("cardExpiry", paymentForm, paymentErrors, paymentTouched)}
                      />
                      {paymentTouched.cardExpiry && paymentErrors.cardExpiry && (
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-medium">
                          <AlertCircle className="h-3 w-3" /> {paymentErrors.cardExpiry}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-[#666]">CVC Code</label>
                      <input
                        type="password"
                        name="cardCvc"
                        value={paymentForm.cardCvc}
                        onChange={handlePaymentChange}
                        onBlur={handlePaymentBlur}
                        placeholder="123"
                        className={getFieldClass("cardCvc", paymentForm, paymentErrors, paymentTouched)}
                      />
                      {paymentTouched.cardCvc && paymentErrors.cardCvc && (
                        <p className="mt-1 flex items-center gap-1 text-[10px] text-rose-600 font-medium">
                          <AlertCircle className="h-3 w-3" /> {paymentErrors.cardCvc}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Pricing recap */}
                  <div className="mt-4 rounded-xl bg-[#f3f3f3] p-3 text-[10px] text-[#666] flex justify-between uppercase tracking-wider items-center">
                    <span>Complete order charge total:</span>
                    <strong className="text-[#1a1a1a] font-mono font-bold text-xs">${cartTotal.toFixed(2)}</strong>
                  </div>

                  <div className="mt-8 flex justify-between border-t border-[#e5e5e5] pt-6 items-center">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep("shipping")}
                      className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-[#666] hover:text-black transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5" />
                      <span>Back to Shipping</span>
                    </button>

                    <button
                      type="submit"
                      disabled={processing}
                      className="flex items-center gap-2 rounded-lg bg-[#ff4e00] px-6 py-3 text-[10px] uppercase font-bold tracking-widest text-white hover:bg-black transition-all cursor-pointer disabled:bg-[#ff4e00]/45"
                    >
                      {processing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent"
                          />
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <span>Pay & Secure Order</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 3: TRANSACTION SUCCESS ORDER INVOICE */}
              {checkoutStep === "success" && (
                <div className="text-center py-4 space-y-6">
                  
                  {/* Celebrating green mark */}
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                    className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600"
                  >
                    <CheckCircle2 className="h-8 w-8" />
                  </motion.div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-serif font-black text-[#1a1a1a]">Checkout Successful!</h3>
                    <p className="text-xs text-[#666] max-w-sm mx-auto">
                      Thank you for your order, <span className="font-bold text-[#1a1a1a]">{shippingForm.fullName}</span>! Your items will start packaging immediately.
                    </p>
                  </div>

                  {/* Tracking Badge */}
                  <div className="inline-block rounded-xl bg-[#f3f3f3] border border-[#e5e5e5] px-6 py-4">
                    <span className="block text-[8px] font-black tracking-[0.2em] text-[#999] uppercase mb-1">Registered Tracking Code</span>
                    <span className="font-mono text-lg font-bold text-[#ff4e00] select-all tracking-widest">{orderTrackingNumber}</span>
                  </div>

                  <p className="text-[10px] text-[#999] max-w-xs mx-auto uppercase tracking-wider leading-relaxed">
                    We've emailed your invoice details to <strong className="text-[#666]">{shippingForm.email}</strong> with shipment monitoring details.
                  </p>

                  <div className="border-t border-[#e5e5e5] pt-6">
                    <button
                      onClick={handleClose}
                      className="rounded-lg bg-black px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-[#ff4e00] transition-colors cursor-pointer"
                    >
                      Continue Shopping
                    </button>
                  </div>

                </div>
              )}

            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

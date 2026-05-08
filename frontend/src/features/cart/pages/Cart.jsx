import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../hook/useCart'
import Navbar from '../../../app/components/Navbar'
import { useRazorpay, RazorpayOrderOptions } from "react-razorpay";
import { useSelector } from 'react-redux'



/* ─── Animation Variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const Cart = () => {

  const navigate = useNavigate();

  const user = useSelector(state => state.user)

  const { items, totalPrice, loading, handleFetchCart, handleUpdateQuantity, handleRemoveItem, handleCreateCartOrder, handleVerifyCartOrder } = useCart()
  const { error, isLoading, Razorpay } = useRazorpay();

  useEffect(() => {
    handleFetchCart()
  }, [])


  async function handleCheckout() {

    const order = await handleCreateCartOrder(); // already returns the Razorpay order object


    const options = {
      key: "rzp_test_SjlYu4EEv5dulS",
      amount: order.amount,
      currency: order.currency,
      name: "Snitch",
      description: "Pay for your order",
      order_id: order.id,
      handler: async (response) => {
        const isValid = await handleVerifyCartOrder(response);
        if (isValid) {
          navigate(`/order-success?order_id=${response?.razorpay_order_id}`)
        }
      },
      prefill: {
        name: user?.fullname,
        email: user?.email,
        contact: user?.contact,
      },
      theme: {
        color: "#F37254",
      },
    };

    const razorpayInstance = new Razorpay(options);
    razorpayInstance.open();
  }


  // The aggregation already calculates the subtotal as totalPrice
  const subtotal = totalPrice || 0;

  if (loading && items.length === 0) {
    return (
      <div className="min-h-screen bg-brand-cream flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-[10px] uppercase tracking-[1em] text-brand-stone"
        >
          Curating Your Bag
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-black selection:text-brand-cream">

      {/* ── Nav ── */}
      <Navbar />

      <main className="pt-32 pb-32 px-8 md:px-14 max-w-[1440px] mx-auto">
        <motion.header
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mb-16"
        >
          <motion.h1 variants={fadeUp} className="text-[clamp(2.5rem,6vw,4rem)] font-serif text-brand-black uppercase leading-none tracking-tight">
            Your Bag
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[10px] uppercase tracking-[0.4em] text-brand-stone mt-4 font-medium">
            {items.length.toString().padStart(2, '0')} / Curation Complete
          </motion.p>
        </motion.header>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          {/* Left: Product List */}
          <section className="w-full lg:flex-1">
            <AnimatePresence mode="popLayout">
              {items.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center space-y-8"
                >
                  <p className="text-brand-stone font-light tracking-[0.2em] uppercase text-sm">Your bag is currently empty.</p>
                  <Link to="/products">
                    <button className="px-12 py-4 border border-brand-black text-[10px] uppercase tracking-[0.4em] hover:bg-brand-black hover:text-white transition-all duration-500">
                      Discover Collection
                    </button>
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  layout
                  className="space-y-12"
                >
                  {items.map((item) => {
                    const vId = item.variant?._id || item.variant;
                    const selectedVariant = item.product?.variantDetails || (vId ? item.product?.variants?.find(v => String(v._id) === String(vId)) : null);

                    const variantImage = typeof selectedVariant?.images?.[0] === 'string' ? selectedVariant.images[0] : selectedVariant?.images?.[0]?.url;
                    const productImage = typeof item.product?.images?.[0] === 'string'
                      ? item.product.images[0]
                      : item.product?.images?.[0]?.url;
                    const itemImage = variantImage || productImage;

                    const variantAttributes = selectedVariant?.attributes
                      ? (selectedVariant.attributes instanceof Map ? Object.fromEntries(selectedVariant.attributes) : selectedVariant.attributes)
                      : null;

                    return (
                      <motion.div
                        key={`${item.product._id}-${item.variant || 'none'}`}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5 }}
                        className="flex gap-8 items-start border-b border-black/5 pb-12 group"
                      >
                        <div className="w-32 md:w-44 shrink-0 aspect-3/4 bg-white overflow-hidden border border-black/5">
                          <img
                            src={itemImage}
                            alt={item.product?.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>

                        <div className="flex-1 flex flex-col min-h-full py-1">
                          <div className="flex justify-between items-start">
                            <div className="space-y-2">
                              <h3 className="text-lg md:text-xl font-serif text-brand-black uppercase tracking-wide">
                                {item.product?.title}
                              </h3>
                              <div className="flex flex-wrap gap-x-3 gap-y-1">
                                {variantAttributes ? (
                                  Object.entries(variantAttributes).map(([key, value]) => (
                                    <div key={key} className="flex flex-col">
                                      <span className="text-[7px] md:text-[8px] uppercase tracking-[0.2em] text-brand-stone/60 font-bold">{key}</span>
                                      <span className="text-[9px] md:text-[10px] uppercase tracking-[0.15em] text-brand-stone font-medium">{value}</span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand-stone font-medium">
                                    Standard Edition
                                  </p>
                                )}
                              </div>
                            </div>
                            <span className="text-[15px] font-medium text-brand-black">
                              {item.price?.amount?.toLocaleString()} {item.price?.currency}
                            </span>
                          </div>

                          <div className="mt-auto pt-10 flex justify-between items-center">
                            <div className="flex items-center border border-black/10">
                              <button
                                onClick={() => handleUpdateQuantity({ productId: item.product?._id, variantId: item.variant, quantity: item.quantity - 1 })}
                                disabled={item.quantity <= 1}
                                className="w-9 h-9 flex items-center justify-center hover:bg-black/5 transition-colors disabled:opacity-30"
                              >
                                <span className="text-sm">−</span>
                              </button>
                              <span className="w-10 text-center text-[12px] font-medium">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQuantity({ productId: item.product?._id, variantId: item.variant, quantity: item.quantity + 1 })}
                                className="w-9 h-9 flex items-center justify-center hover:bg-black/5 transition-colors"
                              >
                                <span className="text-sm">+</span>
                              </button>
                            </div>
                            <button
                              onClick={() => handleRemoveItem({ productId: item.product?._id, variantId: item.variant })}
                              className="text-[10px] uppercase tracking-[0.3em] text-brand-stone hover:text-brand-black transition-colors border-b border-transparent hover:border-brand-black pb-0.5"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {items.length > 0 && (
              <motion.div variants={fadeUp} className="pt-12">
                <p className="text-[13px] font-light text-brand-stone italic leading-relaxed max-w-md">
                  Enjoy complimentary standard shipping and curated gift wrapping on all orders above ₹1999.
                </p>
              </motion.div>
            )}
          </section>

          {/* Right: Sticky Summary */}
          {items.length > 0 && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-full lg:w-[450px] shrink-0 lg:sticky lg:top-32"
            >
              <div className="bg-white p-10 space-y-12 border border-black/5 shadow-sm">
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-black border-b border-black/5 pb-6">
                  Order Summary
                </h3>

                <div className="space-y-6">
                  <div className="flex justify-between text-[14px] font-light">
                    <span className="text-brand-stone">Subtotal</span>
                    <span className="text-brand-black">{subtotal.toLocaleString()} INR</span>
                  </div>
                  <div className="flex justify-between text-[14px] font-light">
                    <span className="text-brand-stone">Shipping</span>
                    <span className="uppercase tracking-widest text-[11px] text-brand-stone">Complimentary</span>
                  </div>
                  <div className="flex justify-between items-end pt-8 border-t border-black/5">
                    <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-black">Total</span>
                    <span className="text-3xl font-serif text-brand-black">{subtotal.toLocaleString()} INR</span>
                  </div>
                </div>

                

                <div className="space-y-6">
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-brand-black text-white py-5 text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-brand-stone transition-all duration-500">
                    Proceed to Checkout
                  </button>

                  <div className="flex flex-col items-center gap-4 opacity-40">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                      <span className="text-[9px] uppercase tracking-[0.25em]">Secure SSL Encrypted</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 px-4 text-center">
                <p className="text-[9px] text-brand-stone uppercase tracking-[0.2em] leading-relaxed">
                  Returns accepted within 14 days.<br />Subject to our terms of service.
                </p>
              </div>
            </motion.aside>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-16 px-8 md:px-14 border-t border-black/5 bg-brand-cream mt-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-2">
            <div className="text-[22px] font-serif tracking-tighter text-brand-black">SNITCH</div>
            <p className="text-[11px] text-brand-stone font-light tracking-wider">Quiet luxury. Loud identity.</p>
          </div>
          <div className="text-[10px] tracking-widest text-brand-stone/60 uppercase">© 2026 SNITCH CLOTHING CO.</div>
        </div>
      </footer>
    </div>
  )
}

export default Cart
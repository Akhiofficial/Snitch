import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import Navbar from '../../../app/components/Navbar'

/* ─── Animation Variants ──────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const lineExpand = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 } },
}

/* ─── Tick SVG (animated checkmark) ──────────────────────────────────── */
const SuccessTick = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.6 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-center justify-center"
  >
    <motion.svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <motion.circle
        cx="28"
        cy="28"
        r="27"
        stroke="#111111"
        strokeWidth="1"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: 'easeInOut' }}
      />
      <motion.path
        d="M17 28.5L24.5 36L39 21"
        stroke="#111111"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8, ease: 'easeInOut' }}
      />
    </motion.svg>
  </motion.div>
)

/* ─── Component ──────────────────────────────────────────────────────── */
const OrderSuccess = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const orderId = queryParams.get('order_id')

  const detailCards = [
    {
      label: 'Estimated Delivery',
      value: '3–5 Business Days',
      sub: 'Standard complimentary shipping',
    },
    {
      label: 'Payment',
      value: 'Verified',
      sub: 'Secured via Razorpay SSL',
    },
    {
      label: 'Status',
      value: 'Processing',
      sub: 'We\'ll notify you via email',
    },
  ]

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-black selection:text-brand-cream font-sans">

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Main ── */}
      <main className="pt-40 pb-32 px-8 md:px-14 max-w-[1440px] mx-auto">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="flex flex-col items-center text-center"
        >

          {/* Tick */}
          <motion.div variants={fadeUp} className="mb-10">
            <SuccessTick />
          </motion.div>

          {/* Top hairline */}
          <motion.div
            variants={lineExpand}
            className="w-24 h-px bg-brand-black mb-10 origin-center"
          />

          {/* Label */}
          <motion.p
            variants={fadeUp}
            className="text-[10px] uppercase tracking-[0.5em] text-brand-stone font-medium mb-5"
          >
            Order Confirmed
          </motion.p>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-[clamp(3rem,8vw,5.5rem)] font-serif text-brand-black uppercase leading-none tracking-tight mb-6"
          >
            Thank You
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-[15px] font-light text-brand-stone max-w-md leading-relaxed mb-8"
          >
            Your order has been placed and is now being carefully prepared.
            <br />
            A confirmation has been sent to your email.
          </motion.p>

          {/* Order ID */}
          {orderId && (
            <motion.div
              variants={fadeUp}
              className="mb-10 px-6 py-3 border border-black/10 bg-white"
            >
              <span className="text-[9px] uppercase tracking-[0.35em] text-brand-stone font-bold mr-3">
                Order
              </span>
              <span className="text-[12px] text-brand-black font-medium tracking-widest">
                #{orderId}
              </span>
            </motion.div>
          )}

          {/* Bottom hairline */}
          <motion.div
            variants={lineExpand}
            className="w-24 h-px bg-brand-black mb-20 origin-center"
          />

          {/* ── Detail Cards ── */}
          <motion.div
            variants={stagger}
            className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-3 gap-0 border border-black/5 bg-white mb-16"
          >
            {detailCards.map((card, i) => (
              <motion.div
                key={card.label}
                variants={fadeUp}
                custom={i}
                className={`flex flex-col items-center py-10 px-8 gap-2 ${
                  i < detailCards.length - 1 ? 'border-b md:border-b-0 md:border-r border-black/5' : ''
                }`}
              >
                <span className="text-[9px] uppercase tracking-[0.35em] text-brand-stone font-bold">
                  {card.label}
                </span>
                <span className="text-[17px] font-serif text-brand-black mt-1">
                  {card.value}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-stone/70 font-light">
                  {card.sub}
                </span>
              </motion.div>
            ))}
          </motion.div>

          {/* ── Action Buttons ── */}
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row gap-4 items-center"
          >
            <Link to="/products">
              <button className="px-14 py-4 bg-brand-black text-white text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-brand-stone transition-all duration-500 min-w-[220px]">
                Continue Shopping
              </button>
            </Link>
            <Link to="/orders">
              <button className="px-14 py-4 border border-brand-black text-brand-black text-[11px] uppercase tracking-[0.4em] font-bold hover:bg-brand-black hover:text-white transition-all duration-500 min-w-[220px]">
                View Orders
              </button>
            </Link>
          </motion.div>

          {/* ── Reassurance strip ── */}
          <motion.div
            variants={fadeUp}
            className="mt-16 flex flex-col sm:flex-row items-center gap-8 text-brand-stone/60"
          >
            {[
              { icon: '🔒', text: 'SSL Secured Payment' },
              { icon: '📦', text: 'Free Standard Shipping' },
              { icon: '↩', text: '14-Day Return Policy' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2">
                <span className="text-[13px]">{item.icon}</span>
                <span className="text-[9px] uppercase tracking-[0.25em] font-medium">{item.text}</span>
              </div>
            ))}
          </motion.div>

        </motion.div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-16 px-8 md:px-14 border-t border-black/5 bg-brand-cream">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 max-w-[1440px] mx-auto">
          <div className="space-y-2">
            <div className="text-[22px] font-serif tracking-tighter text-brand-black">SNITCH</div>
            <p className="text-[11px] text-brand-stone font-light tracking-wider">Quiet luxury. Loud identity.</p>
          </div>
          <div className="text-[10px] tracking-widest text-brand-stone/60 uppercase">
            © 2026 SNITCH CLOTHING CO.
          </div>
        </div>
      </footer>

    </div>
  )
}

export default OrderSuccess
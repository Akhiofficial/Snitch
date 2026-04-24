import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'
import ProductCard from '../components/ProductCard'
import { motion, useScroll, useTransform, useInView, useAnimationControls } from 'framer-motion'
import { Link } from 'react-router'

/* ─── Animation Variants ─────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const lineReveal = {
  hidden: { scaleX: 0, originX: 0 },
  show: { scaleX: 1, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } },
}

/* ─── Marquee Component ──────────────────────────────────────────────── */
const MARQUEE_ITEMS = [
  'NEW ARRIVALS SS26',
  '✦',
  'FREE SHIPPING OVER ₹1999',
  '✦',
  'CURATED ESSENTIALS',
  '✦',
  'QUIET LUXURY',
  '✦',
  'LIMITED EDITIONS',
  '✦',
  'SNITCH NOIR',
  '✦',
]

const Marquee = ({ reverse = false }) => {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]
  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex gap-12"
        animate={{ x: reverse ? ['0%', '50%'] : ['0%', '-50%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="text-[10px] uppercase tracking-[0.35em] font-medium text-brand-stone"
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  )
}

/* ─── Section Title ──────────────────────────────────────────────────── */
const SectionLabel = ({ children }) => (
  <motion.span
    variants={fadeUp}
    className="inline-block text-[10px] uppercase tracking-[0.5em] text-brand-stone font-medium mb-4"
  >
    {children}
  </motion.span>
)

/* ─── Animated Section Wrapper ───────────────────────────────────────── */
const RevealSection = ({ children, className = '' }) => {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/* ─── Editorial Feature Card ─────────────────────────────────────────── */
const EditorialCard = ({ img, label, title, sub, delay = 0, tall = false, productId }) => (
  <motion.div
    variants={fadeUp}
    custom={delay}
    className={`group relative ${tall ? 'row-span-2' : ''}`}
  >
    <Link to={productId ? `/product/${productId}` : '/products'} className="block">
      <div className="overflow-hidden aspect-3/4">
        <motion.img
          src={img}
          alt={title}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="pt-5 space-y-1">
        <p className="text-[10px] uppercase tracking-[0.4em] text-brand-stone">{label}</p>
        <h3 className="text-[18px] font-serif text-brand-black leading-snug group-hover:text-brand-stone transition-colors duration-300">{title}</h3>
        <p className="text-[12px] text-brand-stone font-light line-clamp-1">{sub}</p>
      </div>
      <div
        className="absolute bottom-[88px] left-0 h-px bg-brand-black w-0 group-hover:w-full transition-all duration-500"
      />
    </Link>
  </motion.div>
)

/* ─── Stat Item ──────────────────────────────────────────────────────── */
const Stat = ({ num, label }) => (
  <motion.div variants={fadeUp} className="flex flex-col space-y-1 text-center">
    <span className="text-4xl md:text-5xl font-serif text-brand-cream">{num}</span>
    <span className="text-[10px] uppercase tracking-[0.4em] text-brand-stone">{label}</span>
  </motion.div>
)

/* ─── Main Component ─────────────────────────────────────────────────── */
const Home = () => {
  const { products, loading, error } = useSelector(state => state.products)
  const user = useSelector(state => state.auth.user)
  const { handleGetAllProducts } = useProduct()

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])

  useEffect(() => { handleGetAllProducts() }, [])

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-black selection:text-brand-cream overflow-x-hidden">

      {/* ── Nav ── */}
      <nav className="fixed top-0 left-0 w-full z-50 px-8 md:px-14 py-7 flex justify-between items-center">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-white text-[22px] font-serif tracking-tighter mix-blend-difference"
        >
          SNITCH
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-8"
        >
          {user ? (
            <span className="text-[10px] uppercase tracking-[0.3em] text-white mix-blend-difference font-medium">
              {user.username || user.name || 'Account'}
            </span>
          ) : (
            <div className="flex items-center gap-7">
              <a href="/login" className="text-[10px] uppercase tracking-[0.3em] text-white mix-blend-difference hover:opacity-60 transition-opacity">Login</a>
              <a href="/register" className="text-[10px] uppercase tracking-[0.3em] text-white mix-blend-difference hover:opacity-60 transition-opacity">Register</a>
            </div>
          )}
        </motion.div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative h-screen w-full overflow-hidden flex items-end">
        {/* Parallax bg */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroY, scale: heroScale }}
        >
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-black/30 z-10" />
          <img
            src="https://images.unsplash.com/photo-1701755488627-b75547a39988"
            alt="Snitch Hero"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Hero Text */}
        <motion.div
          className="relative z-20 w-full px-8 md:px-14 pb-24 flex flex-col md:flex-row md:items-end md:justify-between gap-10"
          style={{ opacity: heroOpacity }}
        >
          <div>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[10px] uppercase tracking-[0.6em] text-white/60 block mb-5"
            >
              Spring · Summer 2026
            </motion.span>
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="text-[clamp(3.5rem,10vw,9rem)] font-serif text-white leading-none tracking-tight"
              >
                Snitch <em>Noir</em>
              </motion.h1>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:items-end md:pb-2">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
              className="text-[13px] font-light text-white/70 max-w-xs md:text-right leading-relaxed"
            >
              Where minimalism meets intention. Pieces designed to outlast trends.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/products">
                <button className="group relative overflow-hidden border border-white/30 backdrop-blur-sm px-10 py-4 text-[10px] uppercase tracking-[0.5em] text-white transition-all duration-500 hover:border-white/80">
                  <span className="relative z-10 transition-colors duration-500 group-hover:text-brand-black">Explore Collection</span>
                  <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute right-8 bottom-12 z-20 flex flex-col items-center gap-3"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[8px] uppercase tracking-[0.5em] text-white/40 rotate-90 origin-center mb-4">Scroll</span>
            <div className="h-10 w-px bg-white/20 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full h-full bg-white/60"
                animate={{ y: ['-100%', '200%'] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Marquee Strip ── */}
      <div className="border-y border-black/8 py-4 bg-brand-cream overflow-hidden">
        <Marquee />
      </div>

      {/* ── Editorial Features ── */}
      <section className="py-28 px-8 md:px-14 max-w-[1600px] mx-auto">
        <RevealSection className="mb-16">
          <SectionLabel>The Edit</SectionLabel>
          <motion.div variants={fadeUp} custom={1} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-serif text-brand-black leading-tight max-w-lg">
              Crafted for the<br /><em>quietly confident</em>
            </h2>
            <Link to="/products">
              <motion.span
                className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-brand-stone hover:text-brand-black transition-colors group"
              >
                View All
                <span className="block w-8 h-px bg-brand-stone group-hover:bg-brand-black group-hover:w-12 transition-all duration-500" />
              </motion.span>
            </Link>
          </motion.div>
          <motion.div variants={lineReveal} className="h-px bg-black/10 mt-10" />
        </RevealSection>

        {/* Editorial 3-col grid — latest 3 products */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[0, 1, 2].map(i => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-3/4 bg-black/5" />
                <div className="h-3 w-1/3 bg-black/5 rounded" />
                <div className="h-5 w-2/3 bg-black/5 rounded" />
                <div className="h-3 w-1/2 bg-black/5 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <RevealSection className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...products]
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 3)
              .map((product, i) => (
                <EditorialCard
                  key={product._id}
                  productId={product._id}
                  img={
                    (product.images && product.images[0])
                      ? product.images[0]
                      : 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80'
                  }
                  label={`New Arrival — ${product.category || 'SS 26'}`}
                  title={product.title}
                  sub={product.description}
                  delay={i}
                />
              ))}
          </RevealSection>
        )}

      </section>

      {/* ── Second Marquee ── */}
      <div className="border-y border-black/8 py-4 bg-brand-cream overflow-hidden">
        <Marquee />
      </div>

      {/* ── Full-width Split Banner ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[70vh]">
        {/* Image side */}
        <div className="relative overflow-hidden min-h-[50vh] md:min-h-auto">
          <motion.img
            src="https://images.unsplash.com/photo-1552902865-b72c031ac5ea?q=80&w=1169&auto=format&fit=crop"
            alt="Collection"
            className="w-full h-full object-cover"
            initial={{ scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        {/* Text side */}
        <RevealSection className="flex flex-col justify-center px-10 md:px-20 py-20 bg-brand-dark space-y-8">
          <SectionLabel>Our Philosophy</SectionLabel>
          <motion.blockquote
            variants={fadeUp}
            custom={1}
            className="text-[clamp(1.5rem,3vw,2.8rem)] font-serif italic text-brand-cream leading-tight"
          >
            "True luxury is felt, not shown."
          </motion.blockquote>
          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-[13px] font-light text-brand-stone leading-relaxed max-w-sm"
          >
            We build garments that age with you — every thread chosen for longevity, every silhouette designed for confidence. No logos, no noise.
          </motion.p>
          <motion.div variants={lineReveal} className="h-px bg-white/10 w-16" />
          <motion.div variants={fadeUp} custom={3}>
            <Link to="/products">
              <button className="group relative overflow-hidden border border-white/20 px-8 py-3.5 text-[10px] uppercase tracking-[0.5em] text-white transition-all duration-500 hover:border-white/60">
                <span className="relative z-10 transition-colors duration-500 group-hover:text-brand-black">Shop Now</span>
                <span className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              </button>
            </Link>
          </motion.div>
        </RevealSection>
      </section>

      {/* ── Product Grid ── */}
      <section className="py-28 px-8 md:px-14 max-w-[1800px] mx-auto">
        <RevealSection className="mb-16">
          <SectionLabel>The Essentials</SectionLabel>
          <motion.div variants={fadeUp} custom={1} className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-serif text-brand-black leading-tight">
              Shop the Collection
            </h2>
            <div className="flex items-center gap-8 text-[10px] uppercase tracking-[0.3em] text-brand-stone">
              {['New Arrivals', 'Best Sellers', 'Limited Edition'].map(f => (
                <button key={f} className="hover:text-brand-black border-b border-transparent hover:border-brand-black transition-all pb-0.5">{f}</button>
              ))}
            </div>
          </motion.div>
          <motion.div variants={lineReveal} className="h-px bg-black/10 mt-10" />
        </RevealSection>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-14">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-3/4 bg-black/5" />
                <div className="h-3 w-2/3 bg-black/5 rounded" />
                <div className="h-3 w-1/3 bg-black/5 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-red-400 font-light tracking-widest uppercase text-sm">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-brand-stone font-light tracking-widest uppercase text-sm">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-16">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!loading && products.length > 0 && (
          <div className="mt-24 text-center">
            <Link to="/products">
              <button className="group relative overflow-hidden border border-black/15 hover:border-brand-black px-14 py-4 text-[10px] uppercase tracking-[0.5em] font-medium text-brand-black transition-colors duration-500">
                <span className="relative z-10 transition-colors duration-500 group-hover:text-brand-cream">View All Products</span>
                <span className="absolute inset-0 bg-brand-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
              </button>
            </Link>
          </div>
        )}
      </section>

      {/* ── Stats Banner ── */}
      <RevealSection className="bg-brand-dark py-20 px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
          <Stat num="10K+" label="Happy Customers" />
          <Stat num="200+" label="Curated Pieces" />
          <Stat num="4.9★" label="Average Rating" />
          <Stat num="SS26" label="Current Season" />
        </div>
      </RevealSection>

      {/* ── Footer ── */}
      <footer className="py-16 px-8 md:px-14 border-t border-black/8 bg-brand-cream">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="space-y-2">
            <div className="text-[22px] font-serif tracking-tighter text-brand-black">SNITCH</div>
            <p className="text-[11px] text-brand-stone font-light tracking-wider">Quiet luxury. Loud identity.</p>
          </div>

          <div className="flex flex-wrap gap-10 text-[10px] uppercase tracking-[0.3em] text-brand-stone">
            {['Shop', 'About', 'Contact', 'Returns'].map(l => (
              <a key={l} href="#" className="hover:text-brand-black transition-colors">{l}</a>
            ))}
          </div>

          <div className="flex flex-col items-start md:items-end gap-3">
            <div className="flex gap-6 text-[10px] uppercase tracking-[0.3em] text-brand-stone">
              {['Instagram', 'Pinterest', 'Twitter'].map(s => (
                <a key={s} href="#" className="hover:text-brand-black transition-colors">{s}</a>
              ))}
            </div>
            <p className="text-[10px] tracking-widest text-brand-stone/60">© 2026 SNITCH CLOTHING CO.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
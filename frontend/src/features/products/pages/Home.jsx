import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'
import ProductCard from '../components/ProductCard'
import { motion } from 'framer-motion'

const Home = () => {
  const { products, loading, error } = useSelector(state => state.products);
  const user = useSelector(state => state.auth.user);
  const { handleGetAllProducts } = useProduct();

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-accent selection:text-white">
      {/* Navigation Header */}
      <nav className="absolute top-0 left-0 w-full z-50 px-6 md:px-10 py-8 flex justify-between items-center bg-linear-to-b from-black/20 to-transparent">
        <div className="text-white text-xl font-serif tracking-tighter">SNITCH</div>
        
        <div className="flex items-center space-x-8">
          {user ? (
            <div className="flex items-center space-x-3">
              <span className="text-[11px] uppercase tracking-[0.2em] text-white font-medium border-white/20 pb-1">
                {user.username || user.name || 'User'}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-6">
              <a href="/login" className="text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors">Login</a>
              <a href="/register" className="text-[11px] uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors">Register</a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/20 z-10" />
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: "easeOut" }}
            src="https://images.unsplash.com/photo-1701755488627-b75547a39988?q=80&w=1199&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Hero Background" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 text-center text-white px-4">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-[12px] uppercase tracking-[0.6em] font-light mb-4 block"
          >
            Spring Summer Collection 2026
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-5xl md:text-8xl font-serif mb-8 tracking-tight"
          >
            Snitch <span className="italic">Noir</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <button className="border border-white/30 backdrop-blur-md px-10 py-4 text-[11px] uppercase tracking-[0.4em] hover:bg-white hover:text-brand-black transition-all duration-500">
              Shop the Collection
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-px h-12 bg-white/40 relative">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white animate-pulse" />
          </div>
        </motion.div>
      </section>

      {/* Product Section */}
      <section className="py-24 px-4 md:px-10 lg:px-20 max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-6 md:space-y-0">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-4xl font-serif text-brand-black">The Essentials</h2>
            <p className="text-brand-stone text-[14px] font-light max-w-md">
              A curated selection of our finest pieces, designed for the modern individual who values quality and understated elegance.
            </p>
          </div>
          <div className="flex items-center space-x-8 text-[11px] uppercase tracking-[0.2em] font-medium text-brand-black/60">
            <button className="hover:text-brand-black border-b border-transparent hover:border-brand-black transition-all">New Arrivals</button>
            <button className="hover:text-brand-black border-b border-transparent hover:border-brand-black transition-all">Best Sellers</button>
            <button className="hover:text-brand-black border-b border-transparent hover:border-brand-black transition-all">Limited Edition</button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-3/4 bg-black/5" />
                <div className="h-4 w-2/3 bg-black/5" />
                <div className="h-4 w-1/3 bg-black/5" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-red-500 font-light tracking-widest uppercase text-sm">{error}</p>
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

        {/* View All Button */}
        {!loading && products.length > 0 && (
          <div className="mt-24 text-center">
            <button className="group relative text-[11px] uppercase tracking-[0.4em] font-semibold text-brand-black py-4 px-12 overflow-hidden border border-black/10 hover:border-black transition-colors duration-500">
              <span className="relative z-10">Load More</span>
              <div className="absolute inset-0 bg-brand-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        )}
      </section>

      {/* Brand Ethos */}
      <section className="bg-brand-dark py-32 text-brand-cream px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] uppercase tracking-[0.5em] text-brand-stone"
            >
                Our Philosophy
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-serif italic"
            >
                "True luxury is felt, not shown. It's the silent confidence in quality and the quiet beauty of minimalism."
            </motion.h2>
            <div className="pt-8">
                <div className="w-12 h-px bg-brand-stone mx-auto" />
            </div>
        </div>
      </section>

      {/* Footer (Simplified for now) */}
      <footer className="py-20 px-4 md:px-10 border-t border-black/5 bg-brand-cream">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-10 md:space-y-0">
          <div className="text-2xl font-serif tracking-tighter">SNITCH</div>
          <div className="flex space-x-12 text-[10px] uppercase tracking-[0.2em] text-brand-stone">
            <a href="#" className="hover:text-brand-black transition-colors">Instagram</a>
            <a href="#" className="hover:text-brand-black transition-colors">Pinterest</a>
            <a href="#" className="hover:text-brand-black transition-colors">Twitter</a>
          </div>
          <div className="text-[10px] uppercase tracking-widest text-brand-stone">
            © 2026 SNITCH CLOTHING CO.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
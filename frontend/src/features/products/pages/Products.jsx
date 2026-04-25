import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'
import ProductCard from '../components/ProductCard'
import { motion } from 'framer-motion'
import Navbar from '../../../app/components/Navbar'

const Products = () => {
  const { products, loading, error } = useSelector(state => state.products);
  const { handleGetAllProducts } = useProduct();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  
  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price-low-high') return a.price.amount - b.price.amount;
    if (sortBy === 'price-high-low') return b.price.amount - a.price.amount;
    if (sortBy === 'latest') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });

  const filteredProducts = sortedProducts.filter(product => 
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-accent selection:text-white pt-32 pb-20 px-6 md:px-10 lg:px-20">
      <Navbar />
      {/* Header & Filter Section */}
      <div className="max-w-[1800px] mx-auto mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between space-y-8 md:space-y-0">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif text-brand-black tracking-tight">The Collection</h1>
            <p className="text-brand-stone text-[14px] font-light max-w-lg leading-relaxed">
              Explore our full range of meticulously crafted pieces. From seasonal essentials to limited editions, each item reflects our commitment to quiet luxury.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-12">
            <div className="w-full md:w-64 relative group">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-transparent border-b border-brand-black/10 py-3 text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-brand-black transition-colors appearance-none cursor-pointer"
              >
                <option value="latest">Sort By: Latest Arrivals</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                
              </select>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
              </div>
            </div>

            <div className="w-full md:w-80 relative group">
              <input 
                type="text" 
                placeholder="SEARCH THE COLLECTION" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-b border-brand-black/10 py-3 text-[10px] uppercase tracking-[0.2em] focus:outline-none focus:border-brand-black transition-colors placeholder:text-brand-stone/40"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-[1800px] mx-auto">
        <div className="flex justify-end mb-8">
            <span className="text-[10px] uppercase tracking-[0.2em] text-brand-stone font-light">
                Showing {filteredProducts.length} of {products.length} Products
            </span>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-16">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-3/4 bg-black/5" />
                <div className="h-4 w-2/3 bg-black/5" />
                <div className="h-4 w-1/3 bg-black/5" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-40 text-center">
            <p className="text-red-500 font-light tracking-widest uppercase text-sm">{error}</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-40 text-center space-y-4">
            <p className="text-brand-stone font-light tracking-widest uppercase text-sm italic">No items found matching your search</p>
            <button 
              onClick={() => setSearchQuery('')}
              className="text-[10px] uppercase tracking-[0.3em] text-brand-black border-b border-brand-black pb-1 hover:text-brand-stone transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-20">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Placeholder */}
      {!loading && filteredProducts.length > 0 && (
        <div className="mt-32 flex justify-center items-center space-x-4">
          <span className="text-[10px] uppercase tracking-[0.4em] text-brand-black/40">Page 01 — 01</span>
        </div>
      )}
    </div>
  )
}

export default Products

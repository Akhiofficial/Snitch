import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useProduct } from '../hook/useProduct'
import { motion, AnimatePresence } from 'framer-motion'
import { getProductById } from '../services/product.api'

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data.product);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product details');
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-brand-cream flex items-center justify-center">
      <div className="animate-pulse text-[10px] uppercase tracking-[1em] text-brand-stone">Loading</div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center space-y-8">
      <p className="text-red-500 font-light tracking-widest uppercase text-sm">{error || 'Product not found'}</p>
      <button 
        onClick={() => navigate('/products')}
        className="text-[11px] uppercase tracking-[0.4em] border border-brand-black px-10 py-4 hover:bg-brand-black hover:text-white transition-all"
      >
        Back to Catalog
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-cream selection:bg-brand-accent selection:text-white pt-32 pb-20 px-6 md:px-10 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-3/4 overflow-hidden bg-white border border-black/5 relative group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={product.images[activeImage]}
                  alt={product.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
            
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square overflow-hidden border transition-all duration-300 ${
                      activeImage === idx ? 'border-brand-black opacity-100' : 'border-black/5 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-12">
            <div className="space-y-6">
                <div className="space-y-2">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-brand-stone font-light">New Collection</span>
                    <h1 className="text-4xl md:text-5xl font-serif text-brand-black tracking-tight leading-tight">
                        {product.title}
                    </h1>
                </div>
                
                <div className="flex items-center space-x-4">
                    <span className="text-2xl font-medium text-brand-black">
                        {product.price.currency} {product.price.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-brand-stone bg-black/5 px-2 py-1">Tax Included</span>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="text-[11px] uppercase tracking-[0.3em] font-semibold text-brand-black">Description</h3>
                <p className="text-brand-stone text-[15px] font-light leading-relaxed max-w-lg italic">
                    "{product.description}"
                </p>
            </div>

            <div className="space-y-8 pt-6 border-t border-black/5">
                <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.2em]">
                    <span className="text-brand-stone">Availability</span>
                    <span className={product.stock > 0 ? 'text-green-600' : 'text-red-500'}>
                        {product.stock > 0 ? `${product.stock} units in stock` : 'Out of Stock'}
                    </span>
                </div>
                <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.2em]">
                    <span className="text-brand-stone">Merchant</span>
                    <span className="text-brand-black font-medium">{product.seller.name || 'Snitch Boutique'}</span>
                </div>
            </div>

            <div className="space-y-4 pt-10">
                <button 
                  disabled={product.stock === 0}
                  className="w-full bg-brand-black text-white py-5 text-[11px] uppercase tracking-[0.4em] font-semibold hover:bg-brand-accent transition-colors duration-500 disabled:bg-brand-stone/40 disabled:cursor-not-allowed"
                >
                    {product.stock > 0 ? 'Add to Shopping Bag' : 'Sold Out'}
                </button>
                <button className="w-full border border-brand-black text-brand-black py-5 text-[11px] uppercase tracking-[0.4em] font-semibold hover:bg-brand-black hover:text-white transition-all duration-500">
                    Wishlist
                </button>
            </div>

            <div className="pt-12 space-y-4">
                <details className="group border-b border-black/5 pb-4 cursor-pointer">
                    <summary className="flex justify-between items-center list-none">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-brand-black font-medium">Shipping & Returns</span>
                        <span className="text-lg font-light group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-4 text-[13px] text-brand-stone font-light leading-relaxed">
                        Complimentary standard shipping on all orders. Returns accepted within 14 days of delivery.
                    </p>
                </details>
                <details className="group border-b border-black/5 pb-4 cursor-pointer">
                    <summary className="flex justify-between items-center list-none">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-brand-black font-medium">Composition & Care</span>
                        <span className="text-lg font-light group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="mt-4 text-[13px] text-brand-stone font-light leading-relaxed">
                        Crafted from premium sustainable materials. Professional dry clean recommended.
                    </p>
                </details>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProductDetail

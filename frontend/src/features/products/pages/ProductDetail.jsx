import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { useProduct } from '../hook/useProduct'
import { useCart } from '../../cart/hook/useCart'

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleGetProductById } = useProduct();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  // Variant Selection State
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [matchedVariant, setMatchedVariant] = useState(null);

  // Success Notification State
  const [showSuccess, setShowSuccess] = useState(false);

  // Cart
  const { handleAddItem } = useCart();

  const onAddToBag = async () => {
    try {
      const data = await handleAddItem({
        productId: product._id,
        variantId: matchedVariant?._id
      });
      if (data.success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to add to bag:", err);
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const data = await handleGetProductById(id);
      if (data) {
        setProduct(data);
        // Do NOT auto-select variant, land on parent product by default
        setSelectedAttributes({});
      } else {
        setError('Product not found');
      }
      setLoading(false);
    }
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product && product.variants) {
      const selectedKeys = Object.keys(selectedAttributes);

      if (selectedKeys.length > 0) {
        // If 'ORIGINAL' color is selected, we are effectively on the parent product
        if (selectedAttributes['COLOR'] === 'ORIGINAL') {
          setMatchedVariant(null);
          return;
        }

        // If we only have 'SIZE' selected and it's a parent size, don't match variant yet
        if (selectedKeys.length === 1 && selectedKeys[0].toUpperCase() === 'SIZE') {
          if (product.sizes && product.sizes.includes(selectedAttributes[selectedKeys[0]])) {
            setMatchedVariant(null);
            return;
          }
        }

        // Match first variant that satisfies whatever is selected
        const variant = product.variants.find(v => {
          if (!v.attributes) return false;
          const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes;
          return Object.entries(selectedAttributes).every(([key, val]) => {
            // Find all keys in variant attributes that match the normalized key (e.g., 'size' and 'Size')
            const matchingKeys = Object.keys(attrs).filter(k => k.trim().toUpperCase() === key.toUpperCase());

            // Check if any of the values associated with these keys match (supporting comma-separated lists)
            return matchingKeys.some(vKey => {
              const vVal = String(attrs[vKey]);
              const values = vVal.split(',').map(s => s.trim());
              return values.includes(val);
            });
          });
        });
        setMatchedVariant(variant || null);
        if (variant && variant.images && variant.images.length > 0) {
          setActiveImage(0);
        }
      } else {
        setMatchedVariant(null);
      }
    }
  }, [selectedAttributes, product]);

  const getAttributeOptions = () => {
    if (!product) return {};
    const options = {};

    // Add sizes from parent product if any
    if (product.sizes && product.sizes.length > 0) {
      options['SIZE'] = new Set(product.sizes);
    }

    if (product.variants) {
      product.variants.forEach(v => {
        if (v.attributes) {
          const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes;
          Object.entries(attrs).forEach(([key, val]) => {
            const normalizedKey = key.trim().toUpperCase();
            if (!options[normalizedKey]) options[normalizedKey] = new Set();

            // Split by comma if the value is a string (e.g., "M, XXL")
            if (typeof val === 'string' && val.includes(',')) {
              val.split(',').forEach(v => options[normalizedKey].add(v.trim()));
            } else {
              options[normalizedKey].add(val);
            }
          });
        }
      });
    }

    // Convert sets to arrays
    const result = {};
    Object.keys(options).forEach(key => {
      result[key] = Array.from(options[key]);
    });
    return result;
  };

  const isOptionAvailable = (key, val) => {
    if (!product) return true;

    const isSizeKey = key.toUpperCase() === 'SIZE';
    const otherAttributesSelected = Object.entries(selectedAttributes).filter(([k, v]) => k.toUpperCase() !== key.toUpperCase()).length > 0;

    // Determine if we are in "Parent/Original" mode
    const isOriginalSelected = selectedAttributes['COLOR'] === 'ORIGINAL' || !selectedAttributes['COLOR'];

    // If we are looking at SIZE and we are in Original mode (or no other attributes selected)
    if (isSizeKey && isOriginalSelected) {
      // Check parent sizes
      if (product.sizes && product.sizes.includes(val)) return true;
      // If we strictly have ORIGINAL selected, don't fall back to variants
      if (selectedAttributes['COLOR'] === 'ORIGINAL') return false;
    }

    // If we have variants, check them for availability
    if (product.variants && product.variants.length > 0) {
      const hypotheticalSelection = { ...selectedAttributes, [key]: val };

      return product.variants.some(v => {
        if (!v.attributes) return false;
        const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes;
        return Object.entries(hypotheticalSelection).every(([sKey, sVal]) => {
          const matchingKeys = Object.keys(attrs).filter(k => k.trim().toUpperCase() === sKey.toUpperCase());
          return matchingKeys.some(vKey => {
            const vVal = String(attrs[vKey]);
            const values = vVal.split(',').map(s => s.trim());
            return values.includes(sVal);
          });
        });
      });
    }

    // Fallback for non-size attributes or products without variants
    return true;
  };

  const attributeOptions = getAttributeOptions();

  const handleAttributeSelect = (key, val) => {
    setSelectedAttributes(prev => {
      if (prev[key] === val) {
        // Toggle off if already selected
        const next = { ...prev };
        delete next[key];
        return next;
      }
      return { ...prev, [key]: val };
    });
  };

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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center space-x-3 mb-12 text-[10px] uppercase tracking-[0.4em] text-brand-stone hover:text-brand-black transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <path d="m15 18-6-6 6-6" />
          </svg>
          <span>Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-3/4 overflow-hidden bg-white border border-black/5 relative group">
              <AnimatePresence mode="wait">
                <motion.img
                  key={matchedVariant && matchedVariant.images?.length > 0 ? matchedVariant.images[activeImage].url : product.images[activeImage]}
                  src={matchedVariant && matchedVariant.images?.length > 0 ? matchedVariant.images[activeImage].url : product.images[activeImage]}
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
            {((matchedVariant && matchedVariant.images?.length > 1) || (!matchedVariant && product.images.length > 1)) && (
              <div className="grid grid-cols-4 gap-4">
                {(matchedVariant && matchedVariant.images?.length > 0 ? matchedVariant.images : product.images).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`aspect-square overflow-hidden border transition-all duration-300 ${activeImage === idx ? 'border-brand-black opacity-100' : 'border-black/5 opacity-50 hover:opacity-100'
                      }`}
                  >
                    <img src={typeof img === 'string' ? img : img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.4em] text-brand-stone font-light">New Collection</span>
                <h1 className="text-4xl md:text-5xl font-serif text-brand-black tracking-tight leading-tight">
                  {product.title}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-2xl font-medium text-brand-black">
                  {(matchedVariant?.price?.amount || product.price.amount).toLocaleString()} {(matchedVariant?.price?.currency || product.price.currency)}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-stone bg-black/5 px-2 py-1">Tax Included</span>
              </div>
            </div>

            {/* Variant Selection */}
            {Object.keys(attributeOptions).length > 0 && (
              <div className="space-y-8 py-8 border-y border-black/5">
                <div className="flex justify-between items-center">
                  <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-brand-black">Select Options</h3>
                </div>
                {Object.entries(attributeOptions).map(([key, options]) => {
                  const isColor = ['color', 'colour', 'shade', 'base color'].includes(key.toLowerCase());

                  return (
                    <div key={key} className="space-y-4">
                      <h4 className="text-[10px] uppercase tracking-[0.3em] font-semibold text-brand-stone">{key}</h4>
                      <div className="flex flex-wrap gap-4">
                        {isColor && (
                          <button
                            onClick={() => setSelectedAttributes(prev => ({ ...prev, COLOR: 'ORIGINAL' }))}
                            className={`group relative flex flex-col items-center w-24 space-y-2 p-2 border transition-all duration-300 ${selectedAttributes['COLOR'] === 'ORIGINAL' || Object.keys(selectedAttributes).length === 0
                                ? 'border-brand-black bg-white shadow-lg'
                                : 'border-black/5 bg-transparent hover:border-black/20'
                              }`}
                          >
                            <div className="aspect-square w-full overflow-hidden bg-brand-cream">
                              <img src={product.images[0]} alt="Parent" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex flex-col items-center space-y-1">
                              <span className="text-[8px] uppercase tracking-widest font-bold text-brand-black truncate w-full text-center">Original</span>
                              <span className="text-[9px] text-brand-stone font-medium">{product.price.amount.toLocaleString()} {product.price.currency}</span>
                            </div>
                            {(selectedAttributes['COLOR'] === 'ORIGINAL' || Object.keys(selectedAttributes).length === 0) && (
                              <div className="absolute top-1 right-1 h-2 w-2 bg-brand-black rounded-full" />
                            )}
                          </button>
                        )}
                        {options.map(option => {
                          if (isColor) {
                            // Find first variant with this color to show preview
                            const previewVariant = product.variants.find(v => {
                              const attrs = v.attributes instanceof Map ? Object.fromEntries(v.attributes) : v.attributes;
                              const vKey = Object.keys(attrs).find(k => k.trim().toUpperCase() === key.toUpperCase());
                              return vKey && attrs[vKey] === option;
                            });

                            const previewImg = previewVariant?.images?.[0]?.url || product.images[0];
                            const previewPrice = previewVariant?.price?.amount || product.price.amount;
                            const previewCurrency = previewVariant?.price?.currency || product.price.currency;

                            const available = isOptionAvailable(key, option);

                            return (
                              <button
                                key={option}
                                disabled={!available}
                                onClick={() => handleAttributeSelect(key, option)}
                                className={`group relative flex flex-col items-center w-24 space-y-2 p-2 border transition-all duration-300 ${selectedAttributes[key] === option
                                    ? 'border-brand-black bg-white shadow-lg'
                                    : available
                                      ? 'border-black/5 bg-transparent hover:border-black/20'
                                      : 'border-black/5 bg-transparent opacity-30 cursor-not-allowed grayscale'
                                  }`}
                              >
                                <div className="aspect-square w-full overflow-hidden bg-brand-cream">
                                  <img src={previewImg} alt={option} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                </div>
                                <div className="flex flex-col items-center space-y-1">
                                  <span className="text-[8px] uppercase tracking-widest font-bold text-brand-black truncate w-full text-center">{option}</span>
                                  <span className="text-[9px] text-brand-stone font-medium">{previewPrice.toLocaleString()} {previewCurrency}</span>
                                </div>
                                {selectedAttributes[key] === option && (
                                  <div className="absolute top-1 right-1 h-2 w-2 bg-brand-black rounded-full" />
                                )}
                              </button>
                            );
                          }

                          const available = isOptionAvailable(key, option);

                          // Default button style for other attributes (Size, Material, etc.)
                          return (
                            <button
                              key={option}
                              disabled={!available}
                              onClick={() => handleAttributeSelect(key, option)}
                              className={`px-6 py-3 text-[11px] uppercase tracking-[0.2em] transition-all duration-300 border ${selectedAttributes[key] === option
                                  ? 'bg-brand-black text-white border-brand-black'
                                  : available
                                    ? 'bg-transparent text-brand-stone border-black/10 hover:border-brand-black hover:text-brand-black'
                                    : 'bg-transparent text-brand-stone/30 border-black/5 cursor-not-allowed opacity-50'
                                }`}
                            >
                              {option}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-6">
              <h3 className="text-[11px] uppercase tracking-[0.3em] font-semibold text-brand-black">Description</h3>
              <p className="text-brand-stone text-[15px] font-light leading-relaxed max-w-lg italic">
                "{product.description}"
              </p>
            </div>

            <div className="space-y-8 pt-6 border-t border-black/5">
              <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.2em]">
                <span className="text-brand-stone">Availability</span>
                <span className={(matchedVariant ? matchedVariant.stock : product.stock) > 0 ? 'text-green-600' : 'text-red-500'}>
                  {(matchedVariant ? matchedVariant.stock : product.stock) > 0 ? `${(matchedVariant ? matchedVariant.stock : product.stock)} units in stock` : 'Out of Stock'}
                </span>
              </div>
              <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.2em]">
                <span className="text-brand-stone">Merchant</span>
                <span className="text-brand-black font-medium">{product.seller.name || 'Snitch Boutique'}</span>
              </div>
            </div>

            <div className="space-y-4 pt-10">
              <button
                disabled={(matchedVariant ? matchedVariant.stock : product.stock) === 0}
                onClick={onAddToBag}
                className="w-full bg-brand-black text-white py-5 text-[11px] uppercase tracking-[0.4em] font-semibold hover:bg-brand-accent transition-colors duration-500 disabled:bg-brand-stone/40 disabled:cursor-not-allowed"
              >
                {(matchedVariant ? matchedVariant.stock : product.stock) > 0
                  ? 'Add to Shopping Bag'
                  : 'Sold Out'}
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
      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-10 right-10 z-50 bg-brand-black text-white px-8 py-4 rounded-lg shadow-2xl flex items-center space-x-4 border border-white/10 backdrop-blur-md"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold">Added to bag</span>
              <span className="text-[9px] text-brand-stone uppercase tracking-wide">{product.title}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ProductDetail

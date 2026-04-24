import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useProduct } from '../hook/useProduct';
import { setError } from '../state/product.slice';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Success Modal ──────────────────────────────────────────────────── */
const SuccessModal = ({ product, onView, onAddAnother }) => (
  <motion.div
    className="fixed inset-0 z-50 flex items-center justify-center px-4"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {/* Backdrop */}
    <motion.div
      className="absolute inset-0 bg-brand-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />

    {/* Modal Panel */}
    <motion.div
      className="relative z-10 bg-brand-cream w-full max-w-md p-10 shadow-[0_40px_80px_rgba(0,0,0,0.25)]"
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top accent line */}
      <motion.div
        className="h-px bg-brand-black mb-10"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* Icon */}
      <motion.div
        className="w-12 h-12 rounded-full border border-brand-black/20 flex items-center justify-center mb-8"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg className="w-5 h-5 text-brand-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </motion.div>

      {/* Label */}
      <motion.span
        className="text-[9px] uppercase tracking-[0.5em] text-brand-stone block mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Piece Registered
      </motion.span>

      {/* Title */}
      <motion.h2
        className="text-3xl font-serif text-brand-black leading-tight mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {product?.title || 'New Piece'}
      </motion.h2>

      {/* Subtext */}
      <motion.p
        className="text-[13px] text-brand-stone font-light leading-relaxed mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}
      >
        Your piece has been successfully added to the collection and is now live on the storefront.
      </motion.p>

      {/* Actions */}
      <motion.div
        className="flex flex-col gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
      >
        <button
          onClick={onView}
          className="w-full bg-brand-black text-white py-4 text-[10px] uppercase tracking-[0.4em] hover:bg-brand-stone transition-colors duration-400"
        >
          View Product
        </button>
        <button
          onClick={onAddAnother}
          className="w-full border border-black/15 py-4 text-[10px] uppercase tracking-[0.4em] hover:border-brand-black text-brand-stone hover:text-brand-black transition-all duration-400"
        >
          Add Another Piece
        </button>
      </motion.div>

      {/* Bottom accent */}
      <motion.div
        className="h-px bg-black/8 mt-10"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </motion.div>
  </motion.div>
);

/* ─── Main Component ─────────────────────────────────────────────────── */
const CreateProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.products);
  const { handleCreateProduct } = useProduct();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceAmount: '',
    priceCurrency: 'INR',
    stock: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [createdProduct, setCreatedProduct] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setImages(prev => [...prev, ...files]);
    setImagePreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setError(null));

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('priceAmount', formData.priceAmount);
    data.append('priceCurrency', formData.priceCurrency);
    data.append('stock', formData.stock);
    images.forEach(img => data.append('images', img));

    const product = await handleCreateProduct(data);
    if (product) {
      setCreatedProduct(product);
    }
  };

  const handleViewProduct = () => {
    if (createdProduct?._id) {
      navigate(`/seller/view-product/${createdProduct._id}`);
    } else {
      navigate('/seller/inventory');
    }
  };

  const handleAddAnother = () => {
    setCreatedProduct(null);
    setFormData({ title: '', description: '', priceAmount: '', priceCurrency: 'INR', stock: '' });
    setImages([]);
    setImagePreviews([]);
    dispatch(setError(null));
  };

  return (
    <>
      {/* ── Success Modal ── */}
      <AnimatePresence>
        {createdProduct && (
          <SuccessModal
            product={createdProduct}
            onView={handleViewProduct}
            onAddAnother={handleAddAnother}
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-brand-cream flex flex-row font-sans">
        {/* Sticky Visual Panel */}
        <div className="hidden lg:flex lg:w-1/4 sticky top-0 h-screen shrink-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110"
            style={{ backgroundImage: "url('/assets/minimal_fashion_bg.png')" }}
          />
          <div className="absolute inset-0 bg-linear-to-r from-brand-black/10 via-brand-cream/40 to-brand-cream" />
          <div className="absolute bottom-32 left-16 z-10 space-y-8">
            <div className="h-px w-24 bg-brand-black/20 mb-12" />
            <div className="space-y-4">
              <span className="text-[10px] font-sans text-brand-stone uppercase tracking-[0.6em]">Registry</span>
              <h2 className="text-5xl xl:text-6xl font-serif text-brand-black leading-tight">
                The New <br /> <span className="italic text-brand-accent">Curation.</span>
              </h2>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="flex-1 flex flex-col items-center p-8 sm:p-12 lg:p-20 lg:py-24 bg-brand-cream relative">
          <div className="w-full max-w-7xl space-y-24 animate-reveal">

            {/* Header */}
            <div className="space-y-10">
              {/* Back Button */}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-brand-stone hover:text-brand-black transition-colors duration-300"
              >
                <span className="block w-6 h-px bg-brand-stone group-hover:bg-brand-black group-hover:w-10 transition-all duration-400" />
                Back
              </button>

              <div className="flex items-center gap-6">
                <div className="h-px w-8 bg-brand-accent" />
                <div className="text-brand-stone text-[10px] tracking-[0.5em] font-sans uppercase font-medium">
                  Inventory / Management / New Entry
                </div>
              </div>
              <h1 className="text-8xl lg:text-[10rem] font-serif leading-[0.7] text-brand-black tracking-tighter">
                New <br /><span className="italic text-brand-accent">Piece.</span>
              </h1>
              <p className="text-brand-stone max-w-lg text-lg font-sans font-light leading-relaxed">
                Define the essence of your creation. Every attribute contributes to the narrative of luxury and precision.
              </p>
            </div>

            {/* Error Banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-5 bg-red-500/5 border border-red-500/10 flex items-center gap-4"
                >
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                  <p className="text-red-500 text-xs uppercase tracking-widest">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-24">
              {/* Left: Text Details */}
              <div className="space-y-12">
                <div className="space-y-3">
                  <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Product Title</label>
                  <input
                    required
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Silk Blend Trousers"
                    className="w-full bg-white border-b border-brand-stone/30 focus:border-brand-black text-brand-black p-6 rounded-none outline-none transition-all placeholder:text-brand-stone/30 text-xl font-serif hover:bg-white/80 shadow-premium"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Description</label>
                  <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="6"
                    placeholder="The narrative behind the piece..."
                    className="w-full bg-white border border-brand-stone/10 focus:border-brand-black text-brand-black p-6 rounded-none outline-none transition-all placeholder:text-brand-stone/30 font-sans leading-relaxed shadow-premium resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Price</label>
                    <input
                      required
                      type="number"
                      name="priceAmount"
                      value={formData.priceAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                      className="w-full bg-white border-b border-brand-stone/30 focus:border-brand-black text-brand-black p-6 rounded-none outline-none transition-all font-sans shadow-premium"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Currency</label>
                    <select
                      name="priceCurrency"
                      value={formData.priceCurrency}
                      onChange={handleChange}
                      className="w-full bg-white border-b border-brand-stone/30 focus:border-brand-black text-brand-black p-6 rounded-none outline-none transition-all appearance-none cursor-pointer shadow-premium"
                    >
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Inventory Level</label>
                  <input
                    required
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Units available"
                    className="w-full bg-white border-b border-brand-stone/30 focus:border-brand-black text-brand-black p-6 rounded-none outline-none transition-all font-sans shadow-premium"
                  />
                </div>
              </div>

              {/* Right: Assets & Submit */}
              <div className="space-y-16 flex flex-col justify-between">
                <div className="space-y-12">
                  <div className="space-y-4">
                    <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Visual Curation (Max 5)</label>
                    <div className="relative group/upload">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                        title=""
                      />
                      <div className="w-full aspect-video bg-white border border-brand-stone/10 group-hover/upload:border-brand-black transition-all duration-700 overflow-hidden relative shadow-premium">
                        {imagePreviews.length > 0 ? (
                          <img
                            src={imagePreviews[0]}
                            alt="Main Preview"
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover/upload:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-brand-stone/20 group-hover/upload:text-brand-accent transition-all duration-500 group-hover/upload:scale-110">
                            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M12 4v16m8-8H4" />
                            </svg>
                            <p className="text-[9px] font-sans tracking-[0.4em] uppercase">Upload Visuals</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="grid grid-cols-5 gap-6">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden group/thumb border border-brand-stone/10 bg-white shadow-premium">
                        <img src={preview} alt={`Thumb ${index}`} className="w-full h-full object-cover transition-all duration-500" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute inset-0 bg-brand-black/60 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity backdrop-blur-[2px]"
                        >
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    {Array.from({ length: 5 - imagePreviews.length }).map((_, i) => (
                      <div key={`empty-${i}`} className="aspect-square bg-white/40 border border-brand-stone/5" />
                    ))}
                  </div>
                </div>

                <div className="pt-24 border-t border-brand-stone/10">
                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full bg-brand-black text-white font-sans font-medium py-7 rounded-none hover:bg-brand-accent transition-all duration-500 active:scale-[0.98] disabled:opacity-50 shadow-premium uppercase tracking-[0.4em] text-[12px]"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Processing...
                      </span>
                    ) : 'Register Piece'}
                  </button>
                  <p className="text-[9px] text-brand-stone/40 text-center uppercase tracking-[0.5em] mt-10 font-sans">
                    Secure Curation Record — Ledger v4.0
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateProduct;

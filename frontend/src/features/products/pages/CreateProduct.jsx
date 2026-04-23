import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { createProduct } from '../services/product.api';
import { setLoading, setError } from '../state/product.slice';

const CreateProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.products);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priceAmount: '',
        priceCurrency: 'INR',
        stock: '',
    });


    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            alert("Maximum 5 images allowed");
            return;
        }

        setImages(prev => [...prev, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('priceAmount', formData.priceAmount);
            data.append('priceCurrency', formData.priceCurrency);
            data.append('stock', formData.stock);
            
            images.forEach(image => {
                data.append('images', image);
            });

            const response = await createProduct(data);
            navigate(`/seller/view-product/${response.product._id}`);

        } catch (err) {
            dispatch(setError(err.response?.data?.message || err.message));
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream flex flex-row font-sans">
            {/* Merged Visual Section - Sticky on Desktop */}
            <div className="hidden lg:flex lg:w-1/4 sticky top-0 h-screen shrink-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[2s] ease-out scale-110"
                    style={{ backgroundImage: "url('/assets/minimal_fashion_bg.png')" }}
                />
                {/* Soft Gradient Merge */}
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

            {/* Form Section - Natural Scrolling */}
            <div className="flex-1 flex flex-col items-center p-8 sm:p-12 lg:p-20 lg:py-24 bg-brand-cream relative">
                <div className="w-full max-w-7xl space-y-24 animate-reveal">
                    {/* Header Section */}
                    <div className="space-y-10">
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
                    {error && (
                        <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                            <p className="text-red-500 font-space text-xs uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-24">
                        {/* Left Side: Text Details */}
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
                                    <div className="relative">
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

                        {/* Right Side: Assets & Submit */}
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
                                                <div className="text-brand-stone/20 group-hover/upload:text-brand-accent transition-all duration-500 transform group-hover/upload:scale-110 flex flex-col items-center justify-center gap-4">
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
                                    {loading ? 'Processing...' : 'Register Piece'}
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
    );

};

export default CreateProduct;

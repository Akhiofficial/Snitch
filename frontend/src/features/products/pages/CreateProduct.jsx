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
        <div className="min-h-screen bg-brand-black flex flex-row font-inter overflow-hidden">
            {/* Visual Section - Left Side (Refined Blending) */}
            <div className="hidden md:flex md:w-1/4 lg:w-1/5 relative bg-brand-dark shrink-0 overflow-hidden border-r border-zinc-900/50">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-[0.8] brightness-[0.4] hover:grayscale-0 hover:brightness-100 transition-all duration-[1.5s] ease-out scale-105 hover:scale-100"
                    style={{ backgroundImage: "url('/assets/seller-bg.png')" }}
                />
                {/* Complex Overlay for Better Merging */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-brand-black/20 to-brand-black" />
                <div className="absolute inset-0 bg-linear-to-b from-brand-black/40 via-transparent to-brand-black/60" />

                <div className="absolute top-16 left-10 z-10 space-y-4">
                    <div className="h-px w-12 bg-brand-green/50" />
                    <div className="space-y-1">
                        <h2 className="text-3xl lg:text-4xl font-space font-bold text-white tracking-tighter uppercase leading-none">
                            Expand
                        </h2>
                        <h2 className="text-4xl lg:text-5xl font-space font-bold text-brand-green italic tracking-tighter uppercase leading-none opacity-80">
                            Inventory.
                        </h2>
                    </div>
                    <p className="text-[10px] font-space text-zinc-500 uppercase tracking-[0.4em] pt-4 border-t border-zinc-800/30">
                        Asset Registration
                    </p>
                </div>
            </div>

            {/* Form Section - Premium Polish */}
            <div className="w-full md:w-3/4 lg:w-4/5 flex flex-col items-center p-6 sm:p-12 lg:p-24 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-6xl space-y-16">
                    {/* Header Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="w-1 h-1 rounded-full bg-brand-green animate-pulse" />
                            <div className="text-brand-green text-[10px] tracking-[0.5em] font-space uppercase">
                                System / Inventory / New
                            </div>
                        </div>
                        <h1 className="text-6xl sm:text-7xl lg:text-8xl font-space font-bold tracking-tighter leading-[0.85] uppercase text-white">
                            Create <br /><span className="text-brand-green">Product.</span>
                        </h1>
                        <p className="text-zinc-500 max-w-xl text-lg leading-relaxed font-light">
                            Introduce your new product to the Snitch marketplace with surgical precision. Every detail matters in the pursuit of visual excellence.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                            <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                            <p className="text-red-500 font-space text-xs uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-20">
                        {/* Left Side: Text Details */}
                        <div className="space-y-10">
                            <div className="space-y-3 group">
                                <label className="text-[10px] text-zinc-600 group-focus-within:text-brand-green font-space uppercase tracking-[0.2em] pl-1 transition-colors">Product Title</label>
                                <input
                                    required
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g., Obsidian Vessel 01"
                                    className="w-full bg-zinc-900/20 border border-zinc-800/40 focus:border-brand-green/30 text-white p-6 rounded-2xl outline-none transition-all placeholder:text-zinc-800 text-lg hover:bg-zinc-900/40"
                                />
                            </div>

                            <div className="space-y-3 group">
                                <label className="text-[10px] text-zinc-600 group-focus-within:text-brand-green font-space uppercase tracking-[0.2em] pl-1 transition-colors">Narrative Description</label>
                                <textarea
                                    required
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="8"
                                    placeholder="Clandestine craftsmanship details..."
                                    className="w-full bg-zinc-900/20 border border-zinc-800/40 focus:border-brand-green/30 text-white p-6 rounded-2xl outline-none transition-all placeholder:text-zinc-800 resize-none leading-relaxed hover:bg-zinc-900/40"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3 group">
                                    <label className="text-[10px] text-zinc-600 group-focus-within:text-brand-green font-space uppercase tracking-[0.2em] pl-1 transition-colors">Price Amounts </label>
                                    <input
                                        required
                                        type="number"
                                        name="priceAmount"
                                        value={formData.priceAmount}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className="w-full bg-zinc-900/20 border border-zinc-800/40 focus:border-brand-green/30 text-white p-6 rounded-2xl outline-none transition-all placeholder:text-zinc-800 hover:bg-zinc-900/40"
                                    />
                                </div>
                                <div className="space-y-3 group">
                                    <label className="text-[10px] text-zinc-600 group-focus-within:text-brand-green font-space uppercase tracking-[0.2em] pl-1 transition-colors">Currency</label>
                                    <div className="relative">
                                        <select
                                            name="priceCurrency"
                                            value={formData.priceCurrency}
                                            onChange={handleChange}
                                            className="w-full bg-zinc-900/20 border border-zinc-800/40 focus:border-brand-green/30 text-white p-6 rounded-2xl outline-none transition-all appearance-none cursor-pointer hover:bg-zinc-900/40"
                                        >
                                            <option value="INR">INR</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-600 group-focus-within:text-brand-green transition-colors">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="space-y-3 group">
                                <label className="text-[10px] text-zinc-600 group-focus-within:text-brand-green font-space uppercase tracking-[0.2em] pl-1 transition-colors">Inventory Levels</label>
                                <input
                                    required
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="Units available"
                                    className="w-full bg-zinc-900/20 border border-zinc-800/40 focus:border-brand-green/30 text-white p-6 rounded-2xl outline-none transition-all placeholder:text-zinc-800 hover:bg-zinc-900/40"
                                />
                            </div>
                        </div>

                        {/* Right Side: Assets & Submit */}
                        <div className="space-y-12 flex flex-col justify-between">
                            <div className="space-y-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] text-zinc-600 font-space uppercase tracking-[0.2em] pl-1">Visual Assets (Max 5)</label>
                                    <div className="relative group/upload">
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                                            title="" /* Removes the 'No file chosen' tooltip */
                                        />
                                        <div className="w-full aspect-video bg-zinc-900/10 border border-dashed border-zinc-800/60 group-hover/upload:border-brand-green/40 group-hover/upload:bg-zinc-900/30 rounded-4xl flex flex-col items-center justify-center gap-6 transition-all duration-500 overflow-hidden relative">
                                            {imagePreviews.length > 0 ? (
                                                <img 
                                                    src={imagePreviews[0]} 
                                                    alt="Main Preview" 
                                                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale transition-all duration-700 scale-110 group-hover/upload:scale-100 group-hover/upload:opacity-40 group-hover/upload:grayscale-0"
                                                />
                                            ) : (
                                                <div className="text-zinc-800 group-hover/upload:text-brand-green/40 transition-all duration-500 transform group-hover/upload:scale-110">
                                                    <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="z-20 text-center pointer-events-none">
                                                <p className="text-xs font-space tracking-[0.3em] uppercase text-zinc-400 mb-2 group-hover/upload:text-white transition-colors">Manifest Imagery</p>
                                                <p className="text-[9px] text-zinc-700 font-space tracking-widest">DRAG ASSETS OR CLICK TO BROWSE</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Thumbnails */}
                                <div className="grid grid-cols-5 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group/thumb border border-zinc-900">
                                            <img src={preview} alt={`Thumb ${index}`} className="w-full h-full object-cover grayscale opacity-40 group-hover/thumb:grayscale-0 group-hover/thumb:opacity-100 transition-all duration-500" />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute inset-0 bg-brand-black/60 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity backdrop-blur-[2px]"
                                            >
                                                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    {Array.from({ length: 5 - imagePreviews.length }).map((_, i) => (
                                        <div key={`empty-${i}`} className="aspect-square rounded-xl bg-zinc-900/10 border border-zinc-900/50" />
                                    ))}
                                </div>
                            </div>

                            <div className="pt-12 xl:pt-0">
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="group relative w-full overflow-hidden rounded-2xl py-6 bg-brand-green transition-all duration-500 active:scale-[0.98] disabled:opacity-30"
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
                                    <span className="relative z-10 text-brand-black font-space font-bold uppercase tracking-[0.4em] text-xs">
                                        {loading ? 'Processing Asset...' : 'Register Product'}
                                    </span>
                                </button>
                                <p className="text-[8px] text-zinc-800 text-center uppercase tracking-[0.5em] mt-6 font-space">
                                    Encryption Protocol Active — Snitch v4.0
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

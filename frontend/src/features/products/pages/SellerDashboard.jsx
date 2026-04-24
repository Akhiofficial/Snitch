import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getSellerProducts } from '../services/product.api';
import { setLoading, setError } from '../state/product.slice';

const SellerInventory = () => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.products);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getSellerProducts();
                setProducts(data.products || []);
            } catch (err) {
                dispatch(setError(err.response?.data?.message || err.message));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchProducts();
    }, [dispatch]);

    if (loading && products.length === 0) return (
        <div className="min-h-screen bg-brand-cream flex items-center justify-center">
            <div className="text-brand-accent font-serif text-2xl animate-pulse tracking-widest italic">Snitch is gathering...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-cream text-brand-black font-sans p-6 sm:p-12 lg:p-24 relative">
            {/* Background Texture/Image Overlay */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0">
                <img src="/assets/minimal_fashion_bg.png" className="w-full h-full object-cover" alt="" />
            </div>

            <div className="max-w-7xl mx-auto space-y-24 relative z-10 animate-reveal">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-brand-stone/20 pb-12">
                    <div className="space-y-6">
                        <div className="text-brand-stone text-[11px] tracking-[0.3em] font-sans uppercase font-medium">
                            The Collection / Inventory Management
                        </div>
                        <h1 className="text-7xl sm:text-8xl font-serif leading-tight">
                            Your <span className="italic text-brand-accent">Curation.</span>
                        </h1>
                    </div>
                    <Link 
                        to="/seller/create-product"
                        className="bg-brand-black text-white px-12 py-5 rounded-none font-sans font-medium uppercase tracking-widest text-[10px] hover:bg-brand-accent transition-all duration-500 active:scale-95 shadow-premium"
                    >
                        Add New Piece
                    </Link>
                </div>

                {error && (
                    <div className="p-5 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.6)]" />
                        <p className="text-red-500 font-space text-xs uppercase tracking-widest">{error}</p>
                    </div>
                )}

                {/* Grid */}
                {products.length === 0 && !loading ? (
                    <div className="py-48 text-center space-y-8 border border-brand-stone/10 bg-white/50 backdrop-blur-sm">
                        <p className="text-brand-stone font-serif italic text-2xl">The gallery is currently empty.</p>
                        <Link to="/seller/create-product" className="inline-block text-brand-black font-sans text-[10px] border-b border-brand-black pb-2 uppercase tracking-[0.3em] hover:text-brand-accent hover:border-brand-accent transition-all">Begin Curation</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16">
                        {products.map((product) => (
                            <Link 
                                key={product._id}
                                to={`/seller/product/${product._id}`}
                                className="group block"
                            >
                                <div className="aspect-3/4 bg-white overflow-hidden relative transition-all duration-1000 group-hover:shadow-premium">
                                    {product.images?.[0] ? (
                                        <img 
                                            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url} 
                                            alt={product.title} 
                                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-brand-stone font-serif italic text-lg bg-brand-cream/50">Missing visual.</div>
                                    )}
                                    
                                    {/* Overlay on hover */}
                                    <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/5 transition-all duration-700" />
                                    
                                    <div className="absolute bottom-10 left-10 right-10 flex items-center justify-between opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        <span className="text-[10px] font-sans text-brand-black uppercase tracking-[0.2em] font-semibold bg-white px-4 py-2">View Piece</span>
                                    </div>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <h3 className="text-xl font-serif text-brand-black leading-tight group-hover:text-brand-accent transition-colors">
                                            {product.title}
                                        </h3>
                                        <span className="text-brand-stone font-sans text-[11px] font-medium tracking-widest">{product.price?.currency}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-lg font-sans font-light tracking-tight text-brand-black">
                                            {product.price?.amount?.toLocaleString() || '0'}
                                        </p>

                                        <div className="flex items-center gap-3">
                                            <div className={`w-1.5 h-1.5 rounded-full ${product.stock > 0 ? 'bg-brand-accent' : 'bg-red-400'}`} />
                                            <span className="text-[10px] uppercase tracking-[0.15em] font-sans text-brand-stone font-medium">{product.stock || 0} in stock</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerInventory;

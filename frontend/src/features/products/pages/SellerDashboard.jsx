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
            dispatch(setLoading(true));
            dispatch(setError(null));
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
        <div className="min-h-screen bg-brand-black flex items-center justify-center">
            <div className="text-brand-green font-space animate-pulse tracking-[0.3em] uppercase">Scanning Vault...</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-brand-black text-white font-inter p-6 sm:p-12 lg:p-20">
            <div className="max-w-7xl mx-auto space-y-16">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="space-y-4">
                        <div className="text-brand-green text-[10px] tracking-[0.5em] font-space uppercase">
                            Operational Dashboard / Inventory
                        </div>
                        <h1 className="text-6xl sm:text-7xl font-space font-bold tracking-tighter leading-none uppercase">
                            Your <span className="text-brand-green italic">Collection.</span>
                        </h1>
                    </div>
                    <Link 
                        to="/seller/create-product"
                        className="bg-brand-green text-brand-black px-8 py-4 rounded-xl font-space font-bold uppercase tracking-widest text-xs hover:bg-brand-green-matte transition-all active:scale-95"
                    >
                        Register New Asset
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
                    <div className="py-40 text-center space-y-6 border border-dashed border-zinc-900 rounded-[3rem]">
                        <p className="text-zinc-600 font-space uppercase tracking-widest text-sm">Vault is currently empty</p>
                        <Link to="/seller/create-product" className="inline-block text-brand-green font-space text-xs border-b border-brand-green/30 pb-1 uppercase tracking-[0.2em]">Initialize First Entry</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <Link 
                                key={product._id}
                                to={`/seller/view-product/${product._id}`}
                                className="group space-y-6"
                            >
                                <div className="aspect-square bg-brand-dark/20 rounded-4xl overflow-hidden relative border border-zinc-900 transition-all duration-700 group-hover:border-brand-green/30 group-hover:rounded-2xl">
                                    {product.images?.[0] ? (
                                        <img 
                                            src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url} 
                                            alt={product.title} 
                                            className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-800 uppercase font-space text-[10px] tracking-widest">No Visuals</div>
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-brand-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                    
                                    <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                                        <span className="text-[10px] font-space text-white/50 group-hover:text-white uppercase tracking-widest transition-colors">View Details</span>
                                        <div className="w-8 h-px bg-white/20 group-hover:bg-brand-green group-hover:w-12 transition-all duration-500" />
                                    </div>
                                </div>

                                <div className="space-y-2 px-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-space font-bold uppercase tracking-tight text-white/90 group-hover:text-brand-green transition-colors truncate">
                                            {product.title}
                                        </h3>
                                        <span className="text-zinc-600 font-space text-[10px]">{product.price?.currency}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-zinc-500">
                                        <p className="text-xl font-space font-medium tracking-tighter text-white">
                                            {product.price?.amount?.toLocaleString() || '0'}
                                        </p>

                                        <div className="flex items-center gap-2">
                                            <div className={`w-1 h-1 rounded-full ${product.stock > 0 ? 'bg-brand-green' : 'bg-red-500'}`} />
                                            <span className="text-[9px] uppercase tracking-widest font-space">{product.stock || 0} units</span>
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

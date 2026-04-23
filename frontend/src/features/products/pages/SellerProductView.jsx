import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../services/product.api';
import { setLoading, setError } from '../state/product.slice';
import { getSellerProducts } from '../services/product.api';


const SellerProductView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector(state => state.products);
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(0);

    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            dispatch(setLoading(true));
            dispatch(setError(null));
            try {
                const [productData, listData] = await Promise.all([
                    getProductById(id),
                    getSellerProducts()
                ]);
                setProduct(productData.product);
                setAllProducts(listData.products || []);
            } catch (err) {
                dispatch(setError(err.response?.data?.message || err.message));
            } finally {
                dispatch(setLoading(false));
            }
        };

        fetchProduct();
    }, [id, dispatch]);

    if (loading && !product) return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center">
            <div className="text-brand-green font-space animate-pulse tracking-[0.3em] uppercase">Loading Asset...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 text-center">
            <div className="space-y-6">
                <h2 className="text-red-500 font-space text-2xl uppercase tracking-tighter">Access Denied</h2>
                <p className="text-zinc-500 max-w-sm">{error}</p>
                <Link to="/" className="inline-block text-brand-green font-space text-xs tracking-widest uppercase border-b border-brand-green/30 pb-1">Return to Grid</Link>
            </div>
        </div>
    );

    if (!product) return null;

    return (
        <div className="min-h-screen bg-brand-black text-white font-inter">
            <div className="max-w-7xl mx-auto p-6 sm:p-12 lg:p-20 space-y-32">
                
                <div className="space-y-24">
                    {/* Navigation */}
                    <div>
                        <Link to="/" className="group flex items-center gap-3 text-zinc-500 hover:text-white transition-colors">
                            <div className="w-8 h-px bg-zinc-800 group-hover:bg-brand-green group-hover:w-12 transition-all duration-500" />
                            <span className="text-[10px] font-space uppercase tracking-widest">Back to Dashboard</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                        
                        {/* Visual Section */}
                        <div className="space-y-8">
                            <div className="aspect-4/5 bg-brand-dark/20 rounded-2xl overflow-hidden relative group border border-zinc-900/50">
                                {product.images && product.images.length > 0 ? (
                                    <img 
                                        src={typeof product.images[activeImage] === 'string' ? product.images[activeImage] : product.images[activeImage].url} 
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-800 uppercase font-space text-xs tracking-[0.3em]">
                                        No Imagery Found
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-linear-to-t from-brand-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            {/* Thumbnail Grid */}
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-5 gap-4">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-brand-green' : 'border-transparent grayscale opacity-50 hover:grayscale-0 hover:opacity-80'}`}
                                        >
                                            <img src={typeof img === 'string' ? img : img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Editorial Content */}
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? 'bg-brand-green shadow-[0_0_10px_rgba(148,201,115,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} />
                                    <span className={`text-[10px] font-space uppercase tracking-[0.2em] ${product.stock > 0 ? 'text-brand-green' : 'text-red-500'}`}>
                                        {product.stock > 0 ? `In Stock — ${product.stock} Units` : 'Out of Stock'}
                                    </span>
                                </div>

                                <h1 className="text-6xl sm:text-8xl font-space font-bold tracking-tight leading-none uppercase">
                                    {product.title}
                                </h1>

                                <div className="flex items-baseline gap-2">
                                    <span className="text-zinc-500 font-space text-sm uppercase tracking-widest">{product.price?.currency}</span>
                                    <span className="text-4xl font-space font-bold text-white tracking-tighter">
                                        {product.price?.amount?.toLocaleString() || '0'}
                                    </span>

                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] text-zinc-700 font-space uppercase tracking-[0.3em]">Clandestine Narrative</h3>
                                <p className="text-zinc-500 text-lg leading-relaxed font-inter max-w-xl">
                                    {product.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="pt-8 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button className="bg-brand-green text-brand-black font-space font-bold py-5 rounded-xl hover:bg-brand-green-matte transition-all active:scale-[0.98] uppercase tracking-widest text-xs">
                                        Edit Asset
                                    </button>
                                    <button className="border border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/30 font-space font-bold py-5 rounded-xl transition-all active:scale-[0.98] uppercase tracking-widest text-xs">
                                        Decommission
                                    </button>
                                </div>
                                
                                <p className="text-[10px] text-zinc-800 text-center uppercase tracking-widest font-space">
                                    Internal Seller View — Authorization Level 01
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Inventory List (The Requested Change) */}
                <div className="pt-32 border-t border-zinc-900/50 space-y-12">
                    <div className="flex items-center justify-between">
                        <div className="space-y-2">
                            <h2 className="text-3xl font-space font-bold uppercase tracking-tight">Active <span className="text-brand-green">Vault.</span></h2>
                            <p className="text-[10px] text-zinc-500 font-space uppercase tracking-[0.3em]">Operational Inventory Feed</p>
                        </div>
                        <Link to="/seller/create-product" className="text-[10px] text-brand-green font-space uppercase tracking-widest border-b border-brand-green/20 pb-1 hover:border-brand-green/60 transition-all">Register New Asset</Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {allProducts.map((p) => (
                            <Link 
                                key={p._id} 
                                to={`/seller/view-product/${p._id}`}
                                className={`group space-y-4 ${p._id === id ? 'pointer-events-none' : ''}`}
                            >
                                <div className={`aspect-square rounded-2xl overflow-hidden relative border transition-all duration-500 ${p._id === id ? 'border-brand-green' : 'border-zinc-900 group-hover:border-zinc-700'}`}>
                                    {p.images?.[0] ? (
                                        <img 
                                            src={typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url} 
                                            alt={p.title} 
                                            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${p._id === id ? 'grayscale-0' : 'grayscale group-hover:grayscale-0'}`}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-brand-dark flex items-center justify-center text-[10px] text-zinc-800 font-space">NO VISUAL</div>
                                    )}
                                    {p._id === id && (
                                        <div className="absolute inset-0 bg-brand-green/10 flex items-center justify-center">
                                            <div className="bg-brand-black/80 px-3 py-1 rounded-full text-[8px] font-space text-brand-green uppercase tracking-widest border border-brand-green/20">Active</div>
                                        </div>
                                    )}
                                </div>
                                <div className="px-1 space-y-1">
                                    <h4 className={`text-[11px] font-space font-bold uppercase tracking-tight truncate ${p._id === id ? 'text-brand-green' : 'text-zinc-500 group-hover:text-white'}`}>{p.title}</h4>
                                    <p className="text-[9px] text-zinc-700 font-space uppercase tracking-widest">{p.price?.amount?.toLocaleString()} {p.price?.currency}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerProductView;

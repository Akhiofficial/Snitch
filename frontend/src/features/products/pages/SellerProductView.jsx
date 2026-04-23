import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById } from '../services/product.api';
import { setLoading, setError } from '../state/product.slice';
import { getSellerProducts } from '../services/product.api';
import { useAuth } from '../../auth/hook/useAuth';


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
        <div className="min-h-screen bg-brand-cream flex items-center justify-center">
            <div className="text-brand-accent font-sans animate-pulse tracking-[0.4em] uppercase text-[10px]">Accessing Vault...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6 text-center">
            <div className="space-y-8 animate-reveal">
                <h2 className="text-brand-black font-serif text-4xl italic">Access Restricted</h2>
                <p className="text-brand-stone max-w-sm font-sans text-sm">{error}</p>
                <Link to="/" className="inline-block text-brand-black font-sans text-[10px] tracking-widest uppercase border-b border-brand-black pb-1">Return to Inventory</Link>
            </div>
        </div>
    );

    if (!product) return null;

    return (
        <div className="min-h-screen bg-brand-cream text-brand-black font-sans">
            <div className="max-w-7xl mx-auto p-6 sm:p-12 lg:p-24 space-y-40 animate-reveal">
                
                <div className="space-y-32">
                    {/* Navigation */}
                    <div>
                        <Link to="/" className="group flex items-center gap-4 text-brand-stone hover:text-brand-black transition-colors">
                            <div className="w-12 h-px bg-brand-stone/20 group-hover:bg-brand-black group-hover:w-16 transition-all duration-700" />
                            <span className="text-[10px] font-sans uppercase tracking-[0.4em]">Back to Curation</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-32 items-start">
                        
                        {/* Visual Section */}
                        <div className="space-y-10">
                            <div className="aspect-4/5 bg-white overflow-hidden relative group shadow-premium">
                                {product.images && product.images.length > 0 ? (
                                    <img 
                                        src={typeof product.images[activeImage] === 'string' ? product.images[activeImage] : product.images[activeImage].url} 
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-brand-stone/20 uppercase font-sans text-[10px] tracking-[0.4em]">
                                        Empty Curation
                                    </div>
                                )}
                            </div>

                            {/* Thumbnail Grid */}
                            {product.images && product.images.length > 1 && (
                                <div className="grid grid-cols-5 gap-6">
                                    {product.images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`aspect-square overflow-hidden border transition-all duration-500 shadow-premium ${activeImage === idx ? 'border-brand-black' : 'border-transparent opacity-40 hover:opacity-100'}`}
                                        >
                                            <img src={typeof img === 'string' ? img : img.url} alt="Thumbnail" className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Editorial Content */}
                        <div className="space-y-16">
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className={`h-2 w-2 rounded-full ${product.stock > 0 ? 'bg-brand-accent' : 'bg-red-200'}`} />
                                    <span className={`text-[10px] font-sans uppercase tracking-[0.3em] font-medium ${product.stock > 0 ? 'text-brand-accent' : 'text-brand-stone'}`}>
                                        {product.stock > 0 ? `In Stock / ${product.stock} Units` : 'Sold Out'}
                                    </span>
                                </div>

                                <h1 className="text-7xl sm:text-8xl font-serif italic text-brand-black leading-none">
                                    {product.title}
                                </h1>

                                <div className="flex items-baseline gap-3">
                                    <span className="text-brand-stone font-sans text-xs uppercase tracking-[0.4em]">{product.price?.currency}</span>
                                    <span className="text-5xl font-serif text-brand-black">
                                        {product.price?.amount?.toLocaleString() || '0'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-8 border-y border-brand-stone/10 py-12">
                                <h3 className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.4em] font-bold">The Narrative</h3>
                                <p className="text-brand-stone text-lg leading-relaxed font-sans font-light max-w-xl">
                                    {product.description}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="pt-8 space-y-8">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    <button className="bg-brand-black text-white font-sans font-medium py-6 rounded-none hover:bg-brand-accent transition-all duration-500 active:scale-[0.98] uppercase tracking-[0.3em] text-[10px] shadow-premium">
                                        Edit Curation
                                    </button>
                                    <button className="border border-brand-stone/20 text-brand-stone hover:text-red-400 hover:border-red-100 font-sans font-medium py-6 rounded-none transition-all duration-500 active:scale-[0.98] uppercase tracking-[0.3em] text-[10px]">
                                        Withdraw Piece
                                    </button>
                                </div>
                                
                                <p className="text-[9px] text-brand-stone/40 text-center uppercase tracking-[0.5em] font-sans">
                                    Internal Curation Record — Secure Access
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Global Inventory List */}
                <div className="pt-40 border-t border-brand-stone/10 space-y-16">
                    <div className="flex items-center justify-between">
                        <div className="space-y-4">
                            <h2 className="text-5xl font-serif italic text-brand-black">The <span className="text-brand-accent">Collection.</span></h2>
                            <p className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.4em]">Active Inventory Record</p>
                        </div>
                        <Link to="/seller/create-product" className="text-[10px] text-brand-black font-sans uppercase font-bold tracking-[0.3em] border-b border-brand-black pb-1 hover:text-brand-accent hover:border-brand-accent transition-all duration-500">Register New Piece</Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-12">
                        {allProducts.map((p) => (
                            <Link 
                                key={p._id} 
                                to={`/seller/view-product/${p._id}`}
                                className={`group space-y-6 ${p._id === id ? 'pointer-events-none' : ''}`}
                            >
                                <div className={`aspect-3/4 bg-white overflow-hidden relative transition-all duration-1000 shadow-premium ${p._id === id ? 'ring-1 ring-brand-accent ring-offset-8 ring-offset-brand-cream' : 'group-hover:translate-y-[-8px]'}`}>
                                    {p.images?.[0] ? (
                                        <img 
                                            src={typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url} 
                                            alt={p.title} 
                                            className={`w-full h-full object-cover transition-all duration-1000 ${p._id === id ? 'scale-105' : 'group-hover:scale-110'}`}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-white flex items-center justify-center text-[10px] text-brand-stone font-sans tracking-widest">NO IMAGE</div>
                                    )}
                                    {p._id === id && (
                                        <div className="absolute inset-0 bg-brand-black/5 flex items-end p-6">
                                            <div className="bg-brand-black text-white px-4 py-2 text-[8px] font-sans uppercase tracking-[0.3em]">Current View</div>
                                        </div>
                                    )}
                                </div>
                                <div className="px-1 space-y-2">
                                    <h4 className={`text-[11px] font-sans font-bold uppercase tracking-widest truncate ${p._id === id ? 'text-brand-accent' : 'text-brand-black group-hover:text-brand-accent'}`}>{p.title}</h4>
                                    <p className="text-[9px] text-brand-stone font-sans uppercase tracking-[0.2em]">{p.price?.amount?.toLocaleString()} {p.price?.currency}</p>
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

import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { getProductById, getSellerProducts, addProductVariant, updateVariantStock, deleteProductVariant } from '../services/product.api';
import { setLoading, setError } from '../state/product.slice';


const SellerProductView = () => {
    
    const { id } = useParams();
    const dispatch = useDispatch();
    const { loading, error: reduxError } = useSelector(state => state.products);
    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(0);
    const [allProducts, setAllProducts] = useState([]);

    // Variant Form State
    const [attrKey, setAttrKey] = useState('');
    const [attrVal, setAttrVal] = useState('');
    const [attributes, setAttributes] = useState({}); // { Color: 'Red', Size: 'XL' }
    const [variantPrice, setVariantPrice] = useState('');
    const [variantCurrency, setVariantCurrency] = useState('INR');
    const [variantStock, setVariantStock] = useState(0);
    const [variantImages, setVariantImages] = useState([]); // File objects
    const [imagePreviews, setImagePreviews] = useState([]);
    
    const [variantActionLoading, setVariantActionLoading] = useState(false);
    const [variantError, setVariantError] = useState(null);

    // Inline Editing State
    const [editingVariantId, setEditingVariantId] = useState(null);
    const [editStockValue, setEditStockValue] = useState(0);

    const fetchProductData = async () => {
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

    useEffect(() => {
        fetchProductData();
    }, [id, dispatch]);

    const handleAddAttribute = () => {
        if (attrKey.trim() && attrVal.trim()) {
            setAttributes(prev => ({ ...prev, [attrKey.trim()]: attrVal.trim() }));
            setAttrKey('');
            setAttrVal('');
        }
    };

    const handleRemoveAttribute = (key) => {
        const newAttrs = { ...attributes };
        delete newAttrs[key];
        setAttributes(newAttrs);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (variantImages.length + files.length > 5) {
            setVariantError("Maximum 5 images allowed per variant");
            return;
        }

        const newFiles = [...variantImages, ...files];
        setVariantImages(newFiles);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const handleRemoveImage = (index) => {
        setVariantImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleRegisterVariant = async (e) => {
        e.preventDefault();
        if (Object.keys(attributes).length === 0) {
            setVariantError("At least one attribute (e.g., Color or Size) is required");
            return;
        }

        setVariantActionLoading(true);
        setVariantError(null);

        try {
            const formData = new FormData();
            
            // Append attributes correctly for backend
            Object.entries(attributes).forEach(([key, val]) => {
                formData.append(`attributes[${key}]`, val);
            });

            if (variantPrice) {
                formData.append('priceAmount', variantPrice);
                formData.append('priceCurrency', variantCurrency);
            }
            
            formData.append('stock', variantStock);
            
            variantImages.forEach(file => {
                formData.append('variantImages', file);
            });

            await addProductVariant(id, formData);
            
            // Reset form
            setAttributes({});
            setVariantPrice('');
            setVariantStock(0);
            setVariantImages([]);
            setImagePreviews([]);
            
            // Refresh data
            fetchProductData();
            console.log(formData);
            
        } catch (err) {
            setVariantError(err.response?.data?.message || err.message);
        } finally {
            setVariantActionLoading(false);
        }
    };

    const handleUpdateStock = async (vid) => {
        try {
            await updateVariantStock(id, vid, editStockValue);
            setEditingVariantId(null);
            fetchProductData();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const handleDeleteVariant = async (vid) => {
        if (!window.confirm("Are you sure you want to delete this variant?")) return;
        try {
            await deleteProductVariant(id, vid);
            fetchProductData();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    if (loading && !product) return (
        <div className="min-h-screen bg-brand-cream flex items-center justify-center">
            <div className="text-brand-accent font-sans animate-pulse tracking-[0.4em] uppercase text-[10px]">Accessing Vault...</div>
        </div>
    );

    if (reduxError) return (
        <div className="min-h-screen bg-brand-cream flex items-center justify-center p-6 text-center">
            <div className="space-y-8 animate-reveal">
                <h2 className="text-brand-black font-serif text-4xl italic">Access Restricted</h2>
                <p className="text-brand-stone max-w-sm font-sans text-sm">{reduxError}</p>
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
                        <Link to="/seller/dashboard" className="group flex items-center gap-4 text-brand-stone hover:text-brand-black transition-colors">
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

                {/* VARIANT MANAGEMENT SECTION */}
                <div className="pt-40 border-t border-brand-stone/10 space-y-24">
                    <div className="space-y-4">
                        <h2 className="text-6xl font-serif italic text-brand-black">The <span className="text-brand-accent">Variants.</span></h2>
                        <p className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.4em]">Configure Dimensional Inventory</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                        {/* REGISTER VARIANT PANEL */}
                        <div className="lg:col-span-5 space-y-12 bg-white/50 p-12 shadow-premium">
                            <div className="space-y-2">
                                <h3 className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.4em] font-bold">Register Variant</h3>
                                <div className="h-px bg-brand-stone/10 w-full" />
                            </div>

                            <form onSubmit={handleRegisterVariant} className="space-y-10">
                                {/* Attribute Builder */}
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[9px] uppercase tracking-widest text-brand-stone font-sans font-bold">Attribute Key</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Color"
                                                value={attrKey}
                                                onChange={(e) => setAttrKey(e.target.value)}
                                                className="w-full bg-transparent border-b border-brand-stone/20 py-2 font-sans text-sm focus:border-brand-black outline-none transition-all"
                                            />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <label className="text-[9px] uppercase tracking-widest text-brand-stone font-sans font-bold">Value</label>
                                            <input 
                                                type="text" 
                                                placeholder="e.g. Midnight Black"
                                                value={attrVal}
                                                onChange={(e) => setAttrVal(e.target.value)}
                                                className="w-full bg-transparent border-b border-brand-stone/20 py-2 font-sans text-sm focus:border-brand-black outline-none transition-all"
                                            />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={handleAddAttribute}
                                            className="self-end bg-brand-black text-white w-10 h-10 flex items-center justify-center hover:bg-brand-accent transition-all"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Added Attributes Pills */}
                                    <div className="flex flex-wrap gap-2">
                                        {Object.entries(attributes).map(([key, val]) => (
                                            <div key={key} className="flex items-center gap-2 bg-brand-cream border border-brand-stone/10 px-3 py-1">
                                                <span className="text-[10px] font-sans uppercase tracking-wider text-brand-stone">
                                                    <span className="font-bold text-brand-black">{key}:</span> {val}
                                                </span>
                                                <button 
                                                    type="button" 
                                                    onClick={() => handleRemoveAttribute(key)}
                                                    className="text-brand-stone hover:text-red-500 transition-colors"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Images Upload */}
                                <div className="space-y-4">
                                    <label className="text-[9px] uppercase tracking-widest text-brand-stone font-sans font-bold block">Variant Visuals (Max 5)</label>
                                    <div className="flex flex-wrap gap-4">
                                        {imagePreviews.map((url, idx) => (
                                            <div key={idx} className="w-16 h-16 relative bg-white border border-brand-stone/10 shadow-premium">
                                                <img src={url} alt="Preview" className="w-full h-full object-cover" />
                                                <button 
                                                    type="button"
                                                    onClick={() => handleRemoveImage(idx)}
                                                    className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        {imagePreviews.length < 5 && (
                                            <label className="w-16 h-16 flex items-center justify-center border border-dashed border-brand-stone/30 cursor-pointer hover:border-brand-black transition-all">
                                                <input type="file" multiple onChange={handleImageChange} className="hidden" accept="image/*" />
                                                <span className="text-xl text-brand-stone">+</span>
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Price & Stock - 3 Column Layout for perfect alignment */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-widest text-brand-stone font-sans font-bold block leading-tight">Price (Base Default)</label>
                                        <input 
                                            type="number" 
                                            placeholder="999"
                                            value={variantPrice}
                                            onChange={(e) => setVariantPrice(e.target.value)}
                                            className="w-full bg-transparent border-b border-brand-stone/20 py-2 font-sans text-sm focus:border-brand-black outline-none transition-all"
                                        />
                                    </div>
                                    <div className="space-y-6.5">
                                        <label className="text-[9px] uppercase tracking-widest text-brand-stone font-sans font-bold block leading-tight">Currency</label>
                                        <select 
                                            value={variantCurrency}
                                            onChange={(e) => setVariantCurrency(e.target.value)}
                                            className="w-full bg-transparent border-b border-brand-stone/20 py-2 font-sans text-[10px] uppercase outline-none cursor-pointer hover:text-brand-black transition-all"
                                        >
                                            <option value="INR">INR</option>
                                            <option value="USD">USD</option>
                                            <option value="EUR">EUR</option>
                                            <option value="GBP">GBP</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] uppercase tracking-widest text-brand-stone font-sans font-bold block leading-tight">Stock Quantity</label>
                                        <input 
                                            type="number" 
                                            value={variantStock}
                                            onChange={(e) => setVariantStock(e.target.value)}
                                            className="w-full bg-transparent border-b border-brand-stone/20 py-2 font-sans text-sm focus:border-brand-black outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                {variantError && (
                                    <p className="text-[10px] text-red-500 font-sans uppercase tracking-widest">{variantError}</p>
                                )}

                                <button 
                                    type="submit"
                                    disabled={variantActionLoading}
                                    className="w-full bg-brand-black text-white font-sans font-medium py-5 uppercase tracking-[0.3em] text-[10px] hover:bg-brand-accent transition-all disabled:opacity-50"
                                >
                                    {variantActionLoading ? 'Processing...' : 'Register Variant'}
                                </button>
                            </form>
                        </div>

                        {/* ACTIVE VARIANTS TABLE */}
                        <div className="lg:col-span-7 space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.4em] font-bold">Active Inventory</h3>
                                <div className="h-px bg-brand-stone/10 w-full" />
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full font-sans text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-brand-stone/10">
                                            <th className="py-6 text-[10px] uppercase tracking-widest text-brand-stone font-bold">Piece</th>
                                            <th className="py-6 text-[10px] uppercase tracking-widest text-brand-stone font-bold">Attributes</th>
                                            <th className="py-6 text-[10px] uppercase tracking-widest text-brand-stone font-bold text-center">Price</th>
                                            <th className="py-6 text-[10px] uppercase tracking-widest text-brand-stone font-bold text-center">Stock</th>
                                            <th className="py-6 text-[10px] uppercase tracking-widest text-brand-stone font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-brand-stone/5">
                                        {product.variants && product.variants.length > 0 ? (
                                            product.variants.map((v) => (
                                                <tr key={v._id} className="group hover:bg-white/30 transition-colors">
                                                    <td className="py-8">
                                                        <div className="w-12 h-16 bg-white border border-brand-stone/10 overflow-hidden">
                                                            <img 
                                                                src={v.images && v.images.length > 0 ? v.images[0].url : (typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url)} 
                                                                alt="Variant" 
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="py-8">
                                                        <div className="flex flex-wrap gap-2">
                                                            {v.attributes && Object.entries(v.attributes).map(([key, val]) => (
                                                                <span key={key} className="text-[11px] uppercase tracking-wider text-brand-black font-medium">
                                                                    {key}: <span className="text-brand-stone font-normal">{val}</span>
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="py-8 text-center">
                                                        <span className="text-[13px] font-medium text-brand-black">
                                                            {v.price?.amount 
                                                                ? `${v.price.amount} ${v.price.currency}` 
                                                                : `${product.price.amount} ${product.price.currency}`
                                                            }
                                                        </span>
                                                        {!v.price?.amount && (
                                                            <div className="text-[8px] text-brand-stone uppercase tracking-tighter mt-1">Parent Base</div>
                                                        )}
                                                    </td>
                                                    <td className="py-8 text-center">
                                                        {editingVariantId === v._id ? (
                                                            <div className="flex items-center justify-center gap-2">
                                                                <input 
                                                                    type="number" 
                                                                    value={editStockValue}
                                                                    onChange={(e) => setEditStockValue(e.target.value)}
                                                                    className="w-16 bg-white border border-brand-stone/20 py-1 px-2 text-xs outline-none"
                                                                />
                                                                <button onClick={() => handleUpdateStock(v._id)} className="text-[10px] text-brand-accent uppercase font-bold">Save</button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center justify-center gap-2 group">
                                                                <span className="text-[13px] font-medium text-brand-black">{v.stock}</span>
                                                                <button 
                                                                    onClick={() => { setEditingVariantId(v._id); setEditStockValue(v.stock); }}
                                                                    className="opacity-0 group-hover:opacity-100 text-[10px] text-brand-stone hover:text-brand-black transition-all"
                                                                >
                                                                    ✎
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="py-8 text-right">
                                                        <button 
                                                            onClick={() => handleDeleteVariant(v._id)}
                                                            className="text-[10px] text-brand-stone hover:text-red-500 uppercase tracking-widest font-bold transition-colors"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="py-20 text-center text-brand-stone font-serif italic text-lg opacity-50">
                                                    No variants configured.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
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
                                to={`/seller/product/${p._id}`}
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

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hook/useAuth';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';


const Register = () => {

    const { handleRegister, clearAuthError } = useAuth();
    const { loading, error } = useSelector(state => state.auth);

    const [formData, setFormData] = useState({
        fullname: '',
        username: '',
        email: '',
        password: '',
        contact: '',
        isSeller: false
    });
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        return () => clearAuthError();
    }, []);

    const handleChange = (e) => {
        if (error) clearAuthError();
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await handleRegister({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                contact: formData.contact,
                fullname: formData.fullname,
                isSeller: formData.isSeller
            });
            navigate('/');
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream flex flex-row overflow-hidden font-sans">
            {/* Merged Visual Section */}
            <div className="hidden lg:flex lg:w-1/3 relative shrink-0 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-[2s] ease-out scale-110"
                    style={{ backgroundImage: "url('/assets/minimal_fashion_bg.png')" }}
                />
                {/* Soft Gradient Merge */}
                <div className="absolute inset-0 bg-linear-to-r from-brand-black/10 via-brand-cream/40 to-brand-cream" />

                <div className="absolute bottom-32 left-16 z-10 space-y-8">
                    <div className="h-px w-24 bg-brand-black/20 mb-12" />
                    <div className="space-y-4">
                        <span className="text-[10px] font-sans text-brand-stone uppercase tracking-[0.6em]">Membership</span>
                        <h2 className="text-6xl xl:text-7xl font-serif text-brand-black leading-tight">
                            Join the <br /> <span className="italic text-brand-accent">Curation.</span>
                        </h2>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 md:p-24 bg-brand-cream z-20 overflow-y-auto animate-reveal">
                <div className="w-full max-w-xl space-y-16">
                    {/* Header Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <span className="text-brand-stone text-[10px] tracking-[0.5em] font-sans uppercase font-medium">New Account</span>
                            <div className="flex-1 h-px bg-brand-stone/10" />
                        </div>
                        <h1 className="text-5xl font-serif text-brand-black leading-none">
                            Identity <br /><span className="italic text-brand-accent">Creation.</span>
                        </h1>
                        <p className="text-brand-stone font-sans text-sm max-w-sm leading-relaxed">
                            Complete your registration to access our exclusive curated marketplace.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            <p className="text-red-500 font-space text-[10px] uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    {/* Registration Form */}
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className="w-full bg-transparent border-b border-brand-stone/30 focus:border-brand-black text-brand-black p-4 rounded-none outline-none transition-all font-sans placeholder:text-brand-stone/40 text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Username</label>
                                <input
                                    required
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="@handle"
                                    className="w-full bg-transparent border-b border-brand-stone/30 focus:border-brand-black text-brand-black p-4 rounded-none outline-none transition-all font-sans placeholder:text-brand-stone/40 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Email Address</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="w-full bg-transparent border-b border-brand-stone/30 focus:border-brand-black text-brand-black p-4 rounded-none outline-none transition-all font-sans placeholder:text-brand-stone/40 text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Contact Number</label>
                                <input
                                    required
                                    type="text"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    placeholder="+1..."
                                    className="w-full bg-transparent border-b border-brand-stone/30 focus:border-brand-black text-brand-black p-4 rounded-none outline-none transition-all font-sans placeholder:text-brand-stone/40 text-sm"
                                />
                            </div>

                            <div className="space-y-2 relative">
                                <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Secure Phrase</label>
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-transparent border-b border-brand-stone/30 focus:border-brand-black text-brand-black p-4 rounded-none outline-none transition-all font-sans placeholder:text-brand-stone/40 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 bottom-4 text-brand-stone hover:text-brand-black transition-colors font-sans text-[10px] tracking-widest"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "HIDE" : "SHOW"}
                                </button>
                            </div>
                        </div>

                        {/* Seller Flag Section */}
                        <div className="p-8 bg-white border border-brand-stone/10 shadow-premium space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h3 className="text-brand-black font-sans text-[11px] tracking-[0.2em] uppercase font-semibold">Join as Merchant</h3>
                                    <p className="text-brand-stone text-[10px] font-sans max-w-[250px] leading-relaxed">
                                        Gain the ability to list and curate your own luxury collections.
                                    </p>
                                </div>

                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isSeller"
                                        checked={formData.isSeller}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-12 h-6 bg-brand-stone/20 peer-focus:outline-none rounded-none peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-brand-stone after:rounded-none after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-accent peer-checked:after:bg-white"></div>
                                </label>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-brand-black text-white font-sans font-medium py-5 rounded-none hover:bg-brand-accent transition-all duration-500 active:scale-[0.98] disabled:opacity-50 shadow-premium uppercase tracking-[0.2em] text-[11px]"
                        >
                            {loading ? 'Creating Identity...' : 'Complete Registration'}
                        </button>

                        <div className="relative py-2">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-800/50"></div>
                            </div>
                            <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-space">
                                <span className="bg-brand-black px-4 text-zinc-600">Or integrate via</span>
                            </div>
                        </div>

                        <button
                            onClick={() => window.location.href = "/api/auth/google"}
                            type="button"
                            className="w-full bg-white hover:bg-zinc-50 text-[#1f1f1f] font-roboto font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-all border border-[#747775] active:scale-[0.99] shadow-sm"
                        >
                            <div className="w-5 h-5 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.11c-.22-.67-.35-1.39-.35-2.11s.13-1.44.35-2.11V7.05H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.95l3.66-2.84z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z"
                                        fill="#EA4335"
                                    />
                                </svg>
                            </div>
                            <span className="text-[14px] sm:text-[16px] tracking-normal">Continue with Google</span>
                        </button>

                    </form>

                    <div className="text-center pt-8">
                        <p className="text-brand-stone font-sans text-[11px] tracking-wide uppercase">
                            Already authenticated?{" "}
                            <Link to="/login" className="text-brand-black hover:text-brand-accent transition-colors font-semibold border-b border-brand-black/20 ml-2">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;


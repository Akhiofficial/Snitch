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
        <div className="min-h-screen bg-brand-black flex flex-col md:flex-row overflow-hidden">
            {/* Visual Section - Left Side */}
            <div className="hidden md:flex md:w-1/3 lg:w-1/2 relative bg-brand-dark">
                <div
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-30 hover:grayscale-0 transition-all duration-1000"
                    style={{ backgroundImage: "url('/assets/register-bg.png')" }}
                />
                <div className="absolute inset-0 bg-linear-to-r from-transparent to-brand-black" />

                <div className="absolute top-12 left-12 z-10">
                    <div className="h-0.5 w-12 bg-brand-green mb-4" />
                    <h2 className="text-4xl font-space font-bold text-white tracking-tight uppercase">
                        The <span className="text-brand-green">Curator's</span> <br />Perspective.
                    </h2>
                </div>
            </div>

            {/* Form Section - Right Side */}
            <div className="flex-1 flex items-center justify-center p-8 sm:p-12 md:p-20 bg-brand-black z-20 overflow-y-auto custom-scrollbar">
                <div className="w-full max-w-xl space-y-10">
                    {/* Header Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <span className="text-brand-green text-[10px] tracking-[0.5em] font-space uppercase">Initialization</span>
                            <div className="flex-1 h-px bg-zinc-800" />
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-space font-bold tracking-tight text-white leading-none">
                            Join the <span className="text-brand-green italic">Circle.</span>
                        </h1>
                        <p className="text-zinc-500 font-inter text-sm max-w-sm leading-relaxed">
                            Become a verified curator or merchant in our exclusive retail ecosystem.
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
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-[9px] text-zinc-600 font-space uppercase tracking-[0.2em] pl-1">Full Identity</label>
                                <input
                                    required
                                    type="text"
                                    name="fullname"
                                    value={formData.fullname}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    className="w-full bg-brand-dark/10 border border-zinc-800 focus:border-brand-green/30 text-white p-4 rounded-lg outline-none transition-all font-inter placeholder:text-zinc-800 text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[9px] text-zinc-600 font-space uppercase tracking-[0.2em] pl-1">Public Handle</label>
                                <input
                                    required
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="@handle"
                                    className="w-full bg-brand-dark/10 border border-zinc-800 focus:border-brand-green/30 text-white p-4 rounded-lg outline-none transition-all font-inter placeholder:text-zinc-800 text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="text-[9px] text-zinc-600 font-space uppercase tracking-[0.2em] pl-1">Digital Mail</label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="w-full bg-brand-dark/10 border border-zinc-800 focus:border-brand-green/30 text-white p-4 rounded-lg outline-none transition-all font-inter placeholder:text-zinc-800 text-sm"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] text-zinc-600 font-space uppercase tracking-[0.2em] pl-1">Direct Contact</label>
                                <input
                                    required
                                    type="text"
                                    name="contact"
                                    value={formData.contact}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    className="w-full bg-brand-dark/10 border border-zinc-800 focus:border-brand-green/30 text-white p-4 rounded-lg outline-none transition-all font-inter placeholder:text-zinc-800 text-sm"
                                />
                            </div>

                            <div className="space-y-1.5 relative">
                                <label className="text-[9px] text-zinc-600 font-space uppercase tracking-[0.2em] pl-1">Secure Phrase</label>
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-brand-dark/10 border border-zinc-800 focus:border-brand-green/30 text-white p-4 rounded-lg outline-none transition-all font-inter placeholder:text-zinc-800 text-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 bottom-4 text-zinc-700 hover:text-brand-green transition-colors font-space text-[9px] tracking-tighter"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "CONCEAL" : "REVEAL"}
                                </button>
                            </div>
                        </div>

                        {/* Seller Flag Section */}
                        <div className="p-5 bg-brand-dark/20 rounded-xl border border-zinc-800/50 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <h3 className="text-white font-space text-[10px] tracking-[0.2em] uppercase">Become a Merchant</h3>
                                    <p className="text-zinc-600 text-[10px] font-inter max-w-[200px]">
                                        Unlock the ability to list and curate luxury goods.
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
                                    <div className="w-10 h-5 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-zinc-600 after:border-zinc-500 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-green peer-checked:after:bg-white"></div>
                                </label>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-brand-green text-brand-black font-space font-bold py-5 rounded-lg hover:brightness-110 shadow-lg hover:shadow-brand-green/10 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-[11px]"
                        >
                            {loading ? 'Processing...' : 'Complete Initialization'}
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

                    <div className="text-center">
                        <p className="text-zinc-600 font-inter text-xs">
                            Already authenticated?{" "}
                            <Link to="/login" className="text-brand-green hover:text-white transition-colors tracking-[0.3em] font-space text-[10px] uppercase ml-3">
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


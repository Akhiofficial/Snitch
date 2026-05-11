import React, { useState, useEffect } from 'react';
import { useAuth } from '../hook/useAuth';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';


const Login = () => {
    const { handleLogin, clearAuthError } = useAuth();
    const { loading, error } = useSelector(state => state.auth);
    const [formData, setFormData] = useState({
        identifier: '', // Can be username or contact
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        return () => clearAuthError();
    }, []);

    const handleChange = (e) => {
        if (error) clearAuthError();
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // The backend expects { username, password, contact }. 
            // We'll pass the identifier to both username and contact fields.
            const user = await handleLogin({
                username: formData.identifier,
                password: formData.password,
                contact: formData.identifier
            });

            if (user.role === "buyer") {
                navigate("/")
            } else if (user.role == "seller") {
                navigate("/seller/dashboard")
            }

        } catch (error) {
            console.error("Login attempt failed:", error.response?.data?.message || error.message);
        }

    };

    return (
        <div className="min-h-screen bg-brand-cream flex flex-row font-sans overflow-hidden">
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
                        <span className="text-[10px] font-sans text-brand-stone uppercase tracking-[0.6em]">Protocol</span>
                        <h2 className="text-6xl xl:text-7xl font-serif text-brand-black leading-tight">
                            Elevate <br /> <span className="italic text-brand-accent">Standard.</span>
                        </h2>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8 sm:p-20 bg-brand-cream relative animate-reveal">
                <div className="w-full max-w-md space-y-16">
                    {/* Header Section */}
                    <div className="space-y-6">
                        <div className="text-brand-stone text-[10px] tracking-[0.4em] font-sans uppercase font-medium">
                            Authorized Access
                        </div>
                        <h1 className="text-6xl font-serif text-brand-black leading-none">
                            Entry <br /><span className="italic text-brand-accent">Protocol.</span>
                        </h1>
                        <p className="text-brand-stone max-w-sm text-sm font-sans leading-relaxed">
                            Sign in to access your dashboard and manage your curated collections.
                        </p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                            <p className="text-red-500 font-space text-[11px] uppercase tracking-wider">{error}</p>
                        </div>
                    )}



                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-10">
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Identifier</label>
                                <input
                                    required
                                    type="text"
                                    name="identifier"
                                    value={formData.identifier}
                                    onChange={handleChange}
                                    placeholder="Username or Contact"
                                    className="w-full bg-white border-b border-brand-stone/30 focus:border-brand-black text-brand-black p-4 rounded-none outline-none transition-all placeholder:text-brand-stone/40 font-sans"
                                />
                            </div>

                            <div className="space-y-3 relative">
                                <label className="text-[10px] text-brand-stone font-sans uppercase tracking-[0.3em] font-semibold pl-1">Access Phrase</label>
                                <input
                                    required
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full bg-white border-b border-brand-stone/30 focus:border-brand-black text-brand-black p-4 rounded-none outline-none transition-all placeholder:text-brand-stone/40 font-sans"
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

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-brand-black text-white font-sans font-medium py-5 rounded-none hover:bg-brand-accent transition-all duration-500 active:scale-[0.98] disabled:opacity-50 shadow-premium uppercase tracking-[0.2em] text-[11px]"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-zinc-800/50"></div>
                            </div>
                            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-space">
                                <span className="bg-brand-black px-4 text-zinc-500">Or continue with</span>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                const baseUrl = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
                                window.location.href = `${baseUrl}/api/auth/google`;
                            }}
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
                            New curator?{" "}
                            <Link to="/register" className="text-brand-black hover:text-brand-accent transition-colors font-semibold border-b border-brand-black/20 ml-2">
                                Apply for Access
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

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
            await handleLogin({
                username: formData.identifier,
                password: formData.password,
                contact: formData.identifier
            });
            navigate('/');
        } catch (error) {
            console.error("Login attempt failed:", error.response?.data?.message || error.message);
        }

    };

    return (
        <div className="min-h-screen bg-brand-black flex flex-row font-inter">
      {/* Visual Section - Left Side */}
      <div className="hidden md:flex md:w-1/3 lg:w-1/2 relative bg-brand-dark">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat grayscale-30 hover:grayscale-0 transition-all duration-1000"
          style={{ backgroundImage: "url('/assets/login-bg.png')" }}
        />
        <div className="absolute inset-0 bg-linear-to-r from-transparent to-brand-black" />
        
        <div className="absolute top-12 left-12 z-10">
          <div className="h-0.5 w-12 bg-brand-green mb-4" />
          <h2 className="text-4xl font-space font-bold text-white tracking-tight uppercase">
            Define <br /> <span className="text-brand-green italic text-5xl">Reality.</span>
          </h2>
        </div>
      </div>

            <div className="w-full md:w-2/3 lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-lg space-y-12">
                {/* Header Section */}
                <div className="space-y-4">
                    <div className="text-brand-green text-xs tracking-[0.3em] font-space uppercase">
                        Marketplace Authentication
                    </div>
                    <h1 className="text-5xl sm:text-7xl font-space font-bold tracking-tight text-white leading-none">
                        RETAIL <br /><span className="text-brand-green font-bold">GATEWAY.</span>
                    </h1>
                    <p className="text-zinc-500 max-w-sm text-lg leading-relaxed">
                        Verify your merchant or buyer status to enter the Snitch e-commerce ecosystem.
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
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] text-zinc-500 font-space uppercase tracking-widest pl-1">Username or Contact</label>
                            <input
                                required
                                type="text"
                                name="identifier"
                                value={formData.identifier}
                                onChange={handleChange}
                                placeholder="johndoe7 or +1..."
                                className="w-full bg-brand-dark/40 border border-zinc-800/50 focus:border-brand-green/50 text-white p-5 rounded-xl outline-none transition-all placeholder:text-zinc-700"
                            />
                        </div>

                        <div className="space-y-2 relative">
                            <label className="text-[10px] text-zinc-500 font-space uppercase tracking-widest pl-1">Access Phrase</label>
                            <input
                                required
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full bg-brand-dark/40 border border-zinc-800/50 focus:border-brand-green/50 text-white p-5 rounded-xl outline-none transition-all placeholder:text-zinc-700"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 bottom-5 text-zinc-600 hover:text-brand-green transition-colors font-space text-[10px] tracking-widest"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? "HIDE" : "SHOW"}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-space">
                        <Link to="/forgot-password" title="Coming soon" className="text-zinc-600 hover:text-zinc-400 tracking-widest uppercase">
                            Forgot access phrase?
                        </Link>
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-brand-green text-brand-black font-space font-bold py-5 rounded-xl hover:bg-brand-green-matte hover:shadow-[0_0_40px_rgba(148,201,115,0.2)] transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {loading ? 'VERIFYING...' : 'SIGN IN'}
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
                        onClick={() => window.location.href = "/api/auth/google"}
                        type="button"
                        className="w-full bg-[#131313] hover:bg-black text-white font-roboto font-medium p-1 rounded-xl flex items-center transition-all border border-zinc-800 active:scale-[0.99] group"
                    >
                        <div className="bg-white p-3 rounded-lg flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
                        <span className="flex-1 text-center text-[14px] sm:text-[15px] tracking-wide font-medium">Continue with Google</span>
                    </button>

                </form>

                <div className="text-center pt-4">
                    <p className="text-zinc-600 font-inter text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-brand-green hover:underline underline-offset-8 decoration-1 tracking-[0.2em] font-space text-[11px] uppercase ml-2 transition-all">
                            Register
                        </Link>
                    </p>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

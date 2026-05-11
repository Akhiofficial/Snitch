import React from 'react';
import { useRouteError, Link } from 'react-router';

const ErrorPage = () => {
    const error = useRouteError();

    // Determine if it's a 404 or a generic error
    const is404 = error?.status === 404 || error?.statusText === 'Not Found';
    const errorCode = error?.status || '404';
    const errorMessage = error?.statusText || error?.message || null;

    return (
        <div className="min-h-screen bg-brand-cream flex flex-col font-sans overflow-hidden animate-reveal">

            {/* Minimal Top Nav */}
            <header className="flex items-center justify-between px-10 py-6 border-b border-brand-black/10">
                <Link
                    to="/"
                    className="text-brand-black font-serif text-lg tracking-[0.25em] uppercase"
                >
                    Snitch
                </Link>
                <div className="hidden md:flex items-center gap-10">
                    <Link to="/products" className="text-brand-stone text-[10px] uppercase tracking-[0.3em] hover:text-brand-black transition-colors">
                        Collections
                    </Link>
                    <Link to="/login" className="text-brand-stone text-[10px] uppercase tracking-[0.3em] hover:text-brand-black transition-colors">
                        Sign In
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-center px-10 text-center py-20">
                <div className="max-w-2xl w-full space-y-12">

                    {/* Label + hairline */}
                    <div className="flex flex-col items-center gap-4">
                        <span className="text-[10px] font-sans text-brand-stone uppercase tracking-[0.6em] font-medium">
                            System Interruption
                        </span>
                        <div className="h-px w-16 bg-brand-stone/20" />
                    </div>

                    {/* Large decorative error code */}
                    <div
                        className="font-serif text-brand-black leading-none select-none"
                        style={{ fontSize: 'clamp(100px, 18vw, 180px)', fontWeight: 300, letterSpacing: '-0.04em', opacity: 0.08 }}
                        aria-hidden="true"
                    >
                        {errorCode}
                    </div>

                    {/* Headline */}
                    <div className="space-y-5 -mt-8">
                        <h1 className="text-5xl xl:text-6xl font-serif text-brand-black leading-tight tracking-tight">
                            {is404 ? (
                                <>Page Not <span className="italic text-brand-accent">Found.</span></>
                            ) : (
                                <>Something Went <span className="italic text-brand-accent">Wrong.</span></>
                            )}
                        </h1>

                        <p className="text-brand-stone font-sans text-sm leading-relaxed max-w-md mx-auto">
                            {is404
                                ? "The page you're looking for has been moved, removed, or never existed. Navigate back to explore our collections."
                                : "An unexpected error has occurred. Our team has been notified. Please return home and try again."
                            }
                        </p>

                        {/* Show raw error detail if available (not in production) */}
                        {errorMessage && !is404 && (
                            <p className="text-brand-stone/40 font-sans text-[10px] uppercase tracking-widest mt-2">
                                {errorMessage}
                            </p>
                        )}
                    </div>

                    {/* Hairline divider */}
                    <div className="h-px w-full max-w-xs mx-auto bg-brand-black/10" />

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/"
                            className="bg-brand-black text-white font-sans font-medium py-4 px-10 rounded-none hover:bg-brand-accent transition-all duration-500 uppercase tracking-[0.2em] text-[11px]"
                        >
                            Return Home
                        </Link>
                        <Link
                            to="/products"
                            className="bg-transparent text-brand-black border border-brand-black font-sans font-medium py-4 px-10 rounded-none hover:bg-brand-black/5 transition-all duration-500 uppercase tracking-[0.2em] text-[11px]"
                        >
                            View Collections
                        </Link>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="px-10 py-6 border-t border-brand-black/10 text-center">
                <span className="text-brand-stone/40 font-sans text-[9px] uppercase tracking-[0.5em]">
                    © Snitch — Editorial Fashion
                </span>
            </footer>
        </div>
    );
};

export default ErrorPage;


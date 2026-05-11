import React from 'react';
import { Link, useNavigate } from 'react-router';

/**
 * Unauthorized / Access Restricted page
 * Displayed when:
 *  1. User is not logged in (type="unauthenticated")
 *  2. User is logged in but lacks the required role (type="forbidden")
 */
const Unauthorized = ({ type = 'unauthenticated' }) => {
  const navigate = useNavigate();

  const isUnauthenticated = type === 'unauthenticated';

  return (
    <div className="min-h-screen bg-brand-cream flex flex-col font-sans overflow-hidden animate-reveal">

      {/* Minimal Top Nav */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-brand-black/10">
        <Link to="/" className="text-brand-black font-serif text-lg tracking-[0.25em] uppercase">
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
      <main className="flex-1 flex items-stretch">

        {/* Left Panel — Editorial Number */}
        <div className="hidden lg:flex w-1/3 relative bg-brand-cream items-center justify-center border-r border-brand-black/10">
          {/* Vertical hairline */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-brand-black/10" />

          <div className="flex flex-col items-center gap-6 px-12">
            {/* Tall thin hairline above number */}
            <div className="w-px h-24 bg-brand-stone/30" />

            <span
              className="text-[9rem] xl:text-[11rem] font-serif text-brand-black/6 leading-none select-none"
              aria-hidden="true"
            >
              {isUnauthenticated ? '401' : '403'}
            </span>

            <div className="w-px h-24 bg-brand-stone/30" />

            {/* Rotated label */}
            <span
              className="text-[9px] text-brand-stone uppercase tracking-[0.6em] font-sans"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              {isUnauthenticated ? 'Authentication Required' : 'Insufficient Privileges'}
            </span>
          </div>
        </div>

        {/* Right Panel — Content */}
        <div className="flex-1 flex flex-col justify-center px-10 sm:px-16 lg:px-24 py-20 space-y-14">

          {/* Label */}
          <div>
            <span className="text-[10px] font-sans text-brand-stone uppercase tracking-[0.6em] font-medium">
              {isUnauthenticated ? 'Authentication Required' : 'Access Restricted'}
            </span>
            <div className="h-px w-16 bg-brand-stone/20 mt-4" />
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-6xl xl:text-7xl font-serif text-brand-black leading-none tracking-tight">
              {isUnauthenticated ? (
                <>Restricted <br /><span className="italic text-brand-accent">Access.</span></>
              ) : (
                <>Forbidden <br /><span className="italic text-brand-accent">Zone.</span></>
              )}
            </h1>

            <p className="text-brand-stone font-sans text-sm leading-relaxed max-w-md mt-6">
              {isUnauthenticated
                ? "This curation is reserved for our members. Please sign in to access your exclusive collections and personalized experience."
                : "You don't have the necessary privileges to view this section. This area is restricted to a specific role within our platform."
              }
            </p>
          </div>

          {/* Hairline divider */}
          <div className="h-px w-full max-w-sm bg-brand-black/10" />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-sm">
            {isUnauthenticated ? (
              <Link
                to="/login"
                className="flex-1 bg-brand-black text-white font-sans font-medium py-4 px-8 text-center rounded-none hover:bg-brand-accent transition-all duration-500 uppercase tracking-[0.2em] text-[11px]"
              >
                Sign In
              </Link>
            ) : (
              <button
                onClick={() => navigate(-1)}
                className="flex-1 bg-brand-black text-white font-sans font-medium py-4 px-8 text-center rounded-none hover:bg-brand-accent transition-all duration-500 uppercase tracking-[0.2em] text-[11px]"
              >
                Go Back
              </button>
            )}

            <Link
              to="/"
              className="flex-1 bg-transparent text-brand-black border border-brand-black font-sans font-medium py-4 px-8 text-center rounded-none hover:bg-brand-black/5 transition-all duration-500 uppercase tracking-[0.2em] text-[11px]"
            >
              Go Home
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-brand-stone/60 font-sans text-[10px] uppercase tracking-[0.3em] pt-4">
            Snitch — High Fashion, Curated Access
          </p>
        </div>
      </main>
    </div>
  );
};

export default Unauthorized;

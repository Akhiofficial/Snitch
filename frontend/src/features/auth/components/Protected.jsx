import React from 'react';
import { useSelector } from 'react-redux';
import Unauthorized from './Unauthorized';

/**
 * Protected Route Wrapper
 *
 * Props:
 *  - children: JSX to render when authorized
 *  - role: required role ("buyer" | "seller"). Defaults to "buyer".
 *
 * Behaviour:
 *  - Shows a premium loading screen while auth state is being resolved.
 *  - Shows Unauthorized (type="unauthenticated") when no user is logged in.
 *  - Shows Unauthorized (type="forbidden") when user lacks the required role.
 *  - Renders children when user is authenticated with the correct role.
 */
const Protected = ({ children, role = 'buyer' }) => {
  const user = useSelector((state) => state.auth.user);
  const loading = useSelector((state) => state.auth.loading);

  /* ── Loading state ─────────────────────────────────────────────────── */
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center gap-6">
        {/* Animated hairline loader */}
        <div className="relative w-24 h-px bg-brand-black/10 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 w-1/2 bg-brand-black"
            style={{
              animation: 'slideLoader 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite',
            }}
          />
        </div>
        <span className="text-brand-stone font-sans text-[10px] uppercase tracking-[0.5em]">
          Authenticating
        </span>
        <style>{`
          @keyframes slideLoader {
            0%   { transform: translateX(-100%); }
            50%  { transform: translateX(100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }

  /* ── Not logged in ──────────────────────────────────────────────────── */
  if (!user) {
    return <Unauthorized type="unauthenticated" />;
  }

  /* ── Wrong role ─────────────────────────────────────────────────────── */
  if (user.role !== role) {
    return <Unauthorized type="forbidden" />;
  }

  /* ── Authorized ─────────────────────────────────────────────────────── */
  return children;
};

export default Protected;
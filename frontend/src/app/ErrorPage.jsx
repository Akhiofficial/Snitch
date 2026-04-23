import React from 'react';
import { useRouteError, Link } from 'react-router';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="min-h-screen bg-brand-black flex items-center justify-center p-6 text-center font-inter">
            <div className="max-w-md space-y-8">
                <div className="space-y-4">
                    <div className="text-brand-green text-[10px] tracking-[0.5em] font-space uppercase">
                        System Interruption
                    </div>
                    <h1 className="text-6xl font-space font-bold text-white tracking-tighter uppercase">
                        Access <span className="text-red-500 italic">Error.</span>
                    </h1>
                    <p className="text-zinc-500 text-lg leading-relaxed font-light">
                        The requested operational data is currently unreachable or corrupted.
                    </p>
                </div>

                <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                    <p className="text-red-500/60 font-space text-[10px] uppercase tracking-widest break-all">
                        {error?.statusText || error?.message || "Unknown Exception Detected"}
                    </p>
                </div>

                <div className="pt-8">
                    <Link 
                        to="/" 
                        className="inline-block bg-brand-green text-brand-black px-10 py-4 rounded-xl font-space font-bold uppercase tracking-widest text-xs hover:bg-brand-green-matte transition-all"
                    >
                        Return to Safe Zone
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;

import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, Home, Sparkles } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 text-center shadow-card space-y-6">
        
        <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-8 h-8 animate-spin [animation-duration:8s]" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-sm font-bold text-brand-600">404 Error</span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            The page you are looking for does not exist, has been moved, or is temporarily unavailable.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link
            to="/"
            className="flex-1 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Home Page</span>
          </Link>
          <Link
            to="/courses"
            className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span>Courses Catalog</span>
          </Link>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { AITutorChat } from '../components/ai-tutor/AITutorChat';
import { Sparkles, Bot, AlertTriangle, ShieldCheck } from 'lucide-react';

export const AITutor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialPrompt = searchParams.get('prompt') || '';

  return (
    <div className="py-8 sm:py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Page Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 text-violet-800 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Claude Tutor Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ADITYA Intelligent Learning Assistant
            </h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-soft">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Server-Secured API &bull; Privacy Preserving</span>
          </div>
        </div>

        {/* AI Tutor Chat Container */}
        <AITutorChat initialPrompt={initialPrompt} />

      </div>
    </div>
  );
};

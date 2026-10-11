import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Bot, Code, HelpCircle, Lightbulb, Terminal } from 'lucide-react';

export const AITutorTeaser: React.FC = () => {
  const navigate = useNavigate();

  const samplePrompts = [
    'Explain neural networks in simple terms.',
    'Teach me Python from the beginning.',
    'Help me understand binary search.',
    'Create a study plan for Machine Learning.',
    'Explain this programming error.',
    'Give me a project idea using React and Node.js.',
  ];

  const handlePromptClick = (prompt: string) => {
    navigate(`/ai-tutor?prompt=${encodeURIComponent(prompt)}`);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white relative overflow-hidden">
      {/* Background radial highlights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-900/60 border border-violet-700/80 text-violet-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Core Interactive Feature</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Meet Your 24/7 AI Tutor Powered by Claude
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Stuck on algorithmic complexity? Confused by backpropagation or async JavaScript?
              Ask questions naturally, request progressive hints, generate customized study plans, 
              and debug errors step-by-step.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Lightbulb className="w-5 h-5 text-amber-400 mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">Adaptive Explanations</h4>
                <p className="text-xs text-slate-400">Tailored to beginner, intermediate, or advanced depth.</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <Code className="w-5 h-5 text-cyan-400 mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">Code &amp; Debug Assistance</h4>
                <p className="text-xs text-slate-400">Syntax highlighting, line-by-line breakdown, and test cases.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/ai-tutor"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-500 to-violet-600 hover:from-brand-600 hover:to-violet-700 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 transition-all"
              >
                <span>Launch AI Tutor Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl bg-slate-900/90 border border-slate-700 p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-violet-600/30 border border-violet-500/40 text-violet-400 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Suggested Practice Prompts</h3>
                    <p className="text-xs text-slate-400">Click any prompt to begin an interactive session</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-violet-950 text-violet-300 border border-violet-800">
                  Ready
                </span>
              </div>

              <div className="space-y-2.5">
                {samplePrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePromptClick(prompt)}
                    className="w-full text-left p-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 hover:border-violet-500 text-sm text-slate-200 hover:text-white transition-all flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <Terminal className="w-4 h-4 text-violet-400 shrink-0" />
                      <span className="line-clamp-1">{prompt}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-violet-400 group-hover:translate-x-1 transition-all shrink-0" />
                  </button>
                ))}
              </div>

              <div className="mt-5 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-center">
                <p className="text-xs text-slate-400">
                  Educational disclaimer: AI explanations are pedagogical aids. Critical systems should always be validated against official documentation.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

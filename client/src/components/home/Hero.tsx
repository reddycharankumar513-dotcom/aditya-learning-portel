import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, Play, CheckCircle2, 
  Code2, Brain, Database, Cpu, Award, Terminal, 
  BarChart3, Zap
} from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-32">
      {/* Decorative gradient glow elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-brand-400/20 via-violet-400/20 to-cyan-400/20 blur-3xl -z-10 pointer-events-none rounded-full" />
      <div className="absolute top-12 right-10 w-72 h-72 bg-cyan-300/10 blur-3xl -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 shadow-sm animate-in fade-in duration-300">
              <span className="flex h-2 w-2 rounded-full bg-brand-600 animate-ping" />
              <span className="text-xs sm:text-sm font-semibold tracking-wide">
                Your Journey to Future-Ready Skills Starts Here
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Build Your Future with{' '}
              <span className="gradient-text block sm:inline">
                AI-Powered Learning
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              Master in-demand technology skills, build real-world projects, learn with AI, 
              and prepare for your next career opportunity with <strong className="text-slate-800 font-semibold">ADITYA</strong>.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/courses"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-lg shadow-brand-500/25 hover:shadow-brand-500/40 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
              >
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-sm hover:border-slate-300 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4 text-violet-600" />
                <span>Start Learning</span>
              </Link>
            </div>

            {/* Highlights pills */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Structured Project Curriculums</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-violet-600" />
                <span>24/7 Claude-Powered AI Tutor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                <span>Technical Internship Prep</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Learning Platform Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer Card with Glassmorphic Frame */}
              <div className="rounded-3xl bg-white p-5 sm:p-6 shadow-card border border-slate-200/90 relative z-10 space-y-4">
                
                {/* Simulated AI Tutor Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-violet-600 flex items-center justify-center text-white shadow-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">ADITYA AI Tutor</p>
                      <p className="text-[10px] text-emerald-600 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online &bull; Interactive Mentor
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    Claude 3.5 Sonnet
                  </span>
                </div>

                {/* Simulated Chat Dialogue Bubble */}
                <div className="space-y-2.5 text-xs">
                  <div className="bg-slate-100/80 rounded-2xl p-3 text-slate-700 max-w-[88%] ml-auto rounded-tr-none">
                    <p className="font-medium">How do convolutional layers extract spatial hierarchies in images?</p>
                  </div>
                  <div className="bg-gradient-to-br from-brand-50 to-violet-50/50 border border-brand-100 rounded-2xl p-3.5 text-slate-800 space-y-2 rounded-tl-none">
                    <p className="font-normal text-slate-700 leading-relaxed">
                      Filters convolve across local receptive fields. Early layers detect basic edges &amp; textures, 
                      while deeper layers aggregate them into complex semantic object patterns.
                    </p>
                    <div className="bg-slate-900 text-cyan-300 font-mono text-[10px] p-2 rounded-lg flex items-center justify-between">
                      <code>conv2d = nn.Conv2d(in_ch=3, out_ch=64, k=3)</code>
                      <span className="text-[9px] text-slate-400">PyTorch</span>
                    </div>
                  </div>
                </div>

                {/* Progress Indicators Strip */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                      <Brain className="w-3.5 h-3.5 text-brand-600" />
                      Deep Learning &amp; Neural Nets
                    </span>
                    <span className="font-bold text-brand-600">72% Completed</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-brand-600 via-violet-600 to-cyan-500 h-full rounded-full w-[72%]" />
                  </div>
                </div>

                {/* Mini Badges / Tech Icons */}
                <div className="pt-1 flex items-center justify-between text-[11px] text-slate-600">
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100">
                    <Code2 className="w-3 h-3 text-blue-600" />
                    <span>Python &bull; React</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100">
                    <Database className="w-3 h-3 text-emerald-600" />
                    <span>SQL &bull; Mongo</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100">
                    <Award className="w-3 h-3 text-amber-600" />
                    <span>Milestones Tracked</span>
                  </div>
                </div>

              </div>

              {/* Floating Accent Card 1: Project Milestone */}
              <div className="absolute -bottom-6 -left-6 bg-white p-3.5 rounded-2xl shadow-card border border-slate-200/80 hidden sm:flex items-center gap-3 z-20">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Hands-on Lab Verified</p>
                  <p className="text-[10px] text-slate-500">End-to-end Project Output</p>
                </div>
              </div>

              {/* Floating Accent Card 2: Skill Progression */}
              <div className="absolute -top-6 -right-4 bg-white p-3 rounded-2xl shadow-card border border-slate-200/80 hidden sm:flex items-center gap-2.5 z-20">
                <div className="w-8 h-8 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-800">Adaptive Skill Matrix</p>
                  <p className="text-[9px] text-brand-600 font-semibold">Personalized Recommendations</p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

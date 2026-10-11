import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, MapPin, ExternalLink, ShieldCheck, Cpu } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-xl">A</span>
              </div>
              <div>
                <span className="font-extrabold text-2xl tracking-tight text-white">ADITYA</span>
                <p className="text-xs text-brand-400 font-medium tracking-wide">
                  AI-Powered Education &amp; Career Platform
                </p>
              </div>
            </Link>

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering students and technology professionals worldwide through rigorous, hands-on 
              curriculums in AI, Data Science, and modern Software Engineering, coupled with interactive 
              AI tutoring and career development paths.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Tagline: &quot;Learn. Build. Innovate. Succeed.&quot;</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/programs" className="hover:text-white transition-colors">Specialized Programs</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-white transition-colors">All Courses</Link>
              </li>
              <li>
                <Link to="/ai-tutor" className="hover:text-violet-400 text-violet-300 transition-colors flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5" /> AI Learning Tutor
                </Link>
              </li>
              <li>
                <Link to="/internships" className="hover:text-white transition-colors">Internships</Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-white transition-colors">Career Prep</Link>
              </li>
            </ul>
          </div>

          {/* Technical Disciplines */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Programs</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <Link to="/programs?cat=ai-ml" className="hover:text-white transition-colors">Artificial Intelligence &amp; ML</Link>
              </li>
              <li>
                <Link to="/programs?cat=data-science" className="hover:text-white transition-colors">Data Science &amp; Analytics</Link>
              </li>
              <li>
                <Link to="/programs?cat=software" className="hover:text-white transition-colors">Full-Stack Software Dev</Link>
              </li>
              <li>
                <Link to="/programs?cat=cloud" className="hover:text-white transition-colors">Cloud &amp; DevOps Engineering</Link>
              </li>
              <li>
                <Link to="/programs?cat=career" className="hover:text-white transition-colors">Interview &amp; Career Prep</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Contact &amp; Notice</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 mt-1 shrink-0" />
                <span>Global Remote &amp; Partner Tech Centers</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>support@aditya-ed.org (Placeholder)</span>
              </div>
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-medium text-xs transition-colors"
                >
                  Contact Desk <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer & Legal footer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} ADITYA Learning Platform. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[11px] text-slate-400">
              * Educational project platform. Placement assistance and certifications available as configured per track.
            </span>
            <div className="flex items-center gap-4">
              <Link to="/privacy" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-white transition-colors underline-offset-4 hover:underline">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

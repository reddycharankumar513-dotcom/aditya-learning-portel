import React from 'react';
import { Link } from 'react-router-dom';
import { LearnovaLogo } from './LearnovaLogo';
import { Sparkles, Shield, Heart, Globe, Code, Share2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080B18] text-[#A6B0C8] border-t border-white/[0.08] relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#8065FF]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#32C8F5]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <LearnovaLogo size="lg" showTagline />
            <p className="text-xs text-[#A6B0C8] leading-relaxed max-w-sm mt-3">
              The AI Career Intelligence Platform bridging education and industry. Learn high-impact technologies, prove your readiness through real-time AI mock interviews, and land verified roles at top global employers.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/reddycharankumar513-dotcom/aditya-learning-portel"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/5"
              >
                <Code className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/5"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-colors border border-white/5"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 1: For Students */}
          <div>
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-4">
              For Students
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/student/dashboard" className="hover:text-white transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/student/interviews" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span>AI Mock Interviews</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#32C8F5]/20 text-[#32C8F5] font-bold">New</span>
                </Link>
              </li>
              <li>
                <Link to="/student/assessments" className="hover:text-white transition-colors">
                  Skill Assessments
                </Link>
              </li>
              <li>
                <Link to="/student/resume" className="hover:text-white transition-colors">
                  AI Resume Analyzer
                </Link>
              </li>
              <li>
                <Link to="/student/career-hub" className="hover:text-white transition-colors">
                  Career Opportunities
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: For Employers */}
          <div>
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-4">
              For Employers
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/employer/dashboard" className="hover:text-white transition-colors">
                  Employer Console
                </Link>
              </li>
              <li>
                <Link to="/employer/jobs" className="hover:text-white transition-colors">
                  Post Opportunities
                </Link>
              </li>
              <li>
                <Link to="/employer/candidates" className="hover:text-white transition-colors">
                  Verified Talent Discovery
                </Link>
              </li>
              <li>
                <Link to="/employer/assessments" className="hover:text-white transition-colors">
                  Custom Assessments
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Enterprise Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform & Trust */}
          <div>
            <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-white mb-4">
              Platform & Trust
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Learnova
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-white transition-colors">
                  Pricing & Subscriptions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-[#6B7A99]">
            © {new Date().getFullYear()} LEARNOVA Inc. All rights reserved. Built with precision for students & engineers.
          </p>
          <div className="flex items-center gap-4 text-[#6B7A99]">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#30D6A0]" />
              Bank-grade 256-bit encryption
            </span>
            <span className="text-white/20">•</span>
            <span>Initial Market: India (Global Ready)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

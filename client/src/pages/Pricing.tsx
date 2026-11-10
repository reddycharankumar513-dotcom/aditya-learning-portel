import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Shield, Zap, ArrowRight, HelpCircle } from 'lucide-react';

export const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#32C8F5]" />
            <span>Fair & Transparent Student Pricing</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-heading font-black text-white">
            Invest In Verified Skills, Not Hype
          </h1>
          <p className="text-sm sm:text-base text-[#A6B0C8]">
            Accelerate your technical placement preparation with real-time AI mock drills, ATS resume optimization, and direct employer visibility.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* FREE */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#A6B0C8]">Free Student</span>
              <div className="text-4xl font-heading font-black text-white mt-3 mb-4">₹0</div>
              <p className="text-xs text-[#A6B0C8] mb-6 leading-relaxed">
                Ideal for freshmen and sophomores benchmarking their technical fundamentals.
              </p>
              <ul className="space-y-3 text-xs text-[#A6B0C8]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> 5 AI Mock Interview Drills
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Baseline Career Readiness Score
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> 3 Basic ATS Resume Scans
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Community Support
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="mt-8 w-full py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-center text-xs font-semibold text-white block transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* STARTER */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#32C8F5]">Starter</span>
              <div className="text-4xl font-heading font-black text-white mt-3 mb-4">
                ₹199<span className="text-xs font-normal text-[#A6B0C8]">/month</span>
              </div>
              <p className="text-xs text-[#A6B0C8] mb-6 leading-relaxed">
                For active job seekers drilling coding and technical concepts for campus placements.
              </p>
              <ul className="space-y-3 text-xs text-[#A6B0C8]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> 25 AI Mock Interview Drills
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Voice Interview Mode
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Unlimited ATS Resume Scans
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Skill Gap Remediation Tips
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="mt-8 w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-center text-xs font-semibold text-white block transition-colors"
            >
              Start 7-Day Trial
            </Link>
          </div>

          {/* PRO (Recommended) */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border-2 border-[#8065FF] relative shadow-glow-violet">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#8065FF] text-[10px] font-bold uppercase tracking-wider text-white">
              Most Popular
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#A68BFF]">Pro Career</span>
              <div className="text-4xl font-heading font-black text-white mt-3 mb-4">
                ₹399<span className="text-xs font-normal text-[#A6B0C8]">/month</span>
              </div>
              <p className="text-xs text-[#A6B0C8] mb-6 leading-relaxed">
                The complete suite with unlimited drills, roadmaps, and candidate discovery reach.
              </p>
              <ul className="space-y-3 text-xs text-[#A6B0C8]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Unlimited Text & Voice Drills
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Video Interview Beta
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Verified Talent Discovery Profile
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Personalized AI Roadmaps
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Coding Sandbox Multi-language
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="mt-8 w-full py-3.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-center text-xs font-bold text-white block transition-all shadow-glow-violet"
            >
              Upgrade to Pro
            </Link>
          </div>

          {/* PREMIUM */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 flex flex-col justify-between border border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#F4B860]">Premium Career</span>
              <div className="text-4xl font-heading font-black text-white mt-3 mb-4">
                ₹699<span className="text-xs font-normal text-[#A6B0C8]">/month</span>
              </div>
              <p className="text-xs text-[#A6B0C8] mb-6 leading-relaxed">
                For ambitious engineers seeking 1-on-1 architecture review and direct referral placement.
              </p>
              <ul className="space-y-3 text-xs text-[#A6B0C8]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Everything in Pro Plan
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Direct Hiring Partner Referrals
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> 1-on-1 Human Architecture Review
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-[#30D6A0]" /> Priority Recruiter Visibility
                </li>
              </ul>
            </div>
            <Link
              to="/register"
              className="mt-8 w-full py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-center text-xs font-semibold text-white block transition-colors"
            >
              Choose Premium
            </Link>
          </div>

        </div>

        {/* Security & Payment Protection Notice */}
        <div className="glass-panel rounded-2xl p-6 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#A6B0C8]">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[#30D6A0] flex-shrink-0" />
            <div>
              <strong className="text-white block">Razorpay Encrypted Payment Processing</strong>
              <span>Support for UPI, Net Banking, Credit/Debit Cards, and Wallets. Cancel anytime with one click.</span>
            </div>
          </div>
          <span className="text-[#32C8F5] font-semibold flex-shrink-0">100% Money-Back Guarantee</span>
        </div>

      </div>
    </div>
  );
};

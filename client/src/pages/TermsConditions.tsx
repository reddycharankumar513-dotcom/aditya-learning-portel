import React from 'react';
import { FileText, AlertCircle, CheckCircle, Scale } from 'lucide-react';

export const TermsConditions: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200">
            Terms of Use
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms and Conditions
          </h1>
          <p className="text-sm text-slate-500">
            Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-soft space-y-8 text-sm text-slate-600 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-brand-600" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or creating an account on ADITYA, you agree to comply with and be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue platform use immediately.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-violet-600" />
              2. Educational Scope &amp; Transparency
            </h2>
            <p>
              ADITYA is an independent education and technology skill development platform. Course completions, module reviews, and digital certificates reflect verified mastery of the designated syllabi and hands-on coding criteria. Unless explicitly documented in authorized written agreements, completion of courses does not constitute an unverified guarantee of employment or academic accreditation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              3. AI Tutor Educational Disclaimer
            </h2>
            <p>
              The ADITYA AI Tutor utilizes generative language models (Claude) for pedagogical explanations, code debugging guidance, and study assistance. AI-generated answers, code samples, and architectural recommendations are for training and learning purposes only. Users must verify code syntax and safety before implementing them in production or critical environments.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              4. Code of Conduct &amp; Account Security
            </h2>
            <p>
              Students agree to maintain accurate profile information, safeguard account passwords, and use discussion and AI features respectfully. Automated abuse, rate limit evasion, or attempts to bypass role authorization will result in immediate suspension.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

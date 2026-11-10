import React from 'react';
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200">
            Legal &amp; Privacy
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-500">
            Effective Date: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-soft space-y-8 text-sm text-slate-600 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-brand-600" />
              1. Information We Collect
            </h2>
            <p>
              ADITYA collects student information necessary to deliver our educational platform, courses, and AI mentoring services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-1.5">
              <li><strong>Account Credentials:</strong> Full name, email address, salted and hashed passwords.</li>
              <li><strong>Profile Preferences:</strong> Educational background, country, and declared learning interests.</li>
              <li><strong>Learning Analytics:</strong> Course enrollments, module completion records, and practical assignment progress.</li>
              <li><strong>AI Interaction Logs:</strong> Prompt messages submitted to the AI Tutor to provide continuity during learning sessions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-violet-600" />
              2. How We Protect Your Data
            </h2>
            <p>
              We implement industry-standard security safeguards. Passwords are never stored in plaintext and are hashed using bcrypt before database persistence. Server-side session tokens use signed JSON Web Tokens (JWT) transmitted over encrypted HTTPS channels.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-600" />
              3. AI Interaction Data Handling
            </h2>
            <p>
              When you interact with the ADITYA AI Tutor, messages are processed securely via backend endpoints connecting to the Claude API (Anthropic). We do not sell your conversational data or code snippets to third-party data brokers. AI queries are used solely for real-time pedagogical assistance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-600" />
              4. Data Retention and Student Rights
            </h2>
            <p>
              Students retain the right to update their profile information, review their conversation logs, or request account removal by reaching out via our Contact form.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};

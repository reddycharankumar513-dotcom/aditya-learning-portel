import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Award, Shield, CheckCircle2, Globe, Code, 
  ExternalLink, Sparkles, User, Briefcase, Eye, EyeOff 
} from 'lucide-react';

export const StudentPortfolio: React.FC = () => {
  const { user } = useAuth();
  const [consentEnabled, setConsentEnabled] = useState(true);

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-[#32C8F5]" />
              <span>Verified Candidate Portfolio</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              {user?.name || 'Candidate'} — Skill Portfolio
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8]">
              {user?.college || 'National Institute of Technology'} • Class of {user?.graduationYear || 2026}
            </p>
          </div>

          <div className="text-center sm:text-right flex-shrink-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#A6B0C8] block">
              Readiness Score
            </span>
            <span className="text-3xl font-heading font-black text-[#30D6A0]">
              {user?.careerReadinessScore || 78}%
            </span>
          </div>
        </div>

        {/* Privacy & Consent Toggle Box */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#30D6A0]/20 flex items-center justify-center text-[#30D6A0]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Employer Talent Discovery Consent</h4>
              <p className="text-[11px] text-[#A6B0C8]">
                Allow verified hiring partners to view your approved skills, mock interview percentile, and contact details.
              </p>
            </div>
          </div>

          <button
            onClick={() => setConsentEnabled(!consentEnabled)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              consentEnabled
                ? 'bg-[#30D6A0]/20 text-[#30D6A0] border border-[#30D6A0]/40'
                : 'bg-white/10 text-[#A6B0C8]'
            }`}
          >
            {consentEnabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>{consentEnabled ? 'Discovery Active' : 'Private'}</span>
          </button>
        </div>

        {/* Verified Skills */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#32C8F5]" />
            <span>Verified Technical Competencies</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {(user?.skills || [
              { name: 'JavaScript / TypeScript', proficiency: 'Advanced' },
              { name: 'React 19 & Architecture', proficiency: 'Advanced' },
              { name: 'Node.js & Express REST APIs', proficiency: 'Intermediate' },
              { name: 'MongoDB Indexing & Schema Design', proficiency: 'Intermediate' },
              { name: 'Redis Cache-Aside Systems', proficiency: 'Intermediate' },
            ]).map((sk, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
                <span className="font-semibold text-white">{sk.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#8065FF]/20 text-[#A68BFF] font-bold">
                  {sk.proficiency}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="text-sm font-heading font-bold text-white mb-2">
            Verified Profiles & Repositories
          </h3>
          <div className="flex flex-wrap gap-4 text-xs">
            {user?.github && (
              <a
                href={user.github}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 border border-white/10"
              >
                <Code className="w-4 h-4 text-[#32C8F5]" />
                <span>GitHub: {user.github}</span>
              </a>
            )}
            {user?.linkedin && (
              <a
                href={user.linkedin}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white flex items-center gap-2 border border-white/10"
              >
                <Globe className="w-4 h-4 text-[#8065FF]" />
                <span>LinkedIn Profile</span>
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

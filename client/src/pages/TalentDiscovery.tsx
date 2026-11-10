import React, { useState, useEffect } from 'react';
import { employerService, CandidateProfile } from '../services/employerService';
import { 
  Users, Search, Award, CheckCircle2, Globe, 
  Code, Sparkles, Filter, RefreshCw, Send, ShieldCheck 
} from 'lucide-react';

export const TalentDiscovery: React.FC = () => {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [skill, setSkill] = useState('');
  const [role, setRole] = useState('All');
  const [minScore, setMinScore] = useState(70);
  const [loading, setLoading] = useState(true);
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  useEffect(() => {
    loadTalent();
  }, [role, minScore]);

  const loadTalent = async () => {
    try {
      setLoading(true);
      const res = await employerService.discoverTalent({
        skill,
        role: role !== 'All' ? role : undefined,
        minScore,
      });
      setCandidates(res.candidates || []);
    } catch (err) {
      console.warn('Error discovering talent:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadTalent();
  };

  const handleInvite = (id: string) => {
    setInvitedIds((prev) => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold">
              <Users className="w-3.5 h-3.5 text-[#32C8F5]" />
              <span>Verified Candidate Network</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Talent Discovery & Sourcing
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8]">
              Connect with college students and fresh graduates who have consented to recruiter discovery and proven their skills via AI mock drills.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6B0C8]" />
            <input
              type="text"
              placeholder="Search skill (e.g. React, Python, Docker)..."
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full bg-[#10162A] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
            />
          </form>

          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto text-xs">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="bg-[#10162A] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none"
            >
              <option value="All">All Engineering Roles</option>
              <option value="Software Engineer">Software Engineer</option>
              <option value="Full Stack Engineer">Full Stack Engineer</option>
              <option value="AI / ML Engineer">AI / ML Engineer</option>
            </select>

            <div className="flex items-center gap-2 text-[#A6B0C8]">
              <span>Min Readiness:</span>
              <select
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value, 10))}
                className="bg-[#10162A] border border-white/10 rounded-xl px-2 py-2 text-white focus:outline-none"
              >
                <option value="60">&gt;60% Score</option>
                <option value="75">&gt;75% Score</option>
                <option value="85">&gt;85% Score (Top 10%)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidate Cards Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#8065FF] animate-spin" />
            <p className="text-xs text-[#A6B0C8]">Filtering verified candidates...</p>
          </div>
        ) : candidates.length === 0 ? (
          <div className="text-center py-16 glass-panel rounded-3xl p-8 border border-white/10 space-y-3">
            <Users className="w-10 h-10 text-[#A6B0C8] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-white">No candidates match the specified filter.</h3>
            <p className="text-xs text-[#A6B0C8]">Try lowering the readiness score threshold or clearing search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((cand) => {
              const isInvited = invitedIds.includes(cand._id);
              return (
                <div
                  key={cand._id}
                  className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between hover:border-white/20 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8065FF] to-[#32C8F5] flex items-center justify-center font-bold text-white text-sm shadow-glow-violet">
                          {cand.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-heading font-bold text-white">{cand.name}</h4>
                          <span className="text-[10px] text-[#A6B0C8]">
                            {cand.college} • {cand.graduationYear}
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-base font-heading font-black text-[#30D6A0]">
                          {cand.careerReadinessScore}%
                        </span>
                        <span className="text-[9px] uppercase font-mono text-[#A6B0C8] block -mt-1">
                          Readiness
                        </span>
                      </div>
                    </div>

                    <div className="text-xs font-semibold text-[#A68BFF]">
                      Target: {cand.preferredRoles?.[0] || 'Software Engineer'}
                    </div>

                    {/* Verified Skills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {cand.skills.slice(0, 4).map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-semibold text-white">
                          {sk.name}
                        </span>
                      ))}
                    </div>

                    {/* Social/Repo Links */}
                    <div className="flex items-center gap-3 pt-2 text-xs text-[#A6B0C8]">
                      {cand.github && (
                        <a href={cand.github} target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                          <Code className="w-3.5 h-3.5" /> GitHub
                        </a>
                      )}
                      {cand.linkedin && (
                        <a href={cand.linkedin} target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5" /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10">
                    <button
                      onClick={() => handleInvite(cand._id)}
                      disabled={isInvited}
                      className={`w-full py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1.5 ${
                        isInvited
                          ? 'bg-[#30D6A0]/20 text-[#30D6A0] border border-[#30D6A0]/40'
                          : 'bg-white/10 hover:bg-white/15 text-white'
                      }`}
                    >
                      {isInvited ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Interview Invite Sent</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Invite to Assessment</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

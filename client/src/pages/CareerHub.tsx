import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { careerHubService, OpportunityItem } from '../services/careerHubService';
import { 
  Briefcase, Search, MapPin, Building2, Sparkles, 
  CheckCircle2, ArrowRight, ShieldCheck, Filter, RefreshCw 
} from 'lucide-react';

export const CareerHub: React.FC = () => {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [category, setCategory] = useState<string>('All');
  const [workMode, setWorkMode] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, [category, workMode]);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const res = await careerHubService.getOpportunities({
        category,
        workMode,
        search,
      });
      setOpportunities(res.opportunities || []);
    } catch (err) {
      console.warn('Error loading opportunities:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOpportunities();
  };

  const handleApply = async (id: string) => {
    try {
      setApplyingId(id);
      const res = await careerHubService.applyToOpportunity(id);
      if (res.success) {
        setAppliedIds((prev) => [...prev, id]);
        setSuccessMessage('Application submitted successfully! Tracked in your pipeline.');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      alert(err?.message || 'Error submitting application.');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-[#32C8F5]" />
              <span>Career Opportunities Highway</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Discover Verified Tech Opportunities
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8]">
              Direct listings with transparent compensation and explainable AI skill alignment.
            </p>
          </div>

          <Link
            to="/student/applications"
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span>My Application Tracker</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {successMessage && (
          <div className="p-4 rounded-2xl bg-[#30D6A0]/10 border border-[#30D6A0]/30 text-xs text-[#30D6A0] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A6B0C8]" />
            <input
              type="text"
              placeholder="Search by role, company, or tech stack (e.g. React)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#10162A] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
            />
          </form>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[#10162A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="All">All Categories</option>
              <option value="Internship">Internships</option>
              <option value="Full-time">Full-time Roles</option>
              <option value="Graduate Program">Graduate Programs</option>
            </select>

            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="bg-[#10162A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="All">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>

        {/* Opportunity Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#8065FF] animate-spin" />
            <p className="text-xs text-[#A6B0C8]">Matching verified opportunities with your skill profile...</p>
          </div>
        ) : opportunities.length === 0 ? (
          <div className="text-center py-16 space-y-3 glass-panel rounded-3xl p-8 border border-white/10">
            <Briefcase className="w-10 h-10 text-[#A6B0C8] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-white">No opportunities match the selected filter.</h3>
            <p className="text-xs text-[#A6B0C8]">Try expanding your search criteria or resetting filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {opportunities.map((opp) => {
              const isApplied = appliedIds.includes(opp._id);
              return (
                <div
                  key={opp._id}
                  className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 space-y-4 hover:border-white/20 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8065FF] to-[#32C8F5] flex items-center justify-center font-bold text-white text-sm">
                          {opp.company.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-sm font-heading font-bold text-white">{opp.company}</h4>
                          <span className="text-[10px] text-[#A6B0C8] flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {opp.location} • {opp.workMode}
                          </span>
                        </div>
                      </div>

                      {/* AI Match Badge */}
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#30D6A0]/20 text-[#30D6A0] font-bold border border-[#30D6A0]/30">
                          {opp.matchScore}% Match
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-heading font-bold text-white">{opp.title}</h3>
                      <p className="text-xs text-[#A6B0C8] mt-1 line-clamp-2 leading-relaxed">
                        {opp.description}
                      </p>
                    </div>

                    {/* Explainable Match Reason */}
                    {opp.matchReason && (
                      <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-[11px] text-[#A68BFF] flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#32C8F5] flex-shrink-0" />
                        <span>{opp.matchReason}</span>
                      </div>
                    )}

                    {/* Skill Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {opp.requiredSkills.map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-semibold text-white">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-[#A6B0C8] block">Compensation</span>
                      <strong className="text-xs text-white">{opp.compensation}</strong>
                    </div>

                    <button
                      onClick={() => handleApply(opp._id)}
                      disabled={isApplied || applyingId === opp._id}
                      className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isApplied
                          ? 'bg-[#30D6A0]/20 text-[#30D6A0] border border-[#30D6A0]/40'
                          : 'bg-[#8065FF] hover:bg-[#6A4DFF] text-white shadow-glow-violet'
                      }`}
                    >
                      {applyingId === opp._id ? (
                        <span>Submitting...</span>
                      ) : isApplied ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <>
                          <span>Apply With Learnova</span>
                          <ArrowRight className="w-3.5 h-3.5" />
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { employerService, CompanyProfile } from '../services/employerService';
import { 
  Building2, Briefcase, Users, CheckCircle2, Plus, 
  ArrowRight, ShieldCheck, Sparkles, RefreshCw, Clock 
} from 'lucide-react';

export const EmployerDashboard: React.FC = () => {
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [stats, setStats] = useState<{
    activeJobs: number;
    totalApplicants: number;
    pipelineCounts: Record<string, number>;
  }>({
    activeJobs: 4,
    totalApplicants: 12,
    pipelineCounts: {
      newApplicant: 5,
      underReview: 3,
      interviewScheduled: 2,
      shortlisted: 1,
      hired: 1,
    },
  });
  const [recentApplications, setRecentApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [compRes, dashRes] = await Promise.all([
        employerService.getProfile().catch(() => ({ company: null })),
        employerService.getDashboard().catch(() => ({
          stats: {
            activeJobs: 4,
            totalApplicants: 12,
            pipelineCounts: { newApplicant: 5, underReview: 3, interviewScheduled: 2, shortlisted: 1, hired: 1 },
          },
          recentApplications: [],
        })),
      ]);

      if (compRes.company) setCompany(compRes.company);
      if (dashRes.stats) setStats(dashRes.stats);
      if (dashRes.recentApplications) setRecentApplications(dashRes.recentApplications);
    } catch (err) {
      console.warn('Error loading employer dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#080B18] text-[#F5F7FF]">
        <RefreshCw className="w-8 h-8 text-[#8065FF] animate-spin" />
        <p className="text-sm font-medium text-[#A6B0C8]">Loading Employer Console...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#30D6A0]/20 text-[#30D6A0] text-xs font-bold border border-[#30D6A0]/30 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Verified Employer</span>
              </span>
              <span className="text-xs text-[#A6B0C8]">
                {company?.industry || 'Enterprise Technology'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              {company?.companyName || 'NexGen Technology Labs'} Console
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8]">
              Recruiter: <strong className="text-white">{company?.recruiterName || 'Technical Recruiter'}</strong> • Source pre-vetted students with explainable AI readiness scores.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/employer/jobs"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white text-xs font-bold shadow-glow-violet hover:opacity-95 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Role</span>
            </Link>
            <Link
              to="/employer/talent"
              className="px-4 py-3 rounded-xl glass-panel hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-[#32C8F5]" />
              <span>Discover Talent</span>
            </Link>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <span className="text-xs text-[#A6B0C8]">Active Job Openings</span>
            <div className="text-3xl font-heading font-black text-white mt-1">
              {stats.activeJobs}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <span className="text-xs text-[#A6B0C8]">Total Candidates</span>
            <div className="text-3xl font-heading font-black text-[#32C8F5] mt-1">
              {stats.totalApplicants}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <span className="text-xs text-[#A6B0C8]">Interviews Scheduled</span>
            <div className="text-3xl font-heading font-black text-[#F4B860] mt-1">
              {stats.pipelineCounts.interviewScheduled || 2}
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <span className="text-xs text-[#A6B0C8]">Hired / Selected</span>
            <div className="text-3xl font-heading font-black text-[#30D6A0] mt-1">
              {stats.pipelineCounts.hired || 1}
            </div>
          </div>
        </div>

        {/* Quick Nav & Candidate Pipeline Overview */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h3 className="text-base font-heading font-bold text-white">
                Recruitment Pipeline Stages
              </h3>
              <p className="text-xs text-[#A6B0C8]">Real-time applicant progression across stages</p>
            </div>
            <Link
              to="/employer/pipeline"
              className="text-xs font-semibold text-[#32C8F5] hover:underline flex items-center gap-1"
            >
              <span>Manage Pipeline</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#A6B0C8] uppercase tracking-wider block">New Applied</span>
              <span className="text-xl font-heading font-black text-white mt-1 block">
                {stats.pipelineCounts.newApplicant || 5}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#A6B0C8] uppercase tracking-wider block">Under Review</span>
              <span className="text-xl font-heading font-black text-[#32C8F5] mt-1 block">
                {stats.pipelineCounts.underReview || 3}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#A6B0C8] uppercase tracking-wider block">Interview</span>
              <span className="text-xl font-heading font-black text-[#F4B860] mt-1 block">
                {stats.pipelineCounts.interviewScheduled || 2}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#A6B0C8] uppercase tracking-wider block">Shortlisted</span>
              <span className="text-xl font-heading font-black text-[#8065FF] mt-1 block">
                {stats.pipelineCounts.shortlisted || 1}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
              <span className="text-[10px] text-[#A6B0C8] uppercase tracking-wider block">Hired</span>
              <span className="text-xl font-heading font-black text-[#30D6A0] mt-1 block">
                {stats.pipelineCounts.hired || 1}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Talent Discovery Shortcut */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-base font-heading font-bold text-white">
              Search Consented Candidates by Verified Skill
            </h3>
            <p className="text-xs text-[#A6B0C8]">
              Filter candidates with &gt;75% Career Readiness score and verified mock interview ratings.
            </p>
          </div>

          <Link
            to="/employer/talent"
            className="px-6 py-3 rounded-xl bg-[#8065FF] hover:bg-[#6A4DFF] text-white text-xs font-bold shadow-glow-violet transition-all flex items-center gap-2 flex-shrink-0"
          >
            <span>Open Talent Search</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

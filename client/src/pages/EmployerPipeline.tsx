import React, { useState, useEffect } from 'react';
import { employerService, PipelineItem } from '../services/employerService';
import { 
  Briefcase, CheckCircle2, Clock, Calendar, 
  ArrowRight, RefreshCw, AlertCircle, User, Award 
} from 'lucide-react';

const RECRUITER_STAGES = [
  { key: 'applied', label: 'New Applied' },
  { key: 'assessment', label: 'Assessment' },
  { key: 'interview', label: 'Interview Scheduled' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'offered', label: 'Offer Extended' },
];

export const EmployerPipeline: React.FC = () => {
  const [pipeline, setPipeline] = useState<PipelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPipeline();
  }, []);

  const loadPipeline = async () => {
    try {
      setLoading(true);
      const res = await employerService.getPipeline();
      setPipeline(res.pipeline || []);
    } catch (err) {
      console.warn('Error loading recruitment pipeline:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (appId: string, newStatus: string) => {
    try {
      await employerService.updateCandidateStage({
        applicationId: appId,
        status: newStatus,
      });
      setPipeline((prev) =>
        prev.map((item) => (item._id === appId ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      console.warn('Error updating stage:', err);
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
              <span>Hiring Management Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Recruitment Pipeline & Candidate Stages
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8]">
              Manage applicant stages, review interview evaluations, and advance pre-vetted candidates to offers.
            </p>
          </div>
        </div>

        {/* Pipeline Columns */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#8065FF] animate-spin" />
            <p className="text-xs text-[#A6B0C8]">Loading recruitment pipeline...</p>
          </div>
        ) : pipeline.length === 0 ? (
          <div className="text-center py-16 space-y-3 glass-panel rounded-3xl p-8 border border-white/10">
            <Briefcase className="w-10 h-10 text-[#A6B0C8] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-white">No active candidates in the recruitment pipeline yet.</h3>
            <p className="text-xs text-[#A6B0C8]">Publish a job or discover students to populate candidate stages.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {RECRUITER_STAGES.map((col) => {
              const colCandidates = pipeline.filter((p) => p.status === col.key);
              return (
                <div key={col.key} className="glass-panel rounded-3xl p-4 border border-white/10 flex flex-col min-h-[460px]">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                      {col.label}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                      {colCandidates.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {colCandidates.map((cand) => (
                      <div
                        key={cand._id}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs hover:border-white/20 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white leading-tight">
                            {cand.user?.name || 'Candidate'}
                          </span>
                          <span className="text-[10px] text-[#30D6A0] font-mono font-bold">
                            {cand.user?.careerReadinessScore || 78}%
                          </span>
                        </div>

                        <div className="text-[11px] text-[#A6B0C8]">
                          {cand.opportunity?.title || 'Applied Position'}
                        </div>

                        <div className="text-[10px] text-[#6B7A99]">
                          {cand.user?.college || 'Engineering College'}
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                          <span className="text-[#6B7A99]">Stage:</span>
                          <select
                            value={cand.status}
                            onChange={(e) => handleStageChange(cand._id, e.target.value)}
                            className="bg-[#10162A] text-white text-[10px] rounded px-1.5 py-1 border border-white/10 focus:outline-none"
                          >
                            <option value="applied">Applied</option>
                            <option value="assessment">Assessment</option>
                            <option value="interview">Interview</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="offered">Offered</option>
                          </select>
                        </div>
                      </div>
                    ))}
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

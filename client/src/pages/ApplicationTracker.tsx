import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { careerHubService, ApplicationItem } from '../services/careerHubService';
import { 
  Briefcase, CheckCircle2, Clock, Calendar, 
  ArrowRight, RefreshCw, AlertCircle, Edit3 
} from 'lucide-react';

const STAGES = [
  { key: 'applied', label: 'Applied' },
  { key: 'assessment', label: 'Assessment' },
  { key: 'interview', label: 'Interview' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'offered', label: 'Offered' },
];

export const ApplicationTracker: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const res = await careerHubService.getMyApplications();
      setApplications(res.applications || []);
    } catch (err) {
      console.warn('Error loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStageChange = async (appId: string, newStatus: string) => {
    try {
      await careerHubService.updateApplicationStage({
        applicationId: appId,
        status: newStatus,
      });
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus as any } : a))
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#30D6A0]/20 text-[#30D6A0] text-xs font-semibold border border-[#30D6A0]/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Pipeline Stage Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Application & Interview Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8]">
              Track your recruitment progress, interview schedules, and offers in one unified workflow.
            </p>
          </div>

          <Link
            to="/student/career-hub"
            className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors flex items-center gap-2 flex-shrink-0"
          >
            <span>Browse More Roles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Pipeline Columns Board */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#8065FF] animate-spin" />
            <p className="text-xs text-[#A6B0C8]">Loading application tracker...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-16 space-y-3 glass-panel rounded-3xl p-8 border border-white/10">
            <Briefcase className="w-10 h-10 text-[#A6B0C8] mx-auto opacity-50" />
            <h3 className="text-sm font-bold text-white">No active applications in your pipeline.</h3>
            <p className="text-xs text-[#A6B0C8]">Apply to verified roles in the Career Hub to track recruitment stages.</p>
            <Link
              to="/student/career-hub"
              className="inline-block px-5 py-2.5 rounded-xl bg-[#8065FF] text-white text-xs font-semibold shadow-glow-violet mt-2"
            >
              Explore Opportunities
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {STAGES.map((col) => {
              const stageApps = applications.filter((a) => a.status === col.key);
              return (
                <div key={col.key} className="glass-panel rounded-3xl p-4 border border-white/10 flex flex-col min-h-[450px]">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                    <span className="text-xs font-heading font-bold text-white uppercase tracking-wider">
                      {col.label}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-white font-bold">
                      {stageApps.length}
                    </span>
                  </div>

                  <div className="space-y-3 flex-1 overflow-y-auto">
                    {stageApps.map((app) => (
                      <div
                        key={app._id}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2 text-xs hover:border-white/20 transition-all"
                      >
                        <div className="font-bold text-white leading-tight">
                          {app.opportunity?.title || 'Engineering Role'}
                        </div>
                        <div className="text-[11px] text-[#A6B0C8]">
                          {app.opportunity?.company || 'Technology Company'}
                        </div>

                        {app.matchScore && (
                          <div className="text-[10px] text-[#30D6A0] font-semibold">
                            {app.matchScore}% Skill Alignment
                          </div>
                        )}

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                          <span className="text-[#6B7A99]">Advance:</span>
                          <select
                            value={app.status}
                            onChange={(e) => handleStageChange(app._id, e.target.value)}
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

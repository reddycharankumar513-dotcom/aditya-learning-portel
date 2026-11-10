import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { interviewService } from '../services/interviewService';
import { Interview } from '../types';
import { 
  Sparkles, Play, Award, Calendar, Clock, 
  ArrowRight, RefreshCw, CheckCircle2, ChevronRight 
} from 'lucide-react';

export const InterviewList: React.FC = () => {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setLoading(true);
      const res = await interviewService.getHistory();
      setInterviews(res.interviews || []);
    } catch (err) {
      console.warn('Error loading interviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const avgScore = interviews.length > 0
    ? Math.round(interviews.reduce((acc, curr) => acc + (curr.overallScore || 0), 0) / interviews.length)
    : 0;

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 border border-white/10 shadow-card-dark">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#32C8F5]" />
              <span>AI Mock Interview Simulator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              AI Mock Interview History & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8] mt-1">
              Practice role-specific interviews evaluated using the 6-factor engineering rubric.
            </p>
          </div>

          <Link
            to="/student/interviews/new"
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white text-xs font-bold shadow-glow-violet hover:opacity-95 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Start New Interview</span>
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <span className="text-xs text-[#A6B0C8]">Total Interviews Completed</span>
            <div className="text-3xl font-heading font-black text-white mt-1">{interviews.length}</div>
          </div>
          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <span className="text-xs text-[#A6B0C8]">Average Score</span>
            <div className="text-3xl font-heading font-black text-[#30D6A0] mt-1">
              {avgScore ? `${avgScore}/100` : '—'}
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <span className="text-xs text-[#A6B0C8]">Supported Modes</span>
            <div className="text-sm font-bold text-[#32C8F5] mt-2">Text • Voice • Video Beta</div>
          </div>
        </div>

        {/* Interview List Table / Cards */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
          <h3 className="text-base font-heading font-bold text-white mb-6">Past Interview Sessions</h3>

          {loading ? (
            <div className="py-12 flex justify-center items-center">
              <RefreshCw className="w-8 h-8 text-[#8065FF] animate-spin" />
            </div>
          ) : interviews.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-[#A6B0C8]">
                <Sparkles className="w-6 h-6" />
              </div>
              <p className="text-sm text-[#A6B0C8]">No interview sessions found.</p>
              <Link
                to="/student/interviews/new"
                className="inline-block px-5 py-2.5 rounded-xl bg-[#8065FF] text-white text-xs font-semibold shadow-glow-violet"
              >
                Launch Your First Mock Drill
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {interviews.map((intv) => (
                <div
                  key={intv._id}
                  className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-sm font-heading font-bold text-white">{intv.role}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#8065FF]/20 text-[#A68BFF] font-semibold border border-[#8065FF]/30">
                        {intv.type}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#A6B0C8]">
                        {intv.mode}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#A6B0C8]">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(intv.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {intv.durationMinutes} mins
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-5">
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-[#A6B0C8] font-medium block">
                        Score
                      </span>
                      <span className="text-xl font-heading font-black text-[#30D6A0]">
                        {intv.overallScore}/100
                      </span>
                    </div>

                    <Link
                      to={`/student/interviews/${intv._id}/report`}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors flex items-center gap-1.5"
                    >
                      <span>View Report</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

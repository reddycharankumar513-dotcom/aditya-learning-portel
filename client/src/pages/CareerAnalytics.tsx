import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  BarChart3, TrendingUp, Award, Target, Sparkles, 
  CheckCircle2, ArrowRight, ShieldCheck, Trophy, Code 
} from 'lucide-react';
import { CompactCareerOrb } from '../components/3d/CompactCareerOrb';

export const CareerAnalytics: React.FC = () => {
  const { user } = useAuth();
  const readiness = user?.careerReadinessScore || 78;
  const breakdown = user?.readinessBreakdown || {
    skillsScore: 80,
    interviewScore: 84,
    resumeScore: 72,
    projectsScore: 76,
  };

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold">
              <BarChart3 className="w-3.5 h-3.5 text-[#32C8F5]" />
              <span>Career Intelligence Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Advanced Performance Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8]">
              Empirical evidence of your technical interview readiness, algorithmic depth, and market alignment.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/[0.03] p-4 rounded-2xl border border-white/5">
            <CompactCareerOrb score={readiness} />
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#A6B0C8] block">
                Total Readiness
              </span>
              <span className="text-2xl font-heading font-black text-[#30D6A0]">
                {readiness}%
              </span>
              <span className="text-[10px] text-[#32C8F5] block font-semibold">
                Tier: {user?.plan || 'FREE'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Factor Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <span className="text-xs text-[#A6B0C8]">Technical Assessment</span>
            <div className="text-2xl font-heading font-black text-white mt-1 mb-2">
              {breakdown.skillsScore}%
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10">
              <div className="h-full bg-[#8065FF] rounded-full" style={{ width: `${breakdown.skillsScore}%` }} />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <span className="text-xs text-[#A6B0C8]">AI Mock Interview Average</span>
            <div className="text-2xl font-heading font-black text-[#32C8F5] mt-1 mb-2">
              {breakdown.interviewScore}%
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10">
              <div className="h-full bg-[#32C8F5] rounded-full" style={{ width: `${breakdown.interviewScore}%` }} />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <span className="text-xs text-[#A6B0C8]">ATS Resume Quality</span>
            <div className="text-2xl font-heading font-black text-[#30D6A0] mt-1 mb-2">
              {breakdown.resumeScore}%
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10">
              <div className="h-full bg-[#30D6A0] rounded-full" style={{ width: `${breakdown.resumeScore}%` }} />
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 border border-white/10">
            <span className="text-xs text-[#A6B0C8]">Capstone Projects</span>
            <div className="text-2xl font-heading font-black text-[#F4B860] mt-1 mb-2">
              {breakdown.projectsScore}%
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10">
              <div className="h-full bg-[#F4B860] rounded-full" style={{ width: `${breakdown.projectsScore}%` }} />
            </div>
          </div>
        </div>

        {/* 6 Rubric Breakdown */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-[#8065FF]" />
            <span>Mock Interview 6-Rubric Performance Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#A6B0C8]">Technical Knowledge (30% weight)</span>
                <span className="font-bold text-white">88%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10">
                <div className="h-full bg-[#8065FF] rounded-full" style={{ width: '88%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#A6B0C8]">Answer Relevance (20% weight)</span>
                <span className="font-bold text-white">85%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10">
                <div className="h-full bg-[#32C8F5] rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#A6B0C8]">Problem Solving & Trade-offs (20% weight)</span>
                <span className="font-bold text-white">84%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10">
                <div className="h-full bg-[#30D6A0] rounded-full" style={{ width: '84%' }} />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <div className="flex justify-between">
                <span className="text-[#A6B0C8]">Communication Clarity (15% weight)</span>
                <span className="font-bold text-white">86%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10">
                <div className="h-full bg-[#F4B860] rounded-full" style={{ width: '86%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Nav Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/student/interviews/new"
            className="p-5 rounded-2xl glass-panel hover:bg-white/10 border border-white/10 text-center transition-all group"
          >
            <Sparkles className="w-6 h-6 text-[#32C8F5] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">Drill AI Interview</h4>
            <p className="text-[11px] text-[#A6B0C8] mt-1">Practice high-pressure technical questions</p>
          </Link>

          <Link
            to="/student/coding"
            className="p-5 rounded-2xl glass-panel hover:bg-white/10 border border-white/10 text-center transition-all group"
          >
            <Code className="w-6 h-6 text-[#8065FF] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">Coding Sandbox</h4>
            <p className="text-[11px] text-[#A6B0C8] mt-1">Solve problems in Python, Java, JS, C++, SQL</p>
          </Link>

          <Link
            to="/student/learning/roadmap"
            className="p-5 rounded-2xl glass-panel hover:bg-white/10 border border-white/10 text-center transition-all group"
          >
            <Target className="w-6 h-6 text-[#30D6A0] mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">Personalized Roadmap</h4>
            <p className="text-[11px] text-[#A6B0C8] mt-1">Follow customized sequential milestones</p>
          </Link>
        </div>

      </div>
    </div>
  );
};

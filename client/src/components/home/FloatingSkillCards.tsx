import React from 'react';
import { Sparkles, Trophy, Award, TrendingUp, CheckCircle2 } from 'lucide-react';

interface FloatingSkillCardsProps {
  careerReadiness?: number;
  interviewScore?: number;
  skillsMastered?: number;
}

export const FloatingSkillCards: React.FC<FloatingSkillCardsProps> = ({
  careerReadiness = 78,
  interviewScore = 86,
  skillsMastered = 14,
}) => {
  return (
    <>
      {/* Top Left: Career Readiness Score Card */}
      <div className="absolute -top-4 -left-4 sm:top-2 sm:left-0 z-20 glass-panel rounded-2xl p-3.5 shadow-card-dark border border-white/10 flex items-center gap-3 animate-float-slow max-w-[210px]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8065FF] to-[#32C8F5] flex items-center justify-center text-white shadow-glow-violet flex-shrink-0">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-wider text-[#A6B0C8] font-medium">Career Readiness</div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl font-heading font-extrabold text-white">{careerReadiness}%</span>
            <span className="text-[10px] text-[#30D6A0] font-semibold flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5 inline" /> +12%
            </span>
          </div>
        </div>
      </div>

      {/* Top Right: AI Mock Interview Performance */}
      <div 
        className="absolute -top-2 right-0 sm:right-4 z-20 glass-panel rounded-2xl p-3 shadow-card-dark border border-white/10 flex items-center gap-2.5 animate-float-slow max-w-[200px]"
        style={{ animationDelay: '1.5s' }}
      >
        <div className="w-9 h-9 rounded-xl bg-[#32C8F5]/20 border border-[#32C8F5]/40 flex items-center justify-center text-[#32C8F5] flex-shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#A6B0C8] font-medium">AI Mock Interview</div>
          <div className="text-sm font-heading font-bold text-white flex items-center gap-1">
            <span>Score: {interviewScore}/100</span>
          </div>
          <div className="text-[10px] text-[#30D6A0]">Top 10% Percentile</div>
        </div>
      </div>

      {/* Bottom Left: Skills Mastered */}
      <div 
        className="absolute -bottom-4 left-2 sm:left-4 z-20 glass-panel rounded-2xl p-3 shadow-card-dark border border-white/10 flex items-center gap-2.5 animate-float-slow max-w-[210px]"
        style={{ animationDelay: '2.5s' }}
      >
        <div className="w-9 h-9 rounded-xl bg-[#30D6A0]/20 border border-[#30D6A0]/40 flex items-center justify-center text-[#30D6A0] flex-shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#A6B0C8] font-medium">Verified Skills</div>
          <div className="text-sm font-heading font-bold text-white">{skillsMastered} Competencies</div>
          <div className="text-[10px] text-[#A68BFF]">Full Stack & AI Ready</div>
        </div>
      </div>

      {/* Bottom Right: Target Match */}
      <div 
        className="absolute bottom-2 -right-2 sm:right-2 z-20 glass-panel rounded-2xl p-3 shadow-card-dark border border-white/10 flex items-center gap-2.5 animate-float-slow max-w-[190px]"
        style={{ animationDelay: '3.5s' }}
      >
        <div className="w-9 h-9 rounded-xl bg-[#8065FF]/20 border border-[#8065FF]/40 flex items-center justify-center text-[#8065FF] flex-shrink-0">
          <Award className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-[#A6B0C8] font-medium">Market Match</div>
          <div className="text-xs font-bold text-white">Full Stack & AI</div>
          <div className="text-[10px] text-[#32C8F5]">42 Job Matches</div>
        </div>
      </div>
    </>
  );
};

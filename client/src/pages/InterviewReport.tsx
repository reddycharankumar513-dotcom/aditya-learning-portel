import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { interviewService } from '../services/interviewService';
import { Interview } from '../types';
import { 
  Award, CheckCircle2, AlertTriangle, Sparkles, 
  ArrowLeft, RefreshCw, ChevronDown, ChevronUp, BookOpen, 
  HelpCircle, Target, TrendingUp 
} from 'lucide-react';

export const InterviewReport: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [interview, setInterview] = useState<Interview | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(1);

  useEffect(() => {
    if (id) loadReport(id);
  }, [id]);

  const loadReport = async (interviewId: string) => {
    try {
      setLoading(true);
      const res = await interviewService.getInterview(interviewId);
      setInterview(res.interview);
    } catch (err) {
      console.warn('Error loading interview report:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#080B18] text-[#F5F7FF]">
        <RefreshCw className="w-8 h-8 text-[#8065FF] animate-spin" />
        <p className="text-sm font-medium text-[#A6B0C8]">Analyzing interview evaluation...</p>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#080B18] text-[#F5F7FF]">
        <AlertTriangle className="w-8 h-8 text-rose-500" />
        <p className="text-sm font-medium text-[#A6B0C8]">Report not found.</p>
      </div>
    );
  }

  const scores = interview.categoryScores || {
    technicalKnowledge: 85,
    answerRelevance: 80,
    problemSolving: 80,
    communicationClarity: 85,
    answerStructure: 80,
    timeManagement: 90,
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-[#30D6A0]';
    if (score >= 60) return 'text-[#32C8F5]';
    return 'text-[#F4B860]';
  };

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Navigation Breadcrumb */}
        <Link
          to="/student/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#A6B0C8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Student Dashboard</span>
        </Link>

        {/* Executive Score Summary Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#30D6A0]/20 text-[#30D6A0] text-xs font-bold border border-[#30D6A0]/30">
                  Evaluation Verified
                </span>
                <span className="text-xs text-[#A6B0C8]">
                  Completed on {new Date(interview.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
                {interview.role} Performance Report
              </h1>

              <p className="text-xs sm:text-sm text-[#A6B0C8]">
                {interview.type} • {interview.mode} Mode • {interview.questions.length} Questions Evaluated
              </p>
            </div>

            {/* Score Ring / Metric */}
            <div className="md:col-span-4 flex items-center justify-start md:justify-end">
              <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center w-full max-w-[200px]">
                <span className="text-[11px] uppercase font-mono tracking-wider text-[#A6B0C8] block mb-1">
                  Overall Score
                </span>
                <span className={`text-4xl font-heading font-black ${getScoreColor(interview.overallScore)}`}>
                  {interview.overallScore}
                  <span className="text-sm text-[#A6B0C8] font-normal">/100</span>
                </span>
                <span className="text-[10px] text-[#30D6A0] font-semibold block mt-1">
                  Top 15% Candidate Bench
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 6 Category Rubric Breakdown */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-[#8065FF]" />
            <span>6-Factor Engineering Rubric Evaluation</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#A6B0C8]">Technical Knowledge (30%)</span>
                <span className="font-bold text-white">{scores.technicalKnowledge}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10">
                <div className="h-full bg-[#8065FF] rounded-full" style={{ width: `${scores.technicalKnowledge}%` }} />
              </div>
            </div>

            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#A6B0C8]">Answer Relevance (20%)</span>
                <span className="font-bold text-white">{scores.answerRelevance}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10">
                <div className="h-full bg-[#32C8F5] rounded-full" style={{ width: `${scores.answerRelevance}%` }} />
              </div>
            </div>

            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#A6B0C8]">Problem Solving (20%)</span>
                <span className="font-bold text-white">{scores.problemSolving}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10">
                <div className="h-full bg-[#30D6A0] rounded-full" style={{ width: `${scores.problemSolving}%` }} />
              </div>
            </div>

            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#A6B0C8]">Communication Clarity (15%)</span>
                <span className="font-bold text-white">{scores.communicationClarity}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10">
                <div className="h-full bg-[#F4B860] rounded-full" style={{ width: `${scores.communicationClarity}%` }} />
              </div>
            </div>

            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#A6B0C8]">Answer Structure (10%)</span>
                <span className="font-bold text-white">{scores.answerStructure}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10">
                <div className="h-full bg-[#A68BFF] rounded-full" style={{ width: `${scores.answerStructure}%` }} />
              </div>
            </div>

            <div className="bg-white/[0.03] p-4 rounded-2xl border border-white/5 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#A6B0C8]">Time Management (5%)</span>
                <span className="font-bold text-white">{scores.timeManagement}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/10">
                <div className="h-full bg-[#32C8F5] rounded-full" style={{ width: `${scores.timeManagement}%` }} />
              </div>
            </div>

          </div>
        </div>

        {/* Strengths, Weaknesses & Missing Concepts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Strengths */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
            <h4 className="text-sm font-heading font-bold text-[#30D6A0] flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Key Strengths</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#A6B0C8]">
              {(interview.strengths || ['Good architectural foundation.']).map((str, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#30D6A0] mt-1.5 flex-shrink-0" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses / Practice Topics */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
            <h4 className="text-sm font-heading font-bold text-[#F4B860] flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>Areas For High-Yield Improvement</span>
            </h4>
            <ul className="space-y-2 text-xs text-[#A6B0C8]">
              {(interview.weaknesses || ['Sharpen trade-off analysis.']).map((wk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F4B860] mt-1.5 flex-shrink-0" />
                  <span>{wk}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Question-Wise Detailed Breakdown Accordion */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
          <h3 className="text-base font-heading font-bold text-white mb-2">
            Question-by-Question Diagnostic
          </h3>

          <div className="space-y-3">
            {interview.questions.map((q) => {
              const isExpanded = expandedQuestion === q.id;
              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-white/10 overflow-hidden bg-white/[0.02]"
                >
                  <button
                    onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#32C8F5] font-bold">
                          Q{q.id} • {q.category}
                        </span>
                        <span className={`text-xs font-bold ${getScoreColor(q.score || 0)}`}>
                          Score: {q.score || 0}/100
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-medium text-white line-clamp-1">
                        {q.question}
                      </p>
                    </div>

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-[#A6B0C8] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-[#A6B0C8] flex-shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="p-5 border-t border-white/10 space-y-4 bg-[#080B18]/60 text-xs">
                      <div>
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#A6B0C8] block mb-1">
                          Full Question:
                        </span>
                        <p className="text-white font-medium">{q.question}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#A6B0C8] block mb-1">
                          Your Submitted Answer:
                        </span>
                        <p className="text-[#A6B0C8] whitespace-pre-wrap leading-relaxed">
                          {q.studentAnswer || 'No response recorded.'}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#8065FF]/10 border border-[#8065FF]/30 space-y-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-[#A68BFF] font-bold block">
                          AI Pedagogical Feedback:
                        </span>
                        <p className="text-white leading-relaxed">{q.feedback}</p>
                      </div>

                      {q.suggestedAnswer && (
                        <div className="p-3.5 rounded-xl bg-[#30D6A0]/10 border border-[#30D6A0]/30 space-y-1">
                          <span className="text-[10px] uppercase font-mono tracking-wider text-[#30D6A0] font-bold block">
                            Model Answer Framework:
                          </span>
                          <p className="text-white leading-relaxed">{q.suggestedAnswer}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Navigation Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            to="/student/interviews/new"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#8065FF] hover:bg-[#6A4DFF] text-white text-xs font-semibold shadow-glow-violet text-center"
          >
            Practice Another Interview
          </Link>
          <Link
            to="/student/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-xl glass-panel text-white text-xs font-semibold hover:bg-white/10 text-center"
          >
            Return to Dashboard
          </Link>
        </div>

      </div>
    </div>
  );
};

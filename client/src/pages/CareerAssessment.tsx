import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { Assessment, SkillGap } from '../types';
import { 
  Trophy, CheckCircle2, AlertTriangle, ArrowRight, 
  RefreshCw, Target, Award, Sparkles, BookOpen 
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 1,
    question: 'Which HTTP method is idempotent according to REST specification?',
    options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: 'In React, what hook should be used to synchronize with external APIs or subscriptions?',
    options: ['useMemo', 'useEffect', 'useCallback', 'useRef'],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: 'What is the time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black)?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: 'In MongoDB, what does a compound index on { status: 1, createdAt: -1 } optimize?',
    options: [
      'Only queries filtering by createdAt',
      'Queries filtering by status and sorting by createdAt',
      'Only text searches on status',
      'Full collection scans',
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: 'Which of the following creates a secure, tamper-proof session identifier between client and server?',
    options: [
      'Unsigned Base64 string in localStorage',
      'Cryptographically signed JWT in httpOnly Secure cookie',
      'Plaintext query parameter',
      'Global window variable',
    ],
    correctAnswer: 1,
  },
];

export const CareerAssessment: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [assessmentResult, setAssessmentResult] = useState<Assessment | null>(null);
  const [pastAssessments, setPastAssessments] = useState<Assessment[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssessments();
  }, []);

  const loadAssessments = async () => {
    try {
      setLoading(true);
      const res = await studentService.getAssessments();
      setPastAssessments(res.assessments || []);
      if (res.assessments && res.assessments.length > 0) {
        setAssessmentResult(res.assessments[0]);
      }
    } catch (err) {
      console.warn('Error loading assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId: number, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await studentService.submitAssessment({
        title: 'Full Stack & Software Engineering Assessment',
        domain: 'Full Stack Development',
        answers,
      });
      if (res.assessment) {
        setAssessmentResult(res.assessment);
        setPastAssessments((prev) => [res.assessment, ...prev]);
      }
    } catch (err) {
      console.warn('Error submitting assessment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold mb-2">
              <Trophy className="w-3.5 h-3.5 text-[#F4B860]" />
              <span>Skill Gap Diagnostic Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Technical Skill Assessment
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8] mt-1">
              Verify your architectural & algorithmic proficiency to calibrate your Career Readiness score.
            </p>
          </div>

          {assessmentResult && (
            <div className="text-center sm:text-right flex-shrink-0">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#A6B0C8] block">
                Latest Score
              </span>
              <span className="text-3xl font-heading font-black text-[#30D6A0]">
                {assessmentResult.percentage}%
              </span>
            </div>
          )}
        </div>

        {/* Diagnostic Results (If evaluated) */}
        {assessmentResult && (
          <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
            <h3 className="text-base font-heading font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-[#32C8F5]" />
              <span>Diagnosed Skill Profile & Gaps</span>
            </h3>

            <div className="space-y-3">
              {(assessmentResult.skillGaps || []).map((gap, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{gap.skill}</span>
                      <span className="text-[10px] text-[#A6B0C8]">({gap.category})</span>
                    </div>
                    <p className="text-[#A6B0C8]">{gap.recommendation}</p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full font-bold text-[10px] flex-shrink-0 self-start sm:self-center ${
                      gap.status === 'Strong'
                        ? 'bg-[#30D6A0]/20 text-[#30D6A0] border border-[#30D6A0]/30'
                        : gap.status === 'Needs Practice'
                        ? 'bg-[#F4B860]/20 text-[#F4B860] border border-[#F4B860]/30'
                        : 'bg-red-500/20 text-[#FF647C] border border-red-500/30'
                    }`}
                  >
                    {gap.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assessment Quiz Form */}
        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-8">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-base font-heading font-bold text-white">
              Full Stack & Systems Diagnostic Quiz
            </h3>
            <p className="text-xs text-[#A6B0C8] mt-1">Answer the following 5 benchmark engineering questions:</p>
          </div>

          <div className="space-y-6">
            {QUESTIONS.map((q, idx) => (
              <div key={q.id} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
                <span className="text-[10px] font-mono text-[#32C8F5] uppercase tracking-wider">
                  Question 0{idx + 1}
                </span>
                <p className="text-sm font-semibold text-white">{q.question}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = answers[q.id] === optIdx;
                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelect(q.id, optIdx)}
                        className={`p-3 rounded-xl text-xs text-left border transition-all ${
                          isSelected
                            ? 'border-[#8065FF] bg-[#8065FF]/20 text-white font-semibold shadow-glow-violet'
                            : 'border-white/5 bg-[#10162A] text-[#A6B0C8] hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <button
              type="submit"
              disabled={submitting || Object.keys(answers).length < QUESTIONS.length}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-xs shadow-glow-violet hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {submitting ? (
                <span>Evaluating Diagnostic...</span>
              ) : (
                <>
                  <span>Submit Assessment & Update Readiness</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

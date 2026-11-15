import React, { useState, useEffect } from 'react';
import { studentService } from '../services/studentService';
import { Assessment, AssessmentQuestion } from '../types';
import { 
  Trophy, CheckCircle2, XCircle, AlertTriangle, ArrowRight, ArrowLeft,
  RefreshCw, Target, Award, Sparkles, BookOpen, Clock, Play, BarChart3,
  Check, HelpCircle, ChevronRight, Layers, Flame, BookMarked
} from 'lucide-react';

const SUPPORTED_ROLES = [
  'Full Stack Developer',
  'Python Developer',
  'Java Developer',
  'Frontend Developer',
  'Backend Developer',
  'AI / Machine Learning Engineer',
  'Data Scientist',
  'Cloud & DevOps Engineer',
  'Cybersecurity Engineer',
  'Database Architect',
];

const SUPPORTED_SKILLS = [
  'Full Stack & Software Engineering',
  'Python',
  'TypeScript',
  'React',
  'Node.js',
  'Data Structures & Algorithms',
  'SQL & Database Design',
  'MongoDB',
  'Cloud Architecture & Docker',
  'Artificial Intelligence & ML',
  'System Design & Microservices',
];

export const CareerAssessment: React.FC = () => {
  // Navigation / View Modes: 'configure' | 'active_test' | 'results' | 'history'
  const [viewMode, setViewMode] = useState<'configure' | 'active_test' | 'results' | 'history'>('configure');

  // Configuration Form State
  const [selectedRole, setSelectedRole] = useState('Full Stack Developer');
  const [selectedSkill, setSelectedSkill] = useState('Full Stack & Software Engineering');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [questionCount, setQuestionCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [generating, setGenerating] = useState(false);

  // Active Assessment State
  const [currentAssessment, setCurrentAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(900);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  // History State
  const [pastAssessments, setPastAssessments] = useState<Assessment[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadAssessments();
  }, []);

  // Timer countdown during active test
  useEffect(() => {
    if (viewMode !== 'active_test' || timeLeftSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [viewMode, timeLeftSeconds]);

  const loadAssessments = async () => {
    try {
      setLoadingHistory(true);
      const res = await studentService.getAssessments();
      setPastAssessments(res.assessments || []);
      if (res.assessments && res.assessments.length > 0 && viewMode === 'configure') {
        // If they have assessments, leave default on configure or review
      }
    } catch (err) {
      console.warn('Error loading assessments:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleStartGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setGenerating(true);
      setErrorMessage(null);

      const res = await studentService.generateAssessment({
        role: selectedRole,
        skill: selectedSkill,
        difficulty,
        questionCount,
        durationMinutes,
      });

      if (res.assessment) {
        // Start assessment
        await studentService.startAssessment(res.assessment._id);
        setCurrentAssessment(res.assessment);
        setAnswers({});
        setCurrentQuestionIndex(0);
        setTimeLeftSeconds(durationMinutes * 60);
        setViewMode('active_test');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to generate assessment. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
  };

  const handleSubmitAnswers = async () => {
    if (!currentAssessment) return;
    try {
      setSubmitting(true);
      setShowConfirmSubmit(false);
      const res = await studentService.submitAssessment(currentAssessment._id, answers);
      if (res.assessment) {
        setCurrentAssessment(res.assessment);
        setViewMode('results');
        loadAssessments();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit assessment answers');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReviewPast = (assessment: Assessment) => {
    setCurrentAssessment(assessment);
    setViewMode('results');
  };

  // Format time MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const currentQuestion = currentAssessment?.questions?.[currentQuestionIndex];
  const totalQuestions = currentAssessment?.questions?.length || 0;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-10 px-4 sm:px-6 selection:bg-[#8065FF] selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202947] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-[#8065FF]" />
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                AI Skill Assessment &amp; Benchmark
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Evaluate real-world engineering proficiency with adaptive AI question synthesis and concept-level rubric feedback.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setViewMode('configure')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'configure'
                  ? 'bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white shadow-lg shadow-[#8065FF]/20'
                  : 'bg-[#10162A] text-slate-400 hover:text-white border border-[#202947]'
              }`}
            >
              New Assessment
            </button>
            <button
              onClick={() => setViewMode('history')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'history'
                  ? 'bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white shadow-lg shadow-[#8065FF]/20'
                  : 'bg-[#10162A] text-slate-400 hover:text-white border border-[#202947]'
              }`}
            >
              History ({pastAssessments.length})
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =========================================================================
            VIEW 1: CONFIGURE & GENERATE NEW ASSESSMENT
            ========================================================================= */}
        {viewMode === 'configure' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
              <div>
                <h2 className="text-lg font-bold text-white">Configure Your Assessment</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Our multi-provider AI generates tailored scenarios and questions tailored to your exact target tech stack.
                </p>
              </div>

              <form onSubmit={handleStartGeneration} className="space-y-5">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Target Career Role</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  >
                    {SUPPORTED_ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-2">Primary Technical Domain / Skill</label>
                  <select
                    value={selectedSkill}
                    onChange={(e) => setSelectedSkill(e.target.value)}
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  >
                    {SUPPORTED_SKILLS.map((sk) => (
                      <option key={sk} value={sk}>{sk}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">Difficulty Tier</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as any)}
                      className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                    >
                      <option value="Beginner">Beginner (Foundations)</option>
                      <option value="Intermediate">Intermediate (Industry)</option>
                      <option value="Advanced">Advanced (Architectural)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">Question Count</label>
                    <select
                      value={questionCount}
                      onChange={(e) => setQuestionCount(Number(e.target.value))}
                      className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                    >
                      <option value={5}>5 Questions (~10 mins)</option>
                      <option value={10}>10 Questions (~20 mins)</option>
                      <option value={15}>15 Questions (~30 mins)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-2">Duration (Mins)</label>
                    <input
                      type="number"
                      min={5}
                      max={60}
                      value={durationMinutes}
                      onChange={(e) => setDurationMinutes(Number(e.target.value))}
                      className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#202947] flex justify-end">
                  <button
                    type="submit"
                    disabled={generating}
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white font-bold text-xs shadow-lg shadow-[#8065FF]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Synthesizing Questions with AI...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Launch Adaptive Assessment</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Sidebar Guidelines */}
            <div className="space-y-4">
              <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#32C8F5]" />
                  <span>How AI Assessment Works</span>
                </h3>
                <ul className="space-y-3 text-xs text-slate-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Real-world technical questions synthesized dynamically across core architectural domains.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Anti-tamper protection: answer keys and explanations are stored securely on the backend until submission.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Post-submission concept breakdown, gap identification, and personalized learning roadmap.</span>
                  </li>
                </ul>
              </div>

              {pastAssessments.length > 0 && (
                <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Latest Benchmark</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-white">{pastAssessments[0].skill}</div>
                      <div className="text-[11px] text-slate-400">{new Date(pastAssessments[0].completedAt || pastAssessments[0].createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-[#8065FF]">{pastAssessments[0].percentage}%</div>
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">{pastAssessments[0].proficiency || 'Intermediate'}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 2: ACTIVE TEST TAKING (ONE QUESTION AT A TIME)
            ========================================================================= */}
        {viewMode === 'active_test' && currentAssessment && currentQuestion && (
          <div className="space-y-6">
            
            {/* Top Status Bar: Timer, Progress & Quick Navigation */}
            <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8065FF]/10 text-[#8065FF] flex items-center justify-center font-black text-sm">
                  {currentQuestionIndex + 1}/{totalQuestions}
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">{currentAssessment.title}</h2>
                  <p className="text-[11px] text-slate-400">
                    Answered {answeredCount} of {totalQuestions} questions ({Math.round((answeredCount / totalQuestions) * 100)}%)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 self-start sm:self-auto">
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold ${
                  timeLeftSeconds < 180 
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' 
                    : 'bg-[#151D35] border-[#202947] text-white'
                }`}>
                  <Clock className="w-3.5 h-3.5 text-[#8065FF]" />
                  <span>{formatTime(timeLeftSeconds)}</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowConfirmSubmit(true)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all"
                >
                  Submit Assessment
                </button>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#151D35] text-[#32C8F5] text-[11px] font-semibold border border-[#202947]">
                    {currentQuestion.skillCategory || currentAssessment.skill}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#151D35] text-slate-300 text-[11px] font-medium border border-[#202947]">
                    {currentQuestion.topic || 'Fundamentals'}
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 font-medium">
                  Weight: {currentQuestion.maxMarks || 2} Points
                </span>
              </div>

              {/* Question Text */}
              <div className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                {currentQuestion.question}
              </div>

              {/* Options List */}
              <div className="space-y-3 pt-2">
                {currentQuestion.options?.map((optionText, optIdx) => {
                  const isSelected = answers[currentQuestion.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQuestion.id, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-[#8065FF]/15 border-[#8065FF] text-white shadow-md shadow-[#8065FF]/10'
                          : 'bg-[#080B18] border-[#202947] text-slate-300 hover:border-[#8065FF]/50 hover:bg-[#151D35]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs uppercase ${
                          isSelected ? 'bg-[#8065FF] text-white' : 'bg-[#151D35] text-slate-400'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{optionText}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#8065FF] shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Navigation Bar */}
              <div className="flex items-center justify-between pt-6 border-t border-[#202947]">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                  className="px-4 py-2 rounded-xl bg-[#151D35] hover:bg-[#1E294B] text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#8065FF]/20"
                  >
                    <span>Next</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmSubmit(true)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                  >
                    <span>Review &amp; Finish</span>
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Quick-Jump Question Palette */}
            <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl p-4 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 mr-2 uppercase">Jump To:</span>
              {currentAssessment.questions?.map((q, idx) => {
                const isAnswered = answers[q.id] !== undefined;
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#8065FF] text-white ring-2 ring-[#8065FF]/50'
                        : isAnswered
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#151D35] text-slate-400 hover:text-white border border-[#202947]'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Submit Confirmation Modal */}
        {showConfirmSubmit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <div className="bg-[#10162A] border border-[#202947] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-lg font-bold text-white">Submit Assessment?</h3>
              <p className="text-xs text-slate-300">
                You have answered <span className="text-emerald-400 font-bold">{answeredCount}</span> of{' '}
                <span className="font-bold">{totalQuestions}</span> questions.
                {answeredCount < totalQuestions && (
                  <span className="text-amber-400 block mt-1">
                    Warning: You have {totalQuestions - answeredCount} unanswered questions which will be marked incorrect.
                  </span>
                )}
              </p>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmSubmit(false)}
                  className="px-4 py-2 rounded-xl bg-[#151D35] hover:bg-[#1E294B] text-slate-300 text-xs font-semibold"
                >
                  Return to Test
                </button>
                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleSubmitAnswers}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                >
                  {submitting ? 'Evaluating...' : 'Confirm Submission'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            VIEW 3: RESULTS, TOPIC PERFORMANCE & QUESTION EXPLANATIONS
            ========================================================================= */}
        {viewMode === 'results' && currentAssessment && (
          <div className="space-y-8">
            
            {/* Top Score Banner */}
            <div className="bg-gradient-to-br from-[#10162A] to-[#151D35] border border-[#202947] rounded-3xl p-6 sm:p-8 shadow-card-dark flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#8065FF] to-[#32C8F5] flex items-center justify-center text-white shadow-lg shadow-[#8065FF]/20 shrink-0">
                  <Trophy className="w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {currentAssessment.proficiency || 'Intermediate'} Proficiency
                    </span>
                    <span className="text-xs text-slate-400">{currentAssessment.role}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">{currentAssessment.title}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Completed on {new Date(currentAssessment.completedAt || currentAssessment.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-center">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Score</span>
                  <div className="text-3xl font-black text-white mt-0.5">
                    {currentAssessment.score} <span className="text-sm font-semibold text-slate-500">/ {currentAssessment.maxScore}</span>
                  </div>
                </div>

                <div className="h-10 w-px bg-[#202947]" />

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Percentage</span>
                  <div className={`text-3xl font-black mt-0.5 ${
                    currentAssessment.percentage >= 70 ? 'text-emerald-400' : currentAssessment.percentage >= 50 ? 'text-[#8065FF]' : 'text-amber-400'
                  }`}>
                    {currentAssessment.percentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* Topic Performance & Learning Recommendations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Topic Breakdown Bars */}
              <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#8065FF]" />
                  <span>Topic-wise Performance Breakdown</span>
                </h3>

                <div className="space-y-3 pt-2">
                  {currentAssessment.topicBreakdown?.map((tb, idx) => (
                    <div key={idx} className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="font-semibold">{tb.topic}</span>
                        <span className="font-mono text-slate-400">{tb.score}/{tb.maxScore} ({tb.percentage}%)</span>
                      </div>
                      <div className="h-2 w-full bg-[#080B18] rounded-full overflow-hidden border border-[#202947]">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            tb.percentage >= 75 ? 'bg-emerald-500' : tb.percentage >= 50 ? 'bg-[#8065FF]' : 'bg-amber-500'
                          }`}
                          style={{ width: `${tb.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalized AI Learning Recommendations */}
              <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <BookMarked className="w-4 h-4 text-[#32C8F5]" />
                  <span>Personalized Learning Roadmap</span>
                </h3>

                <div className="space-y-3">
                  {currentAssessment.learningRecommendations?.map((rec, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-[#080B18] border border-[#202947] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{rec.topic}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          rec.priority === 'High' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}>
                          {rec.priority} Priority
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{rec.reason}</p>
                      <div className="text-[11px] text-[#8065FF] font-semibold mt-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{rec.suggestedResource}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Question-by-Question Review with Explanations */}
            <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>Detailed Question &amp; Explanation Review</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Review each response, verify the backend answer key, and study the pedagogical reasoning.
                  </p>
                </div>
              </div>

              <div className="space-y-6 divide-y divide-[#202947]/50">
                {currentAssessment.questions?.map((q, idx) => (
                  <div key={q.id || idx} className="pt-6 first:pt-0 space-y-3">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-md bg-[#151D35] flex items-center justify-center text-xs font-bold text-white">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-300">{q.topic || 'Fundamentals'}</span>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                        q.isCorrect
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      }`}>
                        {q.isCorrect ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>Correct (+{q.marksAwarded || q.maxMarks} pts)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Incorrect (0 pts)</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-white">
                      {q.question}
                    </div>

                    {/* Options list showing student selection vs correct answer */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {q.options?.map((opt, oIdx) => {
                        const isStudentChoice = Number(q.selectedAnswer) === oIdx;
                        const isCorrectOption = Number(q.correctAnswer) === oIdx;

                        return (
                          <div
                            key={oIdx}
                            className={`p-3 rounded-xl border flex items-center justify-between ${
                              isCorrectOption
                                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-semibold'
                                : isStudentChoice && !q.isCorrect
                                ? 'bg-rose-500/10 border-rose-500/40 text-rose-300 line-through'
                                : 'bg-[#080B18] border-[#202947] text-slate-400'
                            }`}
                          >
                            <span>
                              {String.fromCharCode(65 + oIdx)}. {opt}
                            </span>
                            {isCorrectOption && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {/* Pedagogical Explanation Box */}
                    <div className="p-4 rounded-2xl bg-[#080B18] border border-[#202947] space-y-1.5 text-xs">
                      <span className="font-bold text-[#8065FF] block">Pedagogical Explanation:</span>
                      <p className="text-slate-300 leading-relaxed">{q.explanation}</p>
                      {q.feedback && (
                        <p className="text-slate-400 text-[11px] italic pt-1 border-t border-[#202947]/50">
                          Feedback: {q.feedback}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-4">
              <button
                type="button"
                onClick={() => setViewMode('history')}
                className="px-5 py-2.5 rounded-xl bg-[#151D35] hover:bg-[#1E294B] text-slate-200 text-xs font-semibold"
              >
                View Assessment History
              </button>

              <button
                type="button"
                onClick={() => setViewMode('configure')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white text-xs font-bold shadow-lg shadow-[#8065FF]/20"
              >
                Take Another Assessment
              </button>
            </div>

          </div>
        )}

        {/* =========================================================================
            VIEW 4: ASSESSMENT HISTORY TABLE
            ========================================================================= */}
        {viewMode === 'history' && (
          <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl overflow-hidden shadow-card-dark">
            <div className="p-6 border-b border-[#202947] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Your Assessment History</h3>
                <p className="text-xs text-slate-400">Track score progression across technical domains over time.</p>
              </div>

              <button
                onClick={() => setViewMode('configure')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white text-xs font-bold"
              >
                New Assessment
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080B18] text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Role &amp; Domain</th>
                    <th className="py-3.5 px-4">Difficulty</th>
                    <th className="py-3.5 px-4">Score</th>
                    <th className="py-3.5 px-4">Proficiency</th>
                    <th className="py-3.5 px-4">Completed Date</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202947]/50 text-slate-200">
                  {pastAssessments.length > 0 ? (
                    pastAssessments.map((a) => (
                      <tr key={a._id} className="hover:bg-[#151D35]/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{a.skill || a.title}</div>
                          <div className="text-[11px] text-slate-400">{a.role || a.domain}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-300">
                          {a.difficulty || 'Intermediate'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="font-mono font-bold text-white text-sm">{a.percentage}%</span>
                          <span className="text-[10px] text-slate-400 ml-1">({a.score}/{a.maxScore})</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            a.proficiency === 'Expert' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30' :
                            a.proficiency === 'Advanced' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                            'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                          }`}>
                            {a.proficiency || 'Intermediate'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {new Date(a.completedAt || a.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleReviewPast(a)}
                            className="px-3 py-1.5 rounded-lg bg-[#151D35] hover:bg-[#1E294B] text-slate-200 text-xs font-medium border border-[#202947] transition-colors"
                          >
                            View Report
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No skill assessments completed yet. Launch your first assessment above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

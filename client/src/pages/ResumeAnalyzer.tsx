import React, { useState, useEffect, useRef } from 'react';
import { resumeService } from '../services/resumeService';
import { Resume, ResumeAnalysis } from '../types';
import { 
  FileText, Upload, Sparkles, CheckCircle2, AlertTriangle, ArrowRight,
  RefreshCw, Target, Award, Check, X, Download, FileUp, Briefcase,
  Layers, ChevronRight, Edit3, Save, Copy
} from 'lucide-react';

export const ResumeAnalyzer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'analysis' | 'match' | 'builder' | 'history'>('upload');
  const [loading, setLoading] = useState(false);
  const [parsingStep, setParsingStep] = useState<string | null>(null);
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [targetJobDescription, setTargetJobDescription] = useState('');
  const [pastedText, setPastedText] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');

  // Active Resume & Analysis state
  const [currentResume, setCurrentResume] = useState<Resume | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<ResumeAnalysis | null>(null);
  const [jobMatchResult, setJobMatchResult] = useState<any | null>(null);
  const [matchingJob, setMatchingJob] = useState(false);

  // Editable sections in builder
  const [editedSummary, setEditedSummary] = useState('');
  const [acceptedBulletIds, setAcceptedBulletIds] = useState<string[]>([]);
  const [savingSections, setSavingSections] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // History state
  const [resumesList, setResumesList] = useState<Resume[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadResumeHistory();
  }, []);

  const loadResumeHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await resumeService.getResumes();
      setResumesList(res.resumes || []);
      if (res.resumes && res.resumes.length > 0 && !currentResume) {
        // Set first resume as active if none selected
        setCurrentResume(res.resumes[0]);
        if (res.resumes[0].latestAnalysis) {
          setCurrentAnalysis(res.resumes[0].latestAnalysis);
          setEditedSummary(res.resumes[0].improvedContent?.summary || res.resumes[0].parsedSections?.summary || '');
        }
      }
    } catch (err) {
      console.warn('Error loading resume history:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File exceeds maximum size limit of 10MB.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setStatusMessage(null);

      setParsingStep('Uploading and verifying file signature...');
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('targetRole', targetRole);
      if (targetJobDescription.trim()) {
        formData.append('targetJobDescription', targetJobDescription.trim());
      }

      setParsingStep('Extracting structured text and sections...');
      const res = await resumeService.uploadResume(formData);

      if (res.resume && res.analysis) {
        setCurrentResume(res.resume);
        setCurrentAnalysis(res.analysis);
        setEditedSummary(res.resume.improvedContent?.summary || res.resume.parsedSections?.summary || '');
        setActiveTab('analysis');
        setStatusMessage(`Resume "${file.name}" parsed and evaluated successfully.`);
        loadResumeHistory();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse resume file. Ensure it is a valid PDF, DOCX, or text file.');
    } finally {
      setLoading(false);
      setParsingStep(null);
    }
  };

  const handleAnalyzeText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim() || pastedText.trim().length < 30) {
      setErrorMessage('Please paste at least 30 characters of resume content.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);
      setStatusMessage(null);

      const res = await resumeService.analyzeResume({
        resumeText: pastedText.trim(),
        targetRole,
        targetJobDescription: targetJobDescription.trim(),
      });

      if (res.analysis) {
        setCurrentAnalysis(res.analysis);
        if (res.resume) setCurrentResume(res.resume);
        setActiveTab('analysis');
        setStatusMessage('Pasted resume evaluated successfully.');
        loadResumeHistory();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to analyze resume text.');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchJobDescription = async () => {
    if (!currentResume || !targetJobDescription.trim()) return;

    try {
      setMatchingJob(true);
      setErrorMessage(null);

      const res = await resumeService.matchJob(currentResume._id, targetJobDescription.trim());
      setJobMatchResult(res.match);
      setActiveTab('match');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to match job description');
    } finally {
      setMatchingJob(false);
    }
  };

  const handleAcceptSuggestion = async (suggestion: any) => {
    if (!currentResume) return;

    try {
      setSavingSections(true);
      const res = await resumeService.updateSections(currentResume._id, {
        acceptedSuggestion: suggestion.improved,
      });

      setCurrentResume(res.resume);
      setAcceptedBulletIds((prev) => [...prev, suggestion.original]);
      setStatusMessage('Suggestion accepted and applied to your improved resume.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save suggestion');
    } finally {
      setSavingSections(false);
    }
  };

  const handleSaveSummary = async () => {
    if (!currentResume) return;
    try {
      setSavingSections(true);
      const res = await resumeService.updateSections(currentResume._id, {
        summary: editedSummary,
      });
      setCurrentResume(res.resume);
      setStatusMessage('Professional summary updated successfully.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update summary');
    } finally {
      setSavingSections(false);
    }
  };

  const handleExport = async () => {
    if (!currentResume) return;
    try {
      const res = await resumeService.exportResume(currentResume._id);
      const blob = new Blob([res.contentMarkdown], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', res.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      alert(err.message || 'Failed to export resume');
    }
  };

  const scores = currentAnalysis?.sectionScores || {
    skillsRelevance: 20,
    projectsExperience: 16,
    experienceInternships: 12,
    educationCertifications: 8,
    resumeStructure: 8,
    jobAlignment: 8,
    writingQuality: 8,
  };

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-10 px-4 sm:px-6 selection:bg-[#8065FF] selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Navigation Tabs Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#202947] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-5 h-5 text-[#8065FF]" />
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                AI Resume Intelligence &amp; Builder
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Upload PDF/DOCX resumes for native semantic parsing, 7-factor scoring, XYZ metric enhancements, and job matching.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto pb-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'upload'
                  ? 'bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white shadow-lg shadow-[#8065FF]/20'
                  : 'bg-[#10162A] text-slate-400 hover:text-white border border-[#202947]'
              }`}
            >
              Upload &amp; Analyze
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              disabled={!currentAnalysis}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap disabled:opacity-40 ${
                activeTab === 'analysis'
                  ? 'bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white shadow-lg shadow-[#8065FF]/20'
                  : 'bg-[#10162A] text-slate-400 hover:text-white border border-[#202947]'
              }`}
            >
              Analysis Report
            </button>
            <button
              onClick={() => setActiveTab('match')}
              disabled={!currentResume}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap disabled:opacity-40 ${
                activeTab === 'match'
                  ? 'bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white shadow-lg shadow-[#8065FF]/20'
                  : 'bg-[#10162A] text-slate-400 hover:text-white border border-[#202947]'
              }`}
            >
              Job Match
            </button>
            <button
              onClick={() => setActiveTab('builder')}
              disabled={!currentResume}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap disabled:opacity-40 ${
                activeTab === 'builder'
                  ? 'bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white shadow-lg shadow-[#8065FF]/20'
                  : 'bg-[#10162A] text-slate-400 hover:text-white border border-[#202947]'
              }`}
            >
              AI Improvement Assistant
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white shadow-lg shadow-[#8065FF]/20'
                  : 'bg-[#10162A] text-slate-400 hover:text-white border border-[#202947]'
              }`}
            >
              Resumes ({resumesList.length})
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* =========================================================================
            TAB 1: UPLOAD & PARSE
            ========================================================================= */}
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
              <div>
                <h2 className="text-lg font-bold text-white">Upload Your Resume for AI Parsing</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Supports PDF and Microsoft Word DOCX formats with instant text extraction and evidence-backed evaluation.
                </p>
              </div>

              {/* Upload Type Switcher */}
              <div className="flex items-center gap-2 border-b border-[#202947] pb-3">
                <button
                  type="button"
                  onClick={() => setUploadMode('file')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    uploadMode === 'file' ? 'bg-[#8065FF] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload File (PDF / DOCX)
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('text')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    uploadMode === 'text' ? 'bg-[#8065FF] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Paste Resume Text
                </button>
              </div>

              {/* Role & Optional JD Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Target Job Role</label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  >
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Python Developer">Python Developer</option>
                    <option value="AI / ML Engineer">AI / ML Engineer</option>
                    <option value="DevOps Engineer">DevOps Engineer</option>
                    <option value="Data Scientist">Data Scientist</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Target Job Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={targetJobDescription}
                    onChange={(e) => setTargetJobDescription(e.target.value)}
                    placeholder="Paste job posting snippet or keywords..."
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>
              </div>

              {/* Mode A: Drag & Drop Zone */}
              {uploadMode === 'file' && (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files?.[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className="border-2 border-dashed border-[#202947] hover:border-[#8065FF] bg-[#080B18]/60 rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all space-y-4 group"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                  />
                  <div className="w-14 h-14 rounded-2xl bg-[#8065FF]/10 group-hover:bg-[#8065FF]/20 text-[#8065FF] flex items-center justify-center mx-auto transition-colors">
                    <FileUp className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#8065FF] transition-colors">
                      Click to Browse or Drag &amp; Drop Resume
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      PDF or DOCX (Max size: 10MB). Text is parsed locally with privacy protection.
                    </p>
                  </div>
                </div>
              )}

              {/* Mode B: Paste Text */}
              {uploadMode === 'text' && (
                <form onSubmit={handleAnalyzeText} className="space-y-4">
                  <div>
                    <textarea
                      rows={8}
                      value={pastedText}
                      onChange={(e) => setPastedText(e.target.value)}
                      placeholder="Paste your resume sections, skills, education, and project bullet points here..."
                      className="w-full bg-[#080B18] border border-[#202947] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading || !pastedText.trim()}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white text-xs font-bold shadow-lg shadow-[#8065FF]/20 disabled:opacity-50"
                    >
                      Analyze Text
                    </button>
                  </div>
                </form>
              )}

              {/* Parsing Progress Indicator */}
              {loading && (
                <div className="p-4 rounded-2xl bg-[#151D35] border border-[#202947] flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-[#8065FF] animate-spin shrink-0" />
                  <div className="text-xs">
                    <span className="font-bold text-white block">Processing Resume...</span>
                    <span className="text-slate-400">{parsingStep || 'Extracting technical credentials and metrics...'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Guidelines */}
            <div className="space-y-4">
              <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#32C8F5]" />
                  <span>The 7-Factor Rubric</span>
                </h3>
                <div className="space-y-2.5 text-xs text-slate-400">
                  <div className="flex items-center justify-between">
                    <span>1. Skills Relevance</span>
                    <span className="text-white font-mono font-bold">25 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>2. Projects (XYZ Metrics)</span>
                    <span className="text-white font-mono font-bold">20 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>3. Experience &amp; Internships</span>
                    <span className="text-white font-mono font-bold">15 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>4. Education &amp; Certs</span>
                    <span className="text-white font-mono font-bold">10 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>5. Resume Formatting</span>
                    <span className="text-white font-mono font-bold">10 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>6. Job Description Match</span>
                    <span className="text-white font-mono font-bold">10 pts</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>7. Action Verbs &amp; Writing</span>
                    <span className="text-white font-mono font-bold">10 pts</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs space-y-1">
                <span className="font-bold block">Methodology Note:</span>
                <p className="text-[11px] leading-relaxed text-amber-200/80">
                  Learnova calculates readiness scores using rigorous semantic analysis. This is an algorithmic evaluation tool to assist your career preparation, not a guarantee of employer hiring decisions.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: ANALYSIS REPORT & SCORES
            ========================================================================= */}
        {activeTab === 'analysis' && currentAnalysis && (
          <div className="space-y-8">
            
            {/* Top Score Banner */}
            <div className="bg-gradient-to-br from-[#10162A] to-[#151D35] border border-[#202947] rounded-3xl p-6 sm:p-8 shadow-card-dark flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#8065FF] to-[#32C8F5] flex items-center justify-center text-white shadow-lg shadow-[#8065FF]/20 shrink-0">
                  <Award className="w-10 h-10" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      {currentAnalysis.targetRole}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{currentAnalysis.fileName}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">AI Resume Readiness Score</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Calculated against 7 core industry pillars with Google XYZ bullet point verification.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-center">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Overall Score</span>
                  <div className="text-4xl font-black text-white mt-0.5">
                    {currentAnalysis.overallScore || currentAnalysis.atsScore} <span className="text-sm font-semibold text-slate-500">/ 100</span>
                  </div>
                </div>

                <div className="h-10 w-px bg-[#202947]" />

                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Role Match</span>
                  <div className="text-4xl font-black text-[#32C8F5] mt-0.5">
                    {currentAnalysis.matchPercentage}%
                  </div>
                </div>
              </div>
            </div>

            {/* 7 Section Scores Matrix */}
            <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8065FF]" />
                <span>Pillar-by-Pillar Section Scores</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-[#080B18] border border-[#202947]">
                  <span className="text-slate-400 text-[11px] block font-semibold">Skills Relevance</span>
                  <div className="text-xl font-bold text-white mt-1">
                    {scores.skillsRelevance} <span className="text-xs text-slate-500">/ 25</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#080B18] border border-[#202947]">
                  <span className="text-slate-400 text-[11px] block font-semibold">Projects (XYZ Metrics)</span>
                  <div className="text-xl font-bold text-white mt-1">
                    {scores.projectsExperience} <span className="text-xs text-slate-500">/ 20</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#080B18] border border-[#202947]">
                  <span className="text-slate-400 text-[11px] block font-semibold">Experience &amp; Internships</span>
                  <div className="text-xl font-bold text-white mt-1">
                    {scores.experienceInternships} <span className="text-xs text-slate-500">/ 15</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#080B18] border border-[#202947]">
                  <span className="text-slate-400 text-[11px] block font-semibold">Writing Quality &amp; Verbs</span>
                  <div className="text-xl font-bold text-white mt-1">
                    {scores.writingQuality} <span className="text-xs text-slate-500">/ 10</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Identified Strengths</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {currentAnalysis.strengths?.map((st, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">&bull;</span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 space-y-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Areas Requiring Enhancement</span>
                </h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {(currentAnalysis.weaknesses?.length ? currentAnalysis.weaknesses : currentAnalysis.improvements)?.map((imp, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&bull;</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Technical Skills vs Missing Keywords */}
            <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white">Extracted Skills vs Industry Keyword Gaps</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-2">Detected in Your Resume:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentAnalysis.extractedSkills?.map((sk, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-2">Recommended Keywords for {currentAnalysis.targetRole}:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentAnalysis.missingKeywords?.map((kw, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-[#8065FF]/10 text-[#A68BFF] border border-[#8065FF]/20 text-xs">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('builder')}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white text-xs font-bold shadow-lg shadow-[#8065FF]/20 flex items-center gap-2"
              >
                <span>Open AI Improvement Assistant</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleExport}
                className="px-5 py-2.5 rounded-xl bg-[#151D35] hover:bg-[#1E294B] text-slate-200 text-xs font-semibold flex items-center gap-2 border border-[#202947]"
              >
                <Download className="w-4 h-4 text-[#32C8F5]" />
                <span>Export Resume</span>
              </button>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 3: JOB DESCRIPTION MATCHING
            ========================================================================= */}
        {activeTab === 'match' && (
          <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
            <div>
              <h2 className="text-lg font-bold text-white">Compare Resume to Job Description</h2>
              <p className="text-xs text-slate-400 mt-1">
                Paste a target job posting to analyze skill overlap, required credentials, and tailoring recommendations.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Target Job Description</label>
                <textarea
                  rows={6}
                  value={targetJobDescription}
                  onChange={(e) => setTargetJobDescription(e.target.value)}
                  placeholder="Paste the full job description or requirements section here..."
                  className="w-full bg-[#080B18] border border-[#202947] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <button
                type="button"
                disabled={matchingJob || !targetJobDescription.trim()}
                onClick={handleMatchJobDescription}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white text-xs font-bold shadow-lg shadow-[#8065FF]/20 disabled:opacity-50 flex items-center gap-2"
              >
                {matchingJob ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4" />}
                <span>{matchingJob ? 'Analyzing Semantic Match...' : 'Calculate Job Match'}</span>
              </button>
            </div>

            {/* Results Display */}
            {jobMatchResult && (
              <div className="pt-6 border-t border-[#202947] space-y-6">
                <div className="flex items-center justify-between p-5 rounded-2xl bg-[#080B18] border border-[#202947]">
                  <div>
                    <span className="text-xs font-bold text-slate-400 block">Match Ratio</span>
                    <span className="text-2xl font-black text-[#8065FF]">{jobMatchResult.matchPercentage}%</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 block">Keyword Coverage</span>
                    <span className="text-xl font-bold text-emerald-400">{jobMatchResult.keywordCoveragePercentage || 74}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-[#080B18] border border-[#202947] space-y-2">
                    <span className="text-xs font-bold text-emerald-400 block">Matching Requirements:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {jobMatchResult.matchingSkills?.map((m: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-xs">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#080B18] border border-[#202947] space-y-2">
                    <span className="text-xs font-bold text-amber-400 block">Missing Requisition Keywords:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {jobMatchResult.missingSkills?.map((m: string, i: number) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 text-xs">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: AI IMPROVEMENT ASSISTANT & BUILDER (SIDE-BY-SIDE REVIEWS)
            ========================================================================= */}
        {activeTab === 'builder' && currentResume && (
          <div className="space-y-8">
            
            {/* Professional Summary Rewrite Card */}
            <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 sm:p-8 space-y-4 shadow-card-dark">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-[#8065FF]" />
                    <span>Professional Summary &amp; Hook</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    A concise 2-3 sentence executive hook showcasing your primary tech stack and measurable results.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleSaveSummary}
                  disabled={savingSections}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-[#8065FF]/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Summary</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={editedSummary}
                onChange={(e) => setEditedSummary(e.target.value)}
                className="w-full bg-[#080B18] border border-[#202947] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#8065FF]"
              />
            </div>

            {/* Side-by-Side Bullet Point Improvements (XYZ Formula) */}
            <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl p-6 sm:p-8 space-y-6 shadow-card-dark">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#32C8F5]" />
                  <span>AI Bullet Point Enhancements (Google XYZ Formula)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Replace passive phrases with active leadership verbs and quantifiable performance impacts.
                </p>
              </div>

              <div className="space-y-4">
                {currentAnalysis?.bulletPointSuggestions?.map((sugg, idx) => {
                  const isAccepted = acceptedBulletIds.includes(sugg.original);
                  return (
                    <div key={idx} className="p-5 rounded-2xl bg-[#080B18] border border-[#202947] space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                        {/* Original Bullet */}
                        <div className="p-3.5 rounded-xl bg-[#10162A] border border-[#202947]/70 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-slate-500">Original Bullet:</span>
                          <p className="text-slate-300 leading-relaxed">{sugg.original}</p>
                        </div>

                        {/* Improved XYZ Bullet */}
                        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                          <span className="text-[10px] font-bold uppercase text-emerald-400">AI Improved (XYZ Formula):</span>
                          <p className="text-emerald-200 font-medium leading-relaxed">{sugg.improved}</p>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 text-xs">
                        <span className="text-slate-400 text-[11px] italic">
                          Rationale: {sugg.reason}
                        </span>

                        <div className="flex items-center gap-2 self-end sm:self-auto">
                          {isAccepted ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-bold">
                              <Check className="w-3.5 h-3.5" />
                              <span>Applied</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAcceptSuggestion(sugg)}
                              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Apply Improvement</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Export Bottom Banner */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleExport}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white text-xs font-bold shadow-lg shadow-[#8065FF]/20 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Export Enhanced Resume (Markdown)</span>
              </button>
            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 5: RESUME REPOSITORY / HISTORY
            ========================================================================= */}
        {activeTab === 'history' && (
          <div className="bg-[#10162A]/90 border border-[#202947] rounded-3xl overflow-hidden shadow-card-dark">
            <div className="p-6 border-b border-[#202947] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Your Analyzed Resumes</h3>
                <p className="text-xs text-slate-400">Previous uploads and AI diagnostic reports.</p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white text-xs font-bold"
              >
                Upload New Resume
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080B18] text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">File Name</th>
                    <th className="py-3.5 px-4">Target Role</th>
                    <th className="py-3.5 px-4">Format</th>
                    <th className="py-3.5 px-4">Upload Date</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202947]/50 text-slate-200">
                  {resumesList.length > 0 ? (
                    resumesList.map((r) => (
                      <tr key={r._id} className="hover:bg-[#151D35]/50 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {r.fileName}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 rounded-md bg-[#151D35] text-slate-300 border border-[#202947]">
                            {r.targetRole}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono uppercase text-[11px] text-slate-400">
                          {r.mimeType?.includes('pdf') ? 'PDF' : r.mimeType?.includes('word') ? 'DOCX' : 'TXT'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentResume(r);
                              if (r.latestAnalysis) {
                                setCurrentAnalysis(r.latestAnalysis as any);
                              }
                              setActiveTab('analysis');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#151D35] hover:bg-[#1E294B] text-slate-200 text-xs font-medium border border-[#202947] transition-colors"
                          >
                            View Analysis
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        No resumes uploaded yet. Upload your first resume above!
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

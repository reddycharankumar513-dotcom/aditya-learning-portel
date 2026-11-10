import React, { useState, useEffect } from 'react';
import { resumeService } from '../services/resumeService';
import { ResumeAnalysis } from '../types';
import { 
  FileText, Upload, Sparkles, CheckCircle2, 
  AlertTriangle, ArrowRight, RefreshCw, Target, Award, Check 
} from 'lucide-react';

export const ResumeAnalyzer: React.FC = () => {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [targetJobDescription, setTargetJobDescription] = useState('');
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ResumeAnalysis[]>([]);
  const [fetchingHistory, setFetchingHistory] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setFetchingHistory(true);
      const res = await resumeService.getHistory();
      setHistory(res.analyses || []);
      if (res.analyses && res.analyses.length > 0) {
        setAnalysis(res.analyses[0]);
      }
    } catch (err) {
      console.warn('Error fetching resume history:', err);
    } finally {
      setFetchingHistory(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setResumeText(content);
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) return;

    try {
      setLoading(true);
      const res = await resumeService.analyzeResume({
        resumeText,
        fileName: 'Student_Resume_2026.pdf',
        targetRole,
        targetJobDescription,
      });

      if (res.analysis) {
        setAnalysis(res.analysis);
        setHistory((prev) => [res.analysis, ...prev]);
      }
    } catch (err) {
      console.warn('Error analyzing resume:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSampleFill = () => {
    setResumeText(`CHARAN KUMAR REDDY
Software Engineer & Full Stack Developer
Email: charan@example.com | GitHub: github.com/charan | LinkedIn: linkedin.com/in/charan

EDUCATION
B.Tech in Computer Science and Engineering — Class of 2026
Relevant Coursework: Data Structures & Algorithms, Database Systems, Cloud Architecture

TECHNICAL SKILLS
Languages: TypeScript, JavaScript, Python, SQL, HTML/CSS
Frameworks: React 19, Node.js, Express, Tailwind CSS
Databases & Cloud: MongoDB, Redis, Docker, AWS (S3, EC2), Git

EXPERIENCE & PROJECTS
Full Stack Platform Engineer — Open Source Project (2025 - Present)
- Architected responsive web applications using React and Node.js serving 5,000+ monthly active users.
- Designed RESTful API microservices and implemented MongoDB compound indexing, reducing query response times by 38%.
- Integrated real-time caching layers with Redis to optimize database read throughput.`);
  };

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#30D6A0]/20 text-[#30D6A0] text-xs font-semibold mb-2 border border-[#30D6A0]/30">
              <FileText className="w-3.5 h-3.5" />
              <span>ATS Resume Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              AI Resume Analyzer & Job Description Matcher
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8] mt-1">
              Extract technical keywords, benchmark ATS compliance, and rewrite project bullet points using the XYZ formula.
            </p>
          </div>

          {analysis && (
            <div className="text-center sm:text-right flex-shrink-0">
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#A6B0C8] block">
                ATS Score
              </span>
              <span className="text-3xl font-heading font-black text-[#30D6A0]">
                {analysis.atsScore}/100
              </span>
            </div>
          )}
        </div>

        {/* Upload & Form Section */}
        <form onSubmit={handleAnalyze} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-white mb-2">
                Target Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                placeholder="e.g. Full Stack Developer, AI Engineer"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-white mb-2">
                Upload File or Auto-Fill Sample
              </label>
              <div className="flex gap-2">
                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-white/10 bg-[#10162A] text-xs font-semibold text-[#A6B0C8] hover:text-white hover:bg-white/5 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span>Upload .txt / .pdf</span>
                  <input type="file" accept=".txt,.pdf" onChange={handleFileUpload} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={handleSampleFill}
                  className="px-3 py-2.5 rounded-xl border border-[#8065FF]/40 bg-[#8065FF]/10 text-xs font-semibold text-[#A68BFF] hover:bg-[#8065FF]/20 transition-colors"
                >
                  Load Sample
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-white mb-2">
              Paste Resume Plaintext
            </label>
            <textarea
              rows={8}
              placeholder="Paste full text of your resume here..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full bg-[#10162A] border border-white/10 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-[#8065FF] leading-relaxed resize-y font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-white mb-2">
              Target Job Description (Optional for JD Keyword Matching)
            </label>
            <textarea
              rows={3}
              placeholder="Paste job posting text from LinkedIn, Indeed, or career portals..."
              value={targetJobDescription}
              onChange={(e) => setTargetJobDescription(e.target.value)}
              className="w-full bg-[#10162A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#8065FF]"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={loading || !resumeText.trim()}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-xs shadow-glow-violet hover:opacity-95 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? (
                <span>Analyzing ATS Keywords...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Complete Resume Audit</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Results Showcase */}
        {analysis && (
          <div className="space-y-6">
            {/* Top Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="glass-panel rounded-2xl p-5 border border-white/10 text-center">
                <span className="text-xs text-[#A6B0C8]">ATS Compliance Score</span>
                <div className="text-3xl font-heading font-black text-[#30D6A0] mt-1">
                  {analysis.atsScore}/100
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-5 border border-white/10 text-center">
                <span className="text-xs text-[#A6B0C8]">Job Description Match</span>
                <div className="text-3xl font-heading font-black text-[#32C8F5] mt-1">
                  {analysis.matchPercentage}%
                </div>
              </div>

              <div className="glass-panel rounded-2xl p-5 border border-white/10 text-center">
                <span className="text-xs text-[#A6B0C8]">Extracted Technical Keywords</span>
                <div className="text-3xl font-heading font-black text-white mt-1">
                  {analysis.extractedSkills.length}
                </div>
              </div>
            </div>

            {/* Extracted vs Missing Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[#30D6A0] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Detected Competencies</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.extractedSkills.map((sk, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#30D6A0]/15 text-[#30D6A0] text-xs font-semibold border border-[#30D6A0]/30">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
                <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-[#F4B860] flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>High-Priority Missing Keywords</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingKeywords.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F4B860]/15 text-[#F4B860] text-xs font-semibold border border-[#F4B860]/30">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* XYZ Formula Bullet Point Rewrite Suggestions */}
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <h4 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-[#8065FF]" />
                <span>Actionable Bullet Point Rewrites (XYZ Formula)</span>
              </h4>
              <p className="text-xs text-[#A6B0C8]">
                Formula: Accomplished [X] as measured by [Y], by doing [Z].
              </p>

              <div className="space-y-4 pt-2">
                {analysis.bulletPointSuggestions.map((sug, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-[#FF647C]">
                      <strong>Original:</strong> {sug.original}
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#30D6A0]/10 border border-[#30D6A0]/30 text-white">
                      <strong className="text-[#30D6A0]">Improved:</strong> {sug.improved}
                    </div>
                    <span className="text-[10px] text-[#A6B0C8] italic block">
                      Why: {sug.reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

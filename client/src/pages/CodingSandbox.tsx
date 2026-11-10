import React, { useState, useEffect } from 'react';
import { learningPlusService, CodingProblem } from '../services/learningPlusService';
import { 
  Code, Play, Terminal, CheckCircle2, AlertCircle, 
  RefreshCw, Check, Clock, Cpu, Sparkles 
} from 'lucide-react';

export const CodingSandbox: React.FC = () => {
  const [problems, setProblems] = useState<CodingProblem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<CodingProblem | null>(null);
  const [language, setLanguage] = useState<string>('javascript');
  const [code, setCode] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{
    status: string;
    testsPassed: number;
    totalTests: number;
    runtimeMs: number;
    message: string;
  } | null>(null);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const res = await learningPlusService.getCodingProblems();
      if (res.problems && res.problems.length > 0) {
        setProblems(res.problems);
        setSelectedProblem(res.problems[0]);
        setCode(res.problems[0].starterCode['javascript'] || '');
      }
    } catch (err) {
      console.warn('Error loading coding problems:', err);
    }
  };

  const handleSelectProblem = (prob: CodingProblem) => {
    setSelectedProblem(prob);
    setCode(prob.starterCode[language] || prob.starterCode['javascript'] || '');
    setResult(null);
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (selectedProblem) {
      setCode(selectedProblem.starterCode[newLang] || selectedProblem.starterCode['javascript'] || '');
    }
    setResult(null);
  };

  const handleRunCode = async () => {
    if (!selectedProblem) return;
    try {
      setRunning(true);
      const res = await learningPlusService.submitCode(
        selectedProblem.id,
        language,
        code
      );
      setResult({
        status: res.submission.status,
        testsPassed: res.submission.testsPassed,
        totalTests: res.submission.totalTests,
        runtimeMs: res.submission.runtimeMs,
        message: res.message,
      });
    } catch (err: any) {
      setResult({
        status: 'Runtime Error',
        testsPassed: 0,
        totalTests: selectedProblem.testCases.length,
        runtimeMs: 0,
        message: err?.message || 'Execution error in sandbox container.',
      });
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold mb-2">
              <Code className="w-3.5 h-3.5 text-[#32C8F5]" />
              <span>Multi-Language Isolated Execution Sandbox</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Coding Practice & Algorithmic Drills
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8] mt-1">
              Supports Python, Java, JavaScript, C++, and SQL with automated test suite evaluation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#A6B0C8]">Language:</span>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="bg-[#10162A] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-[#8065FF]"
            >
              <option value="javascript">JavaScript (ES2024)</option>
              <option value="python">Python (3.12)</option>
              <option value="java">Java (OpenJDK 21)</option>
              <option value="cpp">C++ (GCC 14)</option>
              <option value="sql">PostgreSQL / SQL</option>
            </select>
          </div>
        </div>

        {/* 2-Column Split: Problem description (5 cols) & Code editor (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Problem Catalog & Statement (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Quick selector tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {problems.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectProblem(p)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedProblem?.id === p.id
                      ? 'bg-[#8065FF] text-white shadow-glow-violet'
                      : 'bg-white/5 text-[#A6B0C8] hover:text-white hover:bg-white/10'
                  }`}
                >
                  {p.title}
                </button>
              ))}
            </div>

            {/* Problem Statement Card */}
            {selectedProblem && (
              <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#32C8F5]/10 text-[#32C8F5] font-bold border border-[#32C8F5]/20">
                    {selectedProblem.category}
                  </span>
                  <span
                    className={`text-xs font-bold ${
                      selectedProblem.difficulty === 'Easy'
                        ? 'text-[#30D6A0]'
                        : selectedProblem.difficulty === 'Medium'
                        ? 'text-[#F4B860]'
                        : 'text-[#FF647C]'
                    }`}
                  >
                    {selectedProblem.difficulty}
                  </span>
                </div>

                <h3 className="text-xl font-heading font-bold text-white">{selectedProblem.title}</h3>
                
                <p className="text-xs text-[#A6B0C8] leading-relaxed whitespace-pre-wrap">
                  {selectedProblem.description}
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-white">Examples</h4>
                  {selectedProblem.examples.map((ex, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1 text-xs font-mono">
                      <div className="text-[#A6B0C8]">Input: <span className="text-white">{ex.input}</span></div>
                      <div className="text-[#30D6A0]">Output: <span className="text-white">{ex.output}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Code Editor & Execution Console (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-xs font-mono text-[#A6B0C8]">
                  <Terminal className="w-4 h-4 text-[#32C8F5]" />
                  <span>main.{language === 'python' ? 'py' : language === 'java' ? 'java' : language === 'cpp' ? 'cpp' : language === 'sql' ? 'sql' : 'js'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleLanguageChange(language)}
                  className="text-[11px] text-[#A6B0C8] hover:text-white"
                >
                  Reset Template
                </button>
              </div>

              {/* Code Textarea Editor */}
              <div className="relative">
                <textarea
                  rows={14}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-[#0D1322] border border-white/10 rounded-2xl p-4 text-xs font-mono text-[#F5F7FF] focus:outline-none focus:border-[#8065FF] leading-relaxed resize-y selection:bg-[#8065FF]/40"
                  spellCheck={false}
                />
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <span className="text-[11px] text-[#6B7A99]">
                  Tested against automated hidden test fixtures.
                </span>

                <button
                  type="button"
                  onClick={handleRunCode}
                  disabled={running || !code.trim()}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-xs shadow-glow-violet hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {running ? (
                    <span>Executing Test Cases...</span>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Run & Test Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Execution Output Console */}
            {result && (
              <div
                className={`glass-panel rounded-3xl p-6 border transition-all space-y-3 ${
                  result.status === 'Accepted'
                    ? 'border-[#30D6A0]/40 bg-[#30D6A0]/5'
                    : 'border-red-500/40 bg-red-500/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {result.status === 'Accepted' ? (
                      <CheckCircle2 className="w-5 h-5 text-[#30D6A0]" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-[#FF647C]" />
                    )}
                    <span
                      className={`text-sm font-heading font-bold ${
                        result.status === 'Accepted' ? 'text-[#30D6A0]' : 'text-[#FF647C]'
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#A6B0C8] font-mono">
                    <span>Tests: {result.testsPassed}/{result.totalTests} Passed</span>
                    <span>Runtime: {result.runtimeMs}ms</span>
                  </div>
                </div>

                <p className="text-xs text-white leading-relaxed">{result.message}</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

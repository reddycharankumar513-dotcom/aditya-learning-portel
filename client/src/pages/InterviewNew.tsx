import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { interviewService, CreateInterviewParams } from '../services/interviewService';
import { 
  Sparkles, Play, ShieldAlert, Cpu, Video, 
  Mic, MessageSquare, AlertCircle, ArrowRight 
} from 'lucide-react';

const SUPPORTED_ROLES = [
  'Full Stack Developer',
  'Python Developer',
  'Java Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'Data Scientist',
  'ML Engineer',
  'AI Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Cybersecurity Analyst',
  'Software Engineer',
  'Custom Role',
];

export const InterviewNew: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('Full Stack Developer');
  const [customRole, setCustomRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'Fresher / Entry' | '1-2 Years' | '3+ Years'>('Fresher / Entry');
  const [difficulty, setDifficulty] = useState<'Standard' | 'Challenging' | 'Expert'>('Standard');
  const [type, setType] = useState<'Technical' | 'HR' | 'Behavioral' | 'Coding' | 'Role-based' | 'Mixed'>('Technical');
  const [mode, setMode] = useState<'Text' | 'Voice' | 'Video'>('Text');
  const [jobDescription, setJobDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const selectedRole = role === 'Custom Role' && customRole.trim() ? customRole.trim() : role;
      const res = await interviewService.createInterview({
        role: selectedRole,
        experienceLevel,
        difficulty,
        type,
        mode,
        jobDescription,
        durationMinutes,
      });

      if (res.success && res.interview?._id) {
        navigate(`/student/interviews/${res.interview._id}`);
      } else {
        throw new Error('Failed to create interview session.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to initiate AI interview session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#32C8F5]" />
            <span>Interactive Simulator</span>
          </div>
          <h1 className="text-3xl font-heading font-black text-white">
            Configure Your AI Mock Interview
          </h1>
          <p className="text-xs sm:text-sm text-[#A6B0C8]">
            Customize role requirements, difficulty, and interview mode to mirror real company hiring rounds.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-xs text-[#FF647C] flex items-center gap-3">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Configuration Form */}
        <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          
          {/* Target Engineering Role */}
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-white mb-2">
              Select Target Engineering Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#8065FF]"
            >
              {SUPPORTED_ROLES.map((r) => (
                <option key={r} value={r} className="bg-[#10162A]">
                  {r}
                </option>
              ))}
            </select>

            {role === 'Custom Role' && (
              <input
                type="text"
                placeholder="Enter specific role title (e.g., SRE / Platform Engineer)"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="mt-3 w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#8065FF]"
              />
            )}
          </div>

          {/* Experience Level & Difficulty */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-white mb-2">
                Candidate Experience Level
              </label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value as any)}
                className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#8065FF]"
              >
                <option value="Fresher / Entry">Fresher / Entry Level (College 2026)</option>
                <option value="1-2 Years">Junior (1 - 2 Years Experience)</option>
                <option value="3+ Years">Mid-Senior (3+ Years Experience)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-white mb-2">
                Interview Rigor & Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#8065FF]"
              >
                <option value="Standard">Standard (Core fundamentals & syntax)</option>
                <option value="Challenging">Challenging (Architecture & bottlenecks)</option>
                <option value="Expert">Expert (Staff-level scale & edge cases)</option>
              </select>
            </div>
          </div>

          {/* Interview Type & Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-white mb-2">
                Interview Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-[#8065FF]"
              >
                <option value="Technical">Technical & System Architecture</option>
                <option value="Behavioral">Behavioral & Cultural (STAR Method)</option>
                <option value="HR">HR & Background Fit</option>
                <option value="Coding">Coding Logic & Algorithmic Design</option>
                <option value="Mixed">Mixed Comprehensive Round</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold uppercase tracking-wider text-white mb-2">
                Interview Mode
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('Text')}
                  className={`py-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    mode === 'Text'
                      ? 'border-[#8065FF] bg-[#8065FF]/20 text-white'
                      : 'border-white/10 bg-[#10162A] text-[#A6B0C8] hover:text-white'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Text Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('Voice')}
                  className={`py-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    mode === 'Voice'
                      ? 'border-[#32C8F5] bg-[#32C8F5]/20 text-white'
                      : 'border-white/10 bg-[#10162A] text-[#A6B0C8] hover:text-white'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>Voice Mode</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('Video')}
                  className={`py-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                    mode === 'Video'
                      ? 'border-[#30D6A0] bg-[#30D6A0]/20 text-white'
                      : 'border-white/10 bg-[#10162A] text-[#A6B0C8] hover:text-white'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>Video Beta</span>
                </button>
              </div>
            </div>
          </div>

          {/* Optional Job Description */}
          <div>
            <label className="block text-xs font-heading font-bold uppercase tracking-wider text-white mb-2">
              Paste Target Job Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Paste specific job posting requirements to ground AI questions in exact company requirements..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full bg-[#10162A] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#8065FF]"
            />
          </div>

          {/* Free Credit Notice & Submit */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#A6B0C8]">
              Available Credits: <strong className="text-[#32C8F5]">{user?.credits ?? 5} Drills Remaining</strong>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-xs shadow-glow-violet hover:opacity-95 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Generating AI Questions...</span>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Begin Mock Interview</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

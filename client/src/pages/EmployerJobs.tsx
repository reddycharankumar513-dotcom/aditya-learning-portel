import React, { useState, useEffect } from 'react';
import { employerService } from '../services/employerService';
import { OpportunityItem } from '../services/careerHubService';
import { 
  Briefcase, Plus, MapPin, CheckCircle2, 
  X, RefreshCw, AlertCircle, ArrowRight 
} from 'lucide-react';

export const EmployerJobs: React.FC = () => {
  const [jobs, setJobs] = useState<OpportunityItem[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Full-time' | 'Internship' | 'Graduate Program'>('Full-time');
  const [workMode, setWorkMode] = useState<'Remote' | 'Hybrid' | 'On-site'>('Remote');
  const [location, setLocation] = useState('India / Remote');
  const [experienceLevel, setExperienceLevel] = useState('Fresher / Entry');
  const [compensation, setCompensation] = useState('₹12,00,000 - ₹16,00,000 / year');
  const [skillsInput, setSkillsInput] = useState('React, Node.js, TypeScript, MongoDB');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const res = await employerService.getJobs();
      setJobs(res.jobs || []);
    } catch (err) {
      console.warn('Error loading jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      setSubmitting(true);
      const requiredSkills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);

      const res = await employerService.createJob({
        title,
        category,
        workMode,
        location,
        experienceLevel,
        compensation,
        requiredSkills,
        description,
      });

      if (res.success && res.opportunity) {
        setJobs((prev) => [res.opportunity, ...prev]);
        setShowModal(false);
        setTitle('');
        setDescription('');
        setSuccessMessage('Job opening published successfully to the Career Hub!');
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      alert(err?.message || 'Error creating job posting.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold">
              <Briefcase className="w-3.5 h-3.5 text-[#32C8F5]" />
              <span>Job & Internship Pipeline</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Manage Company Job Postings
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8]">
              Publish verified opportunities that match directly with prepared students.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white text-xs font-bold shadow-glow-violet hover:opacity-95 transition-all flex items-center gap-2 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Opening</span>
          </button>
        </div>

        {successMessage && (
          <div className="p-4 rounded-2xl bg-[#30D6A0]/10 border border-[#30D6A0]/30 text-xs text-[#30D6A0] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Listings Grid */}
        {loading ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#8065FF] animate-spin" />
            <p className="text-xs text-[#A6B0C8]">Loading job listings...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#8065FF]/20 text-[#A68BFF] font-bold">
                      {job.category}
                    </span>
                    <span className="text-xs text-[#30D6A0] font-semibold">Active</span>
                  </div>

                  <h3 className="text-lg font-heading font-bold text-white">{job.title}</h3>
                  <div className="text-xs text-[#A6B0C8] flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{job.location} • {job.workMode}</span>
                  </div>

                  <p className="text-xs text-[#A6B0C8] line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {job.requiredSkills.map((sk, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <span className="text-[#A6B0C8]">Compensation: <strong className="text-white">{job.compensation}</strong></span>
                  <span className="text-[10px] text-[#32C8F5]">Verified Listing</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Job Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-5 right-5 p-2 rounded-xl text-[#A6B0C8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-heading font-bold text-white mb-4">
                Publish New Tech Opportunity
              </h3>

              <form onSubmit={handleCreateJob} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[#A6B0C8] font-bold mb-1">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Full Stack Engineer (React/Node)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#A6B0C8] font-bold mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                      className="w-full bg-[#10162A] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Internship">Internship</option>
                      <option value="Graduate Program">Graduate Program</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#A6B0C8] font-bold mb-1">Work Mode</label>
                    <select
                      value={workMode}
                      onChange={(e) => setWorkMode(e.target.value as any)}
                      className="w-full bg-[#10162A] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none"
                    >
                      <option value="Remote">Remote</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#A6B0C8] font-bold mb-1">Required Skills (Comma separated)</label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A6B0C8] font-bold mb-1">Compensation Range</label>
                  <input
                    type="text"
                    value={compensation}
                    onChange={(e) => setCompensation(e.target.value)}
                    className="w-full bg-[#10162A] border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div>
                  <label className="block text-[#A6B0C8] font-bold mb-1">Job Description</label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe role responsibilities, tech stack, and ideal candidate profile..."
                    className="w-full bg-[#10162A] border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 rounded-xl bg-[#8065FF] text-white font-bold shadow-glow-violet"
                  >
                    {submitting ? 'Publishing...' : 'Publish Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

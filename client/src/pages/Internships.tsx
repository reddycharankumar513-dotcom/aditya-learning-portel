import React, { useState, useEffect } from 'react';
import { internshipService } from '../services/internshipService';
import { Internship, InternshipApplication } from '../types';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Briefcase, Calendar, MapPin, CheckCircle2, 
  Clock, ArrowRight, ShieldCheck, AlertCircle, RefreshCw 
} from 'lucide-react';

export const Internships: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [internships, setInternships] = useState<Internship[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Application Modal state
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await internshipService.getInternships();
      setInternships(res.internships);

      if (isAuthenticated) {
        try {
          const appsRes = await internshipService.getMyApplications();
          setAppliedIds(appsRes.applications.map((a) => (typeof a.internshipId === 'string' ? a.internshipId : (a.internshipId as any)?._id)));
        } catch (e) {
          console.warn('Could not load user applications:', e);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Could not load internship opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenApply = (internship: Internship) => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent('/internships')}`);
      return;
    }
    setSelectedInternship(internship);
    setResumeUrl('');
    setNotes('');
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInternship) return;

    try {
      setSubmitting(true);
      await internshipService.apply(selectedInternship._id, {
        resumeUrl: resumeUrl || undefined,
        notes: notes || undefined,
      });

      setAppliedIds((prev) => [...prev, selectedInternship._id]);
      setSelectedInternship(null);
      alert('Your technical application has been submitted successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200">
            Practical Opportunities
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Technical Internships &amp; Apprenticeships
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Gain verified engineering experience working on structured project deliverables. 
            All opportunities require relevant curriculum milestones and code review evaluations.
          </p>
        </div>

        {/* Informational Transparency Alert */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-start gap-3 shadow-soft max-w-4xl mx-auto">
          <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600 leading-relaxed">
            <strong>Honest Listings Policy:</strong> ADITYA presents verified technical projects and active partner apprentice opportunities. We never fabricate compensation figures or offer unverified placement guarantees.
          </p>
        </div>

        {/* Listings Stream */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500">Loading active opportunities...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-rose-200 text-rose-700 max-w-xl mx-auto space-y-3">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold">Could not load opportunities</h3>
            <p className="text-xs text-slate-600">{error}</p>
          </div>
        ) : internships.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft max-w-lg mx-auto space-y-3">
            <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No active postings right now</h3>
            <p className="text-xs text-slate-500">
              New project apprentice cycles are posted regularly. In the meantime, advance your course modules and build capstone projects on your dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {internships.map((item) => {
              const hasApplied = appliedIds.includes(item._id);

              return (
                <div
                  key={item._id}
                  className="rounded-3xl bg-white border border-slate-200 shadow-soft hover:shadow-card transition-all p-7 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                      <span className="font-semibold px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 border border-brand-100">
                        {item.type}
                      </span>
                      {hasApplied && (
                        <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>

                    <p className="text-sm text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 py-3 px-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-violet-600" />
                        <span>Duration: {item.duration || '8-12 Weeks'}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-brand-600" />
                        <span>{item.location || 'Remote / Hybrid'}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-slate-500 block mb-1.5">Required Skills:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.skills?.map((s, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600">
                      <strong>Eligibility:</strong> {item.eligibility}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {item.deadline ? `Deadline: ${item.deadline}` : 'Rolling evaluation'}
                    </span>

                    {hasApplied ? (
                      <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl">
                        Application Under Review
                      </span>
                    ) : (
                      <button
                        onClick={() => handleOpenApply(item)}
                        className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center gap-1.5"
                      >
                        <span>Apply Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Application Modal */}
        {selectedInternship && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Apply for Opportunity</h3>
              <p className="text-xs font-semibold text-brand-600 mb-4">{selectedInternship.title}</p>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Portfolio / GitHub / Resume Link
                  </label>
                  <input
                    type="url"
                    required
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                    placeholder="https://github.com/your-username or portfolio URL"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Provide a valid URL to your GitHub profile, project demos, or hosted resume.
                  </p>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Technical Statement / Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Describe relevant course modules completed, technical frameworks used, and project goals..."
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedInternship(null)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Application'}
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

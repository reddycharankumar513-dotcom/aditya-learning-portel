import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { adminService } from '../services/adminService';
import { Internship, InternshipApplication } from '../types';
import { 
  Briefcase, Plus, Trash2, CheckCircle2, 
  ExternalLink, Clock, Users, RefreshCw, AlertCircle 
} from 'lucide-react';

export const AdminInternships: React.FC = () => {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [activeTab, setActiveTab] = useState<'listings' | 'applications'>('listings');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New Internship state
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'Technical Internship' | 'Apprenticeship' | 'Research Fellow' | 'Training Program'>('Technical Internship');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [duration, setDuration] = useState('8-12 Weeks');
  const [location, setLocation] = useState('Remote');
  const [deadline, setDeadline] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [intRes, appRes] = await Promise.all([
        adminService.getInternships(),
        adminService.getApplications(),
      ]);
      setInternships(intRes.internships);
      setApplications(appRes.applications);
    } catch (err) {
      console.warn('Failed to load admin internship data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      setSubmitting(true);
      const skills = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);

      await adminService.createInternship({
        title,
        type,
        description,
        skills,
        eligibility: eligibility || 'Enrolled in an ADITYA technical track',
        duration,
        location,
        deadline: deadline || 'Rolling',
        isPublished: true,
      });

      setShowModal(false);
      resetForm();
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create internship');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setType('Technical Internship');
    setDescription('');
    setSkillsInput('');
    setEligibility('');
    setDuration('8-12 Weeks');
    setLocation('Remote');
    setDeadline('');
  };

  const handleDeleteInternship = async (id: string, name: string) => {
    if (!window.confirm(`Delete opportunity "${name}"?`)) return;
    try {
      await adminService.deleteInternship(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  const handleUpdateApplicationStatus = async (appId: string, status: string) => {
    try {
      await adminService.updateApplicationStatus(appId, status);
      setApplications((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: status as any } : a))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update application');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manage Internships &amp; Applications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Publish technical apprentice programs and evaluate candidate portfolio submissions.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Post Opportunity</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('listings')}
            className={`pb-3 px-4 text-xs font-bold transition-all relative ${
              activeTab === 'listings'
                ? 'text-brand-600 border-b-2 border-brand-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Active Postings ({internships.length})
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 px-4 text-xs font-bold transition-all relative ${
              activeTab === 'applications'
                ? 'text-brand-600 border-b-2 border-brand-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Candidate Submissions ({applications.length})
          </button>
        </div>

        {activeTab === 'listings' ? (
          /* Listings Table */
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft">
            {loading ? (
              <div className="py-12 flex justify-center">
                <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="pb-3 px-3">Title &amp; Type</th>
                      <th className="pb-3 px-3">Location &amp; Duration</th>
                      <th className="pb-3 px-3">Skills</th>
                      <th className="pb-3 px-3">Deadline</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {internships.map((item) => (
                      <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-bold block text-slate-900">{item.title}</span>
                          <span className="text-brand-600 text-[11px] font-medium">{item.type}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span>{item.location}</span>
                          <span className="text-slate-400 block">{item.duration}</span>
                        </td>
                        <td className="py-3 px-3 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {item.skills?.map((s, idx) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px]">
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-slate-500">{item.deadline || 'Rolling'}</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteInternship(item._id, item.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete listing"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          /* Applications Table */
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft">
            {applications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No student applications received yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="pb-3 px-3">Candidate</th>
                      <th className="pb-3 px-3">Opportunity</th>
                      <th className="pb-3 px-3">Portfolio / Resume</th>
                      <th className="pb-3 px-3">Date Applied</th>
                      <th className="pb-3 px-3">Review Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {applications.map((app) => (
                      <tr key={app._id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-3">
                          <span className="font-bold block text-slate-900">{app.user?.name || 'Applicant'}</span>
                          <span className="text-slate-400">{app.user?.email || 'Registered Student'}</span>
                        </td>
                        <td className="py-3 px-3 font-semibold text-slate-800">
                          {app.internship?.title || 'Technical Role'}
                        </td>
                        <td className="py-3 px-3">
                          {app.resumeUrl ? (
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-brand-600 hover:underline flex items-center gap-1 font-semibold"
                            >
                              <span>View Link</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-400">Profile Referenced</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-slate-500">
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-3">
                          <select
                            value={app.status}
                            onChange={(e) => handleUpdateApplicationStatus(app._id, e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
                          >
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="Shortlisted">Shortlisted</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Declined">Declined</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Post Internship Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Create Opportunity Listing</h3>
              <p className="text-xs text-slate-500 mb-5">Publish an apprentice or project opening for platform students.</p>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AI Systems Apprentice"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category Type</label>
                    <select
                      value={type}
                      onChange={(e: any) => setType(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="Technical Internship">Technical Internship</option>
                      <option value="Apprenticeship">Apprenticeship</option>
                      <option value="Research Fellow">Research Fellow</option>
                      <option value="Training Program">Training Program</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="8-12 Weeks"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Remote / Hybrid"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Application Deadline</label>
                    <input
                      type="text"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      placeholder="e.g. May 31, 2026 or Rolling"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Required Skills (comma separated)</label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="e.g. Python, PyTorch, FastApi, Docker"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Eligibility Criteria</label>
                  <input
                    type="text"
                    value={eligibility}
                    onChange={(e) => setEligibility(e.target.value)}
                    placeholder="Completed ML Fundamentals or equivalent project demo"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Responsibilities, project deliverables, and mentorship details..."
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Publish Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

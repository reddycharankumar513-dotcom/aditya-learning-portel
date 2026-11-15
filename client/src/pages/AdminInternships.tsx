import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService } from '../services/adminService';
import { 
  Briefcase, Plus, Trash2, CheckCircle2, 
  ExternalLink, Clock, Users, RefreshCw, AlertCircle,
  Search, Building, MapPin, Calendar, CheckSquare, XCircle,
  Filter, Tag
} from 'lucide-react';

export const AdminInternships: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'listings' | 'applications'>('listings');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New Opportunity Form State
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [type, setType] = useState('Technical Internship');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [eligibility, setEligibility] = useState('');
  const [duration, setDuration] = useState('8-12 Weeks');
  const [location, setLocation] = useState('Remote');
  const [stipend, setStipend] = useState('₹15,000 - ₹25,000 / month');
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const [oppRes, appRes] = await Promise.allSettled([
        adminService.getOpportunities(),
        adminService.getApplications(),
      ]);

      if (oppRes.status === 'fulfilled' && oppRes.value?.opportunities) {
        setOpportunities(oppRes.value.opportunities);
      }
      if (appRes.status === 'fulfilled' && appRes.value?.applications) {
        setApplications(appRes.value.applications);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      setSubmitting(true);
      setStatusMessage(null);
      setErrorMessage(null);

      const skills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await adminService.createOpportunity({
        title,
        company: company || 'Learnova Partner Network',
        type,
        description,
        skills: skills.length ? skills : ['Problem Solving', 'Data Structures'],
        eligibility: eligibility || 'Enrolled in an engineering or computer science track',
        duration,
        location,
        stipend,
        deadline: deadline || 'Rolling',
        status: 'open',
      });

      setStatusMessage(`Opportunity "${title}" published successfully.`);
      setShowModal(false);
      resetForm();
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to create opportunity');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setCompany('');
    setType('Technical Internship');
    setDescription('');
    setSkillsInput('');
    setEligibility('');
    setDuration('8-12 Weeks');
    setLocation('Remote');
    setStipend('₹15,000 - ₹25,000 / month');
    setDeadline('');
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await adminService.updateOpportunityStatus(id, newStatus);
      setStatusMessage(`Opportunity status updated to ${newStatus}.`);
      loadData();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update opportunity status');
    }
  };

  const filteredOpportunities = opportunities.filter((item) => {
    const matchesSearch =
      (item.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.company || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.location || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const activeCount = opportunities.filter((o) => o.status === 'open' || o.isPublished).length;

  return (
    <AdminLayout activeTab="opportunities">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-5 h-5 text-[#8065FF]" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Opportunities &amp; Job Placement Hub
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Manage internships, apprentice tracks, partner hiring requisitions, and candidate applications.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-[#151D35] border border-[#202947] text-xs font-semibold text-slate-200 hover:bg-[#1E294B] flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white font-bold text-xs shadow-lg shadow-[#8065FF]/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Post Opportunity</span>
            </button>
          </div>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Top Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl p-4">
            <span className="text-slate-400 text-[11px] font-semibold uppercase block">Total Listings</span>
            <div className="text-2xl font-black text-white mt-1">{opportunities.length}</div>
          </div>
          <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl p-4">
            <span className="text-slate-400 text-[11px] font-semibold uppercase block">Active &amp; Open Requisitions</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{activeCount}</div>
          </div>
          <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl p-4">
            <span className="text-slate-400 text-[11px] font-semibold uppercase block">Student Applications Logged</span>
            <div className="text-2xl font-black text-[#8065FF] mt-1">{applications.length}</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-[#202947] pb-3">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'listings'
                ? 'bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white shadow-lg shadow-[#8065FF]/20'
                : 'text-slate-400 hover:text-white hover:bg-[#151D35]'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Opportunity Listings ({opportunities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'applications'
                ? 'bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white shadow-lg shadow-[#8065FF]/20'
                : 'text-slate-400 hover:text-white hover:bg-[#151D35]'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Applications Queue ({applications.length})</span>
          </button>
        </div>

        {/* TAB 1: OPPORTUNITY LISTINGS */}
        {activeTab === 'listings' && (
          <div className="space-y-6">
            
            {/* Filter Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by role, company, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#10162A] border border-[#202947] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1">
                {['all', 'Technical Internship', 'Full-Time Job', 'Apprenticeship', 'Research Fellow'].map((typeKey) => (
                  <button
                    key={typeKey}
                    onClick={() => setTypeFilter(typeKey)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      typeFilter === typeKey
                        ? 'bg-[#8065FF] text-white'
                        : 'bg-[#10162A] text-slate-400 hover:text-white border border-[#202947]'
                    }`}
                  >
                    {typeKey === 'all' ? 'All Formats' : typeKey}
                  </button>
                ))}
              </div>
            </div>

            {/* Opportunities Table */}
            <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#080B18] text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Opportunity</th>
                      <th className="py-3.5 px-4">Organization</th>
                      <th className="py-3.5 px-4">Type &amp; Duration</th>
                      <th className="py-3.5 px-4">Location &amp; Stipend</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202947]/50 text-slate-200">
                    {filteredOpportunities.length > 0 ? (
                      filteredOpportunities.map((item) => (
                        <tr key={item._id || item.id} className="hover:bg-[#151D35]/50 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white text-sm">{item.title}</div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {item.skills?.slice(0, 3).map((sk: string, idx: number) => (
                                <span key={idx} className="px-2 py-0.5 rounded bg-[#151D35] text-slate-300 text-[10px] border border-[#202947]">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                              <Building className="w-3.5 h-3.5 text-[#8065FF]" />
                              <span>{item.company || 'Learnova Partner'}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-300">{item.type}</div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{item.duration || 'Flexible'}</span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1 text-slate-300">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              <span>{item.location || 'Remote'}</span>
                            </div>
                            <div className="text-[11px] text-emerald-400 mt-0.5">
                              {item.stipend || 'Competitive'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              value={item.status || 'open'}
                              onChange={(e) => handleUpdateStatus(item._id || item.id, e.target.value)}
                              className="bg-[#080B18] border border-[#202947] rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-200 focus:outline-none focus:border-[#8065FF]"
                            >
                              <option value="open">Open (Active)</option>
                              <option value="closed">Closed</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <span className="text-[11px] text-slate-500">
                              Deadline: {item.deadline || 'Rolling'}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-500">
                          No opportunities found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: APPLICATIONS QUEUE */}
        {activeTab === 'applications' && (
          <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#080B18] text-slate-400 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Candidate</th>
                    <th className="py-3.5 px-4">Target Role</th>
                    <th className="py-3.5 px-4">College / Degree</th>
                    <th className="py-3.5 px-4">Applied Date</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Portfolio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#202947]/50 text-slate-200">
                  {applications.length > 0 ? (
                    applications.map((app) => (
                      <tr key={app._id} className="hover:bg-[#151D35]/50 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white">{app.student?.name || app.applicantName || 'Candidate'}</div>
                          <div className="text-[11px] text-slate-400">{app.student?.email || app.applicantEmail}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-200">{app.job?.title || app.internship?.title || 'Engineering Internship'}</div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {app.student?.college || 'Engineering Institute'}
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            app.status === 'shortlisted' || app.status === 'hired'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : app.status === 'rejected'
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {app.status || 'Under Review'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={`/student/portfolio`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[#8065FF] hover:underline font-semibold"
                          >
                            <span>Profile</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-500">
                        No applications currently logged in the queue.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Post Opportunity Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#10162A] border border-[#202947] rounded-3xl p-6 sm:p-8 max-w-xl w-full my-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Publish New Opportunity</h3>
                <p className="text-xs text-slate-400">Post an internship or job opening to the Learnova Career Hub.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateOpportunity} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Opportunity Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. AI / Machine Learning Research Intern"
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Team</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Learnova AI Labs"
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  >
                    <option value="Technical Internship">Technical Internship</option>
                    <option value="Full-Time Job">Full-Time Job</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                    <option value="Research Fellow">Research Fellow</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote / Bengaluru"
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 3 Months"
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Stipend / CTC</label>
                  <input
                    type="text"
                    value={stipend}
                    onChange={(e) => setStipend(e.target.value)}
                    placeholder="e.g. ₹20,000 / month"
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Application Deadline</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="e.g. Rolling or 2026-12-31"
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Required Skills (Comma separated)
                </label>
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="Python, PyTorch, React, Node.js, Fast API"
                  className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Candidate Eligibility Criteria
                </label>
                <input
                  type="text"
                  value={eligibility}
                  onChange={(e) => setEligibility(e.target.value)}
                  placeholder="e.g. Pre-final or Final Year B.Tech / M.Tech in CS/IT"
                  className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Opportunity Description &amp; Responsibilities *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe day-to-day responsibilities, mentorship provided, and project scope..."
                  className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#202947]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#151D35] hover:bg-[#1E294B] text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white text-xs font-bold shadow-lg shadow-[#8065FF]/20 disabled:opacity-50"
                >
                  {submitting ? 'Posting...' : 'Publish Opportunity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

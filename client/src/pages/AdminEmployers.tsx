import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService } from '../services/adminService';
import { 
  Building2, Search, CheckCircle2, XCircle, AlertCircle, 
  ExternalLink, ShieldCheck, RefreshCw, X 
} from 'lucide-react';

export const AdminEmployers: React.FC = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedCompany, setSelectedCompany] = useState<any | null>(null);
  const [verificationNotes, setVerificationNotes] = useState('');

  useEffect(() => {
    loadEmployers();
  }, [search, statusFilter]);

  const loadEmployers = async () => {
    try {
      setLoading(true);
      const res = await adminService.getEmployers({
        search,
        verificationStatus: statusFilter,
      });
      setCompanies(res.companies);
    } catch (err) {
      console.warn('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVerification = async (isVerified: boolean) => {
    if (!selectedCompany) return;
    try {
      await adminService.updateEmployerVerification(selectedCompany._id, isVerified, verificationNotes);
      alert(`Company verification ${isVerified ? 'approved' : 'rejected'}.`);
      setSelectedCompany(null);
      setVerificationNotes('');
      loadEmployers();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  return (
    <AdminLayout
      title="Employer Management & Verification"
      subtitle="Verify enterprise recruiters, inspect business credentials, and oversee talent acquisition"
    >
      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#151D35] border border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A6B0C8] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search company by name, email, or industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-[#A6B0C8] focus:outline-none focus:border-[#8065FF]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#10162A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
          >
            <option value="all">All Verification States</option>
            <option value="verified">Verified Only</option>
            <option value="pending">Pending Verification</option>
          </select>

          <button
            onClick={loadEmployers}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A6B0C8] hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Employers Table */}
      <div className="rounded-2xl bg-[#151D35] border border-white/10 overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#10162A] border-b border-white/10 text-[#A6B0C8] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Company Profile</th>
                <th className="px-6 py-4">Recruiter / Contact</th>
                <th className="px-6 py-4">Industry & Website</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Registered</th>
                <th className="px-6 py-4 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {companies.length > 0 ? (
                companies.map((comp) => (
                  <tr key={comp._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-white text-sm">{comp.companyName}</p>
                        <p className="text-[11px] text-[#A6B0C8]">{comp.businessEmail}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#F5F7FF]">
                      <p>{comp.recruiterName || 'Talent Lead'}</p>
                      <p className="text-[10px] text-[#A6B0C8]">{comp.designation || 'Recruiter'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#A68BFF] block">{comp.industry || 'Technology'}</span>
                      {comp.website && (
                        <a
                          href={comp.website.startsWith('http') ? comp.website : `https://${comp.website}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-[#32C8F5] hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>{comp.website}</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {comp.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-[#30D6A0] border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-[#F4B860] border border-amber-500/20">
                          <AlertCircle className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-mono text-[11px] text-[#A6B0C8]">
                      {new Date(comp.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCompany(comp)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                          comp.isVerified
                            ? 'bg-white/5 hover:bg-white/10 text-[#A6B0C8]'
                            : 'bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white shadow-sm'
                        }`}
                      >
                        {comp.isVerified ? 'Edit Status' : 'Review & Verify'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#A6B0C8]">
                    No companies found matching filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Review Modal */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Review Enterprise Verification</h3>
              <button onClick={() => setSelectedCompany(null)} className="text-[#A6B0C8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-white/5 space-y-2 text-xs">
              <p><strong className="text-white">Company:</strong> {selectedCompany.companyName}</p>
              <p><strong className="text-white">Business Email:</strong> {selectedCompany.businessEmail}</p>
              <p><strong className="text-white">Website:</strong> {selectedCompany.website || 'N/A'}</p>
              <p><strong className="text-white">Industry:</strong> {selectedCompany.industry || 'Technology'}</p>
              <p><strong className="text-white">Overview:</strong> {selectedCompany.description || 'No description provided.'}</p>
            </div>

            <div>
              <label className="text-xs text-[#A6B0C8] block mb-1">Audit Notes / Verification Comments</label>
              <textarea
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Verified via official corporate domain, GST/CIN verification, etc."
                rows={3}
                className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handleUpdateVerification(false)}
                className="px-4 py-2 rounded-xl bg-red-500/10 text-[#FF647C] hover:bg-red-500/20 text-xs font-bold"
              >
                Reject / Revoke
              </button>
              <button
                onClick={() => handleUpdateVerification(true)}
                className="px-4 py-2 rounded-xl bg-[#30D6A0] text-black font-bold text-xs"
              >
                Approve Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService } from '../services/adminService';
import { User } from '../types';
import { 
  Users, Search, Filter, ShieldAlert, ShieldCheck, 
  Coins, Sparkles, ChevronRight, AlertCircle, RefreshCw, X
} from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [students, setStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selected Student for Detail / Action Modals
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [actionModal, setActionModal] = useState<'suspend' | 'credits' | 'detail' | null>(null);

  // Form states
  const [suspensionReason, setSuspensionReason] = useState('');
  const [creditAmount, setCreditAmount] = useState(5);
  const [creditReason, setCreditReason] = useState('');
  const [creditType, setCreditType] = useState<'grant' | 'deduct'>('grant');

  useEffect(() => {
    loadStudents();
  }, [search, planFilter, statusFilter, page]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const res = await adminService.getStudents({
        search,
        plan: planFilter,
        status: statusFilter,
        page: page.toString(),
      });
      setStudents(res.students);
      setTotalPages(res.pagination.pages || 1);
    } catch (err) {
      console.warn('Failed to load students:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (student: User) => {
    const isSuspending = !student.isSuspended;
    try {
      await adminService.updateStudentStatus(student._id, isSuspending, suspensionReason);
      alert(`Student account ${isSuspending ? 'suspended' : 'reactivated'}.`);
      setActionModal(null);
      setSuspensionReason('');
      loadStudents();
    } catch (err: any) {
      alert(err.message || 'Action failed');
    }
  };

  const handleAdjustCredits = async () => {
    if (!selectedStudent) return;
    try {
      await adminService.adjustStudentCredits(selectedStudent._id, creditAmount, creditReason, creditType);
      alert(`Successfully updated credits.`);
      setActionModal(null);
      setCreditReason('');
      loadStudents();
    } catch (err: any) {
      alert(err.message || 'Credit adjustment failed');
    }
  };

  const openStudentDetail = async (student: User) => {
    try {
      const res = await adminService.getStudentById(student._id);
      setSelectedStudent(res);
      setActionModal('detail');
    } catch (err) {
      alert('Could not fetch student details.');
    }
  };

  return (
    <AdminLayout
      title="Student Directory & Account Controls"
      subtitle="Search candidate profiles, audit learning telemetry, and manage credit allocations"
    >
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-[#151D35] border border-white/10">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#A6B0C8] absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search student by name, email, or college..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-[#A6B0C8] focus:outline-none focus:border-[#8065FF]"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            value={planFilter}
            onChange={(e) => {
              setPlanFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#10162A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
          >
            <option value="all">All Plans</option>
            <option value="FREE">Free Explorer</option>
            <option value="STARTER">Starter</option>
            <option value="PRO">Career Pro</option>
            <option value="PREMIUM">Executive Elite</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="bg-[#10162A] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>

          <button
            onClick={loadStudents}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A6B0C8] hover:text-white"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="rounded-2xl bg-[#151D35] border border-white/10 overflow-hidden shadow-lg shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#10162A] border-b border-white/10 text-[#A6B0C8] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-4">Student Profile</th>
                <th className="px-6 py-4">College & Degree</th>
                <th className="px-6 py-4">Tier Plan</th>
                <th className="px-6 py-4">AI Credits</th>
                <th className="px-6 py-4">Readiness</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.length > 0 ? (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-bold text-white text-sm">{student.name}</p>
                        <p className="text-[11px] text-[#A6B0C8]">{student.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#F5F7FF]">
                      <p className="truncate max-w-[180px]">{student.college || 'Not specified'}</p>
                      <p className="text-[10px] text-[#A6B0C8]">{student.degree || 'B.Tech / Undergraduate'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        student.plan === 'PRO' || student.plan === 'PREMIUM'
                          ? 'bg-[#8065FF]/20 text-[#8065FF] border border-[#8065FF]/30'
                          : 'bg-white/10 text-slate-300'
                      }`}>
                        {student.plan || 'FREE'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-[#32C8F5]">
                      {student.credits ?? 5} Available
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#30D6A0]">{student.careerReadinessScore || 78}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.isSuspended ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-500/10 text-[#FF647C] border border-red-500/20">
                          Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-[#30D6A0] border border-emerald-500/20">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setActionModal('credits');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#32C8F5] font-semibold text-[11px]"
                          title="Adjust Credits"
                        >
                          <Coins className="w-3.5 h-3.5 inline mr-1" />
                          Credits
                        </button>
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setActionModal('suspend');
                          }}
                          className={`px-2.5 py-1 rounded-lg font-semibold text-[11px] ${
                            student.isSuspended
                              ? 'bg-emerald-500/10 text-[#30D6A0] hover:bg-emerald-500/20'
                              : 'bg-red-500/10 text-[#FF647C] hover:bg-red-500/20'
                          }`}
                        >
                          {student.isSuspended ? 'Reactivate' : 'Suspend'}
                        </button>
                        <button
                          onClick={() => openStudentDetail(student)}
                          className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-[#A6B0C8] hover:text-white"
                          title="View Full Profile"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#A6B0C8]">
                    No students match the selected search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-white/10 flex items-center justify-between text-xs text-[#A6B0C8]">
            <span>Page {page} of {totalPages}</span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Credit Adjustment Modal */}
      {actionModal === 'credits' && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Adjust Student AI Credits</h3>
              <button onClick={() => setActionModal(null)} className="text-[#A6B0C8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#A6B0C8]">
              Modifying credits for <strong className="text-white">{selectedStudent.name}</strong> ({selectedStudent.email}).
            </p>
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs text-[#A6B0C8] block mb-1">Adjustment Type</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCreditType('grant')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold ${creditType === 'grant' ? 'bg-[#30D6A0] text-black font-bold' : 'bg-white/5 text-white'}`}
                  >
                    Grant (+)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCreditType('deduct')}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-semibold ${creditType === 'deduct' ? 'bg-[#FF647C] text-white font-bold' : 'bg-white/5 text-white'}`}
                  >
                    Deduct (-)
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#A6B0C8] block mb-1">Number of Credits</label>
                <input
                  type="number"
                  min={1}
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-xs text-[#A6B0C8] block mb-1">Reason for Audit Log</label>
                <input
                  type="text"
                  placeholder="e.g. Promotional grant, support reimbursement..."
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setActionModal(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-[#A6B0C8]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAdjustCredits}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-xs font-bold text-white shadow-md"
                >
                  Confirm Adjustment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Confirmation Modal */}
      {actionModal === 'suspend' && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
            <h3 className="text-base font-bold text-white">
              {selectedStudent.isSuspended ? 'Reactivate Account' : 'Suspend Account'}
            </h3>
            <p className="text-xs text-[#A6B0C8]">
              Are you sure you want to {selectedStudent.isSuspended ? 'reactivate' : 'suspend'} access for{' '}
              <strong className="text-white">{selectedStudent.name}</strong>?
            </p>

            {!selectedStudent.isSuspended && (
              <div>
                <label className="text-xs text-[#A6B0C8] block mb-1">Suspension Reason</label>
                <textarea
                  value={suspensionReason}
                  onChange={(e) => setSuspensionReason(e.target.value)}
                  placeholder="Violation of honor code, suspicious activity, etc."
                  rows={3}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-white"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setActionModal(null)} className="px-4 py-2 rounded-xl bg-white/5 text-xs text-[#A6B0C8]">
                Cancel
              </button>
              <button
                onClick={() => handleToggleStatus(selectedStudent)}
                className={`px-4 py-2 rounded-xl text-xs font-bold text-white ${
                  selectedStudent.isSuspended ? 'bg-[#30D6A0] text-black' : 'bg-[#FF647C]'
                }`}
              >
                Confirm {selectedStudent.isSuspended ? 'Reactivation' : 'Suspension'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Detail Slideout Modal */}
      {actionModal === 'detail' && selectedStudent && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-xl h-full bg-[#10162A] border-l border-white/10 p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">{selectedStudent.student?.name}</h3>
                <p className="text-xs text-[#A6B0C8]">{selectedStudent.student?.email}</p>
              </div>
              <button onClick={() => setActionModal(null)} className="text-[#A6B0C8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Overview */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5">
                <span className="text-[#A6B0C8] block">Current Plan:</span>
                <span className="font-bold text-[#8065FF] text-sm uppercase">{selectedStudent.student?.plan || 'FREE'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <span className="text-[#A6B0C8] block">AI Credits:</span>
                <span className="font-bold text-[#32C8F5] text-sm">{selectedStudent.student?.credits ?? 5}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <span className="text-[#A6B0C8] block">Readiness Score:</span>
                <span className="font-bold text-[#30D6A0] text-sm">{selectedStudent.student?.careerReadinessScore || 78}%</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5">
                <span className="text-[#A6B0C8] block">Joined:</span>
                <span className="font-mono text-white text-sm">
                  {new Date(selectedStudent.student?.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Recent Enrolled Courses */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Enrolled Courses ({selectedStudent.enrollments?.length || 0})</h4>
              <div className="space-y-2">
                {selectedStudent.enrollments?.map((enr: any) => (
                  <div key={enr._id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{enr.course?.title || 'Course'}</p>
                      <p className="text-[10px] text-[#A6B0C8]">{enr.course?.level} • {enr.progress}% Completed</p>
                    </div>
                    <span className="text-emerald-400 font-mono text-[11px]">{enr.progress}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent AI Interviews */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Recent AI Interviews ({selectedStudent.interviews?.length || 0})</h4>
              <div className="space-y-2">
                {selectedStudent.interviews?.map((int: any) => (
                  <div key={int._id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{int.targetRole}</p>
                      <p className="text-[10px] text-[#A6B0C8]">{int.category} • Score: {int.overallScore}/100</p>
                    </div>
                    <span className="text-[#32C8F5] font-bold">{int.overallScore}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

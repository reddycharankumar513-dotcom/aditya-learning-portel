import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { adminService, AdminMetrics } from '../services/adminService';
import { ContactInquiry } from '../types';
import { 
  Users, BookOpen, Briefcase, MessageSquare, 
  CheckCircle2, Clock, AlertCircle, RefreshCw, Shield 
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalUsers: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    totalApplications: 0,
    totalInquiries: 0,
  });
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [metricsRes, inqRes] = await Promise.all([
        adminService.getMetrics(),
        adminService.getInquiries(),
      ]);
      setMetrics(metricsRes.metrics);
      setInquiries(inqRes.inquiries);
    } catch (err) {
      console.warn('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: string) => {
    try {
      await adminService.updateInquiryStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((inq) => (inq._id === id ? { ...inq, status: newStatus as any } : inq))
      );
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-amber-600" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Operations &amp; Admin Dashboard
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage platform courses, student enrollments, internships, and communication inquiries.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh Metrics</span>
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Users</span>
              <Users className="w-5 h-5 text-brand-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{metrics.totalUsers}</p>
            <span className="text-xs text-slate-400 mt-1 block">{metrics.totalStudents} Active Students</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Published Courses</span>
              <BookOpen className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{metrics.totalCourses}</p>
            <span className="text-xs text-slate-400 mt-1 block">Active Syllabi</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Enrollments</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{metrics.totalEnrollments}</p>
            <span className="text-xs text-slate-400 mt-1 block">Course Registrations</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Internship Apps</span>
              <Briefcase className="w-5 h-5 text-amber-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{metrics.totalApplications}</p>
            <span className="text-xs text-slate-400 mt-1 block">Candidate Submissions</span>
          </div>
        </div>

        {/* Recent Contact Inquiries */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Submitted Contact Inquiries</h2>
              <p className="text-xs text-slate-500">Inbound requests from prospective students and partners</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              {inquiries.length} Inquiries Logged
            </span>
          </div>

          {inquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              No contact inquiries submitted yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-2">Sender</th>
                    <th className="pb-3 px-2">Category</th>
                    <th className="pb-3 px-2">Subject &amp; Message</th>
                    <th className="pb-3 px-2">Date</th>
                    <th className="pb-3 px-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {inquiries.map((inq) => (
                    <tr key={inq._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-2">
                        <span className="font-bold block text-slate-900">{inq.name}</span>
                        <span className="text-slate-400">{inq.email}</span>
                      </td>
                      <td className="py-3 px-2">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                          {inq.category}
                        </span>
                      </td>
                      <td className="py-3 px-2 max-w-xs">
                        <span className="font-bold text-slate-800 block truncate">{inq.subject}</span>
                        <p className="text-slate-500 line-clamp-1">{inq.message}</p>
                      </td>
                      <td className="py-3 px-2 text-slate-400 whitespace-nowrap">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-2">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq._id, e.target.value)}
                          className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-semibold bg-white"
                        >
                          <option value="new">New</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

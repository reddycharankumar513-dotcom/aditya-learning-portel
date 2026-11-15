import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService, DashboardStats } from '../services/adminService';
import { 
  Users, CreditCard, DollarSign, Sparkles, BookOpen, 
  Building2, ArrowUpRight, TrendingUp, RefreshCw, 
  ShieldCheck, AlertCircle, Clock
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState('30d');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [timeframe]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await adminService.getDashboardStats(timeframe);
      setStats(res.stats);
    } catch (err) {
      console.warn('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const kpis = [
    {
      label: 'Registered Students',
      value: stats?.users.totalStudents ?? 0,
      sublabel: `${stats?.users.activeStudents ?? 0} Active`,
      icon: Users,
      color: 'from-[#8065FF] to-[#6344EE]',
      link: '/admin/users',
    },
    {
      label: 'Total Revenue',
      value: `₹${(stats?.financials.totalRevenueINR ?? 0).toLocaleString()}`,
      sublabel: `${stats?.financials.successfulPayments ?? 0} Transactions`,
      icon: DollarSign,
      color: 'from-[#30D6A0] to-[#10B981]',
      link: '/admin/payments',
    },
    {
      label: 'Monthly Recurring (MRR)',
      value: `₹${(stats?.subscriptions.mrrINR ?? 0).toLocaleString()}`,
      sublabel: `${stats?.subscriptions.activeSubscriptions ?? 0} Active Subs`,
      icon: TrendingUp,
      color: 'from-[#32C8F5] to-[#0284C7]',
      link: '/admin/plans',
    },
    {
      label: 'Verified Employers',
      value: stats?.users.verifiedEmployers ?? 0,
      sublabel: `${stats?.users.totalEmployers ?? 0} Registered`,
      icon: Building2,
      color: 'from-[#A68BFF] to-[#8065FF]',
      link: '/admin/employers',
    },
    {
      label: 'AI Interviews Done',
      value: stats?.learning.interviewsCompleted ?? 0,
      sublabel: `${stats?.learning.creditsConsumed ?? 0} Credits Used`,
      icon: Sparkles,
      color: 'from-[#F4B860] to-[#D97706]',
      link: '/admin/ai',
    },
    {
      label: 'Course Enrollments',
      value: stats?.learning.totalEnrollments ?? 0,
      sublabel: `${stats?.learning.totalCourses ?? 0} Active Courses`,
      icon: BookOpen,
      color: 'from-[#EC4899] to-[#BE185D]',
      link: '/admin/courses',
    },
  ];

  return (
    <AdminLayout
      title="Platform Operations Overview"
      subtitle="Real-time business telemetry, subscription metrics, and platform health"
      actions={
        <div className="flex items-center gap-2">
          {/* Timeframe Selector */}
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="bg-[#151D35] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#8065FF]"
          >
            <option value="today">Today</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">This Year</option>
            <option value="all">All Time</option>
          </select>

          <button
            onClick={loadDashboard}
            disabled={loading}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A6B0C8] hover:text-white transition-colors"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      }
    >
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.label}
              to={kpi.link}
              className="p-5 rounded-2xl bg-[#151D35] border border-white/10 hover:border-white/20 transition-all hover:scale-[1.01] group relative overflow-hidden shadow-lg shadow-black/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#A6B0C8] uppercase tracking-wider">
                    {kpi.label}
                  </p>
                  <p className="text-2xl font-black text-white mt-1.5 font-space">
                    {kpi.value}
                  </p>
                  <p className="text-[11px] font-medium text-[#30D6A0] mt-1 flex items-center gap-1">
                    <span>{kpi.sublabel}</span>
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${kpi.color} flex items-center justify-center text-white shadow-md group-hover:rotate-6 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics & Quick Action Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Activity & Growth Breakdown */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Registration & Growth Trajectory
              </h2>
              <p className="text-xs text-[#A6B0C8]">Student vs Employer acquisition velocity</p>
            </div>
            <span className="text-xs font-mono text-[#8065FF] bg-[#8065FF]/10 px-2.5 py-1 rounded-lg border border-[#8065FF]/20">
              Live Aggregation
            </span>
          </div>

          {stats?.recentTrends && stats.recentTrends.length > 0 ? (
            <div className="space-y-3 pt-2">
              {stats.recentTrends.map((trend) => (
                <div key={trend._id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span className="text-xs font-mono text-[#F5F7FF]">{trend._id}</span>
                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-[#32C8F5] font-semibold">+{trend.students} Students</span>
                    <span className="text-[#A68BFF] font-semibold">+{trend.employers} Employers</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[#A6B0C8]">
              No registration spikes recorded in selected timeframe.
            </div>
          )}
        </div>

        {/* Right 1 Col: Quick Command Hub */}
        <div className="p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Quick Actions
          </h2>
          <p className="text-xs text-[#A6B0C8]">Administrative shortcuts</p>

          <div className="space-y-2 pt-2">
            <Link
              to="/admin/users"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors border border-white/5"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-[#8065FF]" />
                <span>Search Student Accounts</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#A6B0C8]" />
            </Link>

            <Link
              to="/admin/employers"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors border border-white/5"
            >
              <div className="flex items-center gap-2.5">
                <Building2 className="w-4 h-4 text-[#32C8F5]" />
                <span>Review Pending Employers</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#A6B0C8]" />
            </Link>

            <Link
              to="/admin/plans"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors border border-white/5"
            >
              <div className="flex items-center gap-2.5">
                <CreditCard className="w-4 h-4 text-[#30D6A0]" />
                <span>Manage Pricing & Tiers</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#A6B0C8]" />
            </Link>

            <Link
              to="/admin/ai"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors border border-white/5"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#F4B860]" />
                <span>Tune AI Scoring Rubrics</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#A6B0C8]" />
            </Link>

            <Link
              to="/admin/refunds"
              className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-white transition-colors border border-white/5"
            >
              <div className="flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#FF647C]" />
                <span>Process Customer Refunds</span>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#A6B0C8]" />
            </Link>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

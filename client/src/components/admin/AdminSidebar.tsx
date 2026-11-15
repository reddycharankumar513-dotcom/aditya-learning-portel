import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LearnovaLogo } from '../common/LearnovaLogo';
import { 
  LayoutDashboard, Users, Building2, CreditCard, ShieldAlert,
  Sparkles, BookOpen, Briefcase, FileText, Bell, MessageSquare, 
  History, Settings, ShieldCheck, ArrowLeft, LogOut
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navGroups = [
    {
      group: 'OVERVIEW',
      items: [
        { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      group: 'USER OPERATIONS',
      items: [
        { label: 'Student Directory', path: '/admin/users', icon: Users },
        { label: 'Employer Verifications', path: '/admin/employers', icon: Building2 },
      ],
    },
    {
      group: 'MONETIZATION & PLANS',
      items: [
        { label: 'Plans & Pricing', path: '/admin/plans', icon: CreditCard },
        { label: 'Payments & Revenue', path: '/admin/payments', icon: FileText },
        { label: 'Refund Management', path: '/admin/refunds', icon: ShieldAlert },
        { label: 'Subscriptions', path: '/admin/subscriptions', icon: CreditCard },
      ],
    },
    {
      group: 'AI COMMAND CENTER',
      items: [
        { label: 'AI Models & Rubrics', path: '/admin/ai', icon: Sparkles },
      ],
    },
    {
      group: 'CONTENT & ACADEMY',
      items: [
        { label: 'Courses & Lessons', path: '/admin/courses', icon: BookOpen },
        { label: 'Jobs & Internships', path: '/admin/jobs', icon: Briefcase },
      ],
    },
    {
      group: 'PLATFORM & COMMS',
      items: [
        { label: 'Website CMS', path: '/admin/content', icon: FileText },
        { label: 'Support Tickets', path: '/admin/support', icon: MessageSquare },
        { label: 'Broadcast Notifications', path: '/admin/notifications', icon: Bell },
      ],
    },
    {
      group: 'SECURITY & SETTINGS',
      items: [
        { label: 'Audit Trail Logs', path: '/admin/audit-logs', icon: History },
        { label: 'Admin Roles & RBAC', path: '/admin/roles', icon: ShieldCheck },
        { label: 'Platform Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin' || location.pathname === '/admin/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-[#10162A] border-r border-white/10 text-[#F5F7FF] flex flex-col justify-between shrink-0 h-screen sticky top-0 overflow-y-auto">
      <div>
        {/* Brand & Admin Tower Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2">
            <LearnovaLogo size="sm" />
            <span className="text-[10px] font-mono tracking-wider font-bold bg-[#8065FF]/20 text-[#8065FF] px-2 py-0.5 rounded-full border border-[#8065FF]/30">
              ADMIN TOWER
            </span>
          </Link>
        </div>

        {/* Navigation Groups */}
        <div className="p-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-[#A6B0C8]/60 tracking-wider">
                {group.group}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      active
                        ? 'bg-[#8065FF] text-white shadow-lg shadow-[#8065FF]/25 font-bold'
                        : 'text-[#A6B0C8] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-[#A6B0C8]'}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Footer Profile & Exit */}
      <div className="p-4 border-t border-white/10 bg-[#080B18]/50 space-y-3">
        <div className="flex items-center gap-2.5 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8065FF] to-[#32C8F5] flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-[#32C8F5] uppercase font-mono font-medium truncate">
              {user?.adminRole || 'Super Admin'}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <Link
            to="/student/dashboard"
            className="flex items-center gap-1.5 text-[#A6B0C8] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Student App</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 text-[#FF647C] hover:text-red-400 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

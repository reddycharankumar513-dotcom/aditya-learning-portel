import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Briefcase, Users, 
  MessageSquare, ArrowLeft, Shield 
} from 'lucide-react';

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const links = [
    { label: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Manage Courses', path: '/admin/courses', icon: BookOpen },
    { label: 'Manage Internships', path: '/admin/internships', icon: Briefcase },
    { label: 'User Directory', path: '/admin/users', icon: Users },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen p-5 flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        
        {/* Admin Brand */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm">ADITYA Admin</h2>
            <p className="text-[10px] text-amber-400 font-semibold tracking-wide uppercase">
              Operations Portal
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Return to App link */}
      <div className="pt-4 border-t border-slate-800">
        <Link
          to="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Student Dashboard</span>
        </Link>
      </div>
    </aside>
  );
};

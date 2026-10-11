import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, X, Sparkles, BookOpen, Layers, Briefcase, 
  User as UserIcon, LogOut, LayoutDashboard, Shield, ChevronDown
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Programs', path: '/programs' },
    { label: 'Courses', path: '/courses' },
    { label: 'AI Tutor', path: '/ai-tutor', highlight: true },
    { label: 'Internships', path: '/internships' },
    { label: 'Careers', path: '/careers' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 via-violet-600 to-cyan-500 flex items-center justify-center shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200">
              <span className="text-white font-black text-2xl tracking-tighter">A</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-2xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                  ADITYA
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                  AI-Ed
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide">
                Learn. Build. Innovate. Succeed.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative flex items-center gap-1.5 ${
                    active
                      ? 'text-brand-600 bg-brand-50/80 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  } ${item.highlight ? 'text-violet-700 hover:text-violet-800' : ''}`}
                >
                  {item.highlight && <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />}
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-medium text-sm transition-colors border border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-violet-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-semibold leading-tight text-slate-900 line-clamp-1">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="block text-[10px] text-brand-600 font-medium capitalize">
                      {user.role}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-slate-400" />
                        Student Dashboard
                      </Link>
                      <Link
                        to="/dashboard/my-courses"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                      >
                        <BookOpen className="w-4 h-4 text-slate-400" />
                        My Courses
                      </Link>
                      <Link
                        to="/ai-tutor"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-violet-600 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-violet-500" />
                        AI Learning Tutor
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-slate-400" />
                        Profile Settings
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 font-medium transition-colors border-t border-slate-100 mt-1"
                        >
                          <Shield className="w-4 h-4 text-amber-600" />
                          Admin Portal
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 hover:from-brand-700 hover:to-violet-700 text-white font-medium text-sm shadow-md shadow-brand-500/20 hover:shadow-brand-500/35 transition-all duration-200"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive(item.path)
                    ? 'text-brand-600 bg-brand-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <span>{item.label}</span>
                {item.highlight && <Sparkles className="w-4 h-4 text-violet-600" />}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2 bg-slate-50 rounded-xl mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700">
                    {user.role}
                  </span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Student Dashboard
                </Link>
                <Link
                  to="/dashboard/my-courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  My Courses
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm font-semibold text-amber-700 bg-amber-50"
                  >
                    Admin Portal
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-violet-600 text-white text-sm font-semibold shadow-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

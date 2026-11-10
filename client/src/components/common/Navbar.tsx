import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LearnovaLogo } from './LearnovaLogo';
import { 
  Menu, X, Sparkles, Trophy, FileText, Briefcase, 
  User as UserIcon, LogOut, LayoutDashboard, Shield, ChevronDown, CheckCircle2
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
    { label: 'Features', path: '/features' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'AI Interviews', path: '/student/interviews', highlight: true },
    { label: 'Career Assessment', path: '/student/assessments' },
    { label: 'Resume AI', path: '/student/resume' },
    { label: 'Career Hub', path: '/student/career-hub' },
    { label: 'Pricing', path: '/pricing' },
  ];

  const isActive = (path: string) => {
    if (path.startsWith('/#')) return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#080B18]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Wordmark */}
          <Link to="/" className="flex items-center gap-3 group">
            <LearnovaLogo size="md" showTagline />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1.5">
            {navLinks.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 relative flex items-center gap-1.5 ${
                    active
                      ? 'text-white bg-white/10 font-bold border border-white/10 shadow-sm'
                      : 'text-learnova-text-secondary hover:text-white hover:bg-white/[0.04]'
                  } ${item.highlight ? 'text-[#32C8F5] hover:text-[#32C8F5]' : ''}`}
                >
                  {item.highlight && <Sparkles className="w-3.5 h-3.5 text-[#32C8F5] animate-pulse" />}
                  {item.label}
                  {active && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#8065FF] to-[#32C8F5] rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Link for Employers */}
            <Link
              to="/employer/dashboard"
              className="text-xs font-medium text-[#A6B0C8] hover:text-white px-3 py-1.5 rounded-lg border border-white/5 hover:border-white/20 transition-colors"
            >
              For Employers
            </Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-learnova-bg-card hover:bg-learnova-bg-cardHover text-white font-medium text-sm transition-all border border-white/10 shadow-card-dark"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8065FF] to-[#32C8F5] text-white flex items-center justify-center font-bold text-xs uppercase shadow-glow-violet">
                    {user.name.charAt(0)}
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-semibold leading-tight text-white line-clamp-1">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="block text-[10px] text-[#30D6A0] font-medium">
                      Readiness: {user.careerReadinessScore || 78}%
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-[#A6B0C8]" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 glass-panel rounded-2xl shadow-card-dark border border-white/10 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-white/10">
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <p className="text-[11px] text-[#A6B0C8] truncate">{user.email}</p>
                      <div className="mt-2 flex items-center justify-between text-[11px] bg-white/5 px-2.5 py-1.5 rounded-lg">
                        <span className="text-[#A6B0C8]">Free AI Credits:</span>
                        <span className="font-bold text-[#32C8F5]">{user.credits ?? 5} Available</span>
                      </div>
                    </div>

                    <div className="py-1.5">
                      <Link
                        to="/student/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#F5F7FF] hover:bg-white/10 hover:text-[#32C8F5] transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#8065FF]" />
                        Student Dashboard
                      </Link>
                      <Link
                        to="/student/interviews"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#F5F7FF] hover:bg-white/10 hover:text-[#32C8F5] transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-[#32C8F5]" />
                        AI Mock Interviews
                      </Link>
                      <Link
                        to="/student/assessments"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#F5F7FF] hover:bg-white/10 hover:text-[#32C8F5] transition-colors"
                      >
                        <Trophy className="w-4 h-4 text-[#F4B860]" />
                        Skill Assessments
                      </Link>
                      <Link
                        to="/student/resume"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#F5F7FF] hover:bg-white/10 hover:text-[#32C8F5] transition-colors"
                      >
                        <FileText className="w-4 h-4 text-[#30D6A0]" />
                        Resume Analyzer
                      </Link>
                      <Link
                        to="/student/career-hub"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#F5F7FF] hover:bg-white/10 hover:text-[#32C8F5] transition-colors"
                      >
                        <Briefcase className="w-4 h-4 text-[#A68BFF]" />
                        Career Opportunities Hub
                      </Link>
                      <Link
                        to="/student/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#F5F7FF] hover:bg-white/10 hover:text-[#32C8F5] transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-[#A6B0C8]" />
                        Career Profile Settings
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#F4B860] hover:bg-white/10 font-medium transition-colors border-t border-white/10 mt-1"
                        >
                          <Shield className="w-4 h-4 text-[#F4B860]" />
                          Admin Tower
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-white/10 pt-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#FF647C] hover:bg-red-500/10 transition-colors"
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
                  className="px-4 py-2 text-xs font-semibold text-[#A6B0C8] hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] hover:opacity-90 text-white font-semibold text-xs shadow-glow-violet transition-all duration-200"
                >
                  Start Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-[#A6B0C8] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#080B18]/95 backdrop-blur-2xl border-b border-white/10 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium ${
                  isActive(item.path)
                    ? 'text-white bg-white/10 font-semibold'
                    : 'text-[#A6B0C8] hover:bg-white/5 hover:text-white'
                }`}
              >
                <span>{item.label}</span>
                {item.highlight && <Sparkles className="w-4 h-4 text-[#32C8F5]" />}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 space-y-2">
            {isAuthenticated && user ? (
              <>
                <div className="px-3 py-2 bg-white/5 rounded-xl mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{user.name}</p>
                    <p className="text-xs text-[#A6B0C8]">{user.email}</p>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#8065FF]/20 text-[#A68BFF] border border-[#8065FF]/30">
                    {user.role}
                  </span>
                </div>
                <Link
                  to="/student/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/5"
                >
                  Student Dashboard
                </Link>
                <Link
                  to="/student/interviews"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/5"
                >
                  AI Mock Interviews
                </Link>
                <Link
                  to="/student/assessments"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/5"
                >
                  Skill Assessments
                </Link>
                <Link
                  to="/student/resume"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm font-medium text-white hover:bg-white/5"
                >
                  Resume Analyzer
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-[#FF647C] hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white hover:bg-white/5"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white text-sm font-semibold shadow-glow-violet"
                >
                  Start Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

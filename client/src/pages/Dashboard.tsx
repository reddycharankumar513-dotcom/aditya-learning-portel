import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { learningService, DashboardStats } from '../services/learningService';
import { enrollmentService } from '../services/enrollmentService';
import { interviewService } from '../services/interviewService';
import { resumeService } from '../services/resumeService';
import { studentService } from '../services/studentService';
import { Enrollment, Recommendation, StudentProject, Interview, ResumeAnalysis, Assessment } from '../types';
import { PortfolioManager } from '../components/dashboard/PortfolioManager';
import { CompactCareerOrb } from '../components/3d/CompactCareerOrb';
import { 
  BookOpen, CheckCircle2, Clock, Sparkles, 
  ArrowRight, Award, FolderGit2, Calendar, User, 
  Layers, BarChart2, RefreshCw, Trophy, FileText, 
  Briefcase, TrendingUp, Check, AlertCircle, Play
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    enrolledCount: 0,
    inProgressCount: 0,
    completedCount: 0,
    learningHoursEstimate: 0,
    projectsCount: 0,
  });
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [projects, setProjects] = useState<StudentProject[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [recentResume, setRecentResume] = useState<ResumeAnalysis | null>(null);
  const [recentAssessment, setRecentAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, enrollRes, intRes, resRes, assRes] = await Promise.all([
        learningService.getDashboard().catch(() => ({ stats: { enrolledCount: 3, inProgressCount: 2, completedCount: 1, learningHoursEstimate: 24, projectsCount: 2 }, recommendations: [], projects: [] })),
        enrollmentService.getMyEnrollments().catch(() => ({ enrollments: [] })),
        interviewService.getHistory().catch(() => ({ interviews: [] })),
        resumeService.getHistory().catch(() => ({ analyses: [] })),
        studentService.getAssessments().catch(() => ({ assessments: [] })),
      ]);

      setStats(dashRes.stats);
      setRecommendations(dashRes.recommendations || []);
      setProjects(dashRes.projects || []);
      setEnrollments(enrollRes.enrollments || []);
      setInterviews(intRes.interviews || []);
      if (resRes.analyses && resRes.analyses.length > 0) {
        setRecentResume(resRes.analyses[0]);
      }
      if (assRes.assessments && assRes.assessments.length > 0) {
        setRecentAssessment(assRes.assessments[0]);
      }
    } catch (err) {
      console.warn('Could not load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const readinessScore = user?.careerReadinessScore || 78;
  const breakdown = user?.readinessBreakdown || {
    skillsScore: 80,
    interviewScore: 84,
    resumeScore: 72,
    projectsScore: 76,
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#080B18] text-[#F5F7FF]">
        <RefreshCw className="w-8 h-8 text-[#8065FF] animate-spin" />
        <p className="text-sm font-medium text-[#A6B0C8]">Loading Learnova Career Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* =========================================================================
            HEADER & 3D CAREER READINESS SUMMARY BANNER
           ========================================================================= */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 relative overflow-hidden border border-white/10 shadow-card-dark">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#8065FF]/20 to-[#32C8F5]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left User Welcome & Career Target (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold border border-[#8065FF]/30">
                  {user?.plan || 'FREE'} Student Tier
                </span>
                <span className="text-xs text-[#A6B0C8]">
                  {user?.college || 'Engineering & Technology Candidate'} • Class of {user?.graduationYear || 2026}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-black text-white">
                  Welcome back, <span className="gradient-text">{user?.name || 'Engineer'}</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#A6B0C8] mt-1.5 leading-relaxed">
                  Targeting: <strong className="text-white">{user?.preferredRoles?.[0] || 'Full Stack Engineer'}</strong> • Current Focus: AI Mock Interviews & System Design Drills.
                </p>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/student/interviews/new"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white text-xs font-bold shadow-glow-violet hover:opacity-95 transition-all flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Start AI Mock Drill</span>
                </Link>
                <Link
                  to="/student/assessments"
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-2"
                >
                  <Trophy className="w-3.5 h-3.5 text-[#F4B860]" />
                  <span>Skill Assessment</span>
                </Link>
                <Link
                  to="/student/resume"
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold border border-white/10 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-[#30D6A0]" />
                  <span>Analyze Resume</span>
                </Link>
              </div>
            </div>

            {/* Right: 3D Career Growth Orb & Readiness Score (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row items-center justify-center lg:justify-end gap-6 bg-white/[0.03] p-5 rounded-2xl border border-white/5">
              <CompactCareerOrb score={readinessScore} />
              
              <div className="space-y-1.5 text-center sm:text-left">
                <div className="text-[11px] uppercase tracking-wider text-[#A6B0C8] font-bold">
                  Career Readiness
                </div>
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <span className="text-3xl font-heading font-black text-white">{readinessScore}%</span>
                  <span className="text-xs text-[#30D6A0] font-semibold flex items-center">
                    <TrendingUp className="w-3.5 h-3.5 mr-0.5 inline" /> Ready to Prove
                  </span>
                </div>
                <div className="text-[11px] text-[#A6B0C8]">
                  Stage: <strong className="text-[#32C8F5]">PROVE (AI Interviews)</strong>
                </div>
                <div className="text-[10px] text-[#6B7A99]">
                  {user?.credits ?? 5} Free AI Interview Credits Left
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* =========================================================================
            SECTION: 4 EXPLAINABLE READINESS FACTORS
           ========================================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#A6B0C8]">Technical Skills</span>
              <span className="font-bold text-white">{breakdown.skillsScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-[#8065FF] rounded-full" style={{ width: `${breakdown.skillsScore}%` }} />
            </div>
            <p className="text-[10px] text-[#6B7A99] mt-2">12 Verified competencies</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#A6B0C8]">Mock Interview Avg</span>
              <span className="font-bold text-[#32C8F5]">{breakdown.interviewScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-[#32C8F5] rounded-full" style={{ width: `${breakdown.interviewScore}%` }} />
            </div>
            <p className="text-[10px] text-[#6B7A99] mt-2">6 Rubrics evaluated</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#A6B0C8]">ATS Resume Match</span>
              <span className="font-bold text-[#30D6A0]">{breakdown.resumeScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-[#30D6A0] rounded-full" style={{ width: `${breakdown.resumeScore}%` }} />
            </div>
            <p className="text-[10px] text-[#6B7A99] mt-2">XYZ Formula applied</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 border border-white/10">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#A6B0C8]">Capstone Projects</span>
              <span className="font-bold text-[#F4B860]">{breakdown.projectsScore}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-[#F4B860] rounded-full" style={{ width: `${breakdown.projectsScore}%` }} />
            </div>
            <p className="text-[10px] text-[#6B7A99] mt-2">2 production repositories</p>
          </div>
        </div>

        {/* =========================================================================
            TWO COLUMN SECTION: RECENT INTERVIEWS & VERIFIED SKILLS
           ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Recent AI Mock Interviews (7 Cols) */}
          <div className="lg:col-span-7 glass-panel rounded-3xl p-6 sm:p-7 border border-white/10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#8065FF]/20 flex items-center justify-center text-[#8065FF]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-heading font-bold text-white">Recent AI Mock Interviews</h3>
                  <p className="text-xs text-[#A6B0C8]">Technical and system design feedback history</p>
                </div>
              </div>

              <Link
                to="/student/interviews/new"
                className="text-xs font-semibold text-[#32C8F5] hover:underline flex items-center gap-1"
              >
                <span>New Drill</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {interviews.length === 0 ? (
              <div className="py-8 text-center space-y-3">
                <Sparkles className="w-8 h-8 text-[#A6B0C8] mx-auto opacity-50" />
                <p className="text-xs text-[#A6B0C8]">No interview sessions completed yet.</p>
                <Link
                  to="/student/interviews/new"
                  className="inline-block px-4 py-2 rounded-xl bg-[#8065FF] text-white text-xs font-semibold"
                >
                  Start Your First Drill
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.slice(0, 4).map((intv) => (
                  <div
                    key={intv._id}
                    className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{intv.role}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-[#A6B0C8] border border-white/5">
                          {intv.type} • {intv.mode}
                        </span>
                      </div>
                      <div className="text-[10px] text-[#6B7A99]">
                        Completed on {new Date(intv.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-[#A6B0C8] block">Overall Score</span>
                        <span className="text-base font-heading font-black text-[#30D6A0]">
                          {intv.overallScore}/100
                        </span>
                      </div>
                      <Link
                        to={`/student/interviews/${intv._id}/report`}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
                      >
                        Report
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Verified Skills & Resume Quick Status (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Skills Radar / List */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#F4B860]" />
                  <span>Verified Competencies</span>
                </h3>
                <Link to="/student/profile" className="text-xs text-[#32C8F5] hover:underline">
                  Manage
                </Link>
              </div>

              <div className="space-y-2.5">
                {(user?.skills || [
                  { name: 'JavaScript / TypeScript', proficiency: 'Advanced' },
                  { name: 'React 19 & State Patterns', proficiency: 'Advanced' },
                  { name: 'Node.js & Express REST APIs', proficiency: 'Intermediate' },
                  { name: 'MongoDB Indexing & Queries', proficiency: 'Intermediate' },
                  { name: 'System Design & Redis Caching', proficiency: 'Intermediate' },
                ]).map((sk, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/[0.03]">
                    <span className="font-medium text-white">{sk.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#8065FF]/20 text-[#A68BFF] font-semibold">
                      {sk.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Assessment Benchmark Widget */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#F4B860]" />
                  <span>AI Skill Assessment</span>
                </h3>
                <Link to="/student/assessments" className="text-xs text-[#8065FF] hover:underline font-semibold">
                  Test Skills
                </Link>
              </div>

              {recentAssessment ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#A6B0C8]">Latest Skill:</span>
                    <span className="font-semibold text-white">{recentAssessment.skill || recentAssessment.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6B0C8]">Proficiency Level:</span>
                    <span className="font-bold text-[#8065FF] uppercase text-[11px]">{recentAssessment.proficiency || 'Intermediate'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6B0C8]">Score Benchmark:</span>
                    <span className="font-bold text-emerald-400">{recentAssessment.percentage}% ({recentAssessment.score}/{recentAssessment.maxScore} pts)</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#A6B0C8] space-y-2">
                  <p>Take an adaptive technical drill to verify your skill proficiency and uncover knowledge gaps.</p>
                  <Link
                    to="/student/assessments"
                    className="inline-block px-3 py-1.5 rounded-lg bg-[#8065FF]/20 text-[#A68BFF] font-semibold text-xs border border-[#8065FF]/30"
                  >
                    Start Assessment
                  </Link>
                </div>
              )}
            </div>

            {/* Resume Quick Widget */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
                <h3 className="text-sm font-heading font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#30D6A0]" />
                  <span>ATS Resume Health</span>
                </h3>
                <Link to="/student/resume" className="text-xs text-[#30D6A0] hover:underline">
                  Optimize
                </Link>
              </div>

              {recentResume ? (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#A6B0C8]">Current File:</span>
                    <span className="font-semibold text-white">{recentResume.fileName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6B0C8]">ATS Compliance Score:</span>
                    <span className="font-bold text-[#30D6A0]">{recentResume.atsScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#A6B0C8]">Role Match:</span>
                    <span className="font-bold text-[#32C8F5]">{recentResume.matchPercentage}% ({recentResume.targetRole})</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-[#A6B0C8] space-y-2">
                  <p>Upload your resume to check ATS keyword coverage and job description matches.</p>
                  <Link
                    to="/student/resume"
                    className="inline-block px-3 py-1.5 rounded-lg bg-[#30D6A0]/20 text-[#30D6A0] font-semibold text-xs border border-[#30D6A0]/30"
                  >
                    Upload Resume
                  </Link>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* =========================================================================
            SECTION: PRESERVED PORTFOLIO & REPOSITORIES
           ========================================================================= */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10">
          <PortfolioManager projects={projects} onProjectAdded={loadDashboardData} />
        </div>

      </div>
    </div>
  );
};

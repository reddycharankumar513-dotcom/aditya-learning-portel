import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { learningService, DashboardStats } from '../services/learningService';
import { enrollmentService } from '../services/enrollmentService';
import { Enrollment, Recommendation, StudentProject } from '../types';
import { PortfolioManager } from '../components/dashboard/PortfolioManager';
import { RecommendedCourses } from '../components/dashboard/RecommendedCourses';
import { 
  BookOpen, CheckCircle2, Clock, Sparkles, 
  ArrowRight, Award, FolderGit2, Calendar, User, 
  Layers, BarChart2, RefreshCw 
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, enrollRes] = await Promise.all([
        learningService.getDashboard(),
        enrollmentService.getMyEnrollments(),
      ]);

      setStats(dashRes.stats);
      setRecommendations(dashRes.recommendations);
      setProjects(dashRes.projects);
      setEnrollments(enrollRes.enrollments);
    } catch (err) {
      console.warn('Could not load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const upcomingActivities = [
    {
      title: 'Neural Networks Lab: Convolutional Layers',
      due: 'Friday, 11:59 PM',
      type: 'Hands-on Lab Assignment',
      color: 'bg-brand-50 text-brand-700 border-brand-200',
    },
    {
      title: 'Algorithmic Drills: Tree Traversal Patterns',
      due: 'Sunday, 6:00 PM',
      type: 'Self-Paced Assessment',
      color: 'bg-violet-50 text-violet-700 border-violet-200',
    },
    {
      title: 'Capstone Checkpoint: Schema Design & API Tests',
      due: 'Next Week',
      type: 'Project Milestone',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
  ];

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading student learning overview...</p>
      </div>
    );
  }

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Welcome Section */}
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 via-indigo-600 to-violet-600 text-white p-8 sm:p-10 shadow-lg shadow-brand-500/15 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-brand-100 font-semibold px-2.5 py-0.5 rounded bg-white/10 border border-white/20">
              Active Learning Portal
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-sm text-brand-100 max-w-xl">
              Track your enrolled course curriculums, test your code with the AI Tutor, and build your technical portfolio.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/ai-tutor"
              className="px-5 py-2.5 rounded-xl bg-white text-brand-700 hover:bg-brand-50 font-bold text-xs shadow-sm flex items-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span>Launch AI Tutor</span>
            </Link>
            <Link
              to="/courses"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs transition-colors"
            >
              Browse Catalog
            </Link>
          </div>
        </div>

        {/* Learning Overview Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Enrolled Courses</span>
              <BookOpen className="w-5 h-5 text-brand-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.enrolledCount}</p>
            <span className="text-xs text-slate-400 mt-1 block">Active technical tracks</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">In Progress</span>
              <Clock className="w-5 h-5 text-violet-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.inProgressCount}</p>
            <span className="text-xs text-slate-400 mt-1 block">Modules underway</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Tracks</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{stats.completedCount}</p>
            <span className="text-xs text-slate-400 mt-1 block">Verified milestones</span>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-soft">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Projects Built</span>
              <FolderGit2 className="w-5 h-5 text-cyan-600" />
            </div>
            <p className="text-3xl font-black text-slate-900">{projects.length}</p>
            <span className="text-xs text-slate-400 mt-1 block">Live portfolio entries</span>
          </div>
        </div>

        {/* Section: My Enrolled Courses */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">My Enrolled Courses</h2>
              <p className="text-xs text-slate-500">Pick up exactly where you left off</p>
            </div>
            <Link
              to="/dashboard/my-courses"
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="p-10 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-700">You haven't enrolled in any courses yet</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our catalog to enroll in foundational or advanced curriculums with one click.
              </p>
              <Link
                to="/courses"
                className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-sm"
              >
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.slice(0, 3).map((enr) => {
                const c = enr.course || (enr as any).courseId;
                if (!c) return null;
                const completedCount = enr.completedModules?.length || 0;
                const totalCount = c.modules?.length || 0;
                const percent = enr.progress || (totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0);

                return (
                  <div
                    key={enr._id}
                    className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-300 hover:bg-white transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className="font-semibold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded border border-brand-100">
                          {c.category}
                        </span>
                        <span className="font-bold text-slate-700">{percent}%</span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-2">
                        {c.title}
                      </h3>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-2">
                        <div
                          className="bg-brand-600 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      <p className="text-xs text-slate-500">
                        {completedCount} of {totalCount} modules completed
                      </p>
                    </div>

                    <Link
                      to={`/courses/${c.slug}`}
                      className="w-full text-center py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>Continue Learning</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section: Recommended Learning */}
        <RecommendedCourses recommendations={recommendations} />

        {/* Section: Project Portfolio Manager */}
        <PortfolioManager projects={projects} onProjectAdded={loadDashboardData} />

        {/* Section: Upcoming Activities */}
        <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-soft space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Upcoming Activities &amp; Labs</h3>
                <p className="text-xs text-slate-500">Configured milestone targets for your curriculum tracks</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {upcomingActivities.map((act, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md font-semibold border ${act.color}`}>
                      {act.type}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{act.title}</h4>
                  </div>
                  <p className="text-slate-500">Target Completion: <strong className="text-slate-700">{act.due}</strong></p>
                </div>

                <Link
                  to="/courses"
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-brand-300 text-slate-700 hover:text-brand-600 font-semibold transition-colors shrink-0 text-center"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

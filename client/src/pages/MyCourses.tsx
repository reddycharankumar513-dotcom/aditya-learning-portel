import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentService } from '../services/enrollmentService';
import { Enrollment } from '../types';
import { BookOpen, Clock, CheckCircle2, ArrowRight, RefreshCw, Layers } from 'lucide-react';

export const MyCourses: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const res = await enrollmentService.getMyEnrollments();
      setEnrollments(res.enrollments);
    } catch (err) {
      console.warn('Failed to load my enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnrollments = enrollments.filter((enr) => {
    const isCompleted = enr.status === 'completed' || enr.progress === 100;
    if (filter === 'completed') return isCompleted;
    if (filter === 'in-progress') return !isCompleted;
    return true;
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              My Enrolled Courses
            </h1>
            <p className="text-sm text-slate-500">
              Manage your active curricula, module completions, and hands-on assignment progress.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filter === 'all' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({enrollments.length})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filter === 'in-progress' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
                filter === 'completed' ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Content Stream */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500">Loading your courses...</p>
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft max-w-md mx-auto space-y-4">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No courses match this filter</h3>
            <p className="text-xs text-slate-500">
              Browse our course directory to enroll in full-stack, AI, or data science tracks.
            </p>
            <Link
              to="/courses"
              className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-sm"
            >
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enr) => {
              const c = enr.course || (enr as any).courseId;
              if (!c) return null;

              const completedCount = enr.completedModules?.length || 0;
              const totalCount = c.modules?.length || 0;
              const percent = enr.progress || (totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0);
              const isFinished = percent === 100 || enr.status === 'completed';

              return (
                <div
                  key={enr._id}
                  className="rounded-3xl bg-white border border-slate-200 p-6 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md border border-brand-100">
                        {c.category}
                      </span>
                      {isFinished ? (
                        <span className="font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      ) : (
                        <span className="font-bold text-slate-700">{percent}%</span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{c.title}</h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {c.shortDescription || c.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isFinished ? 'bg-emerald-600' : 'bg-brand-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{completedCount} of {totalCount} modules</span>
                        <span>{percent}% Completed</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <Link
                      to={`/courses/${c.slug}`}
                      className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-brand-600 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <span>{isFinished ? 'Review Curriculum' : 'Continue Learning'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

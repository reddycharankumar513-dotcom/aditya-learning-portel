import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { Course, Enrollment } from '../types';
import { useAuth } from '../context/AuthContext';
import { CourseSyllabus } from '../components/courses/CourseSyllabus';
import { 
  Clock, BookOpen, User, CheckCircle2, 
  ArrowLeft, Sparkles, Layers, ShieldCheck, 
  Share2, Award, AlertCircle, RefreshCw 
} from 'lucide-react';

export const CourseDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadCourseData();
    }
  }, [slug, isAuthenticated]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await courseService.getCourseBySlug(slug!);
      setCourse(res.course);

      if (isAuthenticated && res.course) {
        try {
          const enrollRes = await enrollmentService.getEnrollment(res.course._id);
          setIsEnrolled(enrollRes.isEnrolled);
          setEnrollment(enrollRes.enrollment);
        } catch (e) {
          console.warn('Could not verify enrollment state:', e);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Course not found');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/courses/${slug}`)}`);
      return;
    }

    if (!course) return;

    try {
      setEnrolling(true);
      const res = await enrollmentService.enroll(course._id);
      setIsEnrolled(true);
      setEnrollment(res.enrollment);
    } catch (err: any) {
      alert(err.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading course syllabus &amp; enrollment record...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl border border-rose-200 text-center space-y-4 shadow-soft">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Course Syllabus Unavailable</h2>
        <p className="text-sm text-slate-600">{error || 'The requested course does not exist.'}</p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Courses</span>
        </Link>
      </div>
    );
  }

  const completedModulesCount = enrollment?.completedModules?.length || 0;
  const totalModulesCount = course.modules?.length || 0;
  const progressPercent = enrollment?.progress || (totalModulesCount > 0 ? Math.round((completedModulesCount / totalModulesCount) * 100) : 0);

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Back Link */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Courses</span>
        </Link>

        {/* Hero Course Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center gap-3 text-xs flex-wrap">
              <span className="font-semibold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                {course.category}
              </span>
              <span className="font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {course.difficulty} Level
              </span>
              <span className="text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {course.duration || '6 Weeks'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {course.title}
            </h1>

            <p className="text-base text-slate-600 leading-relaxed">
              {course.description}
            </p>

            {course.instructorName && (
              <div className="flex items-center gap-3 pt-2 text-xs text-slate-600">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-800">{course.instructorName}</span>
                  <span className="text-slate-500 block">{course.instructorRole || 'Lead Instructor'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Action / Enrollment Box */}
          <div className="lg:col-span-4 bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-5">
            {isEnrolled ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Your Progress</span>
                  <span className="font-bold text-emerald-600">{progressPercent}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500 text-center">
                  {completedModulesCount} of {totalModulesCount} modules completed
                </p>

                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Enrolled &bull; Access Full Curriculum Below</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <span className="text-2xl font-black text-slate-900">Enrolling Available</span>
                  <p className="text-xs text-slate-500">Access video lectures, hands-on labs &amp; AI tutoring</p>
                </div>

                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className="w-full py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {enrolling ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <>
                      <span>Enroll in Course</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Quick AI Tutor Help shortcut */}
            <div className="pt-4 border-t border-slate-200">
              <Link
                to={`/ai-tutor?prompt=${encodeURIComponent(`I have a question about the ${course.title} course syllabus:`)}`}
                className="w-full py-2.5 rounded-xl bg-white border border-slate-200 hover:border-violet-300 text-slate-700 hover:text-violet-700 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                <span>Ask AI Tutor About This Course</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Learning Objectives & Prerequisites */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Objectives */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-soft space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-600" />
              <span>What You Will Learn</span>
            </h3>
            <ul className="space-y-2.5">
              {course.learningObjectives?.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites */}
          <div className="bg-white rounded-3xl border border-slate-200 p-7 shadow-soft space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-violet-600" />
              <span>Recommended Prerequisites</span>
            </h3>
            <ul className="space-y-2.5">
              {course.prerequisites?.length ? (
                course.prerequisites.map((pre, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-2 shrink-0" />
                    <span>{pre}</span>
                  </li>
                ))
              ) : (
                <li className="text-xs sm:text-sm text-slate-500">
                  No specialized prerequisites required. Suitable for motivated beginners!
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Detailed Curriculum Section */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Module-by-Module Curriculum</h2>
              <p className="text-xs text-slate-500">
                {isEnrolled
                  ? 'Click modules to review lessons and check off assignments as you complete them.'
                  : 'Enroll in this course to track lesson and assignment progress.'}
              </p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
              {course.modules?.length || 0} Modules
            </span>
          </div>

          <CourseSyllabus
            modules={course.modules || []}
            courseId={course._id}
            isEnrolled={isEnrolled}
            enrollment={enrollment}
            onProgressUpdated={(updated) => {
              setEnrollment(updated);
            }}
          />
        </div>

      </div>
    </div>
  );
};

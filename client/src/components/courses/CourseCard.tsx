import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Course } from '../../types';
import { 
  Clock, BookOpen, User, CheckCircle2, 
  ArrowRight, Sparkles, Layers 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { enrollmentService } from '../../services/enrollmentService';

interface CourseCardProps {
  course: Course;
  isEnrolled?: boolean;
  onEnrollSuccess?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ 
  course, 
  isEnrolled = false,
  onEnrollSuccess 
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = React.useState(false);

  const handleQuickEnroll = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(`/courses/${course.slug}`)}`);
      return;
    }

    try {
      setEnrolling(true);
      await enrollmentService.enroll(course._id);
      if (onEnrollSuccess) onEnrollSuccess();
      navigate('/dashboard/my-courses');
    } catch (err: any) {
      alert(err.message || 'Failed to enroll');
    } finally {
      setEnrolling(false);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 shadow-soft hover:shadow-card hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group overflow-hidden">
      <div className="p-6">
        {/* Category & Difficulty */}
        <div className="flex items-center justify-between text-xs mb-3.5 gap-2 flex-wrap">
          <span className="font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg border border-brand-100">
            {course.category}
          </span>
          <span className={`font-semibold px-2.5 py-0.5 rounded-md border ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
        </div>

        {/* Title */}
        <Link to={`/courses/${course.slug}`}>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2.5 line-clamp-1">
            {course.title}
          </h3>
        </Link>

        {/* Short Description */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-5 leading-relaxed">
          {course.shortDescription || course.description}
        </p>

        {/* Modules & Duration */}
        <div className="grid grid-cols-2 gap-2 py-3 px-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-5">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-brand-600" />
            <span>{course.modules?.length || 0} Modules</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-violet-600" />
            <span>{course.duration || '6 Weeks'}</span>
          </div>
        </div>

        {/* Instructor info */}
        {course.instructorName && (
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Instructor: <strong className="text-slate-700">{course.instructorName}</strong></span>
          </div>
        )}
      </div>

      {/* Card Footer Actions */}
      <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
        <Link
          to={`/courses/${course.slug}`}
          className="flex-1 text-center py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
        >
          View Syllabus
        </Link>

        {isEnrolled ? (
          <Link
            to={`/courses/${course.slug}`}
            className="flex-1 text-center py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors flex items-center justify-center gap-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Enrolled</span>
          </Link>
        ) : (
          <button
            onClick={handleQuickEnroll}
            disabled={enrolling}
            className="flex-1 text-center py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-1 disabled:opacity-50"
          >
            {enrolling ? (
              <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <>
                <span>Enroll Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

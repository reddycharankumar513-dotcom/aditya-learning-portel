import React from 'react';
import { Link } from 'react-router-dom';
import { Recommendation } from '../../types';
import { Sparkles, ArrowRight, Lightbulb, Clock, CheckCircle } from 'lucide-react';

interface RecommendedCoursesProps {
  recommendations: Recommendation[];
}

export const RecommendedCourses: React.FC<RecommendedCoursesProps> = ({ recommendations }) => {
  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-soft space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recommended Learning Paths</h3>
            <p className="text-xs text-slate-500">
              Personalized based on your declared interests, enrolled tracks, and curriculum prerequisites
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
          Advisory Suggestions
        </span>
      </div>

      {recommendations.length === 0 ? (
        <div className="p-6 text-center text-xs text-slate-500 bg-slate-50 rounded-2xl">
          Complete more modules or update your profile interests to receive deeper algorithmic recommendations.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-violet-300 hover:bg-white transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-violet-700 bg-violet-50 px-2 py-0.5 rounded border border-violet-100">
                    {rec.course.category}
                  </span>
                  <span className="font-medium text-slate-500">{rec.course.difficulty}</span>
                </div>

                <h4 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-1.5 line-clamp-1">
                  {rec.course.title}
                </h4>

                {/* Why recommended rationale badge */}
                <div className="p-2.5 rounded-xl bg-violet-50/70 border border-violet-100/80 mb-3 text-xs text-violet-900 flex items-start gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-violet-600 shrink-0 mt-0.5" />
                  <p className="line-clamp-2 leading-relaxed">
                    <strong>Why suggested:</strong> {rec.reason}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {rec.course.duration || '6 Weeks'}
                </span>
                <Link
                  to={`/courses/${rec.course.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 group-hover:text-brand-700"
                >
                  <span>Explore Track</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

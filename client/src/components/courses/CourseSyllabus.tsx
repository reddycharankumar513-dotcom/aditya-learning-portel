import React, { useState } from 'react';
import { CourseModule, Enrollment } from '../../types';
import { 
  ChevronDown, CheckCircle2, Circle, Clock, 
  BookOpen, Code, FileText, Check, Award
} from 'lucide-react';
import { enrollmentService } from '../../services/enrollmentService';

interface CourseSyllabusProps {
  modules: CourseModule[];
  courseId: string;
  isEnrolled: boolean;
  enrollment: Enrollment | null;
  onProgressUpdated: (updatedEnrollment: Enrollment) => void;
}

export const CourseSyllabus: React.FC<CourseSyllabusProps> = ({
  modules,
  courseId,
  isEnrolled,
  enrollment,
  onProgressUpdated,
}) => {
  const [openModuleIndex, setOpenModuleIndex] = useState<number>(0);
  const [updatingModuleId, setUpdatingModuleId] = useState<string | null>(null);

  const completedModuleIds = enrollment?.completedModules || [];

  const handleToggleModuleComplete = async (moduleId: string) => {
    if (!isEnrolled) return;

    try {
      setUpdatingModuleId(moduleId);
      const isCompleted = completedModuleIds.includes(moduleId);
      const res = await enrollmentService.updateProgress(courseId, moduleId, !isCompleted);
      onProgressUpdated(res.enrollment);
    } catch (err: any) {
      alert(err.message || 'Failed to update progress');
    } finally {
      setUpdatingModuleId(null);
    }
  };

  return (
    <div className="space-y-4">
      {modules.map((module, idx) => {
        const isOpen = openModuleIndex === idx;
        const isModuleCompleted = completedModuleIds.includes(module.id);
        const isUpdating = updatingModuleId === module.id;

        return (
          <div
            key={module.id || idx}
            className={`rounded-2xl border transition-all ${
              isModuleCompleted
                ? 'bg-emerald-50/40 border-emerald-200'
                : 'bg-white border-slate-200 shadow-soft'
            }`}
          >
            {/* Module Accordion Header */}
            <div
              onClick={() => setOpenModuleIndex(isOpen ? -1 : idx)}
              className="p-5 flex items-center justify-between cursor-pointer gap-4"
            >
              <div className="flex items-center gap-3.5 flex-1">
                {isEnrolled ? (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleModuleComplete(module.id);
                    }}
                    disabled={isUpdating}
                    className="p-1 rounded-full text-slate-400 hover:text-emerald-600 transition-colors"
                    title={isModuleCompleted ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {isModuleCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-300 hover:text-emerald-500" />
                    )}
                  </button>
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                    {idx + 1}
                  </div>
                )}

                <div>
                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>{module.title}</span>
                    {isModuleCompleted && (
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                        Completed
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{module.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
                <span className="hidden sm:inline flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {module.duration || '1 Week'}
                </span>
                <span className="text-slate-400 font-medium">
                  {module.lessons?.length || 0} Lessons
                </span>
                <div className={`p-1 rounded-full bg-slate-100 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>

            {/* Accordion Content */}
            {isOpen && (
              <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">{module.description}</p>

                {/* Lessons List */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Curriculum Lessons &amp; Practical Exercises:
                  </span>
                  {module.lessons?.map((lesson, lIdx) => (
                    <div
                      key={lesson.id || lIdx}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        {lesson.type === 'exercise' ? (
                          <Code className="w-4 h-4 text-brand-600" />
                        ) : lesson.type === 'reading' ? (
                          <FileText className="w-4 h-4 text-violet-600" />
                        ) : (
                          <BookOpen className="w-4 h-4 text-slate-600" />
                        )}
                        <span className="font-semibold text-slate-800">{lesson.title}</span>
                      </div>
                      <span className="text-slate-500 font-mono text-[11px]">{lesson.duration}</span>
                    </div>
                  ))}
                </div>

                {/* Assignment & Lab */}
                {module.assignment && (
                  <div className="mt-3 p-3.5 rounded-xl bg-brand-50/70 border border-brand-200/80 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-brand-900 mb-1">
                      <Code className="w-4 h-4 text-brand-700" />
                      <span>Hands-on Lab Assignment: {module.assignment.title}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">{module.assignment.instructions}</p>
                  </div>
                )}

                {/* Completion Toggle Button inside accordion for enrolled students */}
                {isEnrolled && (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleToggleModuleComplete(module.id)}
                      disabled={isUpdating}
                      className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                        isModuleCompleted
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                      }`}
                    >
                      {isModuleCompleted ? (
                        <span>Mark as Incomplete</span>
                      ) : (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Module as Completed</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

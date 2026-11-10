import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { enrollmentService } from '../services/enrollmentService';
import { Enrollment } from '../types';
import { 
  Sparkles, CheckCircle2, Circle, ArrowRight, 
  Compass, Layers, Brain, Code2, Rocket, Briefcase 
} from 'lucide-react';

export const LearningPath: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      const res = await enrollmentService.getMyEnrollments();
      setEnrollments(res.enrollments);
    } catch (e) {
      console.warn('Could not load enrollments:', e);
    } finally {
      setLoading(false);
    }
  };

  const stages = [
    {
      stage: 'Phase 1',
      title: 'Foundational Programming & Mathematics',
      description: 'Master core syntax, data structures, and computational math required for modern engineering.',
      icon: Code2,
      recommendedCourses: ['C & C++ Programming Foundations', 'Python for AI'],
      status: 'In Progress',
    },
    {
      stage: 'Phase 2',
      title: 'Full-Stack Systems & Data Engineering',
      description: 'Construct persistent architectures, RESTful APIs, and relational/NoSQL schemas.',
      icon: Layers,
      recommendedCourses: ['Full-Stack Web Development', 'SQL & Relational Database Engineering'],
      status: 'Upcoming',
    },
    {
      stage: 'Phase 3',
      title: 'Machine Learning & Neural Architectures',
      description: 'Implement supervised classifiers, deep convolutional networks, and transformer pipelines.',
      icon: Brain,
      recommendedCourses: ['Machine Learning Fundamentals', 'Deep Learning & Neural Networks'],
      status: 'Upcoming',
    },
    {
      stage: 'Phase 4',
      title: 'Applied Generative AI & Capstone Deployment',
      description: 'Build enterprise RAG agents, integrate vector databases, and deploy containerized services on cloud infrastructure.',
      icon: Rocket,
      recommendedCourses: ['Generative AI & LLM Systems', 'Cloud Computing & DevOps Fundamentals'],
      status: 'Upcoming',
    },
    {
      stage: 'Phase 5',
      title: 'Career Readiness & Technical Interview Drills',
      description: 'Polish portfolio artifacts, ace algorithmic whiteboard sessions, and apply for technical apprentice roles.',
      icon: Briefcase,
      recommendedCourses: ['Technical Interview & Coding Drills', 'Technical Resume & Portfolio Development'],
      status: 'Upcoming',
    },
  ];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200">
            Personalized Curriculum Roadmap
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Engineering Learning Path
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            A milestone-based progression guiding you from foundational syntax to production AI and full-stack deployment.
          </p>
        </div>

        {/* Milestone Timeline */}
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-7 sm:before:left-9 before:w-0.5 before:bg-slate-200 before:z-0">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div
                key={idx}
                className="relative z-10 flex items-start gap-4 sm:gap-6 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200/80 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-mono font-bold text-brand-600 uppercase tracking-widest block">
                        {stage.stage}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900">{stage.title}</h3>
                    </div>

                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
                      {stage.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed">{stage.description}</p>

                  <div className="pt-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Core Recommended Tracks:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {stage.recommendedCourses.map((c, cIdx) => (
                        <Link
                          key={cIdx}
                          to="/courses"
                          className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-brand-600 hover:border-brand-200 font-semibold transition-colors flex items-center gap-1.5"
                        >
                          <span>{c}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Guidance Box */}
        <div className="p-6 rounded-2xl bg-violet-50 border border-violet-200 text-violet-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-violet-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">Want a personalized weekly study plan?</p>
              <p className="text-xs text-violet-700">The Claude AI Tutor can tailor a schedule matching your available weekly study hours.</p>
            </div>
          </div>
          <Link
            to="/ai-tutor?prompt=Generate%20a%20personalized%208-week%20study%20schedule%20for%20me%20allocating%2010%20hours%20per%20week%20for%20Machine%20Learning%20and%20Full-Stack%20development."
            className="px-5 py-2.5 rounded-xl bg-violet-600 text-white font-bold text-xs shrink-0 shadow-sm hover:bg-violet-700 transition-colors"
          >
            Ask AI Tutor
          </Link>
        </div>

      </div>
    </div>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Cpu, Code, Compass, Wrench, Sparkles, 
  ArrowRight, CheckCircle, ShieldAlert
} from 'lucide-react';

export const AboutPreview: React.FC = () => {
  const focusAreas = [
    {
      icon: Cpu,
      title: 'Technology Education',
      color: 'from-blue-500 to-brand-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-brand-600',
      description: 'Comprehensive foundational and advanced tracks in AI, Machine Learning, Data Science, Cloud Computing, and Cybersecurity.',
      topics: ['Deep Learning', 'Neural Networks', 'Cloud Architectures', 'Information Security'],
    },
    {
      icon: Code,
      title: 'Software Development',
      color: 'from-violet-500 to-violet-700',
      bgColor: 'bg-violet-50',
      iconColor: 'text-violet-600',
      description: 'From core algorithmic foundations in C++/Java to modern full-stack web engineering with React, Node.js, and modern databases.',
      topics: ['Data Structures & Algorithms', 'React.js & TypeScript', 'Backend APIs', 'Git Workflow'],
    },
    {
      icon: Compass,
      title: 'Career Development',
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      description: 'Systematic technical interview preparation, structured resume workshops, aptitude drills, and technical assessment coaching.',
      topics: ['System Design Practice', 'Coding Round Drills', 'Resume Audits', 'Communication Skills'],
    },
    {
      icon: Wrench,
      title: 'Practical Learning',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      description: 'Real-world assignments and end-to-end portfolio projects instead of passive lectures. Code, deploy, and verify everything.',
      topics: ['Live Code Exercises', 'Portfolio Projects', 'Guided Labs', 'Debugging Walkthroughs'],
    },
    {
      icon: Sparkles,
      title: 'Personalized AI Learning',
      color: 'from-cyan-500 to-blue-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      description: 'On-demand 24/7 Claude-powered AI tutoring that adapts explanations to your skill level, provides hints, and generates targeted quizzes.',
      topics: ['Adaptive Hints', 'Code Reviews', 'Curated Study Schedules', 'Skill Gap Analysis'],
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3 py-1 rounded-full bg-brand-50 border border-brand-200">
            About The Platform
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Education That Connects Skills with Opportunities
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            ADITYA bridges the divide between theoretical textbook knowledge and the 
            practical engineering expectations of the global technology sector through applied curriculum 
            and intelligent 1-on-1 AI mentorship.
          </p>
        </div>

        {/* 5 Focus Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {focusAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <div
                key={index}
                className={`p-7 rounded-3xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-brand-200 shadow-soft hover:shadow-card transition-all duration-300 flex flex-col justify-between group ${
                  index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${area.bgColor} ${area.iconColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {area.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {area.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200/60">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                    Core Focus
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {area.topics.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner with Read More */}
        <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-brand-50 via-slate-50 to-violet-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">
                Transparent &amp; Verified Curriculums
              </p>
              <p className="text-xs text-slate-500">
                We believe in actual student project outcomes, transparent course modules, and verifiable code repositories.
              </p>
            </div>
          </div>

          <Link
            to="/about"
            className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline"
          >
            <span>Learn More About Our Philosophy</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
};

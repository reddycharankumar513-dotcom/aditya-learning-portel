import React from 'react';
import { 
  UserPlus, Compass, Sparkles, CheckSquare, 
  BarChart, Rocket 
} from 'lucide-react';

export const LearningProcess: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Create an Account',
      description: 'Sign up in seconds, specify your current background, and configure your primary technical interests.',
      icon: UserPlus,
      color: 'text-brand-600',
      bgColor: 'bg-brand-50',
    },
    {
      number: '02',
      title: 'Choose a Learning Path',
      description: 'Select an in-depth track across AI/ML, Data Science, Full-Stack Engineering, or Cloud Infrastructure.',
      icon: Compass,
      color: 'text-violet-600',
      bgColor: 'bg-violet-50',
    },
    {
      number: '03',
      title: 'Learn with AI Mentorship',
      description: 'Work through structured lessons while asking questions, debugging code, and receiving hints from the Claude AI Tutor.',
      icon: Sparkles,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      number: '04',
      title: 'Complete Practical Projects',
      description: 'Build functional portfolio artifacts and code implementations that demonstrate tangible engineering competency.',
      icon: CheckSquare,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      number: '05',
      title: 'Track Verified Progress',
      description: 'Monitor completed modules, milestone assessments, and portfolio progress live on your student dashboard.',
      icon: BarChart,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      number: '06',
      title: 'Prepare for Career Opportunities',
      description: 'Leverage technical interview drills, resume reviews, and apply for student technical internship opportunities.',
      icon: Rocket,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
  ];

  return (
    <section className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3 py-1 rounded-full bg-brand-50 border border-brand-200">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your 6-Step Path to Engineering Mastery
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            A methodical, structured workflow that turns curiosity into verified skills and job-ready technical confidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-slate-50 border border-slate-200 hover:border-brand-200 hover:bg-white hover:shadow-card transition-all duration-300 relative group"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl ${step.bgColor} ${step.color} flex items-center justify-center font-bold text-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-300 group-hover:text-brand-300 transition-colors font-mono">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                  {step.title}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

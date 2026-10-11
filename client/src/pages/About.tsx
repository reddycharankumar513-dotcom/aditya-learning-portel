import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Target, Compass, Code, Cpu, 
  CheckCircle, ArrowRight, ShieldCheck, HeartHandshake, Award
} from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Banner */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200">
            About ADITYA
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Education That Connects <span className="gradient-text">Skills with Opportunities</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            ADITYA was created to modernize technical education through practical engineering project work, 
            hands-on software development, and 24/7 AI-guided mentorship.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Core Mission</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To democratize access to world-class computer science, artificial intelligence, and software engineering 
              training. We believe that true technical mastery comes from building real systems—writing clean code, 
              benchmarking models, optimizing queries, and deploying production services.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
              <Compass className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Our Vision</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              To cultivate a global generation of confident technologists and engineers equipped with both 
              algorithmic fundamentals and state-of-the-art AI competencies, ready to tackle complex challenges 
              in high-growth technology industries.
            </p>
          </div>
        </div>

        {/* 5 Architectural Focus Areas */}
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-soft space-y-10">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Our Five Educational Pillars</h3>
            <p className="text-sm text-slate-600">
              Each curriculum on ADITYA integrates these foundational pillars to provide balanced, comprehensive training.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-600 flex items-center justify-center shrink-0 mt-1 font-bold">1</div>
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Technology Education</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rigorous immersion in Artificial Intelligence, Machine Learning, Deep Neural Networks, Data Science, Cloud Infrastructure, and Cybersecurity. Students study not only API usage, but the underlying mathematical mechanics.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0 mt-1 font-bold">2</div>
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Software Development</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Solid programming disciplines covering C++, Java, Data Structures &amp; Algorithms, followed by modern full-stack web engineering with React.js, TypeScript, Node.js, Express, and distributed databases.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-1 font-bold">3</div>
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Career Development</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Systematic technical assessment coaching, coding interview simulations, resume construction, GitHub portfolio curation, and structured communication training.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0 mt-1 font-bold">4</div>
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Practical Learning</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Guided assignments, practical code repos, and end-to-end capstone projects. Theory is validated immediately through verifiable code execution and unit testing.
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 mt-1 font-bold">5</div>
              <div>
                <h4 className="text-base font-bold text-slate-900 mb-1">Personalized AI Mentorship</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our Claude AI Tutor assists students around the clock with adaptive explanations, step-by-step hints, personalized study paths, and code review support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Integrity & Transparency Banner */}
        <div className="p-8 rounded-3xl bg-slate-100 border border-slate-200 text-slate-700 space-y-3">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-brand-600" />
            <span>Institutional Clarity &amp; Transparency Notice</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ADITYA is an independent technology education platform focused on skill building, project portfolios, and career preparation. We do not make misleading claims of university accreditation, government affiliations, or unverified placement guarantees. Completion credentials reflect verified curriculum milestone achievements.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-base shadow-lg shadow-brand-500/25 transition-all"
          >
            <span>Explore Our Curriculums</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

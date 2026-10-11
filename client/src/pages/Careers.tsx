import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, FileText, Code, CheckCircle, 
  Sparkles, ArrowRight, BookOpen, Target, Terminal 
} from 'lucide-react';

export const Careers: React.FC = () => {
  const careerTracks = [
    {
      title: 'Technical Resume & Portfolio Optimization',
      icon: FileText,
      description: 'Structured methodology to translate academic coursework and personal coding exercises into impactful bullet points with quantifiable engineering outcomes.',
      tips: [
        'Highlight GitHub commit frequency and live demo deployments',
        'Frame accomplishments with the STAR method (Situation, Task, Action, Result)',
        'Ensure ATS readability and remove unverified keyword stuffing',
      ],
      action: 'Build Portfolio',
      link: '/dashboard',
    },
    {
      title: 'Data Structures & Algorithmic Interview Drills',
      icon: Code,
      description: 'Practice high-frequency patterns: Two Pointers, Sliding Window, Monotonic Stacks, Depth-First Search, Graph Traversals, and Dynamic Programming.',
      tips: [
        'Time and space complexity derivation for every function',
        'Edge case handling: null inputs, empty collections, integer overflow',
        'Clear communicative narration during technical problem solving',
      ],
      action: 'Practice with AI Tutor',
      link: '/ai-tutor?prompt=Simulate%20a%20technical%20coding%20interview%20question%20on%20binary%20trees%20and%20guide%20me%20step%20by%20step.',
    },
    {
      title: 'System Design & Architecture Walkthroughs',
      icon: Terminal,
      description: 'Understand trade-offs between horizontal vs. vertical scaling, database sharding, caching tiers, message queues, and API rate limiting.',
      tips: [
        'Requirement scoping: Functional vs. Non-functional requirements',
        'High-level architecture diagrams and back-of-the-envelope calculations',
        'Deep-dive into bottlenecks, single points of failure, and replication models',
      ],
      action: 'Explore System Tracks',
      link: '/courses?category=Cloud+%26+Emerging+Technologies',
    },
    {
      title: 'Technical Assessment & Aptitude Preparation',
      icon: Target,
      description: 'Strengthen quantitative reasoning, logical deduction, algorithmic complexity analysis, and SQL query puzzle solving.',
      tips: [
        'Timed speed problem sets replicating online assessment environments',
        'SQL query optimization with window functions and execution plans',
        'Object-oriented design patterns and clean code principles',
      ],
      action: 'Study SQL Track',
      link: '/courses/sql-database-engineering',
    },
  ];

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200">
            Career Readiness Center
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Prepare for Engineering Opportunities
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Gain the technical fluency, portfolio artifacts, and interview confidence required 
            to successfully showcase your abilities to technology teams worldwide.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {careerTracks.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-slate-200 p-8 shadow-soft hover:shadow-card transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                      Key Recommendations:
                    </span>
                    {item.tips.map((tip, tIdx) => (
                      <div key={tIdx} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle className="w-4 h-4 text-brand-600 mt-0.5 shrink-0" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    to={item.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline"
                  >
                    <span>{item.action}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* AI Mock Interview Box */}
        <div className="rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-violet-950 p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-card">
          <div className="space-y-3 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-800/60 border border-violet-600/80 text-violet-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive AI Practice</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Simulate a Coding Interview with Claude
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Test your algorithmic explanations, explore edge cases, and ask for subtle hints just as you would with a senior engineering interviewer.
            </p>
          </div>

          <Link
            to="/ai-tutor?prompt=I%20want%20to%20simulate%20a%20front-end%20and%20back-end%20engineering%20interview.%20Ask%20me%20one%20conceptual%20question%20first."
            className="px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg shrink-0 transition-all"
          >
            Start Mock Interview Drill
          </Link>
        </div>

      </div>
    </div>
  );
};

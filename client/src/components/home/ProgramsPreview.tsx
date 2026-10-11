import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Brain, BarChart3, Code2, Cloud, Briefcase, 
  ArrowRight, Clock, Award, Tag
} from 'lucide-react';

export const ProgramsPreview: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('ai-ml');

  const categories = [
    { id: 'ai-ml', name: 'AI & Machine Learning', icon: Brain },
    { id: 'data-science', name: 'Data Science & Analytics', icon: BarChart3 },
    { id: 'software', name: 'Software Development', icon: Code2 },
    { id: 'cloud', name: 'Cloud & Emerging Tech', icon: Cloud },
    { id: 'career', name: 'Career & Professional', icon: Briefcase },
  ];

  const programsData: Record<string, Array<{
    title: string;
    description: string;
    skills: string[];
    difficulty: string;
    duration: string;
    slug: string;
  }>> = {
    'ai-ml': [
      {
        title: 'Machine Learning Fundamentals',
        description: 'Supervised, unsupervised algorithms, regression, classification, clustering, model evaluation, and scikit-learn.',
        skills: ['Python', 'Scikit-Learn', 'Math for ML', 'Feature Engineering'],
        difficulty: 'Intermediate',
        duration: '8 Weeks',
        slug: 'machine-learning-fundamentals',
      },
      {
        title: 'Deep Learning & Neural Networks',
        description: 'Build multilayer perceptrons, CNNs for computer vision, and RNNs/LSTMs using PyTorch and TensorFlow.',
        skills: ['PyTorch', 'TensorFlow', 'CNNs', 'Backpropagation'],
        difficulty: 'Advanced',
        duration: '10 Weeks',
        slug: 'deep-learning-neural-networks',
      },
      {
        title: 'Generative AI & LLM Applications',
        description: 'Prompt engineering, RAG pipelines, fine-tuning, embeddings, and building full-stack Claude & OpenAI agents.',
        skills: ['LangChain', 'Claude API', 'Vector DBs', 'RAG Architectures'],
        difficulty: 'Advanced',
        duration: '6 Weeks',
        slug: 'generative-ai-llm-applications',
      },
      {
        title: 'Natural Language Processing',
        description: 'Text preprocessing, tokenization, transformer models, sentiment classification, and semantic analysis.',
        skills: ['Transformers', 'HuggingFace', 'NLTK', 'Attention Mechanisms'],
        difficulty: 'Intermediate',
        duration: '8 Weeks',
        slug: 'natural-language-processing',
      },
    ],
    'data-science': [
      {
        title: 'Python for Data Analysis',
        description: 'Master Pandas, NumPy, statistical hypothesis testing, and automated exploratory data analysis pipelines.',
        skills: ['Pandas', 'NumPy', 'Jupyter', 'Exploratory Analysis'],
        difficulty: 'Beginner',
        duration: '6 Weeks',
        slug: 'python-data-analysis',
      },
      {
        title: 'SQL & Relational Database Engineering',
        description: 'Advanced queries, schema normalization, indexing, CTEs, window functions, and database design.',
        skills: ['PostgreSQL', 'MySQL', 'Database Design', 'Indexing'],
        difficulty: 'Beginner to Intermediate',
        duration: '6 Weeks',
        slug: 'sql-database-engineering',
      },
      {
        title: 'Data Visualization & Business Intelligence',
        description: 'Create interactive dashboards and executive metrics using Power BI, Tableau, and Seaborn.',
        skills: ['Power BI', 'Tableau', 'Seaborn', 'Storytelling with Data'],
        difficulty: 'Beginner',
        duration: '5 Weeks',
        slug: 'data-visualization-bi',
      },
    ],
    'software': [
      {
        title: 'Full-Stack Web Development',
        description: 'Build production web applications with React.js, TypeScript, Tailwind, Node.js, Express, and MongoDB.',
        skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
        difficulty: 'Intermediate',
        duration: '12 Weeks',
        slug: 'full-stack-web-development',
      },
      {
        title: 'Data Structures & Algorithms',
        description: 'Trees, graphs, dynamic programming, sorting, and algorithmic complexity for technical interview mastery.',
        skills: ['C++', 'Java', 'Complexity Analysis', 'Problem Solving'],
        difficulty: 'Intermediate to Advanced',
        duration: '10 Weeks',
        slug: 'data-structures-algorithms',
      },
      {
        title: 'Modern React & TypeScript',
        description: 'Hooks, context, state machines, component architecture, custom utilities, and API integration.',
        skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite'],
        difficulty: 'Beginner to Intermediate',
        duration: '8 Weeks',
        slug: 'modern-react-typescript',
      },
    ],
    'cloud': [
      {
        title: 'Cloud Computing & DevOps Fundamentals',
        description: 'AWS/GCP infrastructure, Docker containerization, CI/CD automated pipelines, and Kubernetes basics.',
        skills: ['Docker', 'AWS', 'GitHub Actions', 'Linux Shell'],
        difficulty: 'Intermediate',
        duration: '8 Weeks',
        slug: 'cloud-devops-fundamentals',
      },
      {
        title: 'Cybersecurity & Secure Software Engineering',
        description: 'OWASP Top 10 vulnerabilities, authentication protocols, encryption, and secure backend coding practices.',
        skills: ['Network Security', 'OWASP', 'JWT Security', 'Penetration Testing'],
        difficulty: 'Intermediate',
        duration: '7 Weeks',
        slug: 'cybersecurity-fundamentals',
      },
    ],
    'career': [
      {
        title: 'Technical Interview & Coding Drills',
        description: 'Live whiteboard problem solving, algorithmic mock interviews, and system architecture walkthroughs.',
        skills: ['LeetCode Patterns', 'System Design', 'Behavioral STAR', 'Live Coding'],
        difficulty: 'All Levels',
        duration: '4 Weeks',
        slug: 'technical-interview-drills',
      },
      {
        title: 'Tech Resume & Portfolio Engineering',
        description: 'Build an engineering portfolio that showcases real GitHub code commits and production project deployments.',
        skills: ['GitHub Showcase', 'Resume Optimization', 'LinkedIn Branding', 'Project Docs'],
        difficulty: 'All Levels',
        duration: '3 Weeks',
        slug: 'resume-portfolio-engineering',
      },
    ],
  };

  const currentPrograms = programsData[activeCategory] || [];

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3 py-1 rounded-full bg-brand-50 border border-brand-200">
              Curated Curriculums
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Specialized Learning Tracks
            </h2>
            <p className="text-base text-slate-600 max-w-xl">
              Each track is engineered from the ground up with modular syllabi, hands-on assignments, 
              and AI-driven code feedback.
            </p>
          </div>

          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700 hover:underline"
          >
            <span>View All Program Syllabi</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  active
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-500'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Programs Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentPrograms.map((prog, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-white p-6 border border-slate-200/90 shadow-soft hover:shadow-card hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-semibold px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 border border-brand-100">
                    {prog.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {prog.duration}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
                  {prog.title}
                </h3>

                <p className="text-sm text-slate-600 line-clamp-3 mb-5 leading-relaxed">
                  {prog.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {prog.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    to={`/courses/${prog.slug}`}
                    className="w-full text-center py-2.5 rounded-xl bg-slate-100 group-hover:bg-brand-600 text-slate-700 group-hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

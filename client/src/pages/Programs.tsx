import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Brain, BarChart3, Code2, Cloud, Briefcase, 
  ArrowRight, Clock, Tag, Layers, CheckCircle2 
} from 'lucide-react';

export const Programs: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'all';
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  const programs = [
    // 1. AI and Machine Learning
    {
      category: 'ai-ml',
      categoryName: 'Artificial Intelligence and Machine Learning',
      title: 'Python for AI',
      description: 'Foundational Python programming specifically tailored for machine learning, vectorized operations with NumPy, and mathematical computation.',
      icon: Brain,
      skills: ['Python 3', 'NumPy', 'OOP', 'Linear Algebra for AI'],
      difficulty: 'Beginner',
      duration: '4 Weeks',
      slug: 'python-for-ai',
    },
    {
      category: 'ai-ml',
      categoryName: 'Artificial Intelligence and Machine Learning',
      title: 'Machine Learning Fundamentals',
      description: 'Supervised, unsupervised algorithms, linear/logistic regression, decision trees, random forests, and model evaluation metrics.',
      icon: Brain,
      skills: ['Scikit-Learn', 'Feature Engineering', 'Model Evaluation', 'Regression'],
      difficulty: 'Intermediate',
      duration: '8 Weeks',
      slug: 'machine-learning-fundamentals',
    },
    {
      category: 'ai-ml',
      categoryName: 'Artificial Intelligence and Machine Learning',
      title: 'Deep Learning & Neural Networks',
      description: 'Deep neural networks, backpropagation calculus, optimization techniques, PyTorch architecture, and computational graphs.',
      icon: Brain,
      skills: ['PyTorch', 'Backpropagation', 'Optimizers', 'Tensor Operations'],
      difficulty: 'Advanced',
      duration: '8 Weeks',
      slug: 'deep-learning-neural-networks',
    },
    {
      category: 'ai-ml',
      categoryName: 'Artificial Intelligence and Machine Learning',
      title: 'Computer Vision',
      description: 'Convolutional neural networks, object detection (YOLO), image segmentation, transfer learning, and image processing with OpenCV.',
      icon: Brain,
      skills: ['CNNs', 'OpenCV', 'ResNet', 'Object Detection'],
      difficulty: 'Advanced',
      duration: '8 Weeks',
      slug: 'computer-vision',
    },
    {
      category: 'ai-ml',
      categoryName: 'Artificial Intelligence and Machine Learning',
      title: 'Natural Language Processing',
      description: 'Text preprocessing, word embeddings (Word2Vec), RNNs, sequence-to-sequence models, and modern Transformer architectures.',
      icon: Brain,
      skills: ['Transformers', 'HuggingFace', 'Tokenization', 'Attention'],
      difficulty: 'Intermediate',
      duration: '8 Weeks',
      slug: 'natural-language-processing',
    },
    {
      category: 'ai-ml',
      categoryName: 'Artificial Intelligence and Machine Learning',
      title: 'Generative AI & LLM Systems',
      description: 'Prompt engineering, Retrieval-Augmented Generation (RAG), vector databases (Chroma/Pinecone), and LLM agent orchestration.',
      icon: Brain,
      skills: ['LangChain', 'Claude API', 'Vector Databases', 'RAG Pipelines'],
      difficulty: 'Advanced',
      duration: '6 Weeks',
      slug: 'generative-ai-llm-applications',
    },

    // 2. Data Science and Analytics
    {
      category: 'data-science',
      categoryName: 'Data Science and Analytics',
      title: 'Python for Data Analysis',
      description: 'Manipulate large tabular datasets using Pandas, automate data cleaning pipelines, and perform exploratory data analysis.',
      icon: BarChart3,
      skills: ['Pandas', 'NumPy', 'Data Cleaning', 'EDA'],
      difficulty: 'Beginner',
      duration: '6 Weeks',
      slug: 'python-data-analysis',
    },
    {
      category: 'data-science',
      categoryName: 'Data Science and Analytics',
      title: 'SQL and Database Management',
      description: 'Relational data modeling, ACID properties, complex joins, window functions, indexing strategies, and database optimization.',
      icon: BarChart3,
      skills: ['PostgreSQL', 'SQL Queries', 'Window Functions', 'Schema Design'],
      difficulty: 'Beginner',
      duration: '6 Weeks',
      slug: 'sql-database-engineering',
    },
    {
      category: 'data-science',
      categoryName: 'Data Science and Analytics',
      title: 'Statistics and Probability for Data Science',
      description: 'Descriptive and inferential statistics, probability distributions, hypothesis testing, A/B testing, and regression analysis.',
      icon: BarChart3,
      skills: ['Hypothesis Testing', 'A/B Testing', 'Probability', 'Statistical Modeling'],
      difficulty: 'Intermediate',
      duration: '6 Weeks',
      slug: 'statistics-probability',
    },
    {
      category: 'data-science',
      categoryName: 'Data Science and Analytics',
      title: 'Data Visualization (Power BI & Tableau)',
      description: 'Translate raw business data into actionable executive dashboards, KPIs, and interactive charts using Power BI and Tableau.',
      icon: BarChart3,
      skills: ['Power BI', 'Tableau', 'DAX', 'Executive Reporting'],
      difficulty: 'Beginner',
      duration: '5 Weeks',
      slug: 'data-visualization-bi',
    },
    {
      category: 'data-science',
      categoryName: 'Data Science and Analytics',
      title: 'End-to-End Data Science Projects',
      description: 'Comprehensive capstone projects: data ingestion, feature store setup, model training, MLflow experiment tracking, and deployment.',
      icon: BarChart3,
      skills: ['MLflow', 'FastAPI', 'Pipeline Engineering', 'Model Deployment'],
      difficulty: 'Advanced',
      duration: '8 Weeks',
      slug: 'end-to-end-data-science',
    },

    // 3. Software Development
    {
      category: 'software',
      categoryName: 'Software Development',
      title: 'C & C++ Programming Foundations',
      description: 'Pointers, memory management, low-level data representations, object-oriented concepts, and standard template library (STL).',
      icon: Code2,
      skills: ['C++', 'STL', 'Pointers & Memory', 'OOP'],
      difficulty: 'Beginner',
      duration: '8 Weeks',
      slug: 'c-cpp-programming',
    },
    {
      category: 'software',
      categoryName: 'Software Development',
      title: 'Java Programming',
      description: 'Core Java, JVM architecture, multithreading, collections framework, exception handling, and enterprise design patterns.',
      icon: Code2,
      skills: ['Java 21', 'OOP', 'Collections', 'Multithreading'],
      difficulty: 'Beginner',
      duration: '8 Weeks',
      slug: 'java-programming',
    },
    {
      category: 'software',
      categoryName: 'Software Development',
      title: 'Data Structures and Algorithms',
      description: 'Arrays, linked lists, trees, graphs, sorting, searching, dynamic programming, and Big-O computational complexity.',
      icon: Code2,
      skills: ['Algorithms', 'Complexity Analysis', 'Graphs', 'Dynamic Programming'],
      difficulty: 'Intermediate',
      duration: '10 Weeks',
      slug: 'data-structures-algorithms',
    },
    {
      category: 'software',
      categoryName: 'Software Development',
      title: 'Full-Stack Web Development',
      description: 'End-to-end engineering with modern React, TypeScript, Tailwind CSS, Node.js, Express, and MongoDB databases.',
      icon: Code2,
      skills: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB'],
      difficulty: 'Intermediate',
      duration: '12 Weeks',
      slug: 'full-stack-web-development',
    },
    {
      category: 'software',
      categoryName: 'Software Development',
      title: 'Git & GitHub Collaboration',
      description: 'Branching models, merge conflict resolution, pull request reviews, rebasing, and open-source contribution practices.',
      icon: Code2,
      skills: ['Git', 'GitHub', 'CI/CD Basics', 'Version Control'],
      difficulty: 'Beginner',
      duration: '3 Weeks',
      slug: 'git-github-collaboration',
    },

    // 4. Cloud and Emerging Technologies
    {
      category: 'cloud',
      categoryName: 'Cloud and Emerging Technologies',
      title: 'Cloud Computing & DevOps Fundamentals',
      description: 'Cloud architectural models (AWS & GCP), Docker containers, Kubernetes fundamentals, and automated GitHub Actions workflows.',
      icon: Cloud,
      skills: ['Docker', 'AWS', 'Kubernetes', 'CI/CD Pipelines'],
      difficulty: 'Intermediate',
      duration: '8 Weeks',
      slug: 'cloud-devops-fundamentals',
    },
    {
      category: 'cloud',
      categoryName: 'Cloud and Emerging Technologies',
      title: 'Cybersecurity Fundamentals',
      description: 'Threat modeling, web application vulnerabilities (OWASP Top 10), cryptographic protocols, network auditing, and secure coding.',
      icon: Cloud,
      skills: ['Network Security', 'OWASP Top 10', 'Cryptography', 'Penetration Testing'],
      difficulty: 'Intermediate',
      duration: '7 Weeks',
      slug: 'cybersecurity-fundamentals',
    },
    {
      category: 'cloud',
      categoryName: 'Cloud and Emerging Technologies',
      title: 'API Development & Distributed Architecture',
      description: 'RESTful API design, rate limiting, token-based authentication, caching with Redis, microservices, and message brokers.',
      icon: Cloud,
      skills: ['REST APIs', 'JWT', 'Redis', 'Microservices'],
      difficulty: 'Advanced',
      duration: '6 Weeks',
      slug: 'api-development-architecture',
    },

    // 5. Career and Professional Development
    {
      category: 'career',
      categoryName: 'Career and Professional Development',
      title: 'Technical Resume & Portfolio Development',
      description: 'Craft an ATS-optimized technical resume, build high-impact GitHub READMEs, and deploy a live personal project showcase.',
      icon: Briefcase,
      skills: ['Resume Strategy', 'Portfolio Design', 'GitHub Presentation', 'LinkedIn'],
      difficulty: 'All Levels',
      duration: '3 Weeks',
      slug: 'resume-portfolio-engineering',
    },
    {
      category: 'career',
      categoryName: 'Career and Professional Development',
      title: 'Technical Interview & Coding Drills',
      description: 'Live algorithmic interview simulation, mock coding tests, whiteboard architecture design, and behavioural interview coaching.',
      icon: Briefcase,
      skills: ['Coding Rounds', 'System Design', 'Behavioral STAR', 'Aptitude Drills'],
      difficulty: 'All Levels',
      duration: '4 Weeks',
      slug: 'technical-interview-drills',
    },
  ];

  const filteredPrograms = selectedCategory === 'all'
    ? programs
    : programs.filter((p) => p.category === selectedCategory);

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200">
            Comprehensive Curriculum Directory
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Specialized Technology Programs
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Explore our curriculum paths in AI, Data Science, Software Engineering, Cloud DevOps, 
            and Career Placement Preparation.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'all'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            All Programs ({programs.length})
          </button>
          <button
            onClick={() => setSelectedCategory('ai-ml')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'ai-ml'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            AI &amp; Machine Learning
          </button>
          <button
            onClick={() => setSelectedCategory('data-science')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'data-science'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Data Science &amp; Analytics
          </button>
          <button
            onClick={() => setSelectedCategory('software')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'software'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Software Development
          </button>
          <button
            onClick={() => setSelectedCategory('cloud')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'cloud'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Cloud &amp; DevOps
          </button>
          <button
            onClick={() => setSelectedCategory('career')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === 'career'
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/25'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            Career Preparation
          </button>
        </div>

        {/* Program Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((prog, idx) => {
            const Icon = prog.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl bg-white border border-slate-200 shadow-soft hover:shadow-card hover:border-brand-300 transition-all duration-300 p-6 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-semibold px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 border border-brand-100">
                      {prog.difficulty}
                    </span>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {prog.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors leading-snug">
                      {prog.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
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
                      <span>View Program Track</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

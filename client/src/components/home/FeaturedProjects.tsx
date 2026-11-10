import React from 'react';
import { 
  FolderGit2, ExternalLink, Code, Layers, 
  Brain, BarChart2, Eye, Sparkles 
} from 'lucide-react';

export const FeaturedProjects: React.FC = () => {
  const projects = [
    {
      title: 'Autonomous RAG Research Assistant',
      category: 'Generative AI',
      icon: Sparkles,
      iconColor: 'text-violet-600',
      bgColor: 'bg-violet-50',
      description: 'End-to-end question-answering engine over dense PDF documentation using Claude, Pinecone vector embeddings, and LangChain.',
      techStack: ['Python', 'Claude API', 'LangChain', 'FastAPI'],
      deliverable: 'Semantic Search Engine + Evaluation Metrics',
    },
    {
      title: 'Medical Image Tumor Classifier',
      category: 'Computer Vision & Deep Learning',
      icon: Eye,
      iconColor: 'text-brand-600',
      bgColor: 'bg-blue-50',
      description: 'Convolutional neural network architecture utilizing transfer learning (ResNet50) for fine-grained feature extraction and high-precision classification.',
      techStack: ['PyTorch', 'Torchvision', 'NumPy', 'OpenCV'],
      deliverable: 'Model Weights + Grad-CAM Explainability Heatmaps',
    },
    {
      title: 'Fintech Analytics & Forecasting Dashboard',
      category: 'Data Analytics & ML',
      icon: BarChart2,
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Interactive analytics cockpit tracking revenue cohorts, customer churn probability, and predictive sales forecasts using ARIMA and XGBoost.',
      techStack: ['Python', 'Pandas', 'XGBoost', 'Streamlit'],
      deliverable: 'Dynamic BI Cockpit + Churn Alerting Pipeline',
    },
    {
      title: 'Real-Time Collaborative Code Editor',
      category: 'Full-Stack Software Engineering',
      icon: Code,
      iconColor: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'Multi-tenant web development workspace supporting WebSockets for concurrent syntax editing, operational transforms, and containerized code execution.',
      techStack: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'Docker'],
      deliverable: 'Live Web App + Isolated Container Sandbox',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3 py-1 rounded-full bg-brand-50 border border-brand-200">
              Curriculum Capstones
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Featured Capstone Projects
            </h2>
            <p className="text-base text-slate-600 max-w-xl">
              Representative industry-grade projects built throughout ADITYA curriculums to demonstrate real engineering proficiency.
            </p>
          </div>

          <div className="text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-500" />
            <span>Sample Curriculum Archetypes</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((proj, idx) => {
            const Icon = proj.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-3xl bg-white border border-slate-200 shadow-soft hover:shadow-card hover:border-brand-300 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
                      {proj.category}
                    </span>
                    <div className={`w-9 h-9 rounded-xl ${proj.bgColor} ${proj.iconColor} flex items-center justify-center`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-brand-600 transition-colors">
                    {proj.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div>
                    <span className="text-xs text-slate-500 font-medium block mb-1.5">Technologies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.techStack.map((tech, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-xs px-2.5 py-0.5 rounded bg-brand-50 text-brand-700 font-medium border border-brand-100"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 border border-slate-200/70 flex items-center justify-between">
                    <span className="font-semibold text-slate-800">Target Artifact:</span>
                    <span className="text-slate-600 truncate ml-2">{proj.deliverable}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

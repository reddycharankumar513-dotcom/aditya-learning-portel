import React, { useState, useEffect } from 'react';
import { learningPlusService, ProjectRecommendation } from '../services/learningPlusService';
import { learningService } from '../services/learningService';
import { 
  FolderGit2, Sparkles, CheckCircle2, ArrowRight, 
  ExternalLink, Code, Layers, Check, Plus, RefreshCw 
} from 'lucide-react';

export const ProjectMentor: React.FC = () => {
  const [recommendations, setRecommendations] = useState<ProjectRecommendation[]>([]);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);
      const res = await learningPlusService.getProjectRecommendations();
      setRecommendations(res.recommendations || []);
    } catch (err) {
      console.warn('Error loading project recommendations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToPortfolio = async (proj: ProjectRecommendation) => {
    try {
      await learningService.addProject({
        title: proj.title,
        description: proj.overview,
        techStack: proj.techStack,
        status: 'In Progress',
        repoUrl: proj.githubTemplate,
      });
      setAddedIds((prev) => [...prev, proj.id]);
    } catch (err) {
      console.warn('Error adding project to portfolio:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#080B18] text-[#F5F7FF]">
        <RefreshCw className="w-8 h-8 text-[#8065FF] animate-spin" />
        <p className="text-sm font-medium text-[#A6B0C8]">Analyzing industry architecture patterns...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold">
              <FolderGit2 className="w-3.5 h-3.5 text-[#32C8F5]" />
              <span>AI Production Capstone Mentor</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Guided Engineering Projects
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8]">
              Move beyond basic todo apps. Build verified, production-grade distributed architectures that stand out to technical recruiters.
            </p>
          </div>
        </div>

        {/* Project Cards */}
        <div className="space-y-8">
          {recommendations.map((proj) => {
            const isAdded = addedIds.includes(proj.id);
            return (
              <div key={proj.id} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#32C8F5]/10 text-[#32C8F5] font-bold border border-[#32C8F5]/20">
                        {proj.category}
                      </span>
                      <span className="text-xs font-bold text-[#F4B860]">
                        {proj.difficulty}
                      </span>
                    </div>
                    <h3 className="text-xl font-heading font-bold text-white">{proj.title}</h3>
                  </div>

                  <button
                    onClick={() => handleAddToPortfolio(proj)}
                    disabled={isAdded}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isAdded
                        ? 'bg-[#30D6A0]/20 text-[#30D6A0] border border-[#30D6A0]/40'
                        : 'bg-[#8065FF] hover:bg-[#6A4DFF] text-white shadow-glow-violet'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Dashboard</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Track In Portfolio</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs text-[#A6B0C8] leading-relaxed">
                  {proj.overview}
                </p>

                {/* Tech Stack Pills */}
                <div>
                  <h4 className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#A6B0C8] mb-2">
                    Recommended Architecture Stack
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {proj.techStack.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-white">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Milestone Checklist */}
                <div>
                  <h4 className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#A6B0C8] mb-2">
                    Implementation Milestones
                  </h4>
                  <div className="space-y-2">
                    {proj.milestones.map((ms, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8065FF]" />
                        <span>{ms}</span>
                      </div>
                    ))}
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

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { learningPlusService, PersonalizedRoadmapData } from '../services/learningPlusService';
import { 
  Compass, CheckCircle2, Circle, Clock, BookOpen, 
  ArrowRight, RefreshCw, Sparkles, Award, Target 
} from 'lucide-react';

export const PersonalizedRoadmap: React.FC = () => {
  const [roadmap, setRoadmap] = useState<PersonalizedRoadmapData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRoadmap();
  }, []);

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      const res = await learningPlusService.getRoadmap();
      setRoadmap(res.roadmap);
    } catch (err) {
      console.warn('Error loading roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (topicId: string, currentStatus: boolean) => {
    if (!roadmap) return;
    try {
      const res = await learningPlusService.toggleMilestone(topicId, !currentStatus);
      if (res.roadmap) {
        setRoadmap(res.roadmap);
      }
    } catch (err) {
      console.warn('Error toggling milestone:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3 bg-[#080B18] text-[#F5F7FF]">
        <RefreshCw className="w-8 h-8 text-[#8065FF] animate-spin" />
        <p className="text-sm font-medium text-[#A6B0C8]">Generating your personalized learning roadmap...</p>
      </div>
    );
  }

  const progress = roadmap?.progressPercentage || 42;

  return (
    <div className="min-h-screen bg-[#080B18] text-[#F5F7FF] py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 shadow-card-dark flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8065FF]/20 text-[#A68BFF] text-xs font-semibold">
              <Compass className="w-3.5 h-3.5 text-[#32C8F5]" />
              <span>AI Milestone Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-white">
              Personalized {roadmap?.targetRole || 'Full Stack'} Roadmap
            </h1>
            <p className="text-xs sm:text-sm text-[#A6B0C8]">
              Dynamically adapted to your diagnosed skill gaps and target company hiring expectations.
            </p>
          </div>

          <div className="text-center sm:text-right flex-shrink-0">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#A6B0C8] block">
              Curriculum Progress
            </span>
            <span className="text-3xl font-heading font-black text-[#30D6A0]">
              {progress}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="glass-panel rounded-2xl p-4 border border-white/10 space-y-2">
          <div className="flex justify-between text-xs text-[#A6B0C8]">
            <span>Roadmap Completion</span>
            <span className="font-bold text-white">{progress}% Complete</span>
          </div>
          <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#8065FF] to-[#32C8F5] rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stages Timeline */}
        <div className="space-y-6">
          {(roadmap?.stages || []).map((stage, stageIdx) => (
            <div key={stage.id} className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-white/5 text-[#32C8F5] font-bold">
                      Stage 0{stageIdx + 1} • {stage.level}
                    </span>
                  </div>
                  <h3 className="text-lg font-heading font-bold text-white">{stage.title}</h3>
                  <p className="text-xs text-[#A6B0C8]">{stage.description}</p>
                </div>
              </div>

              {/* Topics Checklist */}
              <div className="space-y-3 pt-2">
                {stage.topics.map((topic) => (
                  <div
                    key={topic.id}
                    onClick={() => handleToggle(topic.id, topic.completed)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                      topic.completed
                        ? 'bg-white/[0.04] border-[#30D6A0]/40'
                        : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                    }`}
                  >
                    <button type="button" className="mt-0.5 flex-shrink-0">
                      {topic.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-[#30D6A0]" />
                      ) : (
                        <Circle className="w-5 h-5 text-[#A6B0C8]" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-xs font-bold ${topic.completed ? 'text-[#30D6A0] line-through' : 'text-white'}`}>
                          {topic.title}
                        </h4>
                        <span className="text-[10px] text-[#A6B0C8] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {topic.estimatedHours} hrs
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A6B0C8]">{topic.description}</p>
                      
                      {topic.resources && topic.resources.length > 0 && (
                        <div className="flex items-center gap-2 pt-1 text-[10px] text-[#A68BFF]">
                          <BookOpen className="w-3 h-3" />
                          <span>Resource: {topic.resources[0].title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService, AIConfigData } from '../services/adminService';
import { 
  Sparkles, Sliders, Cpu, Save, AlertCircle, 
  CheckCircle2, RefreshCw, BarChart2 
} from 'lucide-react';

export const AdminAIConfig: React.FC = () => {
  const [config, setConfig] = useState<AIConfigData | null>(null);
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [savingWeights, setSavingWeights] = useState(false);
  const [weights, setWeights] = useState({
    technicalKnowledge: 30,
    answerRelevance: 20,
    problemSolving: 20,
    communicationClarity: 15,
    answerStructure: 10,
    timeManagement: 5,
  });

  useEffect(() => {
    loadAIConfig();
  }, []);

  const loadAIConfig = async () => {
    try {
      setLoading(true);
      const [cfgRes, useRes] = await Promise.all([
        adminService.getAIConfig(),
        adminService.getAIUsage(),
      ]);
      setConfig(cfgRes.config);
      setUsage(useRes.usage);
      if (cfgRes.config.scoringWeights) {
        setWeights(cfgRes.config.scoringWeights);
      }
    } catch (err) {
      console.warn('Failed to load AI config:', err);
    } finally {
      setLoading(false);
    }
  };

  const weightsSum =
    Number(weights.technicalKnowledge) +
    Number(weights.answerRelevance) +
    Number(weights.problemSolving) +
    Number(weights.communicationClarity) +
    Number(weights.answerStructure) +
    Number(weights.timeManagement);

  const handleSaveWeights = async () => {
    if (weightsSum !== 100) {
      alert(`Scoring weights must sum to exactly 100%. Current sum: ${weightsSum}%`);
      return;
    }
    try {
      setSavingWeights(true);
      await adminService.updateScoringWeights(weights);
      alert('AI scoring weights updated successfully!');
      loadAIConfig();
    } catch (err: any) {
      alert(err.message || 'Failed to update scoring weights');
    } finally {
      setSavingWeights(false);
    }
  };

  const handleToggleFeature = async (featureKey: string, currentValue: boolean) => {
    if (!config) return;
    try {
      const updatedFeatures = { ...config.features, [featureKey]: !currentValue };
      await adminService.updateAIFeatures({ features: updatedFeatures });
      setConfig({ ...config, features: updatedFeatures });
    } catch (err: any) {
      alert(err.message || 'Failed to update feature');
    }
  };

  return (
    <AdminLayout
      title="AI Command Center & Diagnostic Models"
      subtitle="Orchestrate LLM providers, tune 6-factor interview scoring weights, and audit token consumption"
      actions={
        <button
          onClick={loadAIConfig}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A6B0C8] hover:text-white"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Col 1 & 2: Provider Orchestration & Scoring Rubrics */}
        <div className="lg:col-span-2 space-y-6">

          {/* 1. Multi-Provider Abstraction Card */}
          <div className="p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#8065FF]/10 text-[#8065FF] flex items-center justify-center">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    LLM Provider Orchestration
                  </h3>
                  <p className="text-xs text-[#A6B0C8]">Active generation engines and failover hierarchy</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {config?.providers.map((p) => (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between ${
                    p.isActive
                      ? 'bg-[#10162A] border-white/10'
                      : 'bg-white/[0.01] border-white/5 opacity-50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{p.name}</span>
                      {p.isDefault && (
                        <span className="text-[10px] font-bold bg-[#30D6A0]/20 text-[#30D6A0] px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                      {p.isFallback && (
                        <span className="text-[10px] font-bold bg-[#F4B860]/20 text-[#F4B860] px-2 py-0.5 rounded-full">
                          Fallback
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-[11px] text-[#32C8F5] truncate">{p.model}</p>
                    <p className="text-[10px] text-[#A6B0C8] mt-1">Timeout: {p.timeoutMs / 1000}s</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                    <span className="text-[#A6B0C8] text-[11px]">State:</span>
                    <span className={`font-semibold ${p.isActive ? 'text-[#30D6A0]' : 'text-[#FF647C]'}`}>
                      {p.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. 6-Factor Interview Scoring Rubric Tuning */}
          <div className="p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#32C8F5]/10 text-[#32C8F5] flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Interview Evaluation Rubric Weights
                  </h3>
                  <p className="text-xs text-[#A6B0C8]">
                    Mathematical weights applied to candidate evaluation scores
                  </p>
                </div>
              </div>

              {/* Total Sum Validator Badge */}
              <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                weightsSum === 100
                  ? 'bg-emerald-500/10 text-[#30D6A0] border-emerald-500/30'
                  : 'bg-red-500/10 text-[#FF647C] border-red-500/30'
              }`}>
                {weightsSum === 100 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Total: 100% Verified</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Total: {weightsSum}% (Must Equal 100%)</span>
                  </>
                )}
              </div>
            </div>

            {/* Slider Controls */}
            <div className="space-y-4 pt-3">
              {[
                { key: 'technicalKnowledge', label: 'Technical Depth & Knowledge', weight: weights.technicalKnowledge },
                { key: 'answerRelevance', label: 'Answer Relevance & Correctness', weight: weights.answerRelevance },
                { key: 'problemSolving', label: 'Problem Solving & Algorithmic Rigor', weight: weights.problemSolving },
                { key: 'communicationClarity', label: 'Communication Clarity & Tone', weight: weights.communicationClarity },
                { key: 'answerStructure', label: 'Answer Structure & Organization', weight: weights.answerStructure },
                { key: 'timeManagement', label: 'Pacing & Time Management', weight: weights.timeManagement },
              ].map((item) => (
                <div key={item.key} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-white font-medium">{item.label}</span>
                    <span className="font-mono font-bold text-[#8065FF]">{item.weight}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    value={item.weight}
                    onChange={(e) =>
                      setWeights({
                        ...weights,
                        [item.key]: Number(e.target.value),
                      })
                    }
                    className="w-full accent-[#8065FF] bg-white/10 rounded-lg cursor-pointer h-2"
                  />
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                onClick={handleSaveWeights}
                disabled={savingWeights || weightsSum !== 100}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-xs shadow-md disabled:opacity-40"
              >
                <Save className="w-4 h-4" />
                <span>Save Rubric Weights</span>
              </button>
            </div>
          </div>
        </div>

        {/* Col 3: Feature Toggles & Telemetry */}
        <div className="space-y-6">

          {/* Feature Availability Switches */}
          <div className="p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Platform Features
            </h3>
            <p className="text-xs text-[#A6B0C8]">Global capability toggles</p>

            <div className="space-y-3 pt-2">
              {config?.features &&
                Object.entries(config.features).map(([key, val]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#10162A] border border-white/5"
                  >
                    <div>
                      <span className="text-xs font-semibold text-white capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleFeature(key, val)}
                      className={`w-10 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        val ? 'bg-[#30D6A0]' : 'bg-white/10'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          val ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* AI Usage Summary */}
          <div className="p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#32C8F5]" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Usage Analytics
              </h3>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="flex justify-between p-3 rounded-xl bg-[#10162A]">
                <span className="text-[#A6B0C8]">Total Mock Interviews:</span>
                <span className="font-bold text-white font-mono">{usage?.interviewsCompleted ?? 0}</span>
              </div>
              <div className="flex justify-between p-3 rounded-xl bg-[#10162A]">
                <span className="text-[#A6B0C8]">Active Sessions in Flight:</span>
                <span className="font-bold text-[#32C8F5] font-mono">{usage?.interviewsInProgress ?? 0}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

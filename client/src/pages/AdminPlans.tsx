import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService, PlanItem, CreditPackageItem } from '../services/adminService';
import { 
  CreditCard, Plus, Check, Edit2, Archive, 
  Sparkles, RefreshCw, X, Coins, ShieldCheck 
} from 'lucide-react';

export const AdminPlans: React.FC = () => {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [packages, setPackages] = useState<CreditPackageItem[]>([]);
  const [activeTab, setActiveTab] = useState<'plans' | 'credits'>('plans');
  const [loading, setLoading] = useState(true);

  // Edit / Create Modals
  const [editPlan, setEditPlan] = useState<Partial<PlanItem> | null>(null);
  const [editPackage, setEditPackage] = useState<Partial<CreditPackageItem> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [plansRes, pkgRes] = await Promise.all([
        adminService.getPlans(),
        adminService.getCreditPackages(),
      ]);
      setPlans(plansRes.plans);
      setPackages(pkgRes.packages);
    } catch (err) {
      console.warn('Failed to load plans:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPlan) return;
    try {
      if (editPlan._id) {
        await adminService.updatePlan(editPlan._id, editPlan);
        alert('Plan updated successfully.');
      } else {
        await adminService.createPlan(editPlan);
        alert('New plan created successfully.');
      }
      setEditPlan(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save plan');
    }
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPackage) return;
    try {
      if (editPackage._id) {
        await adminService.updateCreditPackage(editPackage._id, editPackage);
        alert('Credit package updated.');
      } else {
        await adminService.createCreditPackage(editPackage);
        alert('Credit package created.');
      }
      setEditPackage(null);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save credit package');
    }
  };

  const handleTogglePlan = async (plan: PlanItem) => {
    try {
      await adminService.togglePlanStatus(plan._id, !plan.isActive);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Toggle failed');
    }
  };

  return (
    <AdminLayout
      title="Pricing & Monetization Engine"
      subtitle="Configure subscription tiers, dynamic pricing, trial allowances, and standalone credit packages"
      actions={
        <div className="flex items-center gap-3">
          <div className="flex bg-[#151D35] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'plans' ? 'bg-[#8065FF] text-white' : 'text-[#A6B0C8] hover:text-white'
              }`}
            >
              Subscription Plans
            </button>
            <button
              onClick={() => setActiveTab('credits')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'credits' ? 'bg-[#8065FF] text-white' : 'text-[#A6B0C8] hover:text-white'
              }`}
            >
              Credit Bundles
            </button>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'plans') {
                setEditPlan({
                  code: 'CUSTOM',
                  name: 'New Custom Tier',
                  monthlyPriceINR: 499,
                  yearlyPriceINR: 4999,
                  description: 'Special access package',
                  features: ['AI Mock Interviews', 'Standard Resume Scan'],
                  trialDays: 0,
                  interviewCredits: 30,
                  voiceInterviewEnabled: true,
                  videoInterviewEnabled: false,
                  resumeAnalysisLimit: 15,
                  courseAccess: 'standard',
                  isActive: true,
                  isPopular: false,
                  discountPercentage: 0,
                });
              } else {
                setEditPackage({
                  name: 'Custom Credit Bundle',
                  quantity: 10,
                  priceINR: 199,
                  validityDays: 90,
                  description: 'Practice pack',
                  isActive: true,
                });
              }
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-xs shadow-md shadow-[#8065FF]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add {activeTab === 'plans' ? 'Plan' : 'Bundle'}</span>
          </button>
        </div>
      }
    >
      {/* Tab 1: Subscription Plans */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`p-6 rounded-2xl bg-[#151D35] border flex flex-col justify-between transition-all relative ${
                plan.isPopular ? 'border-[#8065FF] shadow-lg shadow-[#8065FF]/10' : 'border-white/10'
              } ${!plan.isActive ? 'opacity-50' : ''}`}
            >
              {plan.isPopular && (
                <div className="absolute top-3 right-3 text-[10px] font-bold bg-[#8065FF] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Popular
                </div>
              )}

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs font-bold text-[#32C8F5] uppercase tracking-wider">
                    {plan.code}
                  </span>
                  {!plan.isActive && (
                    <span className="text-[10px] bg-red-500/20 text-[#FF647C] px-2 py-0.5 rounded-full">
                      Archived
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-black text-white">{plan.name}</h3>
                <p className="text-xs text-[#A6B0C8] mt-1 line-clamp-2">{plan.description}</p>

                {/* Price Display */}
                <div className="my-5 p-3 rounded-xl bg-[#10162A] border border-white/5 space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-white font-space">₹{plan.monthlyPriceINR}</span>
                    <span className="text-xs text-[#A6B0C8]">/ month</span>
                  </div>
                  <div className="text-[11px] text-[#30D6A0]">
                    ₹{plan.yearlyPriceINR} / year ({plan.discountPercentage || 15}% savings)
                  </div>
                </div>

                {/* Quotas & Limits */}
                <div className="space-y-1.5 text-xs text-[#F5F7FF] mb-5">
                  <div className="flex justify-between text-[#A6B0C8]">
                    <span>Monthly Credits:</span>
                    <span className="font-bold text-white">{plan.interviewCredits}</span>
                  </div>
                  <div className="flex justify-between text-[#A6B0C8]">
                    <span>Voice Interviews:</span>
                    <span className="font-bold text-white">{plan.voiceInterviewEnabled ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between text-[#A6B0C8]">
                    <span>Video Interviews:</span>
                    <span className="font-bold text-white">{plan.videoInterviewEnabled ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between text-[#A6B0C8]">
                    <span>Resume Scans:</span>
                    <span className="font-bold text-white">{plan.resumeAnalysisLimit} / mo</span>
                  </div>
                  <div className="flex justify-between text-[#A6B0C8]">
                    <span>Trial Days:</span>
                    <span className="font-bold text-white">{plan.trialDays} Days</span>
                  </div>
                </div>

                {/* Feature Bullet Points */}
                <div className="space-y-1 border-t border-white/5 pt-3">
                  {plan.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#A6B0C8]">
                      <Check className="w-3.5 h-3.5 text-[#30D6A0] shrink-0" />
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => setEditPlan(plan)}
                  className="flex-1 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Plan
                </button>
                <button
                  onClick={() => handleTogglePlan(plan)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A6B0C8] hover:text-white"
                  title={plan.isActive ? 'Archive Plan' : 'Activate Plan'}
                >
                  <Archive className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Credit Bundles */}
      {activeTab === 'credits' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="p-6 rounded-2xl bg-[#151D35] border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-[#32C8F5]/10 text-[#32C8F5] flex items-center justify-center mb-3">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">{pkg.name}</h3>
                <p className="text-xs text-[#A6B0C8] mt-1">{pkg.description}</p>

                <div className="my-4 flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white font-space">
                    ₹{pkg.promotionalPriceINR || pkg.priceINR}
                  </span>
                  {pkg.promotionalPriceINR && (
                    <span className="text-xs text-[#A6B0C8] line-through">₹{pkg.priceINR}</span>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-[#10162A] text-xs space-y-1">
                  <div className="flex justify-between text-[#A6B0C8]">
                    <span>Credit Allocation:</span>
                    <span className="font-bold text-[#32C8F5]">{pkg.quantity} Credits</span>
                  </div>
                  <div className="flex justify-between text-[#A6B0C8]">
                    <span>Validity Period:</span>
                    <span className="font-bold text-white">{pkg.validityDays} Days</span>
                  </div>
                </div>
              </div>

              <div className="pt-5 border-t border-white/10 mt-4">
                <button
                  onClick={() => setEditPackage(pkg)}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-xs flex items-center justify-center gap-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Bundle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Plan Modal */}
      {editPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">
                {editPlan._id ? 'Edit Plan Configuration' : 'Create New Subscription Tier'}
              </h3>
              <button onClick={() => setEditPlan(null)} className="text-[#A6B0C8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePlan} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A6B0C8] block mb-1">Plan Code (UPPERCASE)</label>
                  <input
                    type="text"
                    required
                    value={editPlan.code || ''}
                    onChange={(e) => setEditPlan({ ...editPlan, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A6B0C8] block mb-1">Display Name</label>
                  <input
                    type="text"
                    required
                    value={editPlan.name || ''}
                    onChange={(e) => setEditPlan({ ...editPlan, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#A6B0C8] block mb-1">Marketing Description</label>
                <textarea
                  rows={2}
                  value={editPlan.description || ''}
                  onChange={(e) => setEditPlan({ ...editPlan, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#A6B0C8] block mb-1">Monthly Price (INR ₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editPlan.monthlyPriceINR ?? 0}
                    onChange={(e) => setEditPlan({ ...editPlan, monthlyPriceINR: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A6B0C8] block mb-1">Yearly Price (INR ₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={editPlan.yearlyPriceINR ?? 0}
                    onChange={(e) => setEditPlan({ ...editPlan, yearlyPriceINR: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A6B0C8] block mb-1">Interview Credits / Mo</label>
                  <input
                    type="number"
                    min={0}
                    value={editPlan.interviewCredits ?? 5}
                    onChange={(e) => setEditPlan({ ...editPlan, interviewCredits: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[#A6B0C8] block mb-1">Free Trial (Days)</label>
                  <input
                    type="number"
                    min={0}
                    value={editPlan.trialDays ?? 0}
                    onChange={(e) => setEditPlan({ ...editPlan, trialDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A6B0C8] block mb-1">Resume Scan Limit</label>
                  <input
                    type="number"
                    min={1}
                    value={editPlan.resumeAnalysisLimit ?? 5}
                    onChange={(e) => setEditPlan({ ...editPlan, resumeAnalysisLimit: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-[#A6B0C8] block mb-1">Discount %</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editPlan.discountPercentage ?? 15}
                    onChange={(e) => setEditPlan({ ...editPlan, discountPercentage: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editPlan.voiceInterviewEnabled ?? false}
                    onChange={(e) => setEditPlan({ ...editPlan, voiceInterviewEnabled: e.target.checked })}
                    className="rounded"
                  />
                  <span>Voice Interviews Allowed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editPlan.videoInterviewEnabled ?? false}
                    onChange={(e) => setEditPlan({ ...editPlan, videoInterviewEnabled: e.target.checked })}
                    className="rounded"
                  />
                  <span>Video Interviews Allowed</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editPlan.isPopular ?? false}
                    onChange={(e) => setEditPlan({ ...editPlan, isPopular: e.target.checked })}
                    className="rounded"
                  />
                  <span>Highlight as Popular</span>
                </label>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditPlan(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-[#A6B0C8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold"
                >
                  Save Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

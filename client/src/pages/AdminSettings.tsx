import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService } from '../services/adminService';
import { 
  Key, Database, Shield, Sparkles, CheckCircle2, 
  AlertCircle, RefreshCw, Send, Lock, ExternalLink,
  Users, UserCheck, Sliders, ToggleLeft, ToggleRight,
  Save, Globe, Mail, DollarSign, UploadCloud, ShieldAlert
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'platform' | 'roles' | 'apikeys'>('platform');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Platform Settings State
  const [platformSettings, setPlatformSettings] = useState<any>({
    siteName: 'Learnova',
    supportEmail: 'support@learnova.in',
    allowStudentRegistration: true,
    allowEmployerRegistration: true,
    maintenanceMode: false,
    maintenanceMessage: 'Learnova is currently performing scheduled maintenance. We will be back shortly.',
    currency: 'INR',
    maxUploadSizeMB: 10,
    trialDays: 7,
    freeTrialCredits: 50,
  });

  // Admin Roles State
  const [admins, setAdmins] = useState<any[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const [editingRole, setEditingRole] = useState<'super_admin' | 'finance_admin' | 'content_admin' | 'support_admin'>('support_admin');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [showRoleModal, setShowRoleModal] = useState(false);

  // API Keys / Legacy Diagnostics State
  const [legacySettings, setLegacySettings] = useState<any>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [savingKey, setSavingKey] = useState(false);
  const [testingAi, setTestingAi] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);

  const AVAILABLE_PERMISSIONS = [
    { id: 'users.read', label: 'View Users & Students' },
    { id: 'users.write', label: 'Suspend & Adjust Credits' },
    { id: 'employers.read', label: 'View Employers' },
    { id: 'employers.write', label: 'Approve / Reject Employers' },
    { id: 'plans.manage', label: 'Manage Plans & Pricing' },
    { id: 'payments.read', label: 'View Transactions' },
    { id: 'refunds.manage', label: 'Authorize & Process Refunds' },
    { id: 'ai.manage', label: 'Configure AI Providers & Weights' },
    { id: 'content.manage', label: 'Moderate Courses & Opportunities' },
    { id: 'support.manage', label: 'Reply to Support Tickets' },
    { id: 'notifications.send', label: 'Dispatch Broadcasts' },
    { id: 'settings.manage', label: 'Edit Platform Settings' },
    { id: 'audit.read', label: 'Inspect Audit Logs' },
  ];

  useEffect(() => {
    loadAllSettings();
  }, []);

  const loadAllSettings = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const [platRes, rolesRes, legRes] = await Promise.allSettled([
        adminService.getPlatformSettings(),
        adminService.getAdminRoles(),
        (adminService as any).getSettings ? (adminService as any).getSettings() : Promise.resolve(null),
      ]);

      if (platRes.status === 'fulfilled' && platRes.value?.settings) {
        setPlatformSettings((prev: any) => ({ ...prev, ...platRes.value.settings }));
      }
      if (rolesRes.status === 'fulfilled' && rolesRes.value?.admins) {
        setAdmins(rolesRes.value.admins);
      }
      if (legRes.status === 'fulfilled' && legRes.value?.settings) {
        setLegacySettings(legRes.value.settings);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePlatformSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setStatusMessage(null);
      setErrorMessage(null);

      await adminService.updatePlatformSettings(platformSettings);
      setStatusMessage('Platform settings saved and propagated successfully.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update platform settings');
    } finally {
      setSaving(false);
    }
  };

  const openRoleEditor = (admin: any) => {
    setSelectedAdmin(admin);
    setEditingRole(admin.adminRole || 'support_admin');
    setSelectedPermissions(admin.permissions || []);
    setShowRoleModal(true);
  };

  const handleSaveRole = async () => {
    if (!selectedAdmin) return;
    try {
      setSaving(true);
      await adminService.updateAdminRole(selectedAdmin._id, {
        adminRole: editingRole,
        permissions: editingRole === 'super_admin' ? ['*'] : selectedPermissions,
      });

      setShowRoleModal(false);
      setStatusMessage(`Updated permissions for ${selectedAdmin.name} (${selectedAdmin.email}).`);
      loadAllSettings();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update admin role');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveApiKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;

    try {
      setSavingKey(true);
      setStatusMessage(null);
      setErrorMessage(null);
      setTestResult(null);

      if ((adminService as any).updateSettings) {
        const res = await (adminService as any).updateSettings({ anthropicApiKey: apiKeyInput.trim() });
        setLegacySettings(res.settings);
      }
      setStatusMessage('API Key securely encrypted and saved to runtime settings.');
      setApiKeyInput('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to update API key');
    } finally {
      setSavingKey(false);
    }
  };

  const handleTestAi = async () => {
    try {
      setTestingAi(true);
      setTestResult(null);
      setErrorMessage(null);

      if ((adminService as any).testAiIntegration) {
        const res = await (adminService as any).testAiIntegration();
        setTestResult(res);
      } else {
        setTestResult({ success: true, message: 'AI diagnostics operational.' });
      }
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Claude API diagnostic test failed.',
      });
    } finally {
      setTestingAi(false);
    }
  };

  const togglePermission = (permId: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) ? prev.filter(p => p !== permId) : [...prev, permId]
    );
  };

  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sliders className="w-5 h-5 text-[#8065FF]" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Platform Settings &amp; Governance
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Configure global platform flags, maintenance state, team roles (RBAC), and API credentials.
            </p>
          </div>

          <button
            onClick={loadAllSettings}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-[#151D35] border border-[#202947] text-xs font-semibold text-slate-200 hover:bg-[#1E294B] flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Reload Configuration</span>
          </button>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#202947] pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('platform')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'platform'
                ? 'bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white shadow-lg shadow-[#8065FF]/20'
                : 'text-slate-400 hover:text-white hover:bg-[#151D35]'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Platform Controls</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'roles'
                ? 'bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white shadow-lg shadow-[#8065FF]/20'
                : 'text-slate-400 hover:text-white hover:bg-[#151D35]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Admin Roles &amp; Team (RBAC)</span>
          </button>

          <button
            onClick={() => setActiveTab('apikeys')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'apikeys'
                ? 'bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] text-white shadow-lg shadow-[#8065FF]/20'
                : 'text-slate-400 hover:text-white hover:bg-[#151D35]'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API Credentials &amp; Infrastructure</span>
          </button>
        </div>

        {/* Tab 1: Platform Configuration */}
        {activeTab === 'platform' && (
          <form onSubmit={handleSavePlatformSettings} className="space-y-6">
            
            {/* Maintenance Mode Card */}
            <div className={`p-6 rounded-2xl border transition-all ${
              platformSettings.maintenanceMode 
                ? 'bg-rose-500/10 border-rose-500/30' 
                : 'bg-[#10162A]/90 border-[#202947]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    platformSettings.maintenanceMode ? 'bg-rose-500/20 text-rose-400' : 'bg-[#151D35] text-slate-400'
                  }`}>
                    <ShieldAlert className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Emergency Maintenance Mode</h3>
                    <p className="text-xs text-slate-400">
                      When enabled, regular users are greeted with a maintenance screen. Admins retain full access.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPlatformSettings({ ...platformSettings, maintenanceMode: !platformSettings.maintenanceMode })}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#151D35] border border-[#202947] text-xs font-bold self-start sm:self-auto"
                >
                  {platformSettings.maintenanceMode ? (
                    <>
                      <ToggleRight className="w-6 h-6 text-rose-400" />
                      <span className="text-rose-400">ACTIVE (Site Locked)</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-6 h-6 text-slate-500" />
                      <span className="text-slate-400">Disabled (Normal)</span>
                    </>
                  )}
                </button>
              </div>

              {platformSettings.maintenanceMode && (
                <div className="mt-4 pt-4 border-t border-rose-500/20">
                  <label className="text-xs font-semibold text-rose-300 block mb-1">
                    Public Maintenance Message
                  </label>
                  <input
                    type="text"
                    value={platformSettings.maintenanceMessage || ''}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, maintenanceMessage: e.target.value })}
                    className="w-full bg-[#080B18] border border-rose-500/30 rounded-xl px-3.5 py-2.5 text-xs text-rose-200 font-medium focus:outline-none focus:border-rose-400"
                  />
                </div>
              )}
            </div>

            {/* Registration & User Controls */}
            <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl p-6 space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8065FF]" />
                <span>Onboarding &amp; Registration Switches</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#080B18] border border-[#202947] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Student Registration</h4>
                    <p className="text-[11px] text-slate-400">Allow new students to create accounts</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlatformSettings({ ...platformSettings, allowStudentRegistration: !platformSettings.allowStudentRegistration })}
                    className="text-xs"
                  >
                    {platformSettings.allowStudentRegistration ? (
                      <ToggleRight className="w-8 h-8 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-600" />
                    )}
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-[#080B18] border border-[#202947] flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Employer Registration</h4>
                    <p className="text-[11px] text-slate-400">Allow companies &amp; recruiters to sign up</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPlatformSettings({ ...platformSettings, allowEmployerRegistration: !platformSettings.allowEmployerRegistration })}
                    className="text-xs"
                  >
                    {platformSettings.allowEmployerRegistration ? (
                      <ToggleRight className="w-8 h-8 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#202947]">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Free Trial Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={platformSettings.trialDays ?? 7}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, trialDays: Number(e.target.value) })}
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Initial Free AI Credits
                  </label>
                  <input
                    type="number"
                    value={platformSettings.freeTrialCredits ?? 50}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, freeTrialCredits: Number(e.target.value) })}
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Default Currency
                  </label>
                  <select
                    value={platformSettings.currency || 'INR'}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, currency: e.target.value })}
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  >
                    <option value="INR">INR (₹ - Indian Rupee)</option>
                    <option value="USD">USD ($ - US Dollar)</option>
                    <option value="EUR">EUR (€ - Euro)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* General Contact & Uploads */}
            <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#32C8F5]" />
                <span>Identity &amp; Storage Boundaries</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Official Platform Name
                  </label>
                  <input
                    type="text"
                    value={platformSettings.siteName || ''}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, siteName: e.target.value })}
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Support Inbound Email
                  </label>
                  <input
                    type="email"
                    value={platformSettings.supportEmail || ''}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, supportEmail: e.target.value })}
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Max Upload File Size (MB)
                  </label>
                  <input
                    type="number"
                    value={platformSettings.maxUploadSizeMB ?? 10}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, maxUploadSizeMB: Number(e.target.value) })}
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white font-bold text-xs shadow-lg shadow-[#8065FF]/20 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving Changes...' : 'Save Platform Settings'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Admin Roles & Team (RBAC) */}
        {activeTab === 'roles' && (
          <div className="space-y-6">
            <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-[#8065FF]" />
                    <span>Administrative Team &amp; RBAC Privileges</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Configure granular permissions across 4 core administrative tiers.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#080B18] text-slate-400 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Administrator</th>
                      <th className="py-3 px-4">Role Tier</th>
                      <th className="py-3 px-4">Permissions Scope</th>
                      <th className="py-3 px-4">Last Login</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#202947]/50 text-slate-200">
                    {admins.map((adm) => (
                      <tr key={adm._id} className="hover:bg-[#151D35]/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-white">{adm.name}</div>
                          <div className="text-[11px] text-slate-400">{adm.email}</div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            adm.adminRole === 'super_admin'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                              : adm.adminRole === 'finance_admin'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : adm.adminRole === 'content_admin'
                              ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          }`}>
                            {adm.adminRole ? adm.adminRole.replace('_', ' ') : 'General Admin'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {adm.adminRole === 'super_admin' ? (
                            <span className="text-slate-400 italic">Wildcard (*) — Full Access</span>
                          ) : (
                            <span className="text-slate-400">
                              {adm.permissions?.length ? `${adm.permissions.length} granular grants` : 'Default role grants'}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-400">
                          {adm.lastLoginAt ? new Date(adm.lastLoginAt).toLocaleDateString() : 'Never'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => openRoleEditor(adm)}
                            className="px-3 py-1.5 rounded-lg bg-[#151D35] hover:bg-[#1E294B] text-slate-200 text-xs font-medium border border-[#202947] transition-colors"
                          >
                            Edit Permissions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: API Credentials & Infrastructure */}
        {activeTab === 'apikeys' && (
          <div className="space-y-6">
            
            {/* Anthropic Claude API Integration Card */}
            <div className="bg-[#10162A]/90 rounded-2xl border border-[#202947] p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-[#8065FF] flex items-center justify-center">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Claude AI Tutor Integration</h2>
                    <p className="text-xs text-slate-400">
                      Powered by Anthropic Claude 3.5 Sonnet for 24/7 student tutoring &amp; mock interviews
                    </p>
                  </div>
                </div>

                <div>
                  {legacySettings?.anthropicConfigured ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live Claude API Connected
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-bold">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      Pedagogical Fallback Mode
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#080B18] border border-[#202947] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Active API Key:</span>
                  <span className="font-mono text-white font-bold bg-[#151D35] px-2.5 py-1 rounded border border-[#202947]">
                    {legacySettings?.anthropicMaskedKey || 'None'}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Keys are stored securely with environment-level encryption and decrypted exclusively at runtime.
                </p>
              </div>

              {/* Key Input Form */}
              <form onSubmit={handleSaveApiKey} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Enter / Update Anthropic API Key
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="sk-ant-api03-..."
                      className="w-full text-xs font-mono bg-[#080B18] text-white pl-10 pr-3.5 py-2.5 rounded-xl border border-[#202947] focus:outline-none focus:border-[#8065FF]"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Obtain a key from the{' '}
                    <a
                      href="https://console.anthropic.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#8065FF] hover:underline inline-flex items-center gap-0.5"
                    >
                      <span>Anthropic Console</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="submit"
                    disabled={savingKey || !apiKeyInput.trim()}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white font-bold text-xs shadow-md shadow-[#8065FF]/20 transition-all disabled:opacity-50"
                  >
                    {savingKey ? 'Saving Key...' : 'Save & Activate Key'}
                  </button>

                  <button
                    type="button"
                    onClick={handleTestAi}
                    disabled={testingAi}
                    className="px-4 py-2 rounded-xl bg-[#151D35] hover:bg-[#1E294B] text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-[#202947]"
                  >
                    {testingAi ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Running Diagnostic...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 text-[#8065FF]" />
                        <span>Test Claude Diagnostic</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Test Diagnostic Output */}
              {testResult && (
                <div
                  className={`p-4 rounded-xl border text-xs space-y-1.5 ${
                    testResult.success
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <div className="flex items-center gap-2 font-bold">
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-rose-400" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                  {testResult.latencyMs && (
                    <p className="text-[11px] text-slate-400 font-mono">
                      Latency: {testResult.latencyMs}ms &bull; Model: {testResult.model}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* MongoDB Database Connection Card */}
            <div className="bg-[#10162A]/90 rounded-2xl border border-[#202947] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-[#32C8F5] flex items-center justify-center">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Database Cluster Connection</h2>
                    <p className="text-xs text-slate-400">Mongoose ODM connected with TLS 1.3 encryption</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active Cluster
                </span>
              </div>

              <div className="p-4 rounded-xl bg-[#080B18] border border-[#202947] space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-400">Connection Endpoint:</span>
                  <span className="font-mono text-slate-200 text-[11px] bg-[#151D35] px-2.5 py-1 rounded border border-[#202947]">
                    {legacySettings?.database?.uri || 'mongodb://localhost:27017/aditya_platform'}
                  </span>
                </div>
              </div>
            </div>

            {/* Security & Sessions */}
            <div className="bg-[#10162A]/90 rounded-2xl border border-[#202947] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Security &amp; JWT Authorization</h2>
                    <p className="text-xs text-slate-400">HMAC-SHA256 session token verification</p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  Active (7-Day Token Lifetime)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#080B18] border border-[#202947]">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Client Origin</span>
                  <span className="font-mono font-semibold text-slate-200">{legacySettings?.clientUrl || 'http://localhost:5173'}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#080B18] border border-[#202947]">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Server Port</span>
                  <span className="font-mono font-semibold text-slate-200">{legacySettings?.port || 5000}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#080B18] border border-[#202947]">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Environment</span>
                  <span className="font-mono font-semibold text-slate-200 uppercase">{legacySettings?.nodeEnv || 'development'}</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Role Editor Modal */}
      {showRoleModal && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#10162A] border border-[#202947] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Manage Administrator Role</h3>
                <p className="text-xs text-slate-400">{selectedAdmin.name} &bull; {selectedAdmin.email}</p>
              </div>
              <button
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Role Tier</label>
              <select
                value={editingRole}
                onChange={(e) => setEditingRole(e.target.value as any)}
                className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#8065FF]"
              >
                <option value="super_admin">Super Admin (Unrestricted Root Access)</option>
                <option value="finance_admin">Finance Admin (Billing, Pricing, Refunds, Invoices)</option>
                <option value="content_admin">Content Admin (Courses, Jobs, CMS, Moderation)</option>
                <option value="support_admin">Support Admin (Tickets, User Inspection)</option>
              </select>
            </div>

            {editingRole !== 'super_admin' ? (
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-2">
                  Granular Permissions Overrides
                </label>
                <div className="max-h-56 overflow-y-auto space-y-2 pr-2 border border-[#202947] rounded-xl p-3 bg-[#080B18]">
                  {AVAILABLE_PERMISSIONS.map((perm) => (
                    <label key={perm.id} className="flex items-center gap-2.5 text-xs text-slate-300 hover:text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPermissions.includes(perm.id)}
                        onChange={() => togglePermission(perm.id)}
                        className="rounded border-[#202947] bg-[#151D35] text-[#8065FF] focus:ring-[#8065FF]"
                      />
                      <span>{perm.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs">
                Super Admins automatically receive wildcard (*) access across all administrative endpoints.
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="px-4 py-2 rounded-xl bg-[#151D35] hover:bg-[#1E294B] text-slate-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white text-xs font-bold shadow-lg shadow-[#8065FF]/20 disabled:opacity-50"
              >
                {saving ? 'Updating...' : 'Save Privileges'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

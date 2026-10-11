import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { adminService } from '../services/adminService';
import { 
  Key, Database, Shield, Sparkles, CheckCircle2, 
  AlertCircle, RefreshCw, Send, Lock, ExternalLink 
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [mongoUriInput, setMongoUriInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingKey, setSavingKey] = useState(false);
  const [testingAi, setTestingAi] = useState(false);
  const [testResult, setTestResult] = useState<any>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSettings();
      setSettings(res.settings);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load platform settings');
    } finally {
      setLoading(false);
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

      const res = await adminService.updateSettings({ anthropicApiKey: apiKeyInput.trim() });
      setSettings(res.settings);
      setStatusMessage('Anthropic API Key saved successfully and loaded into runtime!');
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

      const res = await adminService.testAiIntegration();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Claude API diagnostic test failed.',
      });
    } finally {
      setTestingAi(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Key className="w-5 h-5 text-brand-600" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                API Keys &amp; Platform Integrations
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your Claude API credentials, database connections, and test live AI services.
            </p>
          </div>

          <button
            onClick={loadSettings}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reload Status</span>
          </button>
        </div>

        {/* Notifications */}
        {statusMessage && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Anthropic Claude API Integration Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Claude AI Tutor Integration</h2>
                <p className="text-xs text-slate-500">
                  Powered by Anthropic Claude 3.5 Sonnet for 24/7 student tutoring
                </p>
              </div>
            </div>

            <div>
              {settings?.anthropicConfigured ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Live Claude API Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  Pedagogical Engine Fallback Mode
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Active API Key:</span>
              <span className="font-mono text-slate-900 font-bold bg-white px-2.5 py-1 rounded border border-slate-200">
                {settings?.anthropicMaskedKey || 'None'}
              </span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              When configured, prompts sent by students on the AI Tutor page route securely through your server to Anthropic.
            </p>
          </div>

          {/* Key Input Form */}
          <form onSubmit={handleSaveApiKey} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Enter / Update Anthropic API Key
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-ant-api03-..."
                  className="w-full text-xs font-mono pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Obtain a key from the{' '}
                <a
                  href="https://console.anthropic.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-brand-600 hover:underline inline-flex items-center gap-0.5"
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
                className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 transition-all disabled:opacity-50"
              >
                {savingKey ? 'Saving Key...' : 'Save & Activate Key'}
              </button>

              <button
                type="button"
                onClick={handleTestAi}
                disabled={testingAi}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                {testingAi ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Running Diagnostic...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-violet-600" />
                    <span>Test Claude Connection</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Test Diagnostic Output */}
          {testResult && (
            <div
              className={`p-4 rounded-2xl border text-xs space-y-1.5 ${
                testResult.success
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50/70 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{testResult.message}</span>
              </div>
              {testResult.latencyMs && (
                <p className="text-[11px] text-slate-600 font-mono">
                  Latency: {testResult.latencyMs}ms &bull; Model: {testResult.model}
                </p>
              )}
            </div>
          )}
        </div>

        {/* MongoDB Database Connection Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Database Connection</h2>
                <p className="text-xs text-slate-500">Mongoose ODM with MongoDB Atlas / Local</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Connected
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-600">Connection URI:</span>
              <span className="font-mono text-slate-800 text-[11px] bg-white px-2.5 py-1 rounded border border-slate-200">
                {settings?.database?.uri || 'mongodb://localhost:27017/aditya_platform'}
              </span>
            </div>
          </div>
        </div>

        {/* Security & Authentication Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Security &amp; JWT Signing</h2>
                <p className="text-xs text-slate-500">Authentication session keys and CORS headers</p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              Active (7 Days Expiry)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Client Origin</span>
              <span className="font-mono font-semibold text-slate-800">{settings?.clientUrl || 'http://localhost:5173'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Server Port</span>
              <span className="font-mono font-semibold text-slate-800">{settings?.port || 5000}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Environment</span>
              <span className="font-mono font-semibold text-slate-800 uppercase">{settings?.nodeEnv || 'development'}</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

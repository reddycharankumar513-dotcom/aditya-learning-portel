import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService } from '../services/adminService';
import { 
  FileText, Save, Plus, Trash2, CheckCircle2, 
  HelpCircle, Sparkles, RefreshCw 
} from 'lucide-react';

export const AdminContent: React.FC = () => {
  const [content, setContent] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'faqs' | 'testimonials' | 'legal'>('hero');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await adminService.getSiteContent();
      setContent(res.content);
    } catch (err) {
      console.warn('Failed to load CMS content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    try {
      setSaving(true);
      await adminService.updateSiteContent(content);
      alert('Website content updated successfully!');
      loadContent();
    } catch (err: any) {
      alert(err.message || 'Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout
      title="Website Content Management & Legal CMS"
      subtitle="Edit public landing page headlines, curate student testimonials, manage FAQs, and update policy documents"
      actions={
        <div className="flex items-center gap-3">
          <div className="flex bg-[#151D35] p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'hero' ? 'bg-[#8065FF] text-white' : 'text-[#A6B0C8]'
              }`}
            >
              Hero & Copy
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'faqs' ? 'bg-[#8065FF] text-white' : 'text-[#A6B0C8]'
              }`}
            >
              FAQs
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'testimonials' ? 'bg-[#8065FF] text-white' : 'text-[#A6B0C8]'
              }`}
            >
              Testimonials
            </button>
            <button
              onClick={() => setActiveTab('legal')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'legal' ? 'bg-[#8065FF] text-white' : 'text-[#A6B0C8]'
              }`}
            >
              Legal Policies
            </button>
          </div>
        </div>
      }
    >
      {content && (
        <form onSubmit={handleSave} className="space-y-6">

          {/* Tab 1: Hero & Copy */}
          {activeTab === 'hero' && (
            <div className="p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Hero Section Headline & CTAs
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[#A6B0C8] block mb-1">Main Headline</label>
                  <input
                    type="text"
                    value={content.hero?.headline || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, headline: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium"
                  />
                </div>

                <div>
                  <label className="text-[#A6B0C8] block mb-1">Supporting Subheadline</label>
                  <textarea
                    rows={2}
                    value={content.hero?.subheadline || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        hero: { ...content.hero, subheadline: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[#A6B0C8] block mb-1">Primary Call-to-Action Text</label>
                    <input
                      type="text"
                      value={content.hero?.primaryCtaText || ''}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, primaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[#A6B0C8] block mb-1">Secondary Call-to-Action Text</label>
                    <input
                      type="text"
                      value={content.hero?.secondaryCtaText || ''}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          hero: { ...content.hero, secondaryCtaText: e.target.value },
                        })
                      }
                      className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: FAQs */}
          {activeTab === 'faqs' && (
            <div className="p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Frequently Asked Questions ({content.faqs?.length || 0})
                </h3>
                <button
                  type="button"
                  onClick={() =>
                    setContent({
                      ...content,
                      faqs: [
                        ...(content.faqs || []),
                        { question: 'New Question', answer: 'Answer content', category: 'General' },
                      ],
                    })
                  }
                  className="px-3 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#32C8F5]"
                >
                  <Plus className="w-3.5 h-3.5 inline mr-1" />
                  Add FAQ
                </button>
              </div>

              <div className="space-y-3">
                {content.faqs?.map((faq: any, index: number) => (
                  <div key={index} className="p-4 rounded-xl bg-[#10162A] border border-white/5 space-y-2 text-xs">
                    <div className="flex items-center justify-between gap-2">
                      <input
                        type="text"
                        placeholder="Question prompt"
                        value={faq.question}
                        onChange={(e) => {
                          const updated = [...content.faqs];
                          updated[index].question = e.target.value;
                          setContent({ ...content, faqs: updated });
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = content.faqs.filter((_: any, i: number) => i !== index);
                          setContent({ ...content, faqs: updated });
                        }}
                        className="text-[#FF647C] p-1.5 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Answer content"
                      value={faq.answer}
                      onChange={(e) => {
                        const updated = [...content.faqs];
                        updated[index].answer = e.target.value;
                        setContent({ ...content, faqs: updated });
                      }}
                      className="w-full p-2.5 rounded-lg bg-white/5 border border-white/10 text-[#A6B0C8]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Legal Policies */}
          {activeTab === 'legal' && (
            <div className="p-6 rounded-2xl bg-[#151D35] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Platform Legal Disclaimers & Policies
              </h3>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-[#A6B0C8] block mb-1">Terms & Conditions</label>
                  <textarea
                    rows={4}
                    value={content.legal?.termsAndConditions || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        legal: { ...content.legal, termsAndConditions: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-[#A6B0C8] block mb-1">Privacy Policy & Student Data Handling</label>
                  <textarea
                    rows={4}
                    value={content.legal?.privacyPolicy || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        legal: { ...content.legal, privacyPolicy: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="text-[#A6B0C8] block mb-1">Refund Policy (7-Day Guarantee Terms)</label>
                  <textarea
                    rows={3}
                    value={content.legal?.refundPolicy || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        legal: { ...content.legal, refundPolicy: e.target.value },
                      })
                    }
                    className="w-full p-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#32C8F5] text-white font-bold text-xs shadow-md shadow-[#8065FF]/20 disabled:opacity-40"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Publishing Changes...' : 'Save & Publish Website Content'}</span>
            </button>
          </div>

        </form>
      )}
    </AdminLayout>
  );
};

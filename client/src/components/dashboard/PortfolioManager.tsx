import React, { useState } from 'react';
import { StudentProject } from '../../types';
import { learningService } from '../../services/learningService';
import { FolderGit2, Plus, ExternalLink, Trash2, CheckCircle2 } from 'lucide-react';

interface PortfolioManagerProps {
  projects: StudentProject[];
  onProjectAdded: () => void;
}

export const PortfolioManager: React.FC<PortfolioManagerProps> = ({ projects, onProjectAdded }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [status, setStatus] = useState<'In Progress' | 'Completed' | 'Planning'>('In Progress');
  const [submitting, setSubmitting] = useState(false);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    try {
      setSubmitting(true);
      const techStack = techStackInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await learningService.addProject({
        title,
        description,
        techStack,
        status,
        repoUrl: repoUrl || undefined,
        demoUrl: demoUrl || undefined,
      });

      setShowAddModal(false);
      setTitle('');
      setDescription('');
      setTechStackInput('');
      setRepoUrl('');
      setDemoUrl('');
      setStatus('In Progress');
      onProjectAdded();
    } catch (err: any) {
      alert(err.message || 'Failed to save project');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to remove this project?')) return;
    try {
      await learningService.deleteProject(id);
      onProjectAdded();
    } catch (err: any) {
      alert(err.message || 'Failed to remove project');
    }
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-soft space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Project Portfolio</h3>
          <p className="text-xs text-slate-500">
            Showcase your verified technical builds, GitHub repositories, and live demos
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
          <FolderGit2 className="w-10 h-10 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-700">No portfolio projects logged yet</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Document assignments and capstone builds you develop in ADITYA curriculums to demonstrate actual technical competence.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 text-xs font-semibold text-brand-600 hover:text-brand-700 border border-brand-200 rounded-xl bg-white"
          >
            Add Your First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj._id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-brand-200 hover:bg-white transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-100 text-brand-700">
                    {proj.status}
                  </span>
                  <button
                    onClick={() => handleDelete(proj._id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Remove project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-1">{proj.title}</h4>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                  {proj.description}
                </p>
              </div>

              <div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {proj.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-3 text-xs">
                  {proj.repoUrl && (
                    <a
                      href={proj.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-700 hover:text-brand-600 font-medium"
                    >
                      <FolderGit2 className="w-3.5 h-3.5" /> Repository
                    </a>
                  )}
                  {proj.demoUrl && (
                    <a
                      href={proj.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-slate-700 hover:text-brand-600 font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Add Portfolio Project</h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter details for your project build to display on your student dashboard.
            </p>

            <form onSubmit={handleAddProject} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Distributed Task Queue in Node.js"
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the architecture, purpose, and key engineering takeaways..."
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tech Stack (comma separated)</label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="e.g. React, TypeScript, Redis, Docker"
                  className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Repository URL (optional)</label>
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Live Demo URL (optional)</label>
                  <input
                    type="url"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

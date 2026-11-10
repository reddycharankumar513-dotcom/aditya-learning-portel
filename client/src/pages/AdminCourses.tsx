import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { adminService } from '../services/adminService';
import { Course } from '../types';
import { 
  BookOpen, Plus, Trash2, Edit3, CheckCircle2, 
  XCircle, Clock, Layers, AlertCircle, RefreshCw 
} from 'lucide-react';

export const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // New Course Form
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence & ML');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [duration, setDuration] = useState('6 Weeks');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await adminService.getCourses();
      setCourses(res.courses);
    } catch (err) {
      console.warn('Failed to load admin courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description) return;

    try {
      setSubmitting(true);
      await adminService.createCourse({
        title,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        category,
        difficulty,
        duration,
        shortDescription: shortDescription || description.slice(0, 100),
        description,
        instructorName: instructorName || 'ADITYA Engineering Faculty',
        isPublished: true,
        modules: [
          {
            id: 'm-1',
            title: 'Module 1: Foundations & Architecture',
            description: 'Core architectural principles and environment setup.',
            duration: '1 Week',
            lessons: [
              { id: 'l-1', title: 'Introduction & Core Syntax', duration: '45 mins', type: 'lecture' },
              { id: 'l-2', title: 'Hands-on Coding Environment', duration: '1 hour', type: 'exercise' },
            ],
            assignment: {
              id: 'a-1',
              title: 'Initial Build Lab',
              instructions: 'Clone repo, configure dependencies, and pass unit tests.',
            },
          },
        ],
        learningObjectives: ['Master fundamental principles', 'Build hands-on implementations'],
        prerequisites: ['Basic programming logic'],
      });

      setShowModal(false);
      resetForm();
      loadCourses();
    } catch (err: any) {
      alert(err.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setCategory('Artificial Intelligence & ML');
    setDifficulty('Beginner');
    setDuration('6 Weeks');
    setShortDescription('');
    setDescription('');
    setInstructorName('');
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete course "${name}"? This action is permanent.`)) {
      return;
    }
    try {
      await adminService.deleteCourse(id);
      loadCourses();
    } catch (err: any) {
      alert(err.message || 'Failed to delete course');
    }
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      await adminService.updateCourse(course._id, { isPublished: !course.isPublished });
      loadCourses();
    } catch (err: any) {
      alert(err.message || 'Failed to update course status');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Manage Platform Courses
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Create, publish, edit, and organize curriculum syllabi for students.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/20 flex items-center gap-2 self-start sm:self-auto transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Course</span>
          </button>
        </div>

        {/* Courses Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-soft">
          {loading ? (
            <div className="py-12 flex justify-center">
              <RefreshCw className="w-6 h-6 text-brand-600 animate-spin" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                    <th className="pb-3 px-3">Course Title</th>
                    <th className="pb-3 px-3">Category</th>
                    <th className="pb-3 px-3">Difficulty</th>
                    <th className="pb-3 px-3">Duration</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {courses.map((c) => (
                    <tr key={c._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <span className="font-bold block text-slate-900">{c.title}</span>
                        <span className="text-slate-400 font-mono text-[11px]">/{c.slug}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-medium">
                          {c.category}
                        </span>
                      </td>
                      <td className="py-3 px-3">{c.difficulty}</td>
                      <td className="py-3 px-3">{c.duration}</td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleTogglePublish(c)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition-colors ${
                            c.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {c.isPublished ? 'Published' : 'Draft'}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => handleDelete(c._id, c.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create Course Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Create Curriculum Course</h3>
              <p className="text-xs text-slate-500 mb-5">Fill in course metadata to publish to the platform catalog.</p>

              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }}
                    placeholder="e.g. Transformers & LLM Architectures"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="transformers-llm-architectures"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Duration</label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="8 Weeks"
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="Artificial Intelligence & ML">Artificial Intelligence &amp; ML</option>
                      <option value="Data Science & Analytics">Data Science &amp; Analytics</option>
                      <option value="Software Development">Software Development</option>
                      <option value="Cloud & Emerging Technologies">Cloud &amp; Emerging Tech</option>
                      <option value="Career & Professional Development">Career Preparation</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e: any) => setDifficulty(e.target.value)}
                      className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Instructor Name</label>
                  <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh Kumar, Lead AI Architect"
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide a comprehensive syllabus overview..."
                    className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Creating...' : 'Save & Publish Course'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

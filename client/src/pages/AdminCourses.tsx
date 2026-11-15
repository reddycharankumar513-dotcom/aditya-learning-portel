import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../components/admin/AdminLayout';
import { adminService } from '../services/adminService';
import { Course } from '../types';
import { 
  BookOpen, Plus, Trash2, Edit3, CheckCircle2, 
  XCircle, Clock, Layers, AlertCircle, RefreshCw,
  Search, Eye, Users, ChevronRight, Sparkles
} from 'lucide-react';

export const AdminCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Artificial Intelligence & ML');
  const [difficulty, setDifficulty] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [duration, setDuration] = useState('6 Weeks');
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [instructorName, setInstructorName] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await adminService.getCourses();
      setCourses(res.courses || []);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingCourse(null);
    resetForm();
    setShowModal(true);
  };

  const handleOpenEditModal = (course: Course) => {
    setEditingCourse(course);
    setTitle(course.title);
    setSlug(course.slug);
    setCategory(course.category);
    setDifficulty(course.difficulty);
    setDuration(course.duration);
    setShortDescription(course.shortDescription || '');
    setDescription(course.description);
    setInstructorName(course.instructorName || '');
    setIsPublished(course.isPublished ?? true);
    setShowModal(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug || !description) return;

    try {
      setSubmitting(true);
      setStatusMessage(null);
      setErrorMessage(null);

      const coursePayload = {
        title,
        slug: slug.toLowerCase().replace(/\s+/g, '-'),
        category,
        difficulty,
        duration,
        shortDescription: shortDescription || description.slice(0, 120),
        description,
        instructorName: instructorName || 'Learnova Engineering Faculty',
        isPublished,
      };

      if (editingCourse) {
        await adminService.updateCourse(editingCourse._id || editingCourse.id!, coursePayload);
        setStatusMessage(`Course "${title}" updated successfully.`);
      } else {
        await adminService.createCourse({
          ...coursePayload,
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
        setStatusMessage(`Course "${title}" created and published successfully.`);
      }

      setShowModal(false);
      resetForm();
      loadCourses();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save course');
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
    setIsPublished(true);
  };

  const handleTogglePublish = async (course: Course) => {
    try {
      await adminService.updateCourse(course._id || course.id!, { isPublished: !course.isPublished });
      loadCourses();
    } catch (err: any) {
      alert(err.message || 'Failed to update course status');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete course "${name}"?`)) return;
    try {
      await adminService.deleteCourse(id);
      loadCourses();
    } catch (err: any) {
      alert(err.message || 'Failed to delete course');
    }
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || c.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = Array.from(new Set(courses.map(c => c.category)));
  const publishedCount = courses.filter(c => c.isPublished).length;
  const totalStudents = courses.reduce((acc, c) => acc + (c.enrolledStudents || 0), 0);

  return (
    <AdminLayout activeTab="courses">
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-5 h-5 text-[#8065FF]" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Course Catalog &amp; Curriculum Management
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              Create, curate, and publish interactive learning modules, syllabi, and coding lab assignments.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadCourses}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-[#151D35] border border-[#202947] text-xs font-semibold text-slate-200 hover:bg-[#1E294B] flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white font-bold text-xs shadow-lg shadow-[#8065FF]/20 flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>New Course</span>
            </button>
          </div>
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

        {/* Quick Stats Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl p-4">
            <span className="text-slate-400 text-[11px] font-semibold uppercase block">Total Courses</span>
            <div className="text-2xl font-black text-white mt-1">{courses.length}</div>
          </div>
          <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl p-4">
            <span className="text-slate-400 text-[11px] font-semibold uppercase block">Published &amp; Live</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{publishedCount}</div>
          </div>
          <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl p-4">
            <span className="text-slate-400 text-[11px] font-semibold uppercase block">Total Enrollments</span>
            <div className="text-2xl font-black text-[#8065FF] mt-1">{totalStudents}</div>
          </div>
          <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl p-4">
            <span className="text-slate-400 text-[11px] font-semibold uppercase block">Categories</span>
            <div className="text-2xl font-black text-[#32C8F5] mt-1">{categories.length}</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses by title or tag..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#10162A] border border-[#202947] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#8065FF]"
            />
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto overflow-x-auto w-full sm:w-auto pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#8065FF] text-white'
                  : 'bg-[#10162A] text-slate-400 hover:text-white border border-[#202947]'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#8065FF] text-white'
                    : 'bg-[#10162A] text-slate-400 hover:text-white border border-[#202947]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Table / Cards */}
        <div className="bg-[#10162A]/90 border border-[#202947] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#080B18] text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Course Info</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Level &amp; Duration</th>
                  <th className="py-3.5 px-4">Enrolled</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#202947]/50 text-slate-200">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((c) => (
                    <tr key={c._id || c.id} className="hover:bg-[#151D35]/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-sm">{c.title}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">/{c.slug}</div>
                        <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{c.shortDescription}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-[#151D35] text-slate-300 border border-[#202947] text-[11px] font-medium">
                          {c.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200">{c.difficulty}</div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{c.duration}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                          <Users className="w-3.5 h-3.5 text-[#8065FF]" />
                          <span>{c.enrolledStudents || 0}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <button
                          onClick={() => handleTogglePublish(c)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors ${
                            c.isPublished
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                          }`}
                        >
                          {c.isPublished ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(c)}
                            title="Edit Course"
                            className="p-1.5 rounded-lg bg-[#151D35] hover:bg-[#1E294B] text-slate-300 border border-[#202947] transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(c._id || c.id!, c.title)}
                            title="Delete Course"
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No courses match your search or filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Course Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#10162A] border border-[#202947] rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingCourse ? `Edit Course: ${editingCourse.title}` : 'Create New Curriculum Course'}
                </h3>
                <p className="text-xs text-slate-400">Configure syllabus metadata, difficulty, and duration.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (!editingCourse) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                      }
                    }}
                    placeholder="e.g. Full-Stack AI Engineer Bootcamp"
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="full-stack-ai-engineer-bootcamp"
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-[#8065FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  >
                    <option value="Artificial Intelligence & ML">Artificial Intelligence &amp; ML</option>
                    <option value="Full-Stack Web Development">Full-Stack Web Development</option>
                    <option value="Data Structures & Algorithms">Data Structures &amp; Algorithms</option>
                    <option value="Cloud & DevOps Engineering">Cloud &amp; DevOps Engineering</option>
                    <option value="Mobile App Development">Mobile App Development</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Duration</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 6 Weeks"
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Lead Instructor Name</label>
                  <input
                    type="text"
                    value={instructorName}
                    onChange={(e) => setInstructorName(e.target.value)}
                    placeholder="e.g. Dr. Ramesh Kumar"
                    className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Publishing State</label>
                  <div className="flex items-center gap-4 mt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        checked={isPublished}
                        onChange={() => setIsPublished(true)}
                        className="text-[#8065FF] focus:ring-[#8065FF]"
                      />
                      <span>Published (Live to Students)</span>
                    </label>
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="radio"
                        checked={!isPublished}
                        onChange={() => setIsPublished(false)}
                        className="text-[#8065FF] focus:ring-[#8065FF]"
                      />
                      <span>Draft</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Short Summary (Preview)</label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="A concise 1-2 sentence overview for catalog cards..."
                  className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Comprehensive Description *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed course curriculum, technical concepts covered, and industry project deliverables..."
                  className="w-full bg-[#080B18] border border-[#202947] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#8065FF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#202947]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#151D35] hover:bg-[#1E294B] text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#8065FF] to-[#6A4FE0] hover:from-[#7052FF] hover:to-[#5E42DA] text-white text-xs font-bold shadow-lg shadow-[#8065FF]/20 disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

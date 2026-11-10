import React, { useState, useEffect } from 'react';
import { CourseCard } from '../components/courses/CourseCard';
import { courseService } from '../services/courseService';
import { enrollmentService } from '../services/enrollmentService';
import { Course, Enrollment } from '../types';
import { useAuth } from '../context/AuthContext';
import { Search, Filter, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';

export const Courses: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [difficulty, setDifficulty] = useState('All');

  const categories = [
    'All',
    'Artificial Intelligence & ML',
    'Data Science & Analytics',
    'Software Development',
    'Cloud & Emerging Technologies',
    'Career & Professional Development',
  ];

  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  useEffect(() => {
    loadCourses();
  }, [category, difficulty]);

  useEffect(() => {
    if (isAuthenticated) {
      loadMyEnrollments();
    } else {
      setEnrolledCourseIds([]);
    }
  }, [isAuthenticated]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const params: any = {};
      if (category !== 'All') params.category = category;
      if (difficulty !== 'All') params.difficulty = difficulty;
      if (search) params.search = search;

      const res = await courseService.getCourses(params);
      setCourses(res.courses);
    } catch (err: any) {
      console.warn('Could not load courses from backend:', err);
      setError(err.message || 'Could not load courses');
    } finally {
      setLoading(false);
    }
  };

  const loadMyEnrollments = async () => {
    try {
      const res = await enrollmentService.getMyEnrollments();
      const ids = res.enrollments.map((e) => (typeof e.courseId === 'string' ? e.courseId : (e.courseId as any)?._id || (e.course as any)?._id));
      setEnrolledCourseIds(ids.filter(Boolean));
    } catch (err) {
      console.warn('Could not load enrollments:', err);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadCourses();
  };

  // Client-side search filtering on current list as user types
  const displayedCourses = courses.filter((c) => {
    const matchesSearch = search
      ? c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase()) ||
        c.category.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesCategory = category === 'All' || c.category === category;
    const matchesDifficulty = difficulty === 'All' || c.difficulty === difficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200">
            Course Catalog
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Explore All Engineering Courses
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Choose from comprehensive courses designed by experienced industry practitioners, 
            complete with hands-on coding modules and integrated Claude AI tutoring.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-soft space-y-5">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses by keyword, technology, or topic (e.g. PyTorch, React, SQL)..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors shadow-sm"
            >
              Search
            </button>
          </form>

          {/* Filter Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-3 border-t border-slate-100">
            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-all ${
                    category === cat
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2 text-xs shrink-0">
              <span className="font-bold text-slate-500 uppercase tracking-wider">Level:</span>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficulty(diff)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                    difficulty === diff
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 text-brand-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500">Loading courses from database...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-white rounded-3xl border border-rose-200 text-rose-700 max-w-xl mx-auto space-y-3 shadow-soft">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold">Failed to load courses</h3>
            <p className="text-xs text-slate-600">{error}</p>
            <button
              onClick={loadCourses}
              className="px-4 py-2 text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-200"
            >
              Try Again
            </button>
          </div>
        ) : displayedCourses.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 shadow-soft max-w-md mx-auto space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No courses found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or filter selections to find available topics.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setCategory('All');
                setDifficulty('All');
              }}
              className="px-4 py-2 text-xs font-semibold text-brand-600 bg-brand-50 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={enrolledCourseIds.includes(course._id)}
                onEnrollSuccess={loadMyEnrollments}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

import { Request, Response } from 'express';
import { Course } from '../models/Course.js';

export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, difficulty, search } = req.query;

    const filter: any = { isPublished: true };

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const term = search.trim();
      filter.$or = [
        { title: { $regex: term, $options: 'i' } },
        { description: { $regex: term, $options: 'i' } },
        { category: { $regex: term, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter).sort({ createdAt: -1 });
    res.json({ courses });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve courses.' });
  }
};

export const getCourseBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawSlug = req.params.slug;
    const slug = (Array.isArray(rawSlug) ? rawSlug[0] : rawSlug) || '';
    const course = await Course.findOne({ slug: slug.toLowerCase() });

    if (!course) {
      res.status(404).json({ message: `Course with slug "${slug}" not found.` });
      return;
    }

    res.json({ course });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve course details.' });
  }
};

export const getFeaturedCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find({ isPublished: true, featured: true }).limit(6);
    res.json({ courses });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve featured courses.' });
  }
};

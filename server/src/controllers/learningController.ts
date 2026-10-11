import { Response } from 'express';
import { Enrollment } from '../models/Enrollment.js';
import { Project } from '../models/Project.js';
import { recommendationService } from '../services/recommendationService.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getDashboard = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course')
      .sort({ updatedAt: -1 });

    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });

    const enrolledCount = enrollments.length;
    const completedCount = enrollments.filter(
      (e) => e.status === 'completed' || e.progress === 100
    ).length;
    const inProgressCount = enrolledCount - completedCount;

    // Estimate: ~12 hours per completed module + base progress
    const totalCompletedModules = enrollments.reduce(
      (sum, e) => sum + (e.completedModules?.length || 0),
      0
    );
    const learningHoursEstimate = totalCompletedModules * 10;

    const recommendations = await recommendationService.getRecommendationsForUser(req.user);

    res.json({
      stats: {
        enrolledCount,
        inProgressCount,
        completedCount,
        learningHoursEstimate,
        projectsCount: projects.length,
      },
      recentEnrollments: enrollments.slice(0, 5),
      recommendations,
      projects,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve dashboard metrics.' });
  }
};

export const getRecommendations = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  try {
    const recommendations = await recommendationService.getRecommendationsForUser(req.user);
    res.json({ recommendations });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to calculate recommendations.' });
  }
};

export const getProjects = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  try {
    const projects = await Project.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ projects });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve projects.' });
  }
};

export const addProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  try {
    const { title, description, techStack, status, repoUrl, demoUrl } = req.body;

    if (!title || !description) {
      res.status(400).json({ message: 'Project title and description are required.' });
      return;
    }

    const project = await Project.create({
      user: req.user._id,
      title,
      description,
      techStack: Array.isArray(techStack) ? techStack : [],
      status: status || 'In Progress',
      repoUrl: repoUrl || undefined,
      demoUrl: demoUrl || undefined,
    });

    res.status(201).json({
      message: 'Project logged in portfolio.',
      project,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to add project.' });
  }
};

export const deleteProject = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  try {
    const { id } = req.params;
    const project = await Project.findOneAndDelete({ _id: id, user: req.user._id });

    if (!project) {
      res.status(404).json({ message: 'Project not found.' });
      return;
    }

    res.json({ message: 'Project removed from portfolio.' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to remove project.' });
  }
};

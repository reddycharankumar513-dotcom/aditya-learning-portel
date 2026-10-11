import { Request, Response } from 'express';
import { Internship } from '../models/Internship.js';
import { Application } from '../models/Application.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const getInternships = async (req: Request, res: Response): Promise<void> => {
  try {
    const internships = await Internship.find({ isPublished: true }).sort({ createdAt: -1 });
    res.json({ internships });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve internship opportunities.' });
  }
};

export const apply = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required to submit applications.' });
    return;
  }

  try {
    const { id } = req.params;
    const { resumeUrl, notes } = req.body;

    const internship = await Internship.findById(id);
    if (!internship) {
      res.status(404).json({ message: 'Opportunity not found.' });
      return;
    }

    const existingApplication = await Application.findOne({
      user: req.user._id,
      internship: internship._id,
    });

    if (existingApplication) {
      res.status(400).json({ message: 'You have already applied for this opportunity.' });
      return;
    }

    const application = await Application.create({
      user: req.user._id,
      internship: internship._id,
      status: 'Submitted',
      resumeUrl: resumeUrl || undefined,
      notes: notes || undefined,
    });

    res.status(201).json({
      message: 'Application submitted successfully.',
      application,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to submit application.' });
  }
};

export const getMyApplications = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('internship')
      .sort({ appliedAt: -1 });

    res.json({ applications });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve applications.' });
  }
};

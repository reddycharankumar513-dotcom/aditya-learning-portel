import { Response } from 'express';
import { Enrollment } from '../models/Enrollment.js';
import { Course } from '../models/Course.js';
import { AuthenticatedRequest } from '../middleware/authMiddleware.js';

export const enroll = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required to enroll.' });
    return;
  }

  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found.' });
      return;
    }

    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id,
    });

    if (existingEnrollment) {
      res.status(400).json({
        message: 'You are already enrolled in this course.',
        enrollment: existingEnrollment,
      });
      return;
    }

    const enrollment = await Enrollment.create({
      user: req.user._id,
      course: course._id,
      progress: 0,
      completedModules: [],
      status: 'active',
    });

    // Increment course enrolled counter
    course.enrolledCount = (course.enrolledCount || 0) + 1;
    await course.save();

    await enrollment.populate('course');

    res.status(201).json({
      message: 'Successfully enrolled in course.',
      enrollment,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to process enrollment.' });
  }
};

export const getMyEnrollments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course')
      .sort({ updatedAt: -1 });

    res.json({ enrollments });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve enrollments.' });
  }
};

export const checkEnrollment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.json({ isEnrolled: false, enrollment: null });
    return;
  }

  try {
    const { courseId } = req.params;
    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    }).populate('course');

    res.json({
      isEnrolled: !!enrollment,
      enrollment,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to check enrollment.' });
  }
};

export const updateProgress = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Authentication required.' });
    return;
  }

  try {
    const { courseId } = req.params;
    const { moduleId, completed } = req.body;

    const enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });

    if (!enrollment) {
      res.status(404).json({ message: 'Enrollment record not found.' });
      return;
    }

    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404).json({ message: 'Course not found.' });
      return;
    }

    const totalModules = course.modules?.length || 1;
    let completedList = [...enrollment.completedModules];

    if (completed) {
      if (!completedList.includes(moduleId)) {
        completedList.push(moduleId);
      }
    } else {
      completedList = completedList.filter((m) => m !== moduleId);
    }

    const progressPercent = Math.min(
      100,
      Math.round((completedList.length / totalModules) * 100)
    );

    enrollment.completedModules = completedList;
    enrollment.progress = progressPercent;
    enrollment.lastActivityAt = new Date();

    if (progressPercent === 100) {
      enrollment.status = 'completed';
      enrollment.completedAt = new Date();
    } else {
      enrollment.status = 'active';
    }

    await enrollment.save();
    await enrollment.populate('course');

    res.json({
      message: 'Learning progress updated.',
      enrollment,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update progress.' });
  }
};

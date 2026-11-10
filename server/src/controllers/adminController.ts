import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { Internship } from '../models/Internship.js';
import { Application } from '../models/Application.js';
import { ContactInquiry } from '../models/ContactInquiry.js';
import { ENV, updateEnvKey } from '../config/env.js';
import { getDbStatus } from '../config/db.js';

export const getMetrics = async (req: Request, res: Response): Promise<void> => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalCourses,
      totalEnrollments,
      totalApplications,
      totalInquiries,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'student' }),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Application.countDocuments(),
      ContactInquiry.countDocuments(),
    ]);

    res.json({
      metrics: {
        totalUsers,
        totalStudents,
        totalCourses,
        totalEnrollments,
        totalApplications,
        totalInquiries,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to aggregate administrative metrics.' });
  }
};

// Course Management
export const getAdminCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json({ courses });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve courses.' });
  }
};

export const createAdminCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json({ message: 'Course created successfully.', course });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to create course.' });
  }
};

export const updateAdminCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndUpdate(id, req.body, { new: true });
    if (!course) {
      res.status(404).json({ message: 'Course not found.' });
      return;
    }
    res.json({ message: 'Course updated successfully.', course });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update course.' });
  }
};

export const deleteAdminCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      res.status(404).json({ message: 'Course not found.' });
      return;
    }
    res.json({ message: 'Course deleted successfully.' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to delete course.' });
  }
};

// Internship Management
export const getAdminInternships = async (req: Request, res: Response): Promise<void> => {
  try {
    const internships = await Internship.find().sort({ createdAt: -1 });
    res.json({ internships });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve internships.' });
  }
};

export const createAdminInternship = async (req: Request, res: Response): Promise<void> => {
  try {
    const internship = await Internship.create(req.body);
    res.status(201).json({ message: 'Internship opportunity published.', internship });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to create internship.' });
  }
};

export const updateAdminInternship = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const internship = await Internship.findByIdAndUpdate(id, req.body, { new: true });
    if (!internship) {
      res.status(404).json({ message: 'Opportunity not found.' });
      return;
    }
    res.json({ message: 'Opportunity updated.', internship });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update internship.' });
  }
};

export const deleteAdminInternship = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const internship = await Internship.findByIdAndDelete(id);
    if (!internship) {
      res.status(404).json({ message: 'Opportunity not found.' });
      return;
    }
    res.json({ message: 'Opportunity removed.' });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to delete internship.' });
  }
};

// Applications
export const getAdminApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await Application.find()
      .populate('user', 'name email educationStatus country')
      .populate('internship')
      .sort({ appliedAt: -1 });
    res.json({ applications });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve applications.' });
  }
};

export const updateAdminApplicationStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(id, { status }, { new: true });
    if (!application) {
      res.status(404).json({ message: 'Application not found.' });
      return;
    }
    res.json({ message: 'Application status updated.', application });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update application.' });
  }
};

// Users
export const getAdminUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ users });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve users.' });
  }
};

export const updateAdminUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!['student', 'instructor', 'admin'].includes(role)) {
      res.status(400).json({ message: 'Invalid role specified.' });
      return;
    }
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }
    res.json({ message: 'User role updated.', user });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update user role.' });
  }
};

// Contact Inquiries
export const getAdminInquiries = async (req: Request, res: Response): Promise<void> => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    res.json({ inquiries });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve inquiries.' });
  }
};

export const updateAdminInquiryStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const inquiry = await ContactInquiry.findByIdAndUpdate(id, { status }, { new: true });
    if (!inquiry) {
      res.status(404).json({ message: 'Inquiry not found.' });
      return;
    }
    res.json({ message: 'Inquiry status updated.', inquiry });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update inquiry status.' });
  }
};

// Platform Integration & API Key Settings
export const getSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawKey = ENV.ANTHROPIC_API_KEY || '';
    const anthropicConfigured = rawKey.trim().length > 10;
    const anthropicMaskedKey = anthropicConfigured
      ? `${rawKey.slice(0, 7)}...${rawKey.slice(-4)}`
      : 'Not Configured (Running in Pedagogical Engine Mode)';

    res.json({
      settings: {
        anthropicConfigured,
        anthropicMaskedKey,
        database: getDbStatus(),
        jwtConfigured: !!ENV.JWT_SECRET,
        clientUrl: ENV.CLIENT_URL,
        port: ENV.PORT,
        nodeEnv: ENV.NODE_ENV,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to retrieve settings.' });
  }
};

export const updateSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { anthropicApiKey, mongodbUri } = req.body;

    if (anthropicApiKey !== undefined) {
      updateEnvKey('ANTHROPIC_API_KEY', anthropicApiKey.trim());
    }

    if (mongodbUri !== undefined && mongodbUri.trim()) {
      updateEnvKey('MONGODB_URI', mongodbUri.trim());
    }

    const rawKey = ENV.ANTHROPIC_API_KEY || '';
    const anthropicConfigured = rawKey.trim().length > 10;
    const anthropicMaskedKey = anthropicConfigured
      ? `${rawKey.slice(0, 7)}...${rawKey.slice(-4)}`
      : 'Not Configured (Running in Pedagogical Engine Mode)';

    res.json({
      message: 'Integration settings updated successfully.',
      settings: {
        anthropicConfigured,
        anthropicMaskedKey,
        database: getDbStatus(),
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Failed to update integration settings.' });
  }
};

export const testAiIntegration = async (req: Request, res: Response): Promise<void> => {
  try {
    const rawKey = ENV.ANTHROPIC_API_KEY || '';
    if (!rawKey || rawKey.trim().length < 10) {
      res.status(400).json({
        success: false,
        message: 'No Anthropic API Key is currently configured. Please enter a valid API key first.',
      });
      return;
    }

    const startTime = Date.now();
    const testResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': rawKey.trim(),
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 30,
        messages: [{ role: 'user', content: 'Ping' }],
      }),
    });

    const latencyMs = Date.now() - startTime;

    if (testResponse.ok) {
      const data: any = await testResponse.json();
      res.json({
        success: true,
        message: 'Claude API connection verified successfully!',
        model: 'claude-3-5-sonnet-20241022',
        latencyMs,
        responseSample: data?.content?.[0]?.text || 'OK',
      });
    } else {
      const errData: any = await testResponse.json().catch(() => ({}));
      res.status(testResponse.status).json({
        success: false,
        message: `Claude API returned status ${testResponse.status}: ${errData?.error?.message || 'Authentication or request error.'}`,
        error: errData,
      });
    }
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: `Failed to connect to Anthropic servers: ${err.message}`,
    });
  }
};

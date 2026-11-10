import { Request, Response } from 'express';
import { Company } from '../models/Company.js';
import { Opportunity } from '../models/Opportunity.js';
import { CareerApplication } from '../models/CareerApplication.js';
import { User } from '../models/User.js';

export const getEmployerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    let company = await Company.findOne({ user: userId });

    if (!company) {
      const user = await User.findById(userId);
      company = await Company.create({
        user: userId,
        companyName: 'NexGen Technology Labs',
        businessEmail: user?.email || 'hiring@nexgen.io',
        website: 'https://nexgen.io',
        industry: 'Cloud Infrastructure & Enterprise AI',
        description: 'Building high-throughput cloud developer tools and microservices platforms.',
        recruiterName: user?.name || 'Technical Recruiter',
        designation: 'Head of Technical Recruiting',
        isVerified: true,
      });
    }

    res.json({
      success: true,
      company,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving employer profile', error: error.message });
  }
};

export const updateEmployerProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { companyName, businessEmail, website, industry, description, recruiterName, designation } = req.body;

    let company = await Company.findOne({ user: userId });
    if (!company) {
      company = new Company({ user: userId });
    }

    if (companyName) company.companyName = companyName;
    if (businessEmail) company.businessEmail = businessEmail;
    if (website) company.website = website;
    if (industry) company.industry = industry;
    if (description !== undefined) company.description = description;
    if (recruiterName) company.recruiterName = recruiterName;
    if (designation) company.designation = designation;

    await company.save();

    res.json({
      success: true,
      message: 'Company profile updated successfully.',
      company,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating employer profile', error: error.message });
  }
};

export const getEmployerDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    const [activeJobsCount, totalApplications, recentApplications] = await Promise.all([
      Opportunity.countDocuments(),
      CareerApplication.countDocuments(),
      CareerApplication.find().populate('opportunity user', 'title company name email careerReadinessScore skills').sort({ updatedAt: -1 }).limit(6),
    ]);

    const pipelineCounts = {
      newApplicant: await CareerApplication.countDocuments({ status: 'applied' }),
      underReview: await CareerApplication.countDocuments({ status: 'assessment' }),
      interviewScheduled: await CareerApplication.countDocuments({ status: 'interview' }),
      shortlisted: await CareerApplication.countDocuments({ status: 'shortlisted' }),
      hired: await CareerApplication.countDocuments({ status: 'offered' }),
    };

    res.json({
      success: true,
      stats: {
        activeJobs: activeJobsCount,
        totalApplicants: totalApplications,
        pipelineCounts,
      },
      recentApplications,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching employer dashboard stats', error: error.message });
  }
};

export const createJobListing = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const {
      title,
      company = 'NexGen Technology Labs',
      category = 'Full-time',
      workMode = 'Remote',
      location = 'India / Remote',
      experienceLevel = 'Fresher / Entry',
      description,
      requiredSkills,
      compensation = '₹12,00,000 - ₹16,00,000 / year',
    } = req.body;

    if (!title || !description || !requiredSkills || requiredSkills.length === 0) {
      res.status(400).json({ message: 'Please provide title, description, and required skills.' });
      return;
    }

    const opportunity = await Opportunity.create({
      title,
      company,
      category,
      workMode,
      location,
      experienceLevel,
      description,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : requiredSkills.split(',').map((s: string) => s.trim()),
      compensation,
      isVerified: true,
      postedByEmployer: userId,
    });

    res.status(201).json({
      success: true,
      message: 'Job posting published successfully!',
      opportunity,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating job listing', error: error.message });
  }
};

export const getEmployerJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const jobs = await Opportunity.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      jobs,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

export const discoverTalent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skill, role, minScore } = req.query;

    const query: any = { role: 'student' };
    if (minScore) {
      query.careerReadinessScore = { $gte: parseInt(minScore as string, 10) };
    }
    if (role && role !== 'All') {
      query.preferredRoles = { $in: [new RegExp(role as string, 'i')] };
    }

    const candidates = await User.find(query)
      .select('name email college degree department graduationYear skills preferredRoles careerReadinessScore readinessBreakdown github linkedin portfolio')
      .sort({ careerReadinessScore: -1 })
      .limit(20);

    // Filter by skill if requested
    let filtered = candidates;
    if (skill) {
      filtered = candidates.filter((c) =>
        c.skills.some((s) => s.name.toLowerCase().includes((skill as string).toLowerCase()))
      );
    }

    res.json({
      success: true,
      candidates: filtered,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error discovering talent', error: error.message });
  }
};

export const getRecruitmentPipeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const applications = await CareerApplication.find()
      .populate('opportunity', 'title company category workMode')
      .populate('user', 'name email college degree graduationYear skills careerReadinessScore')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      pipeline: applications,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching recruitment pipeline', error: error.message });
  }
};

export const updateCandidateStage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { applicationId, status, notes, interviewDate } = req.body;

    const application = await CareerApplication.findById(applicationId);
    if (!application) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    if (status) application.status = status;
    if (notes !== undefined) application.notes = notes;
    if (interviewDate) application.interviewDate = new Date(interviewDate);

    await application.save();

    res.json({
      success: true,
      message: 'Candidate pipeline stage updated successfully.',
      application,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating candidate stage', error: error.message });
  }
};

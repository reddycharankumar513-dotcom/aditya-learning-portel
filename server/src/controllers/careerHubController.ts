import { Request, Response } from 'express';
import { Opportunity, IOpportunity } from '../models/Opportunity.js';
import { CareerApplication } from '../models/CareerApplication.js';
import { User } from '../models/User.js';

// Pre-seeded Initial Verified Opportunities
const SEED_OPPORTUNITIES = [
  {
    title: 'Full Stack Engineer (Frontend & Node.js)',
    company: 'Razorpay',
    category: 'Full-time' as const,
    workMode: 'Hybrid' as const,
    location: 'Bangalore / Hybrid',
    experienceLevel: 'Fresher / Entry' as const,
    description: 'Build mission-critical payment checkout interfaces in React 19 and scalable Node.js microservices handling millions of daily merchant transactions.',
    requiredSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'REST API'],
    compensation: '₹14,00,000 - ₹18,00,000 / year',
    isVerified: true,
  },
  {
    title: 'AI / Machine Learning Engineering Fellow',
    company: 'Swiggy',
    category: 'Internship' as const,
    workMode: 'Remote' as const,
    location: 'India / Remote',
    experienceLevel: 'Fresher / Entry' as const,
    description: 'Develop transformer-based recommendation systems and dynamic routing heuristics using Python, PyTorch, and vector databases.',
    requiredSkills: ['Python', 'Machine Learning', 'Data Structures', 'Docker'],
    compensation: '₹40,000 - ₹55,000 / month',
    isVerified: true,
  },
  {
    title: 'Cloud Infrastructure & DevOps Apprentice',
    company: 'Zomato',
    category: 'Graduate Program' as const,
    workMode: 'On-site' as const,
    location: 'Gurgaon, Haryana',
    experienceLevel: 'Fresher / Entry' as const,
    description: 'Automate CI/CD pipelines, manage Kubernetes clusters, and optimize cloud database query caching on AWS and Redis.',
    requiredSkills: ['Docker', 'AWS', 'Linux', 'Python', 'Redis'],
    compensation: '₹8,50,000 - ₹12,00,000 / year',
    isVerified: true,
  },
  {
    title: 'Software Development Engineer - Campus 2026',
    company: 'PhonePe',
    category: 'Full-time' as const,
    workMode: 'Hybrid' as const,
    location: 'Bangalore, India',
    experienceLevel: 'Fresher / Entry' as const,
    description: 'Design distributed high-concurrency payment processing platforms using Java, Spring Boot, MySQL, and Kafka.',
    requiredSkills: ['Java', 'Data Structures', 'Algorithms', 'SQL', 'System Design'],
    compensation: '₹16,00,000 - ₹22,00,000 / year',
    isVerified: true,
  },
];

export const getOpportunities = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { category, search, workMode } = req.query;

    let count = await Opportunity.countDocuments();
    if (count === 0) {
      await Opportunity.insertMany(SEED_OPPORTUNITIES);
    }

    const query: any = {};
    if (category && category !== 'All') query.category = category;
    if (workMode && workMode !== 'All') query.workMode = workMode;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { requiredSkills: { $in: [new RegExp(search as string, 'i')] } },
      ];
    }

    const opportunities = await Opportunity.find(query).sort({ createdAt: -1 });

    // Compute explainable match percentage against user's skills
    let userSkills: string[] = ['JavaScript / TypeScript', 'React', 'Node.js & Express', 'Python'];
    if (userId) {
      const user = await User.findById(userId);
      if (user?.skills) {
        userSkills = user.skills.map((s) => s.name);
      }
    }

    const matchedOpportunities = opportunities.map((opp) => {
      const matched = opp.requiredSkills.filter((reqSkill) =>
        userSkills.some((us) => us.toLowerCase().includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(us.toLowerCase()))
      );

      const matchScore = Math.min(
        98,
        Math.max(50, Math.round((matched.length / opp.requiredSkills.length) * 100))
      );

      const matchReason = matched.length > 0
        ? `Strong alignment on ${matched.slice(0, 3).join(', ')}.`
        : 'Foundational programming prerequisites satisfied.';

      return {
        ...opp.toObject(),
        matchScore,
        matchReason,
      };
    });

    res.json({
      success: true,
      opportunities: matchedOpportunities,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching opportunities', error: error.message });
  }
};

export const applyToOpportunity = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { opportunityId, notes } = req.body;

    const opportunity = await Opportunity.findById(opportunityId);
    if (!opportunity) {
      res.status(404).json({ message: 'Opportunity not found' });
      return;
    }

    let application = await CareerApplication.findOne({
      user: userId,
      opportunity: opportunityId,
    });

    if (application) {
      application.status = 'applied';
      application.appliedAt = new Date();
      if (notes) application.notes = notes;
      await application.save();
    } else {
      application = await CareerApplication.create({
        user: userId,
        opportunity: opportunityId,
        status: 'applied',
        appliedAt: new Date(),
        notes: notes || '',
        matchScore: 85,
        matchReason: 'Applied with verified Learnova Career Readiness profile.',
      });
    }

    res.json({
      success: true,
      message: 'Application recorded successfully! Track status in your Career Pipeline.',
      application,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error applying to opportunity', error: error.message });
  }
};

export const getMyApplications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const applications = await CareerApplication.find({ user: userId })
      .populate('opportunity')
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      applications,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

export const updateApplicationStage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { applicationId, status, notes, interviewDate } = req.body;

    const application = await CareerApplication.findOne({
      _id: applicationId,
      user: userId,
    });

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
      message: 'Application pipeline stage updated.',
      application,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating application', error: error.message });
  }
};

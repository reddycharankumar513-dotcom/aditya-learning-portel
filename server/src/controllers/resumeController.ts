import { Request, Response } from 'express';
import { ResumeAnalysis } from '../models/ResumeAnalysis.js';
import { User } from '../models/User.js';
import { analyzeResumeContent } from '../services/resumeAIService.js';

export const analyzeResume = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const {
      resumeText,
      fileName = 'resume.pdf',
      targetRole = 'Full Stack Developer',
      targetJobDescription = '',
    } = req.body;

    if (!resumeText || resumeText.trim().length < 20) {
      res.status(400).json({
        message: 'Please provide valid resume content (at least 20 characters) for analysis.',
      });
      return;
    }

    const analysis = analyzeResumeContent(
      resumeText,
      targetRole,
      targetJobDescription
    );

    const record = await ResumeAnalysis.create({
      user: userId,
      fileName,
      targetRole,
      targetJobDescription,
      atsScore: analysis.atsScore,
      matchPercentage: analysis.matchPercentage,
      extractedSkills: analysis.extractedSkills,
      missingKeywords: analysis.missingKeywords,
      strengths: analysis.strengths,
      improvements: analysis.improvements,
      bulletPointSuggestions: analysis.bulletPointSuggestions,
      experienceSummary: analysis.experienceSummary,
      educationSummary: analysis.educationSummary,
    });

    // Update user readiness score
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $set: {
          'readinessBreakdown.resumeScore': analysis.atsScore,
        },
      });
    }

    res.json({
      success: true,
      analysis: record,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error analyzing resume', error: error.message });
  }
};

export const getResumeAnalyses = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const analyses = await ResumeAnalysis.find({ user: userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      analyses,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching resume analyses', error: error.message });
  }
};

import { Request, Response } from 'express';
import { Interview } from '../models/Interview.js';
import { User } from '../models/User.js';
import { generateQuestionsForRole, evaluateInterviewSubmission } from '../services/interviewAIService.js';

export const createInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const {
      role = 'Full Stack Developer',
      experienceLevel = 'Fresher / Entry',
      difficulty = 'Standard',
      type = 'Technical',
      mode = 'Text',
      jobDescription = '',
      durationMinutes = 20,
    } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Verify credits / entitlements
    if (user.credits <= 0 && user.plan === 'FREE') {
      res.status(403).json({
        message: 'You have exhausted your free AI interview credits. Please upgrade to Pro or purchase additional credits.',
      });
      return;
    }

    // Deduct credit if on FREE plan
    if (user.plan === 'FREE' && user.credits > 0) {
      user.credits -= 1;
      await user.save();
    }

    // Generate initial structured questions
    const questions = generateQuestionsForRole(role, type, experienceLevel);

    const interview = await Interview.create({
      user: userId,
      role,
      experienceLevel,
      difficulty,
      type,
      mode,
      jobDescription,
      durationMinutes,
      status: 'in_progress',
      currentQuestionIndex: 0,
      questions,
    });

    res.status(201).json({
      success: true,
      interview,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error initiating AI interview', error: error.message });
  }
};

export const getInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview) {
      res.status(404).json({ message: 'Interview session not found' });
      return;
    }

    res.json({
      success: true,
      interview,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching interview', error: error.message });
  }
};

export const submitAnswer = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { questionId, answer, timeSpentSeconds } = req.body;

    const interview = await Interview.findById(id);
    if (!interview) {
      res.status(404).json({ message: 'Interview session not found' });
      return;
    }

    const qIndex = interview.questions.findIndex((q) => q.id === questionId);
    if (qIndex === -1) {
      res.status(400).json({ message: 'Invalid question ID' });
      return;
    }

    interview.questions[qIndex].studentAnswer = answer || '';
    interview.questions[qIndex].timeSpentSeconds = timeSpentSeconds || 60;

    // Advance current question index if answering in sequence
    if (interview.currentQuestionIndex < interview.questions.length - 1) {
      interview.currentQuestionIndex += 1;
    }

    await interview.save();

    res.json({
      success: true,
      message: 'Answer recorded',
      currentQuestionIndex: interview.currentQuestionIndex,
      interview,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error submitting answer', error: error.message });
  }
};

export const completeInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const interview = await Interview.findById(id);

    if (!interview) {
      res.status(404).json({ message: 'Interview not found' });
      return;
    }

    // Run pedagogical evaluation engine across all answers
    const evaluation = evaluateInterviewSubmission(
      interview.questions,
      interview.durationMinutes
    );

    interview.status = 'completed';
    interview.questions = evaluation.evaluatedQuestions;
    interview.overallScore = evaluation.overallScore;
    interview.categoryScores = evaluation.categoryScores;
    interview.strengths = evaluation.strengths;
    interview.weaknesses = evaluation.weaknesses;
    interview.missingConcepts = evaluation.missingConcepts;
    interview.recommendedPracticeTopics = evaluation.recommendedPracticeTopics;

    await interview.save();

    // Update user readiness score and breakdown
    const userId = interview.user;
    await User.findByIdAndUpdate(userId, {
      $set: {
        'readinessBreakdown.interviewScore': evaluation.overallScore,
      },
    });

    res.json({
      success: true,
      message: 'Interview completed and evaluated successfully',
      interview,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error completing interview', error: error.message });
  }
};

export const getInterviewHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const interviews = await Interview.find({ user: userId })
      .sort({ createdAt: -1 })
      .select('role type difficulty mode status overallScore categoryScores createdAt durationMinutes');

    res.json({
      success: true,
      interviews,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching interview history', error: error.message });
  }
};

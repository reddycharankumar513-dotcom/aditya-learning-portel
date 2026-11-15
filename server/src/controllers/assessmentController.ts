import { Request, Response } from 'express';
import { Assessment, IAssessmentQuestion } from '../models/Assessment.js';
import { User } from '../models/User.js';
import { AIService } from '../services/ai/AIService.js';

export const assessmentController = {
  /**
   * POST /api/assessments/generate
   * Generates a dynamic AI-powered assessment and returns a sanitized student view
   */
  async generateAssessment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Authentication required' });
      }

      const {
        role = 'Full Stack Developer',
        skill = 'Full Stack & Software Engineering',
        difficulty = 'Intermediate',
        questionCount = 5,
        durationMinutes = 15,
      } = req.body;

      const count = Math.min(15, Math.max(3, parseInt(questionCount, 10) || 5));
      const duration = Math.min(60, Math.max(5, parseInt(durationMinutes, 10) || 15));

      // Generate questions via AIService (Multi-provider with automatic failover)
      const aiResult = await AIService.generateAssessmentQuestions({
        role,
        skill,
        difficulty,
        count,
        userId: userId.toString(),
      });

      const maxScore = aiResult.questions.reduce((sum: number, q: any) => sum + (q.maxMarks || 2), 0);

      const assessment = await Assessment.create({
        user: userId,
        title: `${role} — ${skill} Assessment`,
        role,
        skill,
        difficulty,
        durationMinutes: duration,
        status: 'created',
        questions: aiResult.questions,
        score: 0,
        maxScore,
        percentage: 0,
        proficiency: 'Intermediate',
        topicBreakdown: [],
        skillGaps: [],
        learningRecommendations: [],
      });

      return res.status(201).json({
        success: true,
        message: 'Assessment generated successfully',
        assessment: assessment.toSafeStudentView(),
      });
    } catch (err: any) {
      console.error('[AssessmentController] Error generating assessment:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to generate assessment',
      });
    }
  },

  /**
   * GET /api/assessments
   * Lists all past assessments for the authenticated student
   */
  async getAssessments(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      const assessments = await Assessment.find({ user: userId })
        .sort({ createdAt: -1 })
        .select('-questions.correctAnswer');

      return res.status(200).json({
        success: true,
        assessments,
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * GET /api/assessments/:id
   * Retrieves an assessment by ID with strict ownership validation
   */
  async getAssessmentById(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      const { id } = req.params;

      const assessment = await Assessment.findById(id);
      if (!assessment) {
        return res.status(404).json({ success: false, message: 'Assessment not found' });
      }

      if (assessment.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized access to assessment' });
      }

      return res.status(200).json({
        success: true,
        assessment: assessment.toSafeStudentView(),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/assessments/:id/start
   * Marks assessment as in_progress and records start timestamp
   */
  async startAssessment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      const { id } = req.params;

      const assessment = await Assessment.findById(id);
      if (!assessment) {
        return res.status(404).json({ success: false, message: 'Assessment not found' });
      }

      if (assessment.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      if (assessment.status === 'created') {
        assessment.status = 'in_progress';
        assessment.startedAt = new Date();
        await assessment.save();
      }

      return res.status(200).json({
        success: true,
        assessment: assessment.toSafeStudentView(),
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /api/assessments/:id/submit
   * Evaluates submitted answers, scores each question, runs subjective/coding AI review where needed,
   * compiles topic-wise analytics and learning recommendations, and reveals complete answer keys.
   */
  async submitAssessment(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.userId || (req as any).user?._id;
      const { id } = req.params;
      const { answers = {} } = req.body; // e.g. { "1": 0, "2": 1, ... }

      const assessment = await Assessment.findById(id);
      if (!assessment) {
        return res.status(404).json({ success: false, message: 'Assessment not found' });
      }

      if (assessment.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }

      let totalScore = 0;
      let totalMax = 0;
      const topicStats: Record<string, { score: number; maxScore: number }> = {};
      const skillGaps: any[] = [];

      // Evaluate each question securely on the backend
      for (const q of assessment.questions) {
        const studentAns = answers[q.id];
        q.selectedAnswer = studentAns;
        totalMax += q.maxMarks || 2;

        const topic = q.topic || 'Fundamentals';
        if (!topicStats[topic]) {
          topicStats[topic] = { score: 0, maxScore: 0 };
        }
        topicStats[topic].maxScore += q.maxMarks || 2;

        let isCorrect = false;
        let marks = 0;

        if (q.type === 'mcq_single' || q.type === 'true_false' || q.type === 'scenario') {
          // Strict index comparison
          isCorrect = Number(studentAns) === Number(q.correctAnswer);
          marks = isCorrect ? (q.maxMarks || 2) : 0;
          q.feedback = isCorrect 
            ? 'Correct! Solid grasp of foundational principles.' 
            : `Incorrect. The correct answer was option ${(Number(q.correctAnswer) + 1)}.`;
        } else if (q.type === 'mcq_multiple') {
          const expected = Array.isArray(q.correctAnswer) ? q.correctAnswer.map(Number) : [Number(q.correctAnswer)];
          const provided = Array.isArray(studentAns) ? studentAns.map(Number) : [Number(studentAns)];
          const matches = expected.every((e: number) => provided.includes(e)) && expected.length === provided.length;
          isCorrect = matches;
          marks = matches ? (q.maxMarks || 2) : 0;
        } else {
          // Short answer or code analysis: evaluate using AIService
          if (studentAns && String(studentAns).trim().length > 10) {
            try {
              const evalRes = await AIService.evaluateAnswer({
                question: q.question,
                expectedConcepts: q.evaluationCriteria,
                studentAnswer: String(studentAns),
                maxScore: q.maxMarks || 2,
                userId: userId.toString(),
              });
              marks = Math.min(q.maxMarks || 2, Math.max(0, evalRes.score || 0));
              isCorrect = marks >= ((q.maxMarks || 2) * 0.6);
              q.feedback = evalRes.feedback || 'Evaluated against key concept rubric.';
            } catch {
              marks = (q.maxMarks || 2) * 0.5;
              isCorrect = true;
            }
          }
        }

        q.isCorrect = isCorrect;
        q.marksAwarded = marks;
        totalScore += marks;
        topicStats[topic].score += marks;

        // Register skill gap if question was missed
        if (!isCorrect) {
          skillGaps.push({
            skill: `${q.skillCategory} — ${topic}`,
            category: q.skillCategory,
            status: 'Critical Gap',
            recommendation: `Review ${topic} concepts: ${q.explanation.slice(0, 90)}...`,
          });
        }
      }

      const percentage = Math.round((totalScore / Math.max(1, totalMax)) * 100);

      // Proficiency rating
      let proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' = 'Beginner';
      if (percentage >= 85) proficiency = 'Expert';
      else if (percentage >= 70) proficiency = 'Advanced';
      else if (percentage >= 50) proficiency = 'Intermediate';

      // Compile topic breakdown
      const topicBreakdown = Object.entries(topicStats).map(([topic, data]) => ({
        topic,
        score: data.score,
        maxScore: data.maxScore,
        percentage: Math.round((data.score / Math.max(1, data.maxScore)) * 100),
      }));

      // Generate Personalized Learning Recommendations
      const learningRecommendations: any[] = [];
      for (const t of topicBreakdown) {
        if (t.percentage < 65) {
          learningRecommendations.push({
            topic: t.topic,
            reason: `Scored ${t.percentage}% in ${t.topic}. Reinforcing this concept is vital for ${assessment.role}.`,
            suggestedResource: `Learnova Curated Path: ${t.topic} Mastery & Hands-on Coding Lab`,
            priority: t.percentage < 40 ? 'High' : 'Medium',
          });
        }
      }

      if (learningRecommendations.length === 0) {
        learningRecommendations.push({
          topic: `Advanced ${assessment.skill} Architecture`,
          reason: `Exceptional mastery demonstrated (${percentage}%). Advance to enterprise system design and microservices.`,
          suggestedResource: 'Learnova Senior Engineering Capstone & Live Lab',
          priority: 'Low',
        });
      }

      // Update assessment document
      assessment.score = totalScore;
      assessment.maxScore = totalMax;
      assessment.percentage = percentage;
      assessment.proficiency = proficiency;
      assessment.topicBreakdown = topicBreakdown;
      assessment.skillGaps = skillGaps;
      assessment.learningRecommendations = learningRecommendations;
      assessment.status = 'completed';
      assessment.completedAt = new Date();

      await assessment.save();

      // Recalculate and update user's career readiness score
      await User.findByIdAndUpdate(userId, {
        $set: {
          'readinessBreakdown.skillsScore': percentage,
        },
      });

      return res.status(200).json({
        success: true,
        message: 'Assessment submitted and evaluated successfully',
        assessment, // Full document with complete explanations & answer keys revealed
      });
    } catch (err: any) {
      console.error('[AssessmentController] Error submitting assessment:', err);
      return res.status(500).json({
        success: false,
        message: err.message || 'Failed to submit assessment',
      });
    }
  },
};

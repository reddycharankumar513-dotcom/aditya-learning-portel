import { Request, Response } from 'express';
import { User } from '../models/User.js';
import { Assessment } from '../models/Assessment.js';

export const getStudentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const user = await User.findById(userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'Student profile not found' });
      return;
    }

    res.json({
      success: true,
      profile: user,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving student profile', error: error.message });
  }
};

export const updateStudentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const {
      name,
      phone,
      college,
      degree,
      department,
      graduationYear,
      skills,
      careerInterests,
      preferredRoles,
      linkedin,
      github,
      portfolio,
      goals,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (college) user.college = college;
    if (degree) user.degree = degree;
    if (department) user.department = department;
    if (graduationYear) user.graduationYear = graduationYear;
    if (skills) user.skills = skills;
    if (careerInterests) user.careerInterests = careerInterests;
    if (preferredRoles) user.preferredRoles = preferredRoles;
    if (linkedin !== undefined) user.linkedin = linkedin;
    if (github !== undefined) user.github = github;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (goals !== undefined) user.goals = goals;

    // Recalculate Career Readiness Score based on profile completeness and skills
    let readinessScore = 50;
    if (user.skills && user.skills.length > 0) {
      readinessScore += Math.min(25, user.skills.length * 4);
    }
    if (user.github && user.linkedin) readinessScore += 10;
    if (user.college && user.degree) readinessScore += 5;
    user.careerReadinessScore = Math.min(95, readinessScore);

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: user,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
};

export const getAssessments = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const assessments = await Assessment.find({ user: userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      assessments,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching assessments', error: error.message });
  }
};

export const submitAssessment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;
    const { title, domain, answers } = req.body;

    // Default assessment sample questions
    const sampleQuestions = [
      {
        id: 1,
        question: 'Which HTTP method is idempotent according to REST specification?',
        options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
        correctAnswer: 1,
        explanation: 'PUT is idempotent: executing it multiple times with the same payload results in the exact same resource state.',
      },
      {
        id: 2,
        question: 'In React, what hook should be used to synchronize with external APIs or subscriptions?',
        options: ['useMemo', 'useEffect', 'useCallback', 'useRef'],
        correctAnswer: 1,
        explanation: 'useEffect is the hook for performing side-effects such as subscriptions, timers, or imperative APIs.',
      },
      {
        id: 3,
        question: 'What is the time complexity of searching an element in a balanced Binary Search Tree (AVL / Red-Black)?',
        options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
        correctAnswer: 2,
        explanation: 'A balanced BST maintains height proportional to log(n), guaranteeing O(log n) search, insertion, and deletion.',
      },
      {
        id: 4,
        question: 'In MongoDB, what does a compound index on { status: 1, createdAt: -1 } optimize?',
        options: [
          'Only queries filtering by createdAt',
          'Queries filtering by status and sorting by createdAt',
          'Only text searches on status',
          'Full collection scans',
        ],
        correctAnswer: 1,
        explanation: 'Compound indexes follow the Equality-Sort-Range (ESR) rule, optimizing equality matches on prefix followed by sorting.',
      },
      {
        id: 5,
        question: 'Which of the following creates a secure, tamper-proof session identifier between client and server?',
        options: ['Unsigned Base64 string in localStorage', 'Cryptographically signed JWT in httpOnly Secure cookie', 'Plaintext query parameter', 'Global window variable'],
        correctAnswer: 1,
        explanation: 'A cryptographically signed JWT stored in an httpOnly, Secure cookie prevents client-side XSS exfiltration and ensures authenticity.',
      },
    ];

    let score = 0;
    const evaluatedQuestions = sampleQuestions.map((q) => {
      const selected = answers ? answers[q.id] : undefined;
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score += 1;
      return {
        ...q,
        selectedAnswer: selected,
        isCorrect,
      };
    });

    const percentage = Math.round((score / sampleQuestions.length) * 100);

    const skillGaps = [
      {
        skill: 'REST Architecture & Idempotency',
        category: 'Backend',
        status: evaluatedQuestions[0].isCorrect ? 'Strong' : 'Critical Gap',
        recommendation: evaluatedQuestions[0].isCorrect
          ? 'Maintain strong understanding of HTTP method contracts.'
          : 'Review HTTP specifications on safe vs idempotent operations.',
      },
      {
        skill: 'React Lifecycle & Effects',
        category: 'Frontend',
        status: evaluatedQuestions[1].isCorrect ? 'Strong' : 'Needs Practice',
        recommendation: evaluatedQuestions[1].isCorrect
          ? 'Deepen knowledge of React 19 Concurrent Mode.'
          : 'Study effect cleanups and dependency array mechanics.',
      },
      {
        skill: 'Algorithm Complexity (BST)',
        category: 'Computer Science',
        status: evaluatedQuestions[2].isCorrect ? 'Strong' : 'Critical Gap',
        recommendation: evaluatedQuestions[2].isCorrect
          ? 'Excellent asymptotic analysis skills.'
          : 'Practice Big-O calculation on recursive tree traversals.',
      },
      {
        skill: 'Database Indexing & Optimization',
        category: 'Database',
        status: evaluatedQuestions[3].isCorrect ? 'Strong' : 'Needs Practice',
        recommendation: evaluatedQuestions[3].isCorrect
          ? 'Solid index design proficiency.'
          : 'Study MongoDB EXPLAIN execution plans and ESR rule.',
      },
      {
        skill: 'API Security & Authentication',
        category: 'Security',
        status: evaluatedQuestions[4].isCorrect ? 'Strong' : 'Critical Gap',
        recommendation: evaluatedQuestions[4].isCorrect
          ? 'Demonstrates security-first awareness.'
          : 'Review OWASP session management and secure cookie flags.',
      },
    ] as any;

    const assessment = await Assessment.create({
      user: userId,
      title: title || 'Full Stack & Software Engineering Assessment',
      domain: domain || 'Full Stack Development',
      questions: evaluatedQuestions,
      score,
      maxScore: sampleQuestions.length,
      percentage,
      skillGaps,
    });

    // Update user's career readiness score
    await User.findByIdAndUpdate(userId, {
      $set: {
        'readinessBreakdown.skillsScore': percentage,
      },
    });

    res.json({
      success: true,
      assessment,
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error submitting assessment', error: error.message });
  }
};

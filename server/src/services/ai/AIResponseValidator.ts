export class AIResponseValidator {
  /**
   * Validate and sanitize Assessment Questions payload
   */
  static validateQuestions(data: any): { isValid: boolean; questions: any[]; error?: string } {
    if (!data || typeof data !== 'object') {
      return { isValid: false, questions: [], error: 'Payload is not an object' };
    }

    const rawList = Array.isArray(data.questions) ? data.questions : Array.isArray(data) ? data : [];
    if (rawList.length === 0) {
      return { isValid: false, questions: [], error: 'No questions array found' };
    }

    const sanitized: any[] = [];
    for (let i = 0; i < rawList.length; i++) {
      const q = rawList[i];
      if (!q.question || typeof q.question !== 'string') continue;

      const options = Array.isArray(q.options) && q.options.length >= 2 
        ? q.options.map((o: any) => String(o)) 
        : ['True', 'False'];

      let correctAnswer = 0;
      if (typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < options.length) {
        correctAnswer = q.correctAnswer;
      } else if (typeof q.correctAnswer === 'string') {
        const foundIdx = options.findIndex((opt: string) => opt.toLowerCase() === q.correctAnswer.toLowerCase());
        correctAnswer = foundIdx >= 0 ? foundIdx : 0;
      }

      sanitized.push({
        id: q.id || i + 1,
        question: q.question.trim(),
        skillCategory: q.skillCategory || 'General',
        topic: q.topic || 'Fundamentals',
        difficulty: q.difficulty || 'Intermediate',
        type: q.type || 'mcq_single',
        options,
        correctAnswer,
        explanation: q.explanation || 'Detailed explanation provided upon completion.',
        evaluationCriteria: q.evaluationCriteria || 'Understanding of core concepts.',
        maxMarks: Number(q.maxMarks) || 2,
      });
    }

    if (sanitized.length === 0) {
      return { isValid: false, questions: [], error: 'All questions failed schema validation' };
    }

    return { isValid: true, questions: sanitized };
  }

  /**
   * Validate and sanitize Resume Analysis payload
   */
  static validateResumeAnalysis(data: any): { isValid: boolean; analysis: any; error?: string } {
    if (!data || typeof data !== 'object') {
      return { isValid: false, analysis: null, error: 'Payload is not an object' };
    }

    const overallScore = typeof data.overallScore === 'number' ? Math.min(100, Math.max(0, Math.round(data.overallScore))) : 75;
    const sectionScores = data.sectionScores || {};

    const sanitized = {
      overallScore,
      sectionScores: {
        skillsRelevance: Number(sectionScores.skillsRelevance) || 20,
        projectsExperience: Number(sectionScores.projectsExperience) || 16,
        experienceInternships: Number(sectionScores.experienceInternships) || 12,
        educationCertifications: Number(sectionScores.educationCertifications) || 8,
        resumeStructure: Number(sectionScores.resumeStructure) || 8,
        jobAlignment: Number(sectionScores.jobAlignment) || 8,
        writingQuality: Number(sectionScores.writingQuality) || 8,
      },
      extractedSkills: Array.isArray(data.extractedSkills) ? data.extractedSkills.map(String) : [],
      missingSkills: Array.isArray(data.missingSkills) ? data.missingSkills.map(String) : [],
      strengths: Array.isArray(data.strengths) ? data.strengths.map(String) : ['Clean structure and professional formatting.'],
      weaknesses: Array.isArray(data.weaknesses) ? data.weaknesses.map(String) : ['Add more quantifiable metrics to bullet points.'],
      bulletPointSuggestions: Array.isArray(data.bulletPointSuggestions)
        ? data.bulletPointSuggestions.map((b: any) => ({
            original: String(b.original || ''),
            improved: String(b.improved || ''),
            reason: String(b.reason || 'Employs Google XYZ formula with measurable outcomes.'),
          }))
        : [],
      improvementRecommendations: Array.isArray(data.improvementRecommendations)
        ? data.improvementRecommendations.map(String)
        : ['Quantify project achievements with metrics and business impact.'],
    };

    return { isValid: true, analysis: sanitized };
  }
}

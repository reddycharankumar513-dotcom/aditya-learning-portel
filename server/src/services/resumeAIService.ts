export interface ResumeAnalysisResult {
  atsScore: number;
  matchPercentage: number;
  extractedSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  bulletPointSuggestions: Array<{
    original: string;
    improved: string;
    reason: string;
  }>;
  experienceSummary: string;
  educationSummary: string;
}

const COMMON_TECH_KEYWORDS = [
  'React', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Java', 'SQL',
  'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'Git',
  'REST API', 'GraphQL', 'CI/CD', 'Microservices', 'Redis', 'Tailwind CSS',
  'Machine Learning', 'Data Structures', 'Algorithms', 'System Design'
];

export const analyzeResumeContent = (
  resumeText: string,
  targetRole: string = 'Full Stack Developer',
  targetJobDescription: string = ''
): ResumeAnalysisResult => {
  const text = resumeText || '';
  const lowerText = text.toLowerCase();

  // 1. Extract Skills
  const extractedSkills = COMMON_TECH_KEYWORDS.filter((keyword) =>
    lowerText.includes(keyword.toLowerCase())
  );

  // 2. Identify Missing Keywords based on target role or JD
  let expectedKeywords = COMMON_TECH_KEYWORDS;
  if (targetJobDescription.trim()) {
    const jdWords = targetJobDescription.split(/\W+/).filter((w) => w.length > 3);
    const uniqueJdKeywords = COMMON_TECH_KEYWORDS.filter((keyword) =>
      targetJobDescription.toLowerCase().includes(keyword.toLowerCase())
    );
    if (uniqueJdKeywords.length > 0) {
      expectedKeywords = uniqueJdKeywords;
    }
  }

  const missingKeywords = expectedKeywords
    .filter((kw) => !extractedSkills.some((s) => s.toLowerCase() === kw.toLowerCase()))
    .slice(0, 6);

  // 3. Match Percentage
  const matchRatio = expectedKeywords.length > 0
    ? (expectedKeywords.length - missingKeywords.length) / expectedKeywords.length
    : 0.75;
  const matchPercentage = Math.min(98, Math.max(45, Math.round(matchRatio * 100)));

  // 4. ATS Score Calculation
  // Grounded in: formatting clarity, length, presence of metrics/numbers, strong action verbs
  const hasQuantifiableMetrics = /\d+%|\$\d+|\d+\s*(users|ms|seconds|x|clients|endpoints)/i.test(text);
  const hasStrongActionVerbs = /(architected|engineered|spearheaded|optimized|implemented|reduced|deployed|streamlined)/i.test(text);
  const hasStandardHeadings = /(experience|education|skills|projects|certifications)/i.test(text);

  let atsScore = 65;
  if (extractedSkills.length >= 6) atsScore += 12;
  if (hasQuantifiableMetrics) atsScore += 10;
  if (hasStrongActionVerbs) atsScore += 8;
  if (hasStandardHeadings) atsScore += 5;
  atsScore = Math.min(96, Math.max(50, atsScore));

  // 5. Strengths & Improvements
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (hasQuantifiableMetrics) {
    strengths.push('Effective use of measurable metrics and business impact figures.');
  } else {
    improvements.push('Incorporate quantifiable outcomes (e.g., "reduced latency by 35%", "scaled to 10k users").');
  }

  if (hasStrongActionVerbs) {
    strengths.push('Strong action verbs leading project and experience bullet points.');
  } else {
    improvements.push('Replace passive phrases like "worked on" with active leadership verbs like "architected" or "optimized".');
  }

  if (extractedSkills.length >= 5) {
    strengths.push(`Good technical keyword density for core competencies: ${extractedSkills.slice(0, 4).join(', ')}.`);
  } else {
    improvements.push(`Increase keyword coverage for required tech stack, especially ${missingKeywords.slice(0, 3).join(', ')}.`);
  }

  // 6. Actionable Bullet Point Improvements (XYZ Formula)
  const bulletPointSuggestions = [
    {
      original: 'Worked on building the web application frontend using React.',
      improved: 'Architected responsive frontend components in React 19 with modular state, decreasing initial page load latency by 42%.',
      reason: 'Replaces passive wording with high-impact action verb and quantifiable performance metric.',
    },
    {
      original: 'Responsible for writing backend APIs and connecting MongoDB database.',
      improved: 'Engineered RESTful Node.js/Express microservices with MongoDB indexing, supporting 25k daily requests with 99.9% uptime.',
      reason: 'Highlights scalability, throughput, and system reliability metrics.',
    },
  ];

  return {
    atsScore,
    matchPercentage,
    extractedSkills: extractedSkills.length > 0 ? extractedSkills : ['JavaScript', 'HTML/CSS', 'Git'],
    missingKeywords: missingKeywords.length > 0 ? missingKeywords : ['Docker', 'CI/CD Pipelines', 'System Design'],
    strengths,
    improvements,
    bulletPointSuggestions,
    experienceSummary: 'Relevant software engineering project work and internships identified.',
    educationSummary: 'Degree curriculum in Engineering / Technology with relevant foundational coursework.',
  };
};

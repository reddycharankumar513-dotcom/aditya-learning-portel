export type UserRole = 'student' | 'admin' | 'instructor' | 'employer';

export interface UserSkill {
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  verified?: boolean;
}

export interface ReadinessBreakdown {
  skillsScore: number;
  interviewScore: number;
  resumeScore: number;
  projectsScore: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  adminRole?: 'super_admin' | 'finance_admin' | 'content_admin' | 'support_admin';
  permissions?: string[];
  isSuspended?: boolean;
  suspensionReason?: string;
  lastLoginAt?: string;
  consentShareProfile?: boolean;
  phone?: string;
  college?: string;
  degree?: string;
  department?: string;
  graduationYear?: number;
  country?: string;
  educationStatus?: string;
  learningInterests: string[];
  goals?: string;
  skills?: UserSkill[];
  careerInterests?: string[];
  preferredRoles?: string[];
  linkedin?: string;
  github?: string;
  portfolio?: string;
  careerReadinessScore?: number;
  readinessBreakdown?: ReadinessBreakdown;
  credits?: number;
  plan?: 'FREE' | 'STARTER' | 'PRO' | 'PREMIUM';
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

export interface InterviewQuestion {
  id: number;
  question: string;
  category: 'Technical' | 'HR' | 'Behavioral' | 'System Design' | 'Coding' | 'Problem Solving';
  studentAnswer?: string;
  timeSpentSeconds?: number;
  score?: number;
  feedback?: string;
  suggestedAnswer?: string;
  keyConcepts?: string[];
}

export interface CategoryScores {
  technicalKnowledge: number;
  answerRelevance: number;
  problemSolving: number;
  communicationClarity: number;
  answerStructure: number;
  timeManagement: number;
}

export interface Interview {
  _id: string;
  user: string;
  role: string;
  experienceLevel: 'Fresher / Entry' | '1-2 Years' | '3+ Years';
  difficulty: 'Standard' | 'Challenging' | 'Expert';
  type: 'Technical' | 'HR' | 'Behavioral' | 'Coding' | 'Role-based' | 'Mixed';
  mode: 'Text' | 'Voice' | 'Video';
  jobDescription?: string;
  durationMinutes: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  currentQuestionIndex: number;
  questions: InterviewQuestion[];
  overallScore: number;
  categoryScores: CategoryScores;
  strengths: string[];
  weaknesses: string[];
  missingConcepts: string[];
  recommendedPracticeTopics: string[];
  createdAt: string;
}

export interface SkillGap {
  skill: string;
  category: string;
  status: 'Strong' | 'Needs Practice' | 'Critical Gap';
  recommendation: string;
}

export interface AssessmentQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  selectedAnswer?: number;
  isCorrect?: boolean;
  explanation: string;
}

export interface Assessment {
  _id: string;
  user: string;
  title: string;
  domain: string;
  questions: AssessmentQuestion[];
  score: number;
  maxScore: number;
  percentage: number;
  skillGaps: SkillGap[];
  completedAt: string;
  createdAt: string;
}

export interface BulletSuggestion {
  original: string;
  improved: string;
  reason: string;
}

export interface ResumeAnalysis {
  _id: string;
  user?: string;
  fileName: string;
  targetRole: string;
  targetJobDescription?: string;
  atsScore: number;
  matchPercentage: number;
  extractedSkills: string[];
  missingKeywords: string[];
  strengths: string[];
  improvements: string[];
  bulletPointSuggestions: BulletSuggestion[];
  experienceSummary?: string;
  educationSummary?: string;
  createdAt: string;
}

// Preserve existing interfaces
export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'lecture' | 'exercise' | 'reading';
  content?: string;
}

export interface ModuleAssignment {
  id: string;
  title: string;
  instructions: string;
  starterCode?: string;
}

export interface CourseModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: Lesson[];
  assignment?: ModuleAssignment;
}

export interface Course {
  _id: string;
  id?: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  iconName?: string;
  modules: CourseModule[];
  learningObjectives: string[];
  prerequisites: string[];
  isPublished: boolean;
  instructorName?: string;
  instructorRole?: string;
  enrolledStudents?: number;
  enrolledCount?: number;
  featured?: boolean;
}

export interface Enrollment {
  _id: string;
  userId: string;
  courseId: string;
  course: Course;
  progress: number;
  completedModules: string[];
  status: 'active' | 'completed';
  enrolledAt: string;
  lastActivityAt: string;
}

export interface StudentProject {
  _id: string;
  userId?: string;
  title: string;
  description: string;
  techStack: string[];
  status: 'In Progress' | 'Completed' | 'Planning';
  repoUrl?: string;
  demoUrl?: string;
  createdAt?: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface AIConversation {
  _id: string;
  userId: string;
  title: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface Internship {
  _id: string;
  title: string;
  type: 'Technical Internship' | 'Apprenticeship' | 'Research Fellow' | 'Training Program';
  description: string;
  skills: string[];
  eligibility: string;
  duration: string;
  location: string;
  deadline: string;
  isPublished: boolean;
  hasApplied?: boolean;
}

export interface InternshipApplication {
  _id: string;
  userId: string;
  internshipId: string;
  internship?: Internship;
  status: 'Submitted' | 'Under Review' | 'Shortlisted' | 'Accepted' | 'Declined';
  appliedAt: string;
  resumeUrl?: string;
  notes?: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface ContactInquiry {
  _id: string;
  name: string;
  email: string;
  subject: string;
  category: 'General Inquiry' | 'Courses' | 'Technical Support' | 'Partnerships' | 'Career Opportunities';
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  createdAt: string;
}

export interface Recommendation {
  course: Course;
  reason: string;
  matchScore: number;
}

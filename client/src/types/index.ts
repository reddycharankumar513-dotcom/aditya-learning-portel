export type UserRole = 'student' | 'admin' | 'instructor';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  country?: string;
  educationStatus?: string;
  learningInterests: string[];
  goals?: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message?: string;
}

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
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  iconName: string;
  modules: CourseModule[];
  learningObjectives: string[];
  prerequisites: string[];
  isPublished: boolean;
  instructorName?: string;
  instructorRole?: string;
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

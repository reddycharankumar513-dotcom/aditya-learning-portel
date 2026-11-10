import { api } from './api';

export interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  estimatedHours: number;
  resources: Array<{ title: string; url?: string; type: 'doc' | 'video' | 'exercise' }>;
}

export interface RoadmapStage {
  id: string;
  title: string;
  level: string;
  description: string;
  topics: RoadmapTopic[];
}

export interface PersonalizedRoadmapData {
  _id: string;
  targetRole: string;
  weeklyHours: number;
  progressPercentage: number;
  stages: RoadmapStage[];
}

export interface CodingProblem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: Array<{ input: string; output: string }>;
  starterCode: Record<string, string>;
  testCases: Array<{ input: any; expected: any }>;
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  techStack: string[];
  overview: string;
  milestones: string[];
  githubTemplate: string;
}

export const learningPlusService = {
  getRoadmap: async (): Promise<{ success: boolean; roadmap: PersonalizedRoadmapData }> => {
    return api.get('/api/learning-plus/roadmap');
  },

  toggleMilestone: async (
    topicId: string,
    completed: boolean
  ): Promise<{ success: boolean; progressPercentage: number; roadmap: PersonalizedRoadmapData }> => {
    return api.post('/api/learning-plus/roadmap/toggle', { topicId, completed });
  },

  getCodingProblems: async (): Promise<{ success: boolean; problems: CodingProblem[] }> => {
    return api.get('/api/learning-plus/coding/problems');
  },

  submitCode: async (
    problemId: string,
    language: string,
    code: string
  ): Promise<{
    success: boolean;
    submission: {
      status: string;
      testsPassed: number;
      totalTests: number;
      runtimeMs: number;
      memoryKb: number;
    };
    message: string;
  }> => {
    return api.post('/api/learning-plus/coding/submit', { problemId, language, code });
  },

  getProjectRecommendations: async (): Promise<{
    success: boolean;
    recommendations: ProjectRecommendation[];
  }> => {
    return api.get('/api/learning-plus/projects/recommendations');
  },
};

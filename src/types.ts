export type Section = 'home' | 'learn' | 'prepare' | 'test';
export type LearnTopic = 'overview' | 'linear-overview' | 'array' | 'string' | 'stack' | 'queue' | 'linked-list' | 'non-linear-overview' | 'tree' | 'graph' | 'sorting' | 'searching-graphs';
export type LearnMode = 'overview' | 'flashcards' | 'quiz' | 'spaced';
export type TestMode = 'overview' | 'mcq-dsa' | 'mcq-role' | 'coding-topic' | 'company-round' | 'comprehensive-company-test';

export interface CodingPlatformStats {
  platform: string;
  username: string;
  totalSolved: number;
  difficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  streak: number;
  rating?: number;
  badges: string[];
}

export interface DSATopicProgress {
  topic: string;
  total: number;
  solved: number;
  percentage: number;
}

export interface InterviewReadinessScore {
  overall: number;
  dsaPractice: number;
  aptitude: number;
  codingActivity: number;
  mockInterview: number;
  suggestions: string[];
}

export interface TopicPerformance {
  topic: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface TestResult {
  id: string;
  title: string;
  score: string;
  total: number;
  correct: number;
  time: string;
  status: 'Completed' | 'Practice' | 'Studied';
  feedback: string;
  weaknesses: string[];
  improvements: string[];
  topicAnalysis?: TopicPerformance[];
}

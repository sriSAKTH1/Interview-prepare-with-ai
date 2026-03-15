export type Section = 'home' | 'learn' | 'prepare' | 'test' | 'settings';
export type LearnTopic = 'overview' | 'questions-approach' | 'linear-overview' | 'array' | 'string' | 'stack' | 'queue' | 'linked-list' | 'non-linear-overview' | 'tree' | 'graph' | 'sorting' | 'bubble-sort' | 'selection-sort' | 'insertion-sort' | 'merge-sort' | 'quick-sort' | 'heap-sort' | 'bucket-sort' | 'searching-graphs' | 'linear-search' | 'binary-search' | 'bfs' | 'dfs';
export type LearnMode = 'overview' | 'flashcards' | 'quiz' | 'spaced' | 'intro';
export type TestMode = 'overview' | 'mcq-dsa' | 'mcq-role' | 'company-round' | 'aptitude' | 'comprehensive-company-test' | 'input-output';

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
  questions?: any[];
  userAnswers?: (number | string)[];
}

export interface CompletedTopic {
  id: string;
  topicId: string;
  topicName: string;
  category: string;
  completedAt: string;
}

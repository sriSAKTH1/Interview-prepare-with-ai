import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Code2, 
  Trophy, 
  TrendingUp, 
  Plus, 
  Search, 
  Building2, 
  Briefcase, 
  Target, 
  CheckCircle2, 
  AlertCircle,
  User,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CodingPlatformStats, DSATopicProgress, InterviewReadinessScore } from '../types';

export function CodingDashboard({ onStartTest }: { onStartTest: (mode: any, company?: string, role?: string) => void }) {
  const [usernames, setUsernames] = useState({
    leetcode: '',
    hackerrank: '',
    codechef: '',
    geeksforgeeks: ''
  });

  const [platformStats, setPlatformStats] = useState<CodingPlatformStats[]>([
    {
      platform: 'LeetCode',
      username: 'sudharsan_01',
      totalSolved: 450,
      difficulty: { easy: 150, medium: 250, hard: 50 },
      streak: 15,
      rating: 1850,
      badges: ['Knight', 'Daily Challenge']
    },
    {
      platform: 'HackerRank',
      username: 'sudharsan_hr',
      totalSolved: 120,
      difficulty: { easy: 60, medium: 40, hard: 20 },
      streak: 5,
      badges: ['5 Star Problem Solving']
    }
  ]);

  const [dsaProgress, setDsaProgress] = useState<DSATopicProgress[]>([
    { topic: 'Arrays', total: 100, solved: 80, percentage: 80 },
    { topic: 'Strings', total: 80, solved: 50, percentage: 62.5 },
    { topic: 'Binary Search', total: 50, solved: 30, percentage: 60 },
    { topic: 'Stack', total: 40, solved: 25, percentage: 62.5 },
    { topic: 'Queue', total: 30, solved: 15, percentage: 50 },
    { topic: 'Linked List', total: 60, solved: 40, percentage: 66.7 },
    { topic: 'Trees', total: 120, solved: 60, percentage: 50 },
    { topic: 'Graphs', total: 100, solved: 20, percentage: 20 },
    { topic: 'Dynamic Programming', total: 150, solved: 45, percentage: 30 },
    { topic: 'Greedy Algorithms', total: 70, solved: 35, percentage: 50 },
    { topic: 'Backtracking', total: 50, solved: 15, percentage: 30 }
  ]);

  const [readinessScore, setReadinessScore] = useState<InterviewReadinessScore>({
    overall: 72,
    dsaPractice: 65,
    aptitude: 80,
    codingActivity: 75,
    mockInterview: 68,
    suggestions: [
      'Focus more on Graph algorithms and Dynamic Programming.',
      'Improve your mock interview performance by practicing behavioral questions.',
      'Maintain your daily streak on LeetCode to boost coding activity score.'
    ]
  });

  const [companySearch, setCompanySearch] = useState({ company: '', role: '' });

  const difficultyData = [
    { name: 'Easy', value: platformStats.reduce((acc, curr) => acc + curr.difficulty.easy, 0), color: '#10b981' },
    { name: 'Medium', value: platformStats.reduce((acc, curr) => acc + curr.difficulty.medium, 0), color: '#f59e0b' },
    { name: 'Hard', value: platformStats.reduce((acc, curr) => acc + curr.difficulty.hard, 0), color: '#ef4444' }
  ];

  return (
    <div className="space-y-8">
      {/* Platform Integration & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code2 className="text-indigo-600 dark:text-indigo-400" /> Coding Platforms
              </h2>
              <button className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1">
                <Plus size={16} /> Add Platform
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['LeetCode', 'HackerRank', 'CodeChef', 'GeeksforGeeks'].map((platform) => (
                <div key={platform} className="relative">
                  <input
                    type="text"
                    placeholder={`${platform} Username`}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white dark:placeholder:text-slate-500"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                    <User size={18} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {platformStats.map((stats) => (
              <div key={stats.platform} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold">
                      {stats.platform[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{stats.platform}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">@{stats.username}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalSolved}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Solved</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Difficulty Distribution</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold">View Details</span>
                  </div>
                  <div className="flex h-2 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <div className="bg-emerald-500" style={{ width: `${(stats.difficulty.easy / stats.totalSolved) * 100}%` }} />
                    <div className="bg-amber-500" style={{ width: `${(stats.difficulty.medium / stats.totalSolved) * 100}%` }} />
                    <div className="bg-red-500" style={{ width: `${(stats.difficulty.hard / stats.totalSolved) * 100}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
                    <span>E: {stats.difficulty.easy}</span>
                    <span>M: {stats.difficulty.medium}</span>
                    <span>H: {stats.difficulty.hard}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-orange-500" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{stats.streak} Day Streak</span>
                  </div>
                  {stats.rating && (
                    <div className="flex items-center gap-2">
                      <Trophy size={14} className="text-amber-500" />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Rating: {stats.rating}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interview Readiness Score */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Target className="text-indigo-600 dark:text-indigo-400" /> Interview Readiness
            </h2>
            
            <div className="relative w-48 h-48 mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="12"
                  strokeDasharray={552.92}
                  strokeDashoffset={552.92 * (1 - readinessScore.overall / 100)}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-900 dark:text-white">{readinessScore.overall}</span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Score</span>
              </div>
            </div>

            <div className="w-full space-y-3">
              <ScoreBar label="DSA Practice" value={readinessScore.dsaPractice} color="bg-indigo-500" />
              <ScoreBar label="Aptitude" value={readinessScore.aptitude} color="bg-emerald-500" />
              <ScoreBar label="Coding Activity" value={readinessScore.codingActivity} color="bg-amber-500" />
              <ScoreBar label="Mock Interview" value={readinessScore.mockInterview} color="bg-rose-500" />
            </div>

            <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-left w-full">
              <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2">
                <TrendingUp size={14} /> Improvement Suggestions
              </h4>
              <ul className="space-y-2">
                {readinessScore.suggestions.map((s, i) => (
                  <li key={i} className="text-[10px] text-indigo-700 dark:text-indigo-400 flex items-start gap-2">
                    <div className="w-1 h-1 bg-indigo-400 dark:bg-indigo-600 rounded-full mt-1.5 flex-shrink-0" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* DSA Topic Progress */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Coding Progress Dashboard</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track your mastery across key DSA topics</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-indigo-600 rounded-full" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Solved</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-100 dark:bg-slate-800 rounded-full" />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Remaining</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-6">
          {dsaProgress.map((topic) => (
            <div key={topic.topic} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-700 dark:text-slate-300">{topic.topic}</span>
                <span className="text-slate-400 dark:text-slate-500 font-mono">{topic.solved}/{topic.total} <span className="text-indigo-600 dark:text-indigo-400 font-bold">({topic.percentage}%)</span></span>
              </div>
              <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${topic.percentage}%` }}
                  className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Company Mock Test Generator */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="flex-1 space-y-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
              <Building2 size={24} />
            </div>
            <h2 className="text-3xl font-bold">Company-Specific Mock Test</h2>
            <p className="text-indigo-100 max-w-md">
              Enter a company and role to generate a tailored mock test based on previous interview patterns.
            </p>
          </div>

          <div className="w-full lg:w-auto flex-shrink-0 bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/20 space-y-4 min-w-[320px]">
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={companySearch.company}
                  onChange={(e) => setCompanySearch({ ...companySearch, company: e.target.value })}
                  placeholder="Company Name (e.g., TCS)"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-sm placeholder:text-indigo-200 outline-none focus:bg-white/20 transition-all"
                />
                <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-200" />
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={companySearch.role}
                  onChange={(e) => setCompanySearch({ ...companySearch, role: e.target.value })}
                  placeholder="Job Role (e.g., Software Developer)"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-sm placeholder:text-indigo-200 outline-none focus:bg-white/20 transition-all"
                />
                <Briefcase size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-200" />
              </div>
            </div>
            <button 
              onClick={() => onStartTest('comprehensive-company-test', companySearch.company, companySearch.role)}
              className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Zap size={18} fill="currentColor" />
              Generate Mock Test
            </button>
            <p className="text-[10px] text-center text-indigo-200 font-medium">
              Includes Aptitude, Technical MCQs, and Coding Challenges
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
}

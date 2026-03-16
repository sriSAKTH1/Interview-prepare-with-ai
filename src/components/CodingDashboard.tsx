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
  Settings,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Github
} from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CodingPlatformStats, DSATopicProgress, InterviewReadinessScore } from '../types';
import { fetchAllPlatformStats, PlatformStats } from '../services/platformService';

export function CodingDashboard({ 
  onStartTest,
  initialStats = [],
  initialUsernames = {
    leetcode: '',
    codeforces: '',
    codechef: '',
    hackerrank: '',
    github: ''
  },
  onGoToSettings,
  aptitudeScore = 70
}: { 
  onStartTest: (config: any) => void,
  initialStats?: PlatformStats[],
  initialUsernames?: any,
  onGoToSettings?: () => void,
  aptitudeScore?: number
}) {
  const [usernames, setUsernames] = useState(() => {
    const saved = localStorage.getItem('coding_usernames');
    return saved ? JSON.parse(saved) : initialUsernames;
  });

  const [platformStats, setPlatformStats] = useState<PlatformStats[]>(initialStats);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    if (initialStats.length > 0 && platformStats.length === 0) {
      setPlatformStats(initialStats);
    }
  }, [initialStats]);

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
    overall: 0,
    dsaPractice: 0,
    aptitude: Math.min(aptitudeScore, 70),
    codingActivity: 0,
    mockInterview: 0,
    suggestions: [
      'Connect your coding platforms to see your interview readiness score.',
      'Maintain your daily streak on LeetCode to boost coding activity score.'
    ]
  });

  useEffect(() => {
    if (platformStats.length > 0) {
      const leetcodeStats = platformStats.find(s => s.platform === 'LeetCode');
      const totalSolved = leetcodeStats ? leetcodeStats.totalSolved : platformStats.reduce((acc, curr) => acc + (curr.totalSolved || 0), 0);
      
      // Update DSA progress based on total solved
      // We'll distribute the total solved across topics proportionally to their difficulty/importance
      const weights = [
        { topic: 'Arrays', weight: 0.15, total: 100 },
        { topic: 'Strings', weight: 0.12, total: 80 },
        { topic: 'Binary Search', weight: 0.08, total: 50 },
        { topic: 'Stack', weight: 0.06, total: 40 },
        { topic: 'Queue', weight: 0.04, total: 30 },
        { topic: 'Linked List', weight: 0.08, total: 60 },
        { topic: 'Trees', weight: 0.12, total: 120 },
        { topic: 'Graphs', weight: 0.10, total: 100 },
        { topic: 'Dynamic Programming', weight: 0.12, total: 150 },
        { topic: 'Greedy Algorithms', weight: 0.08, total: 70 },
        { topic: 'Backtracking', weight: 0.05, total: 50 }
      ];

      const newProgress = weights.map(w => {
        const solved = Math.min(w.total, Math.round(totalSolved * w.weight));
        return {
          topic: w.topic,
          total: w.total,
          solved: solved,
          percentage: Math.round((solved / w.total) * 100)
        };
      });
      setDsaProgress(newProgress);

      const avgRating = platformStats.filter(s => s.rating && s.rating > 0).reduce((acc, curr, _, arr) => acc + (curr.rating || 0) / arr.length, 0);
      
      // Dynamic calculation logic
      const dsaScore = Math.min(100, Math.round((totalSolved / 500) * 100));
      const activityScore = Math.min(100, platformStats.length * 20 + (totalSolved > 100 ? 20 : 0));
      const mockScore = 65 + Math.floor(Math.random() * 10); // Simulated for now
      
      const overall = Math.round((dsaScore + Math.min(aptitudeScore, 70) + activityScore + mockScore) / 4);
      
      const newSuggestions = [];
      if (dsaScore < 50) newSuggestions.push('Focus on solving more problems on LeetCode and Codeforces.');
      if (totalSolved < 100) newSuggestions.push('Aim for at least 100 solved problems to improve your foundation.');
      if (platformStats.length < 3) newSuggestions.push('Connect more platforms like GitHub and CodeChef for a better profile.');
      if (newSuggestions.length === 0) newSuggestions.push('Your progress is excellent! Keep practicing advanced topics.');

      setReadinessScore({
        overall,
        dsaPractice: dsaScore,
        aptitude: Math.min(aptitudeScore, 70),
        codingActivity: activityScore,
        mockInterview: mockScore,
        suggestions: newSuggestions
      });
    }
  }, [platformStats]);

  useEffect(() => {
    localStorage.setItem('coding_usernames', JSON.stringify(usernames));
  }, [usernames]);

  useEffect(() => {
    const hasUsernames = Object.values(usernames).some(v => v !== '');
    if (hasUsernames) {
      refreshStats();
    }
  }, []);

  const refreshStats = async () => {
    setIsLoading(true);
    try {
      const stats = await fetchAllPlatformStats({
        leetcode: usernames.leetcode,
        codeforces: usernames.codeforces,
        codechef: usernames.codechef,
        github: usernames.github,
        hackerrank: usernames.hackerrank
      });
      setPlatformStats(stats);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUsernameChange = (platform: string, value: string) => {
    setUsernames(prev => ({ ...prev, [platform.toLowerCase()]: value }));
  };

  const [companySearch, setCompanySearch] = useState({ company: '', role: '' });

  const difficultyData = [
    { name: 'Easy', value: platformStats.reduce((acc, curr) => acc + (curr.difficulty?.easy || 0), 0), color: '#10b981' },
    { name: 'Medium', value: platformStats.reduce((acc, curr) => acc + (curr.difficulty?.medium || 0), 0), color: '#f59e0b' },
    { name: 'Hard', value: platformStats.reduce((acc, curr) => acc + (curr.difficulty?.hard || 0), 0), color: '#ef4444' }
  ];

  return (
    <div className="space-y-8">
      {/* Global Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
            <Trophy size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Total Solved</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">
              {platformStats.reduce((acc, curr) => acc + (curr.totalSolved || 0), 0)}
            </h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Platforms</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{platformStats.length}</h3>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Readiness</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white">{readinessScore.overall}%</h3>
          </div>
        </div>
      </div>

      {/* Platform Integration & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-end mb-6">
              <button 
                onClick={refreshStats}
                disabled={isLoading}
                className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1 disabled:opacity-50"
              >
                {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                Refresh Stats
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'LeetCode', key: 'leetcode', icon: Code2 },
                { name: 'Codeforces', key: 'codeforces', icon: Activity },
                { name: 'CodeChef', key: 'codechef', icon: Trophy },
                { name: 'HackerRank', key: 'hackerrank', icon: Target },
                { name: 'GitHub', key: 'github', icon: Github }
              ].map((platform) => (
                <div key={platform.key} className="relative group">
                  <input
                    type="text"
                    readOnly
                    value={usernames[platform.key as keyof typeof usernames]}
                    onClick={onGoToSettings}
                    placeholder={`${platform.name} Username`}
                    className="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700 transition-all dark:text-white dark:placeholder:text-slate-500"
                  />
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-600 dark:text-indigo-400">
                    <platform.icon size={18} />
                  </div>
                  <button 
                    onClick={onGoToSettings}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Settings size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isLoading && platformStats.length === 0 && (
              <div className="md:col-span-2 py-12 text-center">
                <RefreshCw size={32} className="animate-spin text-indigo-600 mx-auto mb-4" />
                <p className="text-sm text-slate-500 dark:text-slate-400">Fetching your coding data...</p>
              </div>
            )}

            {platformStats.map((stats) => (
              <div key={stats.platform} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-900 transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold">
                      {stats.platform === 'GitHub' ? <Github size={20} /> : stats.platform[0]}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{stats.platform}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">@{stats.username}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{stats.totalSolved || stats.rating || 0}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">{stats.platform === 'GitHub' ? 'Total Repos' : (stats.totalSolved ? 'Solved' : 'Rating')}</span>
                  </div>
                </div>
                
                {stats.difficulty && stats.totalSolved > 0 && stats.platform !== 'GitHub' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 dark:text-slate-400">Progress Breakdown</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                        <CheckCircle2 size={12} /> Easy: {stats.difficulty.easy}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                        <CheckCircle2 size={12} /> Medium: {stats.difficulty.medium}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-lg">
                        <CheckCircle2 size={12} /> Hard: {stats.difficulty.hard}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-lg">
                        <CheckCircle2 size={12} /> Total: {stats.totalSolved}
                      </div>
                    </div>
                    <div className="flex h-1.5 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 mt-2">
                      <div className="bg-emerald-500" style={{ width: `${(stats.difficulty.easy / stats.totalSolved) * 100}%` }} />
                      <div className="bg-amber-500" style={{ width: `${(stats.difficulty.medium / stats.totalSolved) * 100}%` }} />
                      <div className="bg-red-500" style={{ width: `${(stats.difficulty.hard / stats.totalSolved) * 100}%` }} />
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-orange-500" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">{stats.rank || 'Active'}</span>
                  </div>
                  {stats.rating !== undefined && stats.rating > 0 && (
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
                <span className="text-3xl font-black text-slate-900 dark:text-white">{readinessScore.overall}</span>
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Score</span>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {platformStats.find(s => s.platform === 'LeetCode') && <Code2 className="text-orange-500" size={24} />}
              {platformStats.find(s => s.platform === 'LeetCode') ? 'LeetCode' : 'Coding'} Progress Dashboard
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {platformStats.find(s => s.platform === 'LeetCode') 
                ? 'Topic mastery estimated from your LeetCode problem-solving activity' 
                : 'Track your mastery across key DSA topics'}
            </p>
          </div>
          
          {platformStats.find(s => s.platform === 'LeetCode') && (
            <div className="flex items-center gap-6 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
              <div className="text-center">
                <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Easy</p>
                <p className="text-lg font-black dark:text-white">{platformStats.find(s => s.platform === 'LeetCode')?.difficulty?.easy}</p>
              </div>
              <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700" />
              <div className="text-center">
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase">Medium</p>
                <p className="text-lg font-black dark:text-white">{platformStats.find(s => s.platform === 'LeetCode')?.difficulty?.medium}</p>
              </div>
              <div className="w-[1px] h-8 bg-slate-200 dark:bg-slate-700" />
              <div className="text-center">
                <p className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase">Hard</p>
                <p className="text-lg font-black dark:text-white">{platformStats.find(s => s.platform === 'LeetCode')?.difficulty?.hard}</p>
              </div>
            </div>
          )}

          <div className="hidden xl:flex items-center gap-4">
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
                <span className="text-slate-400 dark:text-slate-500 font-mono">
                  {topic.solved}/{topic.total} 
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-1">({topic.percentage}%)</span>
                  {platformStats.find(s => s.platform === 'LeetCode') && (
                    <span className="ml-2 text-[8px] px-1 bg-slate-100 dark:bg-slate-800 rounded text-slate-400 uppercase">Est.</span>
                  )}
                </span>
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
              onClick={() => onStartTest({ mode: 'comprehensive-company-test', company: companySearch.company, role: companySearch.role })}
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

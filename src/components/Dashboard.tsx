import { useState, useEffect, useMemo } from 'react';
import { Clock, ClipboardCheck, BarChart3, Award, Layout, ChevronRight, Code2, Target, Sparkles, CheckCircle2, BookOpen, Edit2, X, Trophy, Globe, Github, Activity, MapPin, Settings as SettingsIcon, Plus } from 'lucide-react';
import { TestResult, CompletedTopic } from '../types';
import { CodingDashboard } from './CodingDashboard';
import { InterviewReadiness } from './InterviewReadiness';
import { motion, AnimatePresence } from 'motion/react';
import { fetchAllPlatformStats, PlatformStats } from '../services/platformService';

export function Dashboard({ 
  history, 
  onStartTest, 
  careerPath, 
  setCareerPath,
  completedTopics = [],
  user,
  userData,
  onViewResult,
  onGoToSettings,
  onOpenRoadmap,
  usernames: propUsernames
}: { 
  history: TestResult[], 
  onStartTest: (config: any) => void,
  careerPath: string,
  setCareerPath: (path: string) => void,
  completedTopics?: CompletedTopic[],
  user?: any,
  userData?: any,
  onViewResult?: (result: TestResult) => void,
  onGoToSettings?: () => void,
  onOpenRoadmap?: () => void,
  usernames?: any
}) {
  const [isChangingPath, setIsChangingPath] = useState(false);
  const [platformStats, setPlatformStats] = useState<PlatformStats[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  const studyHours = userData?.totalStudyMinutes 
    ? (userData.totalStudyMinutes / 60).toFixed(1) + 'h'
    : '0.0h';
  
  const [activeTab, setActiveTab] = useState<'overview' | 'readiness' | 'coding'>('overview');

  const usernames = useMemo(() => {
    if (propUsernames) return propUsernames;
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('coding_usernames');
      return saved ? JSON.parse(saved) : {
        leetcode: '',
        codeforces: '',
        codechef: '',
        hackerrank: '',
        github: ''
      };
    }
    return { leetcode: '', codeforces: '', codechef: '', hackerrank: '', github: '' };
  }, [propUsernames]);

  useEffect(() => {
    const hasUsernames = Object.values(usernames).some(v => v !== '');
    console.log('Dashboard usernames:', usernames, 'hasUsernames:', hasUsernames);
    if (hasUsernames) {
      const fetchStats = async () => {
        setIsLoadingStats(true);
        console.log('Fetching platform stats...');
        try {
          const stats = await fetchAllPlatformStats(usernames);
          console.log('Fetched stats:', stats);
          setPlatformStats(stats);
        } catch (error) {
          console.error('Failed to fetch stats in Dashboard:', error);
        } finally {
          setIsLoadingStats(false);
        }
      };
      fetchStats();
    }
  }, [usernames]);

  const [aptitudeScore, setAptitudeScore] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aptitude_mastery_score');
      const lastUpdate = localStorage.getItem('aptitude_last_decay_date');
      let score = saved ? parseFloat(saved) : 68; // Start near 70
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (lastUpdate) {
        const lastDate = new Date(lastUpdate);
        lastDate.setHours(0, 0, 0, 0);
        const diffTime = today.getTime() - lastDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays > 0) {
          // Reduce 1.5 points per day of inactivity
          score = Math.max(0, score - (diffDays * 1.5));
          localStorage.setItem('aptitude_mastery_score', score.toString());
          localStorage.setItem('aptitude_last_decay_date', today.toISOString());
        }
      } else {
        localStorage.setItem('aptitude_last_decay_date', today.toISOString());
        localStorage.setItem('aptitude_mastery_score', score.toString());
      }
      return Math.min(score, 70);
    }
    return 68;
  });

  const totalSolved = platformStats.reduce((acc, curr) => acc + (curr.totalSolved || 0), 0);
  const leetcodeSolved = platformStats.find(s => s.platform === 'LeetCode')?.totalSolved || 0;
  const platformsCount = platformStats.length;

  // Calculate a simplified readiness score for the overview card
  const calculateReadiness = () => {
    const dsaPractice = Math.min(100, (completedTopics.length * 5));
    const aptitude = Math.min(100, aptitudeScore);
    const mockInterview = Math.min(100, (history.length * 10));
    return Math.round((dsaPractice + aptitude + mockInterview) / 3);
  };

  const readinessScore = calculateReadiness();

  const roles = ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'AI Engineer'];

  const avgScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.correct / curr.total) * 100, 0) / history.length)
    : 0;

  const displayName = user?.displayName || 'Sudharsan';

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {getGreeting()}, {displayName}! 👋
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-slate-500 dark:text-slate-400">Your current career path is set to <span className="text-indigo-600 dark:text-indigo-400 font-bold">{careerPath}</span>.</p>
            <button 
              onClick={() => setIsChangingPath(!isChangingPath)}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-indigo-600 dark:text-indigo-400 transition-colors"
              title="Change Career Path"
            >
              <Edit2 size={14} />
            </button>
          </div>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onOpenRoadmap}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
          >
            <MapPin size={16} />
            View Roadmap
          </button>
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            View Analytics
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded-xl text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm">
            Start Practice
          </button>
        </div>
      </div>

      {/* Career Path Selector */}
      <AnimatePresence>
        {isChangingPath && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm mb-8 relative">
              <button 
                onClick={() => setIsChangingPath(false)}
                className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                  <Target size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Tailor Your Experience</h2>
              </div>
              <div className="flex flex-wrap gap-3">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCareerPath(role);
                      setIsChangingPath(false);
                    }}
                    className={`px-6 py-3 rounded-2xl text-sm font-bold transition-all border-2 ${
                      careerPath === role
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                        : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mb-8 bg-slate-100 dark:bg-slate-900/50 p-1.5 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'overview' 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('readiness')}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'readiness' 
              ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm' 
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Sparkles size={16} /> Interview Readiness
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard 
                title="LeetCode Solved" 
                value={isLoadingStats ? "..." : leetcodeSolved.toString()} 
                change={leetcodeSolved > 0 ? "Synced" : "Connect LeetCode"} 
                icon={Code2} 
                color="text-orange-600" 
                bgColor="bg-orange-50" 
                onClick={leetcodeSolved === 0 ? onGoToSettings : undefined}
              />
              <StatCard 
                title="Platforms" 
                value={platformsCount.toString()} 
                change={platformsCount > 0 ? "Connected" : "Connect Now"} 
                icon={Globe} 
                color="text-emerald-600" 
                bgColor="bg-emerald-50" 
                onClick={platformsCount === 0 ? onGoToSettings : undefined}
              />
              <StatCard 
                title="Readiness" 
                value={`${readinessScore}%`} 
                change="AI Score" 
                icon={Target} 
                color="text-indigo-600" 
                bgColor="bg-indigo-50" 
                onClick={() => setActiveTab('readiness')}
              />
            </div>
            
            {/* Coding Platform Integration Section */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full -mr-32 -mt-32 blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-32 -mb-32 blur-3xl" />
              
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="text-indigo-600 dark:text-indigo-400" size={24} />
                    Coding Platform Integration
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Your connected coding profiles and real-time synchronization status.</p>
                </div>
                <button 
                  onClick={onGoToSettings}
                  className="px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-bold transition-all flex items-center gap-2 border border-slate-200 dark:border-slate-700"
                >
                  <SettingsIcon size={16} />
                  Manage Connections
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
                {[
                  { name: 'LeetCode', key: 'leetcode', icon: Code2, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
                  { name: 'GitHub', key: 'github', icon: Github, color: 'text-slate-900 dark:text-white', bgColor: 'bg-slate-50 dark:bg-slate-800' },
                  { name: 'Codeforces', key: 'codeforces', icon: Activity, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
                  { name: 'CodeChef', key: 'codechef', icon: Trophy, color: 'text-amber-600', bgColor: 'bg-amber-50 dark:bg-amber-900/20' },
                  { name: 'HackerRank', key: 'hackerrank', icon: Target, color: 'text-emerald-600', bgColor: 'bg-emerald-50 dark:bg-emerald-900/20' }
                ].map((platform, idx) => {
                  const username = usernames[platform.key];
                  const isConnected = Boolean(username);
                  const stats = platformStats.find(s => s.platform.toLowerCase() === platform.name.toLowerCase());
                  
                  return (
                    <motion.div 
                      key={platform.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + (idx * 0.05) }}
                      className={`p-4 rounded-2xl border transition-all group ${
                        isConnected 
                          ? 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-900/50 shadow-sm' 
                          : 'bg-slate-50/50 dark:bg-slate-900/50 border-dashed border-slate-200 dark:border-slate-800 opacity-60 grayscale hover:grayscale-0 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-xl ${platform.bgColor} ${platform.color}`}>
                          <platform.icon size={18} />
                        </div>
                        {isConnected ? (
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase">Live</span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Offline</span>
                        )}
                      </div>
                      
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{platform.name}</h4>
                      {isConnected ? (
                        <div className="mt-1">
                          <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold truncate">@{username}</p>
                          {stats && (
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                              {stats.totalSolved || stats.rating || 0} {platform.name === 'GitHub' ? 'Repos' : 'Solved'}
                            </p>
                          )}
                        </div>
                      ) : (
                        <button 
                          onClick={onGoToSettings}
                          className="mt-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
                        >
                          <Plus size={10} /> Connect Now
                        </button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity */}
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recent Test Activity</h2>
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View All</button>
                  </div>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    {history.length > 0 ? (
                      history.slice(0, 5).map((item) => (
                        <ActivityItem 
                          key={item.id}
                          title={item.title} 
                          time={item.time} 
                          score={item.score} 
                          status={item.status} 
                          onClick={() => onViewResult?.(item)}
                        />
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-500 dark:text-slate-400">No recent test activity</div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Completed Topics</h2>
                    <button className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline">View Progress</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {completedTopics.length > 0 ? (
                      completedTopics.slice(0, 4).map((topic) => (
                        <div key={topic.topicId} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{topic.topicName}</h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">{topic.category}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full bg-white dark:bg-slate-900 p-8 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
                        Start learning to see your completed topics here!
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Recommended */}
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Recommended for You</h2>
                <div className="space-y-3">
                  <RecommendationCard 
                    title="Advanced React Patterns" 
                    description="Master hooks, HOCs and performance optimization."
                    tag="Course"
                  />
                  <RecommendationCard 
                    title="Google Mock Interview" 
                    description="Simulate a real technical interview with AI."
                    tag="Interview"
                  />
                  <RecommendationCard 
                    title="SQL Query Optimization" 
                    description="Learn to write efficient database queries."
                    tag="Quiz"
                    onClick={() => onStartTest({ mode: 'sql-optimization' })}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'readiness' && (
          <motion.div
            key="readiness"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <InterviewReadiness 
              history={history}
              completedTopics={completedTopics}
              platformStats={platformStats}
              aptitudeScore={aptitudeScore}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color, bgColor, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm ${onClick ? 'cursor-pointer hover:border-indigo-300 transition-all' : ''}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl ${bgColor} dark:bg-slate-800 ${color}`}>
          <Icon size={20} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          change.startsWith('+') || change === 'Synced' || change === 'Connected' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        }`}>
          {change}
        </span>
      </div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
    </div>
  );
}

function ActivityItem({ title, time, score, status, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
          <Layout size={18} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{title}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">{time}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-slate-900 dark:text-white">{score}</div>
        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400 dark:text-slate-500">{status}</div>
      </div>
    </div>
  );
}

function RecommendationCard({ title, description, tag, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all cursor-pointer group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md">
          {tag}
        </span>
        <ChevronRight size={16} className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors" />
      </div>
      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{description}</p>
    </div>
  );
}

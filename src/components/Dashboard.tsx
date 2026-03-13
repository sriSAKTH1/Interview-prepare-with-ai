import { Clock, ClipboardCheck, BarChart3, Award, Layout, ChevronRight, Code2, Target, Sparkles, CheckCircle2, BookOpen } from 'lucide-react';
import { TestResult, CompletedTopic } from '../types';
import { CodingDashboard } from './CodingDashboard';
import { motion } from 'motion/react';

export function Dashboard({ 
  history, 
  onStartTest, 
  careerPath, 
  setCareerPath,
  completedTopics = [],
  user
}: { 
  history: TestResult[], 
  onStartTest: (config: any) => void,
  careerPath: string,
  setCareerPath: (path: string) => void,
  completedTopics?: CompletedTopic[],
  user?: any
}) {
  const roles = ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'AI Engineer'];

  const avgScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.correct / curr.total) * 100, 0) / history.length)
    : 0;

  const displayName = user?.displayName || 'Sudharsan';

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {displayName}! 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your current career path is set to <span className="text-indigo-600 dark:text-indigo-400 font-bold">{careerPath}</span>.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
            View Analytics
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded-xl text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm">
            Start Practice
          </button>
        </div>
      </div>

      {/* Career Path Selector */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm">
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
              onClick={() => setCareerPath(role)}
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Study Hours" 
          value="24.5h" 
          change="+12%" 
          icon={Clock} 
          color="text-blue-600" 
          bgColor="bg-blue-50" 
        />
        <StatCard 
          title="Tests Completed" 
          value={history.length.toString()} 
          change="+2" 
          icon={ClipboardCheck} 
          color="text-emerald-600" 
          bgColor="bg-emerald-50" 
        />
        <StatCard 
          title="Avg. Score" 
          value={`${avgScore}%`} 
          change="+5%" 
          icon={BarChart3} 
          color="text-indigo-600" 
          bgColor="bg-indigo-50" 
        />
        <StatCard 
          title="Topics Mastered" 
          value={completedTopics.length.toString()} 
          change="New" 
          icon={BookOpen} 
          color="text-amber-600" 
          bgColor="bg-amber-50" 
        />
      </div>

      {/* Coding Progress & Analytics */}
      <CodingDashboard onStartTest={onStartTest} />

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
                history.map((item) => (
                  <ActivityItem 
                    key={item.id}
                    title={item.title} 
                    time={item.time} 
                    score={item.score} 
                    status={item.status} 
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
                completedTopics.map((topic) => (
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

        {/* Upcoming */}
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
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, change, icon: Icon, color, bgColor }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl ${bgColor} dark:bg-slate-800 ${color}`}>
          <Icon size={20} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          change.startsWith('+') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
        }`}>
          {change}
        </span>
      </div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
    </div>
  );
}

function ActivityItem({ title, time, score, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
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

function RecommendationCard({ title, description, tag }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all cursor-pointer group">
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

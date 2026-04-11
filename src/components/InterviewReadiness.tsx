import { motion } from 'motion/react';
import { 
  Target, 
  Brain, 
  Code2, 
  MessageSquare, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Award,
  BarChart3
} from 'lucide-react';
import { TestResult, CompletedTopic, CodingPlatformStats, InterviewReadinessScore } from '../types';

interface InterviewReadinessProps {
  history: TestResult[];
  completedTopics: CompletedTopic[];
  platformStats: any[];
  aptitudeScore: number;
  userData?: any;
}

export function InterviewReadiness({ 
  history, 
  completedTopics, 
  platformStats, 
  aptitudeScore,
  userData
}: InterviewReadinessProps) {
  
  // Calculate scores
  const calculateReadiness = (): InterviewReadinessScore => {
    // 1. DSA Practice (0-100)
    // Based on completed topics and DSA tests
    const dsaTopicsCount = completedTopics.length;
    const dsaTests = history.filter(h => h.title.toLowerCase().includes('dsa') || h.title.toLowerCase().includes('algorithm'));
    const avgDsaScore = dsaTests.length > 0 
      ? dsaTests.reduce((acc, curr) => acc + (curr.correct / curr.total) * 100, 0) / dsaTests.length 
      : 0;
    
    // Topics count weight (max 40 points for 20 topics)
    const topicPoints = Math.min(40, dsaTopicsCount * 2);
    // Test performance weight (max 60 points based on avg score and count)
    const testPoints = Math.min(60, (avgDsaScore * 0.5) + (dsaTests.length * 2));
    const dsaPractice = Math.min(100, topicPoints + testPoints);

    // 2. Aptitude (0-100)
    const aptitude = Math.min(100, aptitudeScore);

    // 4. Mock Interview (0-100)
    const mockInterviews = history.filter(h => h.title.toLowerCase().includes('mock') || h.title.toLowerCase().includes('interview') || h.title.toLowerCase().includes('company'));
    const interviewsWithScore = mockInterviews.filter(h => h.interviewScore !== undefined && h.interviewScore !== null);
    const avgInterviewScore = interviewsWithScore.length > 0
      ? interviewsWithScore.reduce((acc, curr) => acc + (curr.interviewScore || 0), 0) / interviewsWithScore.length
      : 0;

    const avgMockMcqScore = mockInterviews.length > 0
      ? mockInterviews.reduce((acc, curr) => acc + (curr.correct / curr.total) * 100, 0) / mockInterviews.length
      : 0;

    let mockInterview = 0;
    if (interviewsWithScore.length > 0) {
      mockInterview = Math.min(100, (avgInterviewScore * 0.7) + (mockInterviews.length * 6));
    } else {
      mockInterview = Math.min(100, (mockInterviews.length * 8) + (avgMockMcqScore * 0.4));
    }

    // Overall Score (Weighted)
    const languages = userData?.languages || [];
    const languageBonus = Math.min(10, languages.length * 2.5); // Max 10 points bonus for languages
    
    const overall = Math.round(
      (dsaPractice * 0.40) + 
      (aptitude * 0.20) + 
      (mockInterview * 0.30) +
      (languageBonus * 1.0)
    );

    // Dynamic Suggestions
    const suggestions = [];
    
    if (languages.length === 0) {
      suggestions.push("Specify your programming language proficiency in settings to improve your readiness analysis.");
    }
    
    if (dsaPractice < 50) {
      suggestions.push("Your DSA foundation needs work. Complete at least 10 more topics in the Learn section.");
    } else if (dsaPractice < 80) {
      suggestions.push("Good DSA progress. Try solving more 'Hard' difficulty problems to push your limits.");
    }

    if (aptitude < 70) {
      suggestions.push("Aptitude is often the first filter in interviews. Aim for a consistent 85%+ in practice tests.");
    }

    if (mockInterview < 60) {
      suggestions.push("Technical communication is key. Use the Mock Interview feature to practice explaining your logic aloud.");
    }

    if (overall > 85) {
      suggestions.push("Exceptional readiness! You're likely ready for Tier-1 product companies. Focus on system design now.");
    } else if (overall > 70) {
      suggestions.push("You're reaching the 'Interview Ready' zone. Start applying for roles while continuing your daily practice.");
    }

    // Ensure at least 3 suggestions
    if (suggestions.length < 3) {
      suggestions.push("Keep a consistent daily streak to maintain your problem-solving momentum.");
      suggestions.push("Review your past test mistakes to identify and bridge knowledge gaps.");
    }

    return {
      overall,
      dsaPractice: Math.round(dsaPractice),
      aptitude: Math.round(aptitude),
      mockInterview: Math.round(mockInterview),
      suggestions: suggestions.slice(0, 5) // Max 5 suggestions
    };
  };

  const score = calculateReadiness();

  const metrics = [
    { 
      label: 'DSA Practice', 
      value: score.dsaPractice, 
      icon: Brain, 
      color: 'text-indigo-600', 
      bg: 'bg-indigo-50',
      desc: 'Based on completed topics and DSA tests'
    },
    { 
      label: 'Aptitude', 
      value: score.aptitude, 
      icon: Target, 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50',
      desc: 'Based on your recent aptitude performance'
    },
    { 
      label: 'Mock Interview', 
      value: score.mockInterview, 
      icon: MessageSquare, 
      color: 'text-rose-600', 
      bg: 'bg-rose-50',
      desc: 'Based on mock interview results'
    },
    {
      label: 'Language Mastery',
      value: Math.min(100, (userData?.languages?.length || 0) * 25),
      icon: Code2,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      desc: 'Based on your programming language proficiency'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Card */}
      <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest text-indigo-300">
              <Sparkles size={14} /> AI Readiness Analysis
            </div>
            <h2 className="text-4xl font-bold">Interview Readiness</h2>
            <p className="text-slate-400 max-w-md">
              Your comprehensive readiness score based on practice, aptitude, and mock performance.
            </p>
          </div>

          <div className="relative">
            <div className="w-48 h-48 rounded-full border-8 border-white/5 flex items-center justify-center">
              <div className="text-center">
                <div className="text-5xl font-black text-indigo-400">{score.overall}%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Readiness</div>
              </div>
            </div>
            {/* Decorative rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border-t-4 border-indigo-500 rounded-full"
            />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl" />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className={`w-12 h-12 ${m.bg} dark:bg-slate-800 ${m.color} rounded-2xl flex items-center justify-center mb-4`}>
              <m.icon size={24} />
            </div>
            <div className="flex justify-between items-end mb-2">
              <h3 className="font-bold text-slate-900 dark:text-white">{m.label}</h3>
              <span className={`text-lg font-black ${m.color}`}>{m.value}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${m.value}%` }}
                className={`h-full ${m.color.replace('text', 'bg')}`}
              />
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{m.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Analysis & Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
              <TrendingUp size={20} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">AI Recommendations</h3>
          </div>

          <div className="space-y-4">
            {score.suggestions.map((s, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="w-8 h-8 bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
                  <Zap size={16} />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{s}</p>
              </div>
            ))}
          </div>

          {userData?.languages && userData.languages.length > 0 && (
            <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Language Proficiency Breakdown</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userData.languages.map((lang: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{lang.language}</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                      lang.level === 'Expert' ? 'bg-purple-50 text-purple-600' :
                      lang.level === 'Advanced' ? 'bg-blue-50 text-blue-600' :
                      lang.level === 'Intermediate' ? 'bg-emerald-50 text-emerald-600' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
              <Award size={24} />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ready for the Real Deal?</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-8">
              Based on your current readiness, we recommend taking a full-length Comprehensive Company Test to simulate a real interview environment.
            </p>
            <button className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
              Start Final Test <ArrowRight size={18} />
            </button>
          </div>
          <div className="absolute bottom-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
}

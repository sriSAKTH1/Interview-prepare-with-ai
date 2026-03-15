import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X,
  Star,
  Equal, 
  Info, 
  Grid3X3, 
  Type, 
  Layers, 
  Users, 
  User,
  Link, 
  Network, 
  GitBranch, 
  ArrowDownAZ, 
  Search, 
  Plus,
  Play,
  ChevronLeft, 
  Menu, 
  Layout, 
  ChevronDown, 
  ChevronRight, 
  Book, 
  Zap, 
  CheckCircle2, 
  Rocket, 
  Brain, 
  Target, 
  Globe, 
  Activity, 
  Smartphone, 
  ShoppingCart, 
  Map, 
  Database, 
  Terminal, 
  Check, 
  Trophy, 
  Lightbulb,
  ArrowLeft,
  Repeat,
  XCircle,
  Volume2,
  Code2,
  Cpu,
  Globe2,
  DatabaseZap,
  ArrowRight,
  HelpCircle,
  MessageSquare,
  FileText,
  ListChecks,
  Code,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { LearnTopic, LearnMode, CompletedTopic } from '../types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ArrayVisualizer } from './ArrayVisualizer';
import { StackVisualizer } from './StackVisualizer';
import { QueueVisualizer } from './QueueVisualizer';
import { LinkedListVisualizer } from './LinkedListVisualizer';
import { SortingVisualizer } from './SortingVisualizer';

export function LearnSection({ topic, setTopic, mode, setMode, careerPath, onMarkComplete, completedTopics, user }: { 
  topic: LearnTopic, 
  setTopic: (t: LearnTopic) => void,
  mode: LearnMode,
  setMode: (m: LearnMode) => void,
  careerPath?: string,
  onMarkComplete?: (topicId: string, topicName: string, category: string) => void,
  completedTopics?: CompletedTopic[],
  user?: any
}) {
  const [learnStep, setLearnStep] = useState<'overview' | 'curriculum'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedCats, setExpandedCats] = useState<string[]>(['DATA STRUCTURES', 'ALGORITHMS', 'Linear', 'Non-Linear']);
  const [showJourneyModal, setShowJourneyModal] = useState(false);

  const isCompleted = completedTopics?.some(t => t.topicId === topic);

  const handleMarkComplete = () => {
    if (onMarkComplete) {
      const topicName = topic.charAt(0).toUpperCase() + topic.slice(1).replace('-', ' ');
      // Determine category based on sidebarCategories or just use a generic one
      let category = 'General';
      if (topic.includes('sort')) category = 'Algorithms';
      else if (['array', 'stack', 'queue', 'linked-list'].includes(topic)) category = 'Linear Data Structures';
      else if (['tree', 'graph'].includes(topic)) category = 'Non-Linear Data Structures';
      
      onMarkComplete(topic, topicName, category);
    }
  };

  const toggleCat = (cat: string) => {
    setExpandedCats(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const sidebarCategories = [
    {
      title: "DATA STRUCTURES",
      items: [
        { 
          id: 'linear', 
          label: 'Linear', 
          icon: Equal,
          subItems: [
            { id: 'linear-overview', label: 'Overview', icon: Info },
            { id: 'array', label: 'Array', icon: Grid3X3 },
            { id: 'string', label: 'String', icon: Type },
            { id: 'stack', label: 'Stack', icon: Layers },
            { id: 'queue', label: 'Queue', icon: Users },
            { id: 'linked-list', label: 'Linked List', icon: Link },
          ]
        },
        { 
          id: 'non-linear', 
          label: 'Non-Linear', 
          icon: GitBranch,
          subItems: [
            { id: 'non-linear-overview', label: 'Overview', icon: Info },
            { id: 'tree', label: 'Tree', icon: Network },
            { id: 'graph', label: 'Graph', icon: GitBranch },
          ]
        },
      ]
    },
    {
      title: "ALGORITHMS",
      items: [
        { 
          id: 'sorting', 
          label: 'Sorting', 
          icon: ArrowDownAZ,
          subItems: [
            { id: 'sorting', label: 'Overview', icon: Info },
            { id: 'bubble-sort', label: 'Bubble Sort', icon: Repeat },
            { id: 'selection-sort', label: 'Selection Sort', icon: Target },
            { id: 'insertion-sort', label: 'Insertion Sort', icon: Plus },
            { id: 'merge-sort', label: 'Merge Sort', icon: GitBranch },
            { id: 'quick-sort', label: 'Quick Sort', icon: Zap },
            { id: 'heap-sort', label: 'Heap Sort', icon: Layers },
            { id: 'bucket-sort', label: 'Bucket Sort', icon: ShoppingCart },
          ]
        },
        { 
          id: 'searching-graphs', 
          label: 'Searching & Graphs', 
          icon: Search,
          subItems: [
            { id: 'searching-graphs', label: 'Overview', icon: Info },
            { id: 'linear-search', label: 'Linear Search', icon: Search },
            { id: 'binary-search', label: 'Binary Search', icon: Search },
            { id: 'bfs', label: 'BFS (Breadth First)', icon: Network },
            { id: 'dfs', label: 'DFS (Depth First)', icon: GitBranch },
          ]
        },
      ]
    }
  ];

  const learnPaths = [
    {
      id: 'dsa',
      title: 'DSA Curriculum',
      description: 'Master Data Structures and Algorithms from basics to advanced levels.',
      icon: Code2,
      color: 'bg-indigo-600',
      tag: 'Core'
    },
    {
      id: 'web',
      title: 'Web Development',
      description: 'Learn modern web technologies like React, Node.js, and System Design.',
      icon: Globe2,
      color: 'bg-emerald-600',
      tag: 'Fullstack'
    },
    {
      id: 'system',
      title: 'System Design',
      description: 'Design scalable systems and understand architectural patterns.',
      icon: Cpu,
      color: 'bg-amber-600',
      tag: 'Advanced'
    },
    {
      id: 'database',
      title: 'Database Mastery',
      description: 'Learn SQL, NoSQL, and database optimization techniques.',
      icon: DatabaseZap,
      color: 'bg-rose-600',
      tag: 'Backend'
    }
  ];

  if (learnStep === 'overview') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Learning Center</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Tailored learning for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{careerPath || 'your career'}</span>.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learnPaths.map((path) => (
            <motion.button
              key={path.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (path.id === 'dsa') {
                  setLearnStep('curriculum');
                }
              }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all text-left group relative overflow-hidden"
            >
              <div className={`w-16 h-16 ${path.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform`}>
                <path.icon size={32} />
              </div>
              
              <div className="absolute top-8 right-8">
                <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-bold uppercase tracking-widest">
                  {path.tag}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 mb-3">{path.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-6">{path.description}</p>
              
              <div className="flex items-center gap-2 text-indigo-600 font-bold">
                {path.id === 'dsa' ? 'Start Learning' : 'Coming Soon'} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Decorative background element */}
              <div className={`absolute -bottom-12 -right-12 w-32 h-32 ${path.color} opacity-[0.03] rounded-full`} />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  const totalTopics = sidebarCategories.reduce((acc, cat) => {
    return acc + cat.items.reduce((itemAcc, item) => {
      return itemAcc + (item.subItems ? item.subItems.length : 1);
    }, 0);
  }, 0);
  
  const completionPercentage = totalTopics > 0 
    ? Math.min(100, Math.round((completedTopics.length / totalTopics) * 100))
    : 0;

  return (
    <div className="flex h-full overflow-hidden bg-white dark:bg-slate-950">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 300 : 80 }}
        className="bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col relative z-40 shadow-sm"
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 h-16 bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3 overflow-hidden">
            <button 
              onClick={() => setLearnStep('overview')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors shrink-0"
            >
              <ArrowLeft size={18} />
            </button>
            {isSidebarOpen && <span className="font-bold text-slate-900 dark:text-white truncate">DSA Curriculum</span>}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors shrink-0"
          >
            {isSidebarOpen ? <ChevronLeft size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <div className="flex-1 py-6 px-3 space-y-8 overflow-y-auto custom-scrollbar">
          {/* Overview Item */}
          <button
            onClick={() => {
              setTopic('overview');
              setMode('overview');
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              topic === 'overview' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Layout size={18} className="shrink-0" />
            {isSidebarOpen && <span className="font-semibold text-sm truncate">Overview</span>}
          </button>

          <button
            onClick={() => {
              setTopic('questions-approach');
              setMode('overview');
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              topic === 'questions-approach' 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <HelpCircle size={18} className="shrink-0" />
            {isSidebarOpen && <span className="font-semibold text-sm truncate">Questions Approach</span>}
          </button>

          {sidebarCategories.map((category, catIdx) => (
            <div key={catIdx} className="space-y-3">
              {isSidebarOpen && (
                <div className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                  {category.title}
                </div>
              )}
              <div className="space-y-1">
                {category.items.map((item) => (
                  <div key={item.id} className="space-y-1">
                    <button
                      onClick={() => {
                        if (item.subItems) {
                          toggleCat(item.label);
                        } else {
                          setTopic(item.id as LearnTopic);
                          setMode('overview');
                        }
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all group ${
                        !item.subItems && topic === item.id 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      <item.icon size={18} className="shrink-0" />
                      {isSidebarOpen && <span className="font-semibold text-sm truncate flex-1 text-left">{item.label}</span>}
                      {isSidebarOpen && (
                        item.subItems ? (
                          <ChevronDown 
                            size={14} 
                            className={`transition-transform opacity-50 ${expandedCats.includes(item.label) ? 'rotate-180' : ''}`} 
                          />
                        ) : (
                          <ChevronRight 
                            size={14} 
                            className={`transition-transform opacity-0 group-hover:opacity-100 ${topic === item.id ? 'text-white opacity-100' : 'text-slate-400'}`} 
                          />
                        )
                      )}
                    </button>
                    
                    {/* Sub Items */}
                    {isSidebarOpen && item.subItems && expandedCats.includes(item.label) && (
                      <div className="ml-5 pl-4 border-l border-slate-200 dark:border-slate-800 space-y-1 py-1">
                        {item.subItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setTopic(sub.id as LearnTopic);
                              setMode('overview');
                            }}
                            className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all relative ${
                              topic === sub.id 
                                ? 'text-indigo-600 dark:text-indigo-400 font-bold bg-indigo-50 dark:bg-indigo-900/20' 
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-800'
                            }`}
                          >
                            {topic === sub.id && (
                              <motion.div 
                                layoutId="activeSub"
                                className="absolute left-[-17px] w-1 h-4 bg-indigo-600 dark:bg-indigo-500 rounded-full"
                              />
                            )}
                            <sub.icon size={16} className={`shrink-0 ${topic === sub.id ? 'opacity-100' : 'opacity-50'}`} />
                            <span className="text-sm truncate flex-1">{sub.label}</span>
                            {completedTopics.some(t => t.topicId === sub.id) && (
                              <CheckCircle2 size={14} className="text-emerald-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          {isSidebarOpen && (
            <div className="px-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Your Progress</span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full">{completionPercentage}%</span>
              </div>
              <div className="h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPercentage}%` }}
                  className="h-full bg-indigo-600 dark:bg-indigo-500" 
                />
              </div>
            </div>
          )}

          <div className={`flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 ${isSidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
              <Trophy size={18} />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 overflow-hidden">
                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Current Rank</div>
                <div className="text-xs font-bold text-slate-900 dark:text-white truncate">DSA Apprentice</div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-slate-950">
        <AnimatePresence mode="wait">
          {mode === 'overview' ? (
            <motion.div
              key={topic}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {topic === 'overview' && (
                <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
                  <LearnOverview setMode={setMode} onStartJourney={() => setShowJourneyModal(true)} />
                </div>
              )}
              {topic === 'questions-approach' && (
                <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
                  <QuestionsApproach />
                </div>
              )}
              {topic !== 'overview' && (
                <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Book size={18} />
                    </div>
                    <h2 className="font-bold text-slate-900 dark:text-white capitalize">{topic.replace('-', ' ')}</h2>
                  </div>
                  <button
                    onClick={handleMarkComplete}
                    disabled={isCompleted}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                      isCompleted 
                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none'
                    }`}
                  >
                    {isCompleted ? <Check size={14} /> : <CheckCircle2 size={14} />}
                    {isCompleted ? 'Completed' : 'Mark as Complete'}
                  </button>
                </div>
              )}
              {topic === 'linear-overview' && (
                <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
                  <LinearOverviewContent setMode={setMode} />
                </div>
              )}
              {topic === 'array' && <ArrayVisualizer />}
              {topic === 'string' && (
                <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
                  <TopicContent title="Strings" icon={Type} setMode={setMode} />
                </div>
              )}
              {topic === 'stack' && <StackVisualizer />}
              {topic === 'queue' && <QueueVisualizer />}
              {topic === 'linked-list' && <LinkedListVisualizer />}
              {topic === 'non-linear-overview' && (
                <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
                  <TopicContent title="Non-Linear Overview" icon={Info} setMode={setMode} />
                </div>
              )}
              {topic === 'tree' && (
                <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
                  <TopicContent title="Trees" icon={Network} setMode={setMode} />
                </div>
              )}
              {topic === 'graph' && (
                <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
                  <TopicContent title="Graphs" icon={GitBranch} setMode={setMode} />
                </div>
              )}
              {topic === 'sorting' && <SortingVisualizer initialAlgorithm="sorting" />}
              {topic === 'bubble-sort' && <SortingVisualizer initialAlgorithm="bubble-sort" />}
              {topic === 'selection-sort' && <SortingVisualizer initialAlgorithm="selection-sort" />}
              {topic === 'insertion-sort' && <SortingVisualizer initialAlgorithm="insertion-sort" />}
              {topic === 'merge-sort' && <SortingVisualizer initialAlgorithm="merge-sort" />}
              {topic === 'quick-sort' && <SortingVisualizer initialAlgorithm="quick-sort" />}
              {topic === 'heap-sort' && <SortingVisualizer initialAlgorithm="heap-sort" />}
              {topic === 'bucket-sort' && <SortingVisualizer initialAlgorithm="bucket-sort" />}
              {topic === 'searching-graphs' && (
                <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
                  <TopicContent title="Searching & Graphs" icon={Search} setMode={setMode} />
                </div>
              )}
              {topic === 'linear-search' && (
                <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
                  <TopicContent title="Linear Search" icon={Search} setMode={setMode} />
                </div>
              )}
              {topic === 'binary-search' && (
                <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
                  <TopicContent title="Binary Search" icon={Search} setMode={setMode} />
                </div>
              )}
              {topic === 'bfs' && (
                <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
                  <TopicContent title="BFS (Breadth First)" icon={Network} setMode={setMode} />
                </div>
              )}
              {topic === 'dfs' && (
                <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
                  <TopicContent title="DFS (Depth First)" icon={GitBranch} setMode={setMode} />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key={mode}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="max-w-5xl mx-auto p-8 h-full overflow-y-auto"
            >
              {mode !== 'intro' && (
                <button 
                  onClick={() => setMode('overview')}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium mb-6"
                >
                  <ArrowLeft size={18} />
                  Back to {topic.charAt(0).toUpperCase() + topic.slice(1).replace('-', ' ')}
                </button>
              )}
            {mode === 'flashcards' && <FlashcardMode />}
            {mode === 'quiz' && <QuizMode />}
            {mode === 'spaced' && <SpacedRepetitionMode />}
            {mode === 'intro' && <DSAIntroMode onBack={() => setMode('overview')} />}
          </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showJourneyModal && (
            <StartJourneyModal 
              onClose={() => setShowJourneyModal(false)} 
              onComplete={(data) => {
                if (user) {
                  const userRef = doc(db, 'users', user.uid);
                  setDoc(userRef, { journeyData: data }, { merge: true })
                    .catch(err => handleFirestoreError(err, OperationType.UPDATE, 'users'));
                }
                setShowJourneyModal(false);
                setMode('intro');
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StartJourneyModal({ onClose, onComplete }: { onClose: () => void, onComplete: (data: any) => void }) {
  const [language, setLanguage] = useState('Java');
  const [langRating, setLangRating] = useState(0);
  const [dsaRating, setDsaRating] = useState(0);

  const languages = ['Java', 'Python', 'C++', 'JavaScript', 'C#', 'Go'];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
            <Rocket size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Start Your Journey</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Tell us about your current skills</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Choose Language</label>
            <div className="grid grid-cols-3 gap-2">
              {languages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border-2 ${
                    language === lang 
                      ? 'bg-indigo-600 border-indigo-600 text-white' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-indigo-200'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Rate your {language} skill</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setLangRating(star)}
                  className={`p-1 transition-all ${langRating >= star ? 'text-amber-400 scale-110' : 'text-slate-200 dark:text-slate-700'}`}
                >
                  <Star size={28} fill={langRating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-slate-400">{langRating}/5</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Rate your DSA skill</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setDsaRating(star)}
                  className={`p-1 transition-all ${dsaRating >= star ? 'text-indigo-500 scale-110' : 'text-slate-200 dark:text-slate-700'}`}
                >
                  <Star size={28} fill={dsaRating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
              <span className="ml-2 text-sm font-bold text-slate-400">{dsaRating}/5</span>
            </div>
          </div>

          <button
            onClick={() => onComplete({ language, langRating, dsaRating })}
            disabled={!langRating || !dsaRating}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            Let's Go!
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function LearnOverview({ setMode, onStartJourney }: { setMode: (m: LearnMode) => void, onStartJourney?: () => void }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-20"
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-slate-900 dark:bg-indigo-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-slate-200 dark:shadow-none">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Book size={20} className="text-indigo-400" />
            <span className="text-slate-400 font-bold text-sm uppercase tracking-widest">Course Overview</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            📘 Data Structures & Algorithms
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Master the foundation of software development and problem-solving. Build efficient code and crack top technical interviews.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onStartJourney ? onStartJourney() : setMode('flashcards')}
              className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Zap size={18} /> Start Learning
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
              <CheckCircle2 size={16} className="text-indigo-400" />
              <span className="text-sm font-medium text-slate-300">Industry Standard Curriculum</span>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-20%] left-[-5%] w-60 h-60 bg-indigo-900/20 rounded-full blur-3xl opacity-50" />
      </motion.div>

      {/* Why DSA? */}
      <motion.section variants={itemVariants} className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <Rocket size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Why DSA is Important?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { icon: Zap, text: "Write optimized and efficient code", color: "text-amber-600", bg: "bg-amber-50" },
            { icon: Brain, text: "Improve logical thinking and problem-solving", color: "text-purple-600", bg: "bg-purple-50" },
            { icon: Target, text: "Essential for cracking technical interviews", color: "text-rose-600", bg: "bg-rose-50" },
            { icon: Globe, text: "Used in search engines, social media, and databases", color: "text-blue-600", bg: "bg-blue-50" }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-4 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm"
            >
              <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-lg flex items-center justify-center shrink-0`}>
                <item.icon size={20} />
              </div>
              <span className="font-medium text-slate-700">{item.text}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-slate-500 italic text-sm pl-2">
          Companies like Google, Amazon, Microsoft, TCS, and Infosys test DSA heavily. Mastering it is non-negotiable.
        </p>
      </motion.section>

      {/* Where is it used? */}
      <motion.section variants={itemVariants} className="bg-slate-900 rounded-[2.5rem] p-10 text-white overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white">
              <Activity size={20} />
            </div>
            <h2 className="text-2xl font-bold">Where is DSA Used?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Search, title: "Search Engines", desc: "Fast searching using Binary Search & Trees" },
              { icon: Smartphone, title: "Social Media", desc: "Graphs for friend connections" },
              { icon: ShoppingCart, title: "E-commerce", desc: "Sorting & searching products" },
              { icon: Map, title: "Navigation", desc: "Graph algorithms for shortest paths" },
              { icon: Database, title: "Databases", desc: "Trees & Hashing for quick retrieval" }
            ].map((item, i) => (
              <div key={i} className="space-y-2 group">
                <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
                  <item.icon size={20} />
                </div>
                <h4 className="font-bold">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
      </motion.section>

      {/* Pre-requisites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.section variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <Terminal size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Pre-Requisites</h2>
          </div>
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs">1</span>
                Programming Basics
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {['Variables', 'Loops', 'Functions', 'Arrays'].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded-lg">
                    <Check size={14} className="text-emerald-500" /> {item}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-400">Java and Python are widely accepted in interviews.</p>
            </div>
            <div className="h-[1px] bg-slate-100" />
            <div className="space-y-4">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center text-xs">2</span>
                Complexity Analysis
              </h4>
              <div className="bg-slate-900 p-4 rounded-2xl font-mono text-sm text-indigo-300">
                T(n) = O(n)
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Understand Big-O Notation (O(1), O(log n), O(n²)) to optimize your code and avoid slow solutions.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Who should learn? */}
        <motion.section variants={itemVariants} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <User size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Who Should Learn?</h2>
          </div>
          <div className="flex-1 space-y-4">
            {[
              "Students preparing for Campus Placements",
              "Developers wanting to switch to better tech roles",
              "Anyone preparing for Coding Contests",
              "Software Engineering aspirants"
            ].map((text, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="mt-1 w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                  <Check size={12} />
                </div>
                <span className="text-slate-600 font-medium">{text}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 p-6 bg-amber-50 rounded-2xl border border-amber-100">
            <p className="text-amber-800 text-sm font-medium">
              Improve coding skills and write efficient programs that scale.
            </p>
          </div>
        </motion.section>
      </div>

      {/* How to Solve? */}
      <motion.section variants={itemVariants} className="bg-indigo-50 p-10 rounded-[2.5rem] border border-indigo-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Trophy size={20} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">How to Solve DSA Problems?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { step: "01", title: "Understand", desc: "Read the problem clearly and identify constraints." },
            { step: "02", title: "Identify Pattern", desc: "Is it an Array? Stack? Tree? Graph?" },
            { step: "03", title: "Brute Force", desc: "Think of the simplest solution first." },
            { step: "04", title: "Optimize", desc: "Use better data structures or algorithms." },
            { step: "05", title: "Analyze", desc: "Check Time & Space Complexity." },
            { step: "06", title: "Practice", desc: "Consistency is the key to mastery." }
          ].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-indigo-100/50">
              <span className="text-indigo-600 font-black text-2xl opacity-20">{item.step}</span>
              <h4 className="font-bold text-slate-900 mt-1">{item.title}</h4>
              <p className="text-slate-500 text-sm mt-2">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Final Note */}
      <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-600 text-sm font-bold uppercase tracking-widest">
          <Lightbulb size={16} /> Final Note
        </div>
        <h2 className="text-3xl font-bold text-slate-900">
          DSA is not just about coding.
        </h2>
        <p className="text-slate-500 text-lg leading-relaxed">
          It is about thinking logically, solving problems efficiently, and becoming a better engineer. Master DSA to confidently face any technical interview.
        </p>
        <div className="pt-4">
          <button 
            onClick={() => onStartJourney ? onStartJourney() : setMode('flashcards')}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
          >
            Start Your Journey
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TopicContent({ title, icon: Icon, setMode }: { title: string, icon: any, setMode: (m: LearnMode) => void }) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
          <Icon size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
          <p className="text-slate-500 mt-1">Deep dive into {title.toLowerCase()} concepts and implementation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 mb-4">Core Concepts</h3>
          <ul className="space-y-3">
            {['Introduction', 'Basic Implementation', 'Advanced Patterns', 'Common Interview Questions'].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-600 hover:text-indigo-600 cursor-pointer transition-colors group">
                <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold group-hover:bg-indigo-50 transition-colors">
                  {i + 1}
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 mb-2">Practice this Topic</h3>
            <p className="text-sm text-slate-500">Ready to apply what you've learned? Start a focused practice session.</p>
          </div>
          <div className="flex gap-2 mt-6">
            <button 
              onClick={() => setMode('flashcards')}
              className="flex-1 p-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
            >
              Flashcards
            </button>
            <button 
              onClick={() => setMode('quiz')}
              className="flex-1 p-3 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FlashcardMode() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const cards = [
    { q: "What is a Closure in JavaScript?", a: "A closure is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment)." },
    { q: "Explain the Big O of a Binary Search.", a: "Binary Search has a time complexity of O(log n) because it halves the search space in each step." },
    { q: "What is CAP Theorem?", a: "It states that a distributed data store can only provide two of three guarantees: Consistency, Availability, and Partition Tolerance." }
  ];

  const nextCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Flashcards: Web Fundamentals</h2>
        <p className="text-slate-500">Card {currentIndex + 1} of {cards.length}</p>
      </div>

      <div 
        className="relative h-80 w-full perspective-1000 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d transition-transform duration-500"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
        >
          {/* Front */}
          <div className="absolute inset-0 backface-hidden bg-white border-2 border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm">
            <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-4">Question</span>
            <h3 className="text-xl font-bold text-slate-900">{cards[currentIndex].q}</h3>
            <p className="mt-8 text-slate-400 text-sm italic">Click to flip</p>
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden bg-indigo-600 border-2 border-indigo-600 rounded-3xl p-12 flex flex-col items-center justify-center text-center shadow-sm rotate-y-180">
            <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest mb-4">Answer</span>
            <p className="text-white text-lg leading-relaxed">{cards[currentIndex].a}</p>
            <p className="mt-8 text-indigo-300 text-sm italic">Click to flip back</p>
          </div>
        </motion.div>
      </div>

      <div className="flex justify-center gap-4 mt-12">
        <button 
          onClick={(e) => { e.stopPropagation(); nextCard(); }}
          className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
        >
          Next Card
        </button>
      </div>
    </div>
  );
}

function QuizMode() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const questions = [
    {
      q: "Which data structure uses LIFO (Last In First Out)?",
      options: ["Queue", "Stack", "Linked List", "Binary Tree"],
      correct: 1
    },
    {
      q: "What is the time complexity of inserting into a Hash Map (average case)?",
      options: ["O(1)", "O(n)", "O(log n)", "O(n log n)"],
      correct: 0
    }
  ];

  const handleCheck = () => {
    if (selected === null) return;
    setIsCorrect(selected === questions[step].correct);
  };

  const handleNext = () => {
    setStep((prev) => (prev + 1) % questions.length);
    setSelected(null);
    setIsCorrect(null);
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Quiz: Data Structures</h2>
            <p className="text-slate-500">Question {step + 1} of {questions.length}</p>
          </div>
          <div className="text-indigo-600 font-bold">Score: 0/0</div>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900">{questions[step].q}</h3>
        
        <div className="space-y-3">
          {questions[step].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setSelected(idx)}
              disabled={isCorrect !== null}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                selected === idx 
                  ? isCorrect === null 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : isCorrect 
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-red-500 bg-red-50 text-red-700'
                  : 'border-slate-100 hover:border-slate-200 text-slate-600'
              }`}
            >
              <span className="font-medium">{opt}</span>
              {selected === idx && isCorrect !== null && (
                isCorrect ? <CheckCircle2 size={20} /> : <XCircle size={20} />
              )}
            </button>
          ))}
        </div>

        <div className="pt-4">
          {isCorrect === null ? (
            <button 
              onClick={handleCheck}
              disabled={selected === null}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
            >
              Check Answer
            </button>
          ) : (
            <button 
              onClick={handleNext}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
            >
              Next Question
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SpacedRepetitionMode() {
  return (
    <div className="max-w-4xl mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Spaced Repetition</h2>
          <p className="text-slate-500">Your daily review schedule based on memory decay.</p>
        </div>
        <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
          Start Daily Review
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-1">12</div>
          <div className="text-sm font-medium text-slate-500">Due Today</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="text-3xl font-bold text-emerald-600 mb-1">45</div>
          <div className="text-sm font-medium text-slate-500">Learned</div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center">
          <div className="text-3xl font-bold text-amber-600 mb-1">8</div>
          <div className="text-sm font-medium text-slate-500">Struggling</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold text-slate-900">Upcoming Reviews</h3>
        </div>
        <div className="divide-y divide-slate-100">
          <ReviewItem topic="React Lifecycle" status="Due in 2h" level="Expert" />
          <ReviewItem topic="SQL Joins" status="Due in 5h" level="Intermediate" />
          <ReviewItem topic="HTTP Status Codes" status="Due Tomorrow" level="Beginner" />
        </div>
      </div>
    </div>
  );
}


function QuestionsApproach() {
  const steps = [
    {
      icon: Search,
      title: "1. Understand the Problem",
      color: "text-blue-600",
      bg: "bg-blue-50",
      points: [
        "Read the problem statement carefully twice.",
        "Identify the inputs and their types (e.g., integer array, string).",
        "Identify the expected output and its type.",
        "Clarify constraints (e.g., time limit, memory limit, input size).",
        "Ask clarifying questions (e.g., Can the input be empty? Are there negative numbers?)."
      ]
    },
    {
      icon: Brain,
      title: "2. Brainstorm & Brute Force",
      color: "text-purple-600",
      bg: "bg-purple-50",
      points: [
        "Think of the simplest possible solution (Brute Force).",
        "Don't worry about efficiency yet, just focus on correctness.",
        "Write down the steps for the brute force approach.",
        "Calculate the time and space complexity of this approach."
      ]
    },
    {
      icon: Zap,
      title: "3. Optimize & Pattern Recognition",
      color: "text-amber-600",
      bg: "bg-amber-50",
      points: [
        "Look for patterns or repeated work in the brute force solution.",
        "Can we use a better data structure? (e.g., Hash Map for O(1) lookup).",
        "Can we use a specific algorithm? (e.g., Two Pointers, Sliding Window, Binary Search).",
        "Consider trade-offs between time and space complexity.",
        "Aim for the most optimal complexity based on constraints."
      ]
    },
    {
      icon: FileText,
      title: "4. Dry Run with Examples",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      points: [
        "Take a small sample input and trace your logic step-by-step.",
        "Use edge cases (e.g., empty input, single element, all duplicates).",
        "Verify if the logic produces the correct output.",
        "This helps catch logical errors before you start coding."
      ]
    },
    {
      icon: Code,
      title: "5. Implementation",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      points: [
        "Write clean, readable code with meaningful variable names.",
        "Follow the logic you dry-ran in the previous step.",
        "Handle edge cases explicitly.",
        "Keep the code modular if possible."
      ]
    },
    {
      icon: ShieldCheck,
      title: "6. Review & Analyze",
      color: "text-rose-600",
      bg: "bg-rose-50",
      points: [
        "Double-check your code for syntax or logical errors.",
        "Re-calculate the final time and space complexity.",
        "Explain your solution clearly (if in an interview).",
        "Think about how the solution could be further improved or scaled."
      ]
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
          <Target size={14} /> Problem Solving Guide
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">How to Approach DSA Questions</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl">
          A systematic framework to tackle any coding problem, from understanding requirements to delivering an optimized solution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all"
          >
            <div className={`w-12 h-12 ${step.bg} dark:bg-slate-800 ${step.color} rounded-xl flex items-center justify-center mb-6`}>
              <step.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{step.title}</h3>
            <ul className="space-y-3">
              {step.points.map((point, pIndex) => (
                <li key={pIndex} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-2 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 dark:bg-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Lightbulb size={20} className="text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold">Pro Interview Tips</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-300">Think Aloud</h4>
              <p className="text-slate-400 text-sm">Always communicate your thought process. Interviewers are more interested in HOW you think than just the final code.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-300">Don't Jump to Code</h4>
              <p className="text-slate-400 text-sm">Wait until the interviewer agrees with your logic. Coding a wrong approach is a waste of time.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-300">Handle Constraints</h4>
              <p className="text-slate-400 text-sm">If N is 10^5, an O(N^2) solution will likely TLE. Aim for O(N log N) or O(N).</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-300">Test Your Code</h4>
              <p className="text-slate-400 text-sm">Before saying "I'm done", manually trace your code with a small example to find bugs.</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>
    </motion.div>
  );
}

function DSAIntroMode({ onBack }: { onBack: () => void }) {
  const content = [
    {
      title: "Introduction",
      text: "Data Structures and Algorithms (DSA) are fundamental concepts in computer science that help developers write efficient and optimized programs. DSA focuses on how data is stored, organized, and processed in a computer system.\n\nUnderstanding DSA improves problem-solving ability and helps programmers build faster and more scalable software. Most technology companies evaluate DSA skills during coding interviews because it demonstrates logical thinking and programming efficiency."
    },
    {
      title: "What is Data Structure?",
      text: "A Data Structure is a way of organizing and storing data so that it can be accessed and modified efficiently.\n\nDifferent types of data structures are used depending on the problem and the operations required."
    },
    {
      title: "Examples of Data Structures",
      list: [
        "Arrays",
        "Linked Lists",
        "Stacks",
        "Queues",
        "Trees",
        "Graphs",
        "Hash Tables"
      ],
      text: "Each data structure is designed to solve specific problems efficiently."
    },
    {
      title: "What is an Algorithm?",
      text: "An Algorithm is a step-by-step procedure or set of rules to be followed in calculations or other problem-solving operations.\n\nIn programming, an algorithm is a set of instructions that takes an input, processes it, and provides the desired output."
    },
    {
      title: "Examples of Algorithms",
      list: [
        "Sorting Algorithms (Bubble Sort, Merge Sort, Quick Sort)",
        "Searching Algorithms (Linear Search, Binary Search)",
        "Graph Algorithms (BFS, DFS)",
        "Dynamic Programming"
      ]
    },
    {
      title: "Why Learn DSA?",
      list: [
        "Efficiency: Helps in writing code that runs faster and uses less memory.",
        "Problem Solving: Enhances logical thinking to solve complex real-world problems.",
        "Interview Preparation: Most top-tier tech companies (Google, Amazon, Microsoft) focus heavily on DSA.",
        "Scalability: Essential for building applications that handle large amounts of data."
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-8 space-y-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft size={18} />
          Back to Overview
        </button>
        <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Introductory Lesson
        </div>
      </div>

      <div className="space-y-6">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Data Structures and Algorithms (DSA)</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Your foundation for technical excellence starts here.</p>
      </div>

      {/* Video Section */}
      <div className="aspect-video w-full bg-slate-900 rounded-[2.5rem] overflow-hidden relative group shadow-2xl">
        <img 
          src="https://picsum.photos/seed/coding/1200/675" 
          alt="DSA Introduction Video" 
          className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8 text-center">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/50 mb-6"
          >
            <Play size={32} fill="currentColor" className="ml-1" />
          </motion.button>
          <h3 className="text-2xl font-bold mb-2">Watch: DSA Fundamentals</h3>
          <p className="text-slate-300 max-w-md">A comprehensive overview of why DSA matters in modern software engineering.</p>
        </div>
        <div className="absolute bottom-6 right-6 px-3 py-1 bg-black/50 backdrop-blur-md rounded-lg text-[10px] font-bold text-white/80">
          12:45
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          {content.map((section, idx) => (
            <motion.section 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm">
                  {idx + 1}
                </span>
                {section.title}
              </h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {section.text && (
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {section.text}
                  </p>
                )}
                {section.list && (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {section.list.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <div className="mt-1 w-4 h-4 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                          <Check size={10} className="text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.section>
          ))}
        </div>

        <div className="space-y-8">
          <div className="bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200 dark:shadow-none">
            <h3 className="text-xl font-bold mb-4">Ready to Start?</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-6">
              Now that you understand the basics, let's dive into your first data structure: Arrays.
            </p>
            <button 
              onClick={onBack}
              className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all"
            >
              Go to Curriculum
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-6">Key Takeaways</h3>
            <div className="space-y-4">
              {[
                "DSA = Efficiency",
                "Data Structure = Storage",
                "Algorithm = Procedure",
                "Crucial for Interviews"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                  <span className="text-sm text-slate-600 dark:text-slate-400 font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinearOverviewContent({ setMode }: { setMode: (m: LearnMode) => void }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 pb-20"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
          <Equal size={14} /> Linear Data Structures
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Introduction</h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          Linear Data Structures are a type of data structure in which elements are arranged sequentially, meaning each element is connected to its previous and next element in a single line.
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          In linear data structures, data is stored and accessed in a specific order. Each element has a unique position, and operations like insertion, deletion, and traversal follow a linear path.
        </p>
        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
          These structures are widely used in programming because they are simple to understand and efficient for many common operations.
        </p>
      </motion.div>

      {/* Characteristics */}
      <motion.section variants={itemVariants} className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
          <CheckCircle2 className="text-emerald-500" /> Characteristics
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            "Elements are arranged in a sequential order.",
            "Each element has a single predecessor and a single successor (except the first and last).",
            "Data is traversed in a single direction or sequentially.",
            "Easy to implement and manage."
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
              <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <Check size={14} />
              </div>
              <span className="text-slate-700 dark:text-slate-300 font-medium">{text}</span>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Types */}
      <motion.section variants={itemVariants} className="space-y-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Types of Linear Data Structures</h2>
        
        <div className="grid grid-cols-1 gap-6">
          {/* Array */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-indigo-200 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Grid3X3 size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Array</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400">An Array is a collection of elements stored in contiguous memory locations. Each element can be accessed using an index value.</p>
                <div className="flex flex-wrap gap-2">
                  {['Fast access using index', 'Fixed size', 'Efficient for similar types'].map(f => (
                    <span key={f} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-bold">{f}</span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center">
                <div className="flex gap-2">
                  {[10, 20, 30, 40, 50].map((n, i) => (
                    <div key={i} className="w-12 h-12 bg-indigo-600 rounded-lg flex flex-col items-center justify-center text-white font-bold shadow-lg">
                      {n}
                      <span className="text-[8px] opacity-50">{i}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Linked List */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-emerald-200 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Link size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Linked List</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400">A Linked List is a collection of nodes where each node contains data and a reference to the next node. They do not store elements in contiguous memory.</p>
                <div className="flex flex-wrap gap-2">
                  {['Dynamic size', 'Efficient insertion/deletion', 'Connected via pointers'].map(f => (
                    <span key={f} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold">{f}</span>
                  ))}
                </div>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  {[10, 20, 30, 40].map((n, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                        {n}
                      </div>
                      <ArrowRight size={16} className="text-emerald-400" />
                    </div>
                  ))}
                  <div className="text-emerald-400 font-mono font-bold">NULL</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stack */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-amber-200 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Stack (LIFO)</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400">A Stack follows the Last In, First Out principle. The last element inserted is the first one to be removed.</p>
                <div className="flex flex-wrap gap-2">
                  {['Push', 'Pop', 'Peek', 'Undo Operations'].map(f => (
                    <span key={f} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold">{f}</span>
                  ))}
                </div>
                <div className="pt-4 flex gap-2">
                  <button 
                    onClick={() => {
                      const stack = document.getElementById('stack-container');
                      if (stack) {
                        const el = document.createElement('div');
                        el.className = 'w-24 h-10 bg-amber-500 rounded flex items-center justify-center text-white font-bold shadow-lg mb-2 animate-bounce';
                        el.innerText = Math.floor(Math.random() * 100).toString();
                        stack.prepend(el);
                      }
                    }}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors"
                  >
                    Push Element
                  </button>
                  <button 
                    onClick={() => {
                      const stack = document.getElementById('stack-container');
                      if (stack && stack.firstChild) {
                        (stack.firstChild as HTMLElement).classList.add('translate-x-full', 'opacity-0');
                        setTimeout(() => stack.removeChild(stack.firstChild!), 300);
                      }
                    }}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Pop Element
                  </button>
                </div>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 flex items-center justify-center min-h-[200px]">
                <div id="stack-container" className="flex flex-col gap-2 border-x-2 border-b-2 border-amber-500/30 p-4 rounded-b-xl w-32 items-center">
                  {[30, 20, 10].map((n, i) => (
                    <div 
                      key={i}
                      className="w-24 h-10 bg-amber-600 rounded flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300"
                    >
                      {n}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Queue */}
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-rose-200 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-rose-100 dark:bg-rose-900/30 rounded-2xl flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Users size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Queue (FIFO)</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400">A Queue follows the First In, First Out principle. The first element inserted is the first one to be removed.</p>
                <div className="flex flex-wrap gap-2">
                  {['Enqueue', 'Dequeue', 'Task Scheduling', 'Print Queues'].map(f => (
                    <span key={f} className="px-3 py-1 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-full text-xs font-bold">{f}</span>
                  ))}
                </div>
                <div className="pt-4 flex gap-2">
                  <button 
                    onClick={() => {
                      const queue = document.getElementById('queue-container');
                      if (queue) {
                        const el = document.createElement('div');
                        el.className = 'w-12 h-12 bg-rose-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shrink-0 animate-pulse';
                        el.innerText = Math.floor(Math.random() * 100).toString();
                        queue.appendChild(el);
                      }
                    }}
                    className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors"
                  >
                    Enqueue
                  </button>
                  <button 
                    onClick={() => {
                      const queue = document.getElementById('queue-container');
                      if (queue && queue.firstChild) {
                        (queue.firstChild as HTMLElement).classList.add('-translate-x-full', 'opacity-0');
                        setTimeout(() => queue.removeChild(queue.firstChild!), 300);
                      }
                    }}
                    className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Dequeue
                  </button>
                </div>
              </div>
              <div className="bg-slate-900 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[200px]">
                <div className="flex gap-2 items-center w-full overflow-hidden px-4">
                  <span className="text-[10px] text-rose-400 font-bold uppercase shrink-0">Front</span>
                  <div id="queue-container" className="flex gap-2 items-center flex-1">
                    {[10, 20, 30].map((n, i) => (
                      <div 
                        key={i}
                        className="w-12 h-12 bg-rose-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg transition-all duration-300 shrink-0"
                      >
                        {n}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] text-rose-400 font-bold uppercase shrink-0">Rear</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Advantages & Limitations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.section variants={itemVariants} className="bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30">
          <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-400 mb-6 flex items-center gap-2">
            <Plus size={20} /> Advantages
          </h3>
          <ul className="space-y-4">
            {[
              "Simple and easy to implement",
              "Efficient for sequential data processing",
              "Easy traversal of elements",
              "Widely used in many applications"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm font-medium">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                {text}
              </li>
            ))}
          </ul>
        </motion.section>

        <motion.section variants={itemVariants} className="bg-rose-50 dark:bg-rose-900/10 p-8 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30">
          <h3 className="text-xl font-bold text-rose-900 dark:text-rose-400 mb-6 flex items-center gap-2">
            <X size={20} /> Limitations
          </h3>
          <ul className="space-y-4">
            {[
              "Traversal is sequential",
              "Some operations may take more time",
              "Not ideal for complex relationships"
            ].map((text, i) => (
              <li key={i} className="flex items-center gap-3 text-rose-800 dark:text-rose-300 text-sm font-medium">
                <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                {text}
              </li>
            ))}
          </ul>
        </motion.section>
      </div>

      {/* Real-World Applications */}
      <motion.section variants={itemVariants} className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <Globe size={24} className="text-indigo-400" /> Real-World Applications
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: Volume2, text: "Music Playlists" },
              { icon: Clock, text: "Browser History" },
              { icon: ShoppingCart, text: "Print Queues" },
              { icon: Repeat, text: "Undo/Redo" },
              { icon: Activity, text: "Task Scheduling" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                <item.icon size={24} className="text-indigo-400" />
                <span className="text-xs font-bold text-center">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl" />
      </motion.section>

      {/* Conclusion */}
      <motion.div variants={itemVariants} className="text-center max-w-2xl mx-auto space-y-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Conclusion</h2>
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
          Linear data structures form the foundation of many programming concepts. Understanding arrays, linked lists, stacks, and queues helps developers design efficient programs and solve problems effectively.
        </p>
        <p className="text-slate-500 dark:text-slate-400 text-lg leading-relaxed">
          Mastering these structures is an important step toward learning advanced data structures and algorithms.
        </p>
        <div className="pt-8">
          <button 
            onClick={() => setMode('flashcards')}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
          >
            Practice Linear Structures
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ReviewItem({ topic, status, level }: any) {
  return (
    <div className="flex items-center justify-between p-6 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
          <Repeat size={18} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900">{topic}</h4>
          <p className="text-xs text-slate-500">{status}</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${
        level === 'Expert' ? 'bg-emerald-50 text-emerald-600' : 
        level === 'Intermediate' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
      }`}>
        {level}
      </span>
    </div>
  );
}

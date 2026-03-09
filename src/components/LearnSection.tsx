import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
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
  ArrowRight
} from 'lucide-react';
import { LearnTopic, LearnMode } from '../types';

export function LearnSection({ topic, setTopic, mode, setMode, careerPath }: { 
  topic: LearnTopic, 
  setTopic: (t: LearnTopic) => void,
  mode: LearnMode,
  setMode: (m: LearnMode) => void,
  careerPath?: string
}) {
  const [learnStep, setLearnStep] = useState<'overview' | 'curriculum'>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedCats, setExpandedCats] = useState<string[]>(['DATA STRUCTURES', 'ALGORITHMS', 'Linear', 'Non-Linear']);

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
        { id: 'sorting', label: 'Sorting', icon: ArrowDownAZ },
        { id: 'searching-graphs', label: 'Searching & Graphs', icon: Search },
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

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col relative z-40"
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-100 h-16">
          <button 
            onClick={() => setLearnStep('overview')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          {isSidebarOpen && <span className="font-bold text-slate-900">Curriculum</span>}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors mx-auto"
          >
            {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <div className="flex-1 py-4 px-2 space-y-6 overflow-y-auto">
          {/* Overview Item */}
          <button
            onClick={() => {
              setTopic('overview');
              setMode('overview');
            }}
            className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
              topic === 'overview' 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <Layout size={20} className="shrink-0" />
            {isSidebarOpen && <span className="font-medium truncate">Overview</span>}
          </button>

          {sidebarCategories.map((category, catIdx) => (
            <div key={catIdx} className="space-y-2">
              {isSidebarOpen && (
                <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
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
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <item.icon size={20} className="shrink-0" />
                      {isSidebarOpen && <span className="font-medium truncate flex-1 text-left">{item.label}</span>}
                      {isSidebarOpen && (
                        item.subItems ? (
                          <ChevronDown 
                            size={16} 
                            className={`transition-transform ${expandedCats.includes(item.label) ? 'rotate-180' : ''}`} 
                          />
                        ) : (
                          <ChevronRight 
                            size={16} 
                            className={`transition-transform ${topic === item.id ? 'text-white' : 'text-slate-300 group-hover:text-slate-500'}`} 
                          />
                        )
                      )}
                    </button>
                    
                    {/* Sub Items */}
                    {isSidebarOpen && item.subItems && expandedCats.includes(item.label) && (
                      <div className="ml-4 pl-4 border-l border-slate-100 space-y-1">
                        {item.subItems.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => {
                              setTopic(sub.id as LearnTopic);
                              setMode('overview');
                            }}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all ${
                              topic === sub.id 
                                ? 'bg-indigo-50 text-indigo-600 font-bold' 
                                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                          >
                            <sub.icon size={18} className="shrink-0 opacity-70" />
                            <span className="text-sm truncate">{sub.label}</span>
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

        <div className="p-4 border-t border-slate-100">
          <div className={`flex items-center gap-3 ${isSidebarOpen ? '' : 'justify-center'}`}>
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
              75%
            </div>
            {isSidebarOpen && (
              <div className="flex-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Progress</div>
                <div className="h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-indigo-600 w-3/4" />
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#f8f9fa] p-8">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {mode === 'overview' ? (
              <motion.div
                key={topic}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                {topic === 'overview' && <LearnOverview setMode={setMode} />}
                {topic === 'linear-overview' && <TopicContent title="Linear Overview" icon={Info} setMode={setMode} />}
                {topic === 'array' && <TopicContent title="Arrays" icon={Grid3X3} setMode={setMode} />}
                {topic === 'string' && <TopicContent title="Strings" icon={Type} setMode={setMode} />}
                {topic === 'stack' && <TopicContent title="Stacks" icon={Layers} setMode={setMode} />}
                {topic === 'queue' && <TopicContent title="Queues" icon={Users} setMode={setMode} />}
                {topic === 'linked-list' && <TopicContent title="Linked Lists" icon={Link} setMode={setMode} />}
                {topic === 'non-linear-overview' && <TopicContent title="Non-Linear Overview" icon={Info} setMode={setMode} />}
                {topic === 'tree' && <TopicContent title="Trees" icon={Network} setMode={setMode} />}
                {topic === 'graph' && <TopicContent title="Graphs" icon={GitBranch} setMode={setMode} />}
                {topic === 'sorting' && <TopicContent title="Sorting Algorithms" icon={ArrowDownAZ} setMode={setMode} />}
                {topic === 'searching-graphs' && <TopicContent title="Searching & Graphs" icon={Search} setMode={setMode} />}
              </motion.div>
            ) : (
              <motion.div
                key={mode}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <button 
                  onClick={() => setMode('overview')}
                  className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium mb-6"
                >
                  <ArrowLeft size={18} />
                  Back to {topic.charAt(0).toUpperCase() + topic.slice(1).replace('-', ' ')}
                </button>
                {mode === 'flashcards' && <FlashcardMode />}
                {mode === 'quiz' && <QuizMode />}
                {mode === 'spaced' && <SpacedRepetitionMode />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function LearnOverview({ setMode }: { setMode: (m: LearnMode) => void }) {
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
      <motion.div variants={itemVariants} className="relative overflow-hidden bg-indigo-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-indigo-200">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Book size={20} className="text-indigo-200" />
            <span className="text-indigo-100 font-bold text-sm uppercase tracking-widest">Course Overview</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            📘 Data Structures & Algorithms (DSA)
          </h1>
          <p className="text-indigo-100 text-lg leading-relaxed mb-8">
            Master the foundation of software development and problem-solving. Build efficient code and crack top technical interviews.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setMode('flashcards')}
              className="px-6 py-3 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center gap-2"
            >
              <Zap size={18} /> Start Learning
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/30 rounded-2xl border border-indigo-400/30 backdrop-blur-sm">
              <CheckCircle2 size={16} className="text-indigo-200" />
              <span className="text-sm font-medium">Industry Standard Curriculum</span>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-indigo-500 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-20%] left-[-5%] w-60 h-60 bg-indigo-700 rounded-full blur-3xl opacity-50" />
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
            onClick={() => setMode('flashcards')}
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

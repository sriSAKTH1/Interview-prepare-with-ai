/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { GoogleGenAI, Type as GenAISchemaType } from "@google/genai";
import { Layout, Home, BookOpen, ClipboardCheck, Bell, Search, User, BarChart3, Clock, Award, ChevronRight, Layers, HelpCircle, Repeat, ArrowLeft, CheckCircle2, XCircle, Menu, X, ChevronLeft, Code2, Cpu, Zap, Target, Trophy, Lightbulb, Globe, Smartphone, ShoppingCart, Map, Database, Terminal, Activity, Rocket, Brain, Book, Check, Share2, ArrowDownAZ, Equal, Info, Grid3X3, Type, Link, Network, GitBranch, ChevronDown, Users, Building2, Briefcase, ListChecks, FileCode, GraduationCap, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Section = 'home' | 'learn' | 'test';
type LearnTopic = 'overview' | 'linear-overview' | 'array' | 'string' | 'stack' | 'queue' | 'linked-list' | 'non-linear-overview' | 'tree' | 'graph' | 'sorting' | 'searching-graphs';
type LearnMode = 'overview' | 'flashcards' | 'quiz' | 'spaced';
type TestMode = 'overview' | 'mcq-dsa' | 'mcq-role' | 'coding-topic' | 'company-round';

interface TopicPerformance {
  topic: string;
  correct: number;
  total: number;
  percentage: number;
}

interface TestResult {
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

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [learnTopic, setLearnTopic] = useState<LearnTopic>('overview');
  const [learnMode, setLearnMode] = useState<LearnMode>('overview');
  const [testMode, setTestMode] = useState<TestMode>('overview');
  const [testHistory, setTestHistory] = useState<TestResult[]>([
    {
      id: '1',
      title: 'Python Data Structures Mock Test',
      score: '92/100',
      total: 100,
      correct: 92,
      time: '2 hours ago',
      status: 'Completed',
      feedback: 'Excellent performance! You have a strong grasp of basic data structures.',
      weaknesses: ['Graph Traversal'],
      improvements: ['Practice Dijkstra\'s algorithm', 'Study topological sorting']
    }
  ]);

  const addTestResult = (result: TestResult) => {
    setTestHistory(prev => [result, ...prev]);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn and Prepare', icon: BookOpen },
    { id: 'test', label: 'Test', icon: ClipboardCheck },
  ];

  const handleNavClick = (id: Section) => {
    setActiveSection(id);
    if (id === 'learn') {
      setLearnTopic('overview');
      setLearnMode('overview');
    }
    if (id === 'test') {
      setTestMode('overview');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white border-b border-slate-200 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="font-bold text-xl tracking-tight">PrepMaster</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as Section)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    activeSection === item.id 
                      ? 'bg-indigo-50 text-indigo-600' 
                      : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="h-6 w-[1px] bg-slate-200 mx-2 hidden md:block"></div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                <Search size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden border border-slate-300">
                <User size={20} className="text-slate-500" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`pt-16 min-h-screen ${activeSection === 'learn' ? '' : 'max-w-7xl mx-auto px-4 pt-24'}`}>
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Dashboard history={testHistory} />
            </motion.div>
          )}
          
          {activeSection === 'learn' && (
            <motion.div
              key="learn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-[calc(100vh-64px)]"
            >
              <LearnSection 
                topic={learnTopic} 
                setTopic={setLearnTopic} 
                mode={learnMode} 
                setMode={setLearnMode} 
              />
            </motion.div>
          )}
          
          {activeSection === 'test' && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="min-h-[calc(100vh-64px)]"
            >
              <TestSection mode={testMode} setMode={setTestMode} onComplete={addTestResult} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function LearnSection({ topic, setTopic, mode, setMode }: { 
  topic: LearnTopic, 
  setTopic: (t: LearnTopic) => void,
  mode: LearnMode,
  setMode: (m: LearnMode) => void
}) {
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
          icon: Share2,
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

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col relative z-40"
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-100 h-16">
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

function PathStep({ number, title, description, status }: any) {
  return (
    <div className="flex gap-6 relative group">
      {status !== 'locked' && (
        <div className="absolute left-6 top-12 bottom-[-32px] w-[2px] bg-slate-100 last:hidden" />
      )}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 z-10 transition-all ${
        status === 'completed' ? 'bg-emerald-500 text-white' : 
        status === 'in-progress' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 
        'bg-slate-100 text-slate-400'
      }`}>
        {status === 'completed' ? <CheckCircle2 size={24} /> : number}
      </div>
      <div className="pt-1">
        <h4 className={`font-bold ${status === 'locked' ? 'text-slate-400' : 'text-slate-900'}`}>{title}</h4>
        <p className="text-sm text-slate-500 mt-1">{description}</p>
        {status === 'in-progress' && (
          <button className="mt-3 text-xs font-bold text-indigo-600 hover:underline">Continue Learning</button>
        )}
      </div>
    </div>
  );
}

function PracticeModeCard({ title, description, icon: Icon, color, bgColor, onClick }: any) {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
    >
      <div className={`w-12 h-12 rounded-2xl ${bgColor} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
      <div className="mt-6 flex items-center gap-2 text-indigo-600 font-semibold text-sm">
        Start Practice <ChevronRight size={16} />
      </div>
    </div>
  );
}

function ProgressItem({ label, progress }: { label: string, progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-slate-700">{label}</span>
        <span className="text-slate-500">{progress}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full bg-indigo-600"
        />
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

function Dashboard({ history }: { history: TestResult[] }) {
  const avgScore = history.length > 0 
    ? Math.round(history.reduce((acc, curr) => acc + (curr.correct / curr.total) * 100, 0) / history.length)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, Sudharsan! 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your preparation today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            View Analytics
          </button>
          <button className="px-4 py-2 bg-indigo-600 rounded-xl text-sm font-medium text-white hover:bg-indigo-700 transition-colors shadow-sm">
            Start Practice
          </button>
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
          title="Achievements" 
          value="8" 
          change="New" 
          icon={Award} 
          color="text-amber-600" 
          bgColor="bg-amber-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
            <button className="text-sm text-indigo-600 font-medium hover:underline">View All</button>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
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
              <div className="p-8 text-center text-slate-500">No recent activity</div>
            )}
          </div>
        </div>

        {/* Upcoming */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-900">Recommended for You</h2>
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
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2 rounded-xl ${bgColor} ${color}`}>
          <Icon size={20} />
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
        }`}>
          {change}
        </span>
      </div>
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}

function TestSection({ mode, setMode, onComplete }: { mode: TestMode, setMode: (m: TestMode) => void, onComplete: (r: TestResult) => void }) {
  const [testStep, setTestStep] = useState<'overview' | 'difficulty' | 'role-selection' | 'generating' | 'rules' | 'active' | 'results'>('overview');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [customRole, setCustomRole] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [dynamicQuestions, setDynamicQuestions] = useState<any[]>([]);

  const predefinedRoles = [
    'Frontend Developer',
    'Backend Developer',
    'Fullstack Developer',
    'Data Scientist',
    'DevOps Engineer',
    'Mobile Developer',
    'Security Analyst',
    'Cloud Architect'
  ];

  // Mock 30 questions for DSA
  const dsaQuestions = Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    question: `Question ${i + 1}: What is the time complexity of ${['Binary Search', 'Quick Sort', 'Merge Sort', 'Bubble Sort', 'Insertion Sort'][i % 5]} in the ${['best', 'average', 'worst'][i % 3]} case?`,
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
    correct: (i % 5) + (i % 3) % 4,
    topic: ['Arrays', 'Strings', 'Stacks', 'Queues', 'Linked Lists', 'Trees', 'Graphs'][i % 7]
  }));

  const questions = mode === 'mcq-dsa' ? dsaQuestions : dynamicQuestions;

  const generateRoleBasedQuestions = async (role: string) => {
    setTestStep('generating');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 30 multiple-choice questions for a ${role} role at ${difficulty} difficulty. 
        Focus on core technical skills, common interview questions, and industry best practices.
        Return the response in JSON format as an array of objects with the following structure:
        {
          "id": number,
          "question": "string",
          "options": ["string", "string", "string", "string"],
          "correct": number (index of correct option 0-3),
          "topic": "string"
        }`,
        config: {
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: GenAISchemaType.ARRAY,
            items: {
              type: GenAISchemaType.OBJECT,
              properties: {
                id: { type: GenAISchemaType.INTEGER },
                question: { type: GenAISchemaType.STRING },
                options: { type: GenAISchemaType.ARRAY, items: { type: GenAISchemaType.STRING } },
                correct: { type: GenAISchemaType.INTEGER },
                topic: { type: GenAISchemaType.STRING }
              },
              required: ["id", "question", "options", "correct", "topic"]
            }
          }
        }
      });

      const generated = JSON.parse(response.text || '[]');
      if (generated.length > 0) {
        setDynamicQuestions(generated);
        setTestStep('rules');
      } else {
        throw new Error("No questions generated");
      }
    } catch (error) {
      console.error("Error generating questions:", error);
      // Fallback or error state
      setTestStep('role-selection');
    }
  };

  const handleFinishTest = (finalAnswers = answers) => {
    const correctCount = finalAnswers.reduce((acc, ans, idx) => acc + (ans === questions[idx].correct ? 1 : 0), 0);
    const score = Math.round((correctCount / questions.length) * 100);
    
    // Topic-wise analysis
    const topicsMap: Record<string, { correct: number, total: number }> = {};
    questions.forEach((q, idx) => {
      if (!topicsMap[q.topic]) {
        topicsMap[q.topic] = { correct: 0, total: 0 };
      }
      topicsMap[q.topic].total += 1;
      if (finalAnswers[idx] === q.correct) {
        topicsMap[q.topic].correct += 1;
      }
    });

    const topicAnalysis: TopicPerformance[] = Object.entries(topicsMap).map(([topic, stats]) => ({
      topic,
      correct: stats.correct,
      total: stats.total,
      percentage: Math.round((stats.correct / stats.total) * 100)
    }));

    const weaknesses = topicAnalysis
      .filter(t => t.percentage < 60)
      .map(t => t.topic);
    
    const strengths = topicAnalysis
      .filter(t => t.percentage >= 80)
      .map(t => t.topic);

    const improvements = weaknesses.map(w => `Focus on ${w} fundamentals and practice more problems in this area.`);
    if (improvements.length === 0 && score < 100) {
      improvements.push("Review the questions you missed to understand the underlying concepts.");
    }

    const result: TestResult = {
      id: Math.random().toString(36).substr(2, 9),
      title: mode === 'mcq-dsa' ? `MCQ-DSA (${difficulty})` : `MCQ-Role (${selectedRole || customRole})`,
      score: `${score}/100`,
      total: 100,
      correct: correctCount,
      time: 'Just now',
      status: 'Completed',
      feedback: score > 90 ? 'Exceptional! You have a deep understanding of the subject matter.' : 
                score > 75 ? 'Great job! You have a solid grasp of most topics.' : 
                score > 50 ? 'Good effort! You are on the right track, but some areas need more attention.' : 
                'Keep studying! Focus on the core fundamentals and try again.',
      weaknesses,
      improvements,
      topicAnalysis
    };
    
    onComplete(result);
    setTestStep('results');
  };

  const handleAnswer = (optionIdx: number) => {
    const newAnswers = [...answers, optionIdx];
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleFinishTest(newAnswers);
    }
  };

  useEffect(() => {
    let timer: any;
    if (testStep === 'active' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && testStep === 'active') {
      handleFinishTest();
    }
    return () => clearInterval(timer);
  }, [testStep, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const testOptions = [
    {
      id: 'mcq-dsa',
      title: 'MCQ-DSA',
      description: 'Test your theoretical knowledge of Data Structures and Algorithms with multiple-choice questions.',
      icon: ListChecks,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      tag: 'Theory'
    },
    {
      id: 'mcq-role',
      title: 'MCQ-Role Based',
      description: 'Role-specific assessments for Frontend, Backend, Fullstack, and Mobile developers.',
      icon: Briefcase,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      tag: 'Career'
    },
    {
      id: 'coding-topic',
      title: 'DSA Topic-Wise Coding',
      description: 'Hands-on coding challenges categorized by specific topics like Arrays, Trees, and Graphs.',
      icon: FileCode,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      tag: 'Coding'
    },
    {
      id: 'company-round',
      title: 'Company Specific Rounds',
      description: 'Simulate interview rounds for top companies like Google, Amazon, and Microsoft.',
      icon: Building2,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      tag: 'Premium'
    }
  ];

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

  if (mode === 'mcq-dsa' || mode === 'mcq-role') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {testStep === 'overview' && (
            <motion.div
              key="test-init"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm text-center space-y-6"
            >
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
                {mode === 'mcq-dsa' ? <ListChecks size={40} /> : <Briefcase size={40} />}
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {mode === 'mcq-dsa' ? 'MCQ-DSA Assessment' : 'Role-Based MCQ Assessment'}
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                {mode === 'mcq-dsa' 
                  ? 'Prepare yourself for a timed session with 30 questions covering various DSA topics.'
                  : 'Select your target role and our AI will generate a custom assessment based on current industry standards.'}
              </p>
              <div className="pt-6">
                <button 
                  onClick={() => setTestStep('difficulty')}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                >
                  Initialize Test Environment
                </button>
              </div>
              <button onClick={() => setMode('overview')} className="text-slate-400 hover:text-slate-600 text-sm font-medium">Cancel</button>
            </motion.div>
          )}

          {testStep === 'difficulty' && (
            <motion.div
              key="test-difficulty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900">Select Difficulty</h2>
                <p className="text-slate-500 mt-2">Choose the level that matches your current expertise.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setDifficulty(level);
                      if (mode === 'mcq-role') {
                        setTestStep('role-selection');
                      } else {
                        setTestStep('rules');
                      }
                    }}
                    className={`p-6 rounded-2xl border-2 transition-all text-center group ${
                      difficulty === level ? 'border-indigo-600 bg-indigo-50' : 'border-slate-100 hover:border-indigo-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center ${
                      level === 'Easy' ? 'bg-emerald-100 text-emerald-600' : 
                      level === 'Medium' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                    }`}>
                      <Zap size={24} />
                    </div>
                    <h4 className="font-bold text-lg">{level}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {level === 'Easy' ? 'Fundamentals & Basics' : 
                       level === 'Medium' ? 'Intermediate Logic' : 'Advanced Optimization'}
                    </p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {testStep === 'role-selection' && (
            <motion.div
              key="role-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900">Choose Your Role</h2>
                <p className="text-slate-500 mt-2">Select a predefined role or type your own.</p>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {predefinedRoles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`p-4 rounded-xl border-2 transition-all text-sm font-bold ${
                      selectedRole === role ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 text-slate-600 hover:border-indigo-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  placeholder="Or type a custom role (e.g. AI Engineer, Product Manager...)"
                  value={customRole}
                  onChange={(e) => {
                    setCustomRole(e.target.value);
                    setSelectedRole('');
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-medium"
                />
              </div>

              <div className="pt-4">
                <button 
                  disabled={!selectedRole && !customRole}
                  onClick={() => generateRoleBasedQuestions(selectedRole || customRole)}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Generate AI Test <Sparkles size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {testStep === 'generating' && (
            <motion.div
              key="generating"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm text-center space-y-8"
            >
              <div className="relative w-24 h-24 mx-auto">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-full h-full border-4 border-indigo-100 border-t-indigo-600 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                  <Sparkles size={32} />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">AI is Crafting Your Test</h2>
                <p className="text-slate-500 mt-2">Analyzing industry standards and generating 30 high-impact questions for {selectedRole || customRole}...</p>
              </div>
              <div className="flex justify-center gap-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                    className="w-2 h-2 bg-indigo-600 rounded-full"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {testStep === 'rules' && (
            <motion.div
              key="dsa-rules"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-2xl space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-indigo-600" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Info size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Test Rules & Guidelines</h2>
                  <p className="text-slate-500 text-sm">Created by PrepMaster AI Team • Please read carefully.</p>
                </div>
              </div>
              
              <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {[
                  "Total of 30 multiple-choice questions.",
                  "Each question has only one correct answer.",
                  "No negative marking for incorrect answers.",
                  "You cannot go back to previous questions.",
                  "The test is timed (30 minutes recommended).",
                  "Do not refresh the page during the test."
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-slate-700 text-sm font-medium">{rule}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => setTestStep('active')}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-2"
                >
                  I Understand, Start Test <Rocket size={18} />
                </button>
                <button onClick={() => setTestStep('difficulty')} className="text-slate-400 hover:text-slate-600 text-sm font-medium">Go Back</button>
              </div>
            </motion.div>
          )}

          {testStep === 'active' && (
            <motion.div
              key="dsa-active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
                    {currentQuestion + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Question {currentQuestion + 1} of {questions.length}</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">{questions[currentQuestion].topic}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-slate-600 font-mono text-sm">
                  <Clock size={16} /> {formatTime(timeLeft)}
                </div>
              </div>

              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  className="h-full bg-indigo-600"
                />
              </div>

              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                <h3 className="text-xl font-bold text-slate-900 leading-relaxed">
                  {questions[currentQuestion].question}
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {questions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(idx)}
                      className="w-full p-5 text-left rounded-2xl border-2 border-slate-100 hover:border-indigo-600 hover:bg-indigo-50 transition-all group flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-700 group-hover:text-indigo-700">{option}</span>
                      <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-indigo-600 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {testStep === 'results' && (
            <motion.div
              key="dsa-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm text-center space-y-8">
                <div className="w-24 h-24 bg-indigo-600 text-white rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-indigo-100">
                  <Trophy size={48} />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-slate-900">Test Completed!</h2>
                    <p className="text-slate-500 mt-2">You've successfully finished the {mode === 'mcq-dsa' ? 'MCQ-DSA' : 'MCQ-Role'} ({difficulty}) assessment.</p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="text-2xl font-bold text-slate-900">{answers.reduce((acc, ans, idx) => acc + (ans === questions[idx].correct ? 1 : 0), 0)}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Correct</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="text-2xl font-bold text-slate-900">{Math.round((answers.reduce((acc, ans, idx) => acc + (ans === questions[idx].correct ? 1 : 0), 0) / questions.length) * 100)}%</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Score</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="text-2xl font-bold text-slate-900">{formatTime(1800 - timeLeft)}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Taken</div>
                    </div>
                  </div>

                  <div className="space-y-6 text-left bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        <Brain size={18} className="text-indigo-600" /> AI Feedback
                      </h4>
                      <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                        {Math.round((answers.reduce((acc, ans, idx) => acc + (ans === questions[idx].correct ? 1 : 0), 0) / questions.length) * 100) > 70 
                          ? "Excellent work! Your understanding of core concepts is impressive. You handled the edge cases well."
                          : "Good attempt. You seem to struggle with some advanced topics. Focus on industry best practices and core fundamentals."}
                      </p>
                    </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <XCircle size={16} className="text-rose-500" /> Weaknesses
                      </h4>
                      <ul className="mt-2 space-y-1">
                        {(mode === 'mcq-dsa' ? ['Graph Traversal', 'Dynamic Programming'] : ['Core Technical Skills', 'Industry Standards']).map(w => (
                          <li key={w} className="text-xs text-slate-500 flex items-center gap-2">
                            <div className="w-1 h-1 bg-slate-300 rounded-full" /> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-500" /> To Improve
                      </h4>
                      <ul className="mt-2 space-y-1">
                        {(mode === 'mcq-dsa' ? ['Practice Dijkstra\'s', 'Study Memoization'] : ['Review Role Fundamentals', 'Practice More Mock Interviews']).map(i => (
                          <li key={i} className="text-xs text-slate-500 flex items-center gap-2">
                            <div className="w-1 h-1 bg-slate-300 rounded-full" /> {i}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setMode('overview')}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
                  >
                    Return to Assessments
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <AnimatePresence mode="wait">
        {mode === 'overview' ? (
          <motion.div
            key="test-overview"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold uppercase tracking-widest mb-4">
                <ClipboardCheck size={16} /> Assessment Center
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-4">Evaluate Your Skills</h1>
              <p className="text-slate-500 text-lg">
                Choose from various testing modes to identify your strengths and areas for improvement.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testOptions.map((option) => (
                <motion.div
                  key={option.id}
                  variants={itemVariants}
                  whileHover={{ y: -5 }}
                  onClick={() => setMode(option.id as TestMode)}
                  className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${option.bgColor} ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <option.icon size={28} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-500 rounded-full">
                      {option.tag}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">{option.title}</h3>
                  <p className="text-slate-500 leading-relaxed mb-6">
                    {option.description}
                  </p>
                  <div className="flex items-center gap-2 text-indigo-600 font-bold">
                    Start Assessment <ChevronRight size={18} />
                  </div>
                  {/* Decorative background circle */}
                  <div className={`absolute -bottom-12 -right-12 w-32 h-32 ${option.bgColor} rounded-full opacity-20 blur-2xl group-hover:opacity-40 transition-opacity`} />
                </motion.div>
              ))}
            </div>

            {/* Quick Stats / Info */}
            <motion.div variants={itemVariants} className="bg-slate-900 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">Ready for a Real Challenge?</h2>
                <p className="text-slate-400">Our AI monitors your performance and provides detailed feedback.</p>
              </div>
              <div className="flex gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400">500+</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-400">50+</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Companies</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-400">Real-time</div>
                  <div className="text-xs text-slate-500 uppercase tracking-widest font-bold">Feedback</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="test-mode"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            <button 
              onClick={() => setMode('overview')}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium mb-6"
            >
              <ArrowLeft size={18} /> Back to Assessments
            </button>
            
            <div className="bg-white p-12 rounded-[3rem] border border-slate-200 shadow-sm text-center space-y-6">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto">
                {mode === 'coding-topic' && <FileCode size={40} />}
                {mode === 'company-round' && <Building2 size={40} />}
              </div>
              <h2 className="text-3xl font-bold text-slate-900">
                {mode === 'coding-topic' && 'Topic-Wise Coding Test'}
                {mode === 'company-round' && 'Company Specific Round'}
              </h2>
              <p className="text-slate-500 max-w-lg mx-auto">
                The {mode.replace('-', ' ')} module is being initialized. Prepare yourself for a timed session with real-time AI evaluation.
              </p>
              <div className="pt-6">
                <button className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200">
                  Initialize Test Environment
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ActivityItem({ title, time, score, status }: any) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          <Layout size={18} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
          <p className="text-xs text-slate-500">{time}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-bold text-slate-900">{score}</div>
        <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">{status}</div>
      </div>
    </div>
  );
}

function RecommendationCard({ title, description, tag }: any) {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
          {tag}
        </span>
        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
      </div>
      <h4 className="text-sm font-bold text-slate-900 mb-1">{title}</h4>
      <p className="text-xs text-slate-500 line-clamp-2">{description}</p>
    </div>
  );
}

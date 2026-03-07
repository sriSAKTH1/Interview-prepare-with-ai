/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Home, BookOpen, Bell, Search, User, ClipboardCheck, Zap, Moon, Sun, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Dashboard } from './components/Dashboard';
import { LearnSection } from './components/LearnSection';
import { PrepareSection } from './components/PrepareSection';
import { TestSection } from './components/TestSection';
import { Section, LearnTopic, LearnMode, TestResult } from './types';

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [learnTopic, setLearnTopic] = useState<LearnTopic>('overview');
  const [learnMode, setLearnMode] = useState<LearnMode>('overview');
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
  const [testConfig, setTestConfig] = useState<{ mode: any, company?: string, role?: string } | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const addTestResult = (result: TestResult) => {
    setTestHistory(prev => [result, ...prev]);
  };

  const startTest = (mode: any, company?: string, role?: string) => {
    setTestConfig({ mode, company, role });
    setActiveSection('test');
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'prepare', label: 'Prepare', icon: Zap },
    { id: 'test', label: 'Test', icon: ClipboardCheck },
  ];

  const handleNavClick = (id: Section) => {
    setActiveSection(id);
    if (id === 'learn') {
      setLearnTopic('overview');
      setLearnMode('overview');
    }
  };

  return (
      <div className={`min-h-screen bg-[#f8f9fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300`}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <span className="font-bold text-xl tracking-tight dark:text-white">PrepMaster</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id as Section)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                    activeSection === item.id 
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>
            
            <div className="h-6 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2 hidden md:block"></div>
            
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <Search size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
              </button>
              
              <div className="relative">
                <button 
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-700 hover:border-indigo-500 transition-all"
                >
                  <User size={20} className="text-slate-500 dark:text-slate-400" />
                </button>

                <AnimatePresence>
                  {showProfileMenu && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowProfileMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-20 overflow-hidden"
                      >
                        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                          <p className="text-sm font-bold dark:text-white">Profile Settings</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Manage your preferences</p>
                        </div>
                        <div className="p-2">
                          <button 
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              {isDarkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-600" />}
                              <span className="text-sm font-medium dark:text-slate-200">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                            </div>
                            <div className={`w-10 h-5 rounded-full transition-colors relative ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isDarkMode ? 'left-6' : 'left-1'}`} />
                            </div>
                          </button>
                          
                          <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <Settings size={18} className="text-slate-400" />
                            <span className="text-sm font-medium dark:text-slate-200">Account Settings</span>
                          </button>
                        </div>
                        <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                          <button className="w-full text-left p-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`pt-16 min-h-screen ${activeSection === 'learn' || activeSection === 'prepare' || activeSection === 'test' ? '' : 'max-w-7xl mx-auto px-4 pt-24'}`}>
        <AnimatePresence mode="wait">
          {activeSection === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Dashboard history={testHistory} onStartTest={startTest} />
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

          {activeSection === 'prepare' && (
            <motion.div
              key="prepare"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="h-[calc(100vh-64px)]"
            >
              <PrepareSection />
            </motion.div>
          )}

          {activeSection === 'test' && (
            <motion.div
              key="test"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TestSection 
                onComplete={addTestResult} 
                initialMode={testConfig?.mode}
                initialCompany={testConfig?.company}
                initialRole={testConfig?.role}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

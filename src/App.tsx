/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { Home, BookOpen, Bell, Search, User, ClipboardCheck, Zap, Settings as SettingsIcon, LogIn, LogOut, Code2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Dashboard } from './components/Dashboard';
import { LearnSection } from './components/LearnSection';
import { PrepareSection } from './components/PrepareSection';
import { TestSection } from './components/TestSection';
import { Settings } from './components/Settings';
import { Logo } from './components/Logo';
import Login from './components/Login';
import { Section, LearnTopic, LearnMode, TestResult, CompletedTopic } from './types';
import { 
  auth, 
  db, 
  signInWithGoogle, 
  logout, 
  handleFirestoreError, 
  OperationType 
} from './firebase';
import { 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  orderBy,
  doc,
  setDoc,
  Timestamp
} from 'firebase/firestore';

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800 text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl flex items-center justify-center mx-auto">
              <Zap size={32} />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Something went wrong</h1>
            <p className="text-slate-500 dark:text-slate-400">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
            >
              Refresh Page
            </button>
            {this.state.error && (
              <pre className="text-[10px] text-left bg-slate-100 dark:bg-slate-800 p-4 rounded-lg overflow-auto max-h-40 text-slate-500">
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [activeSection, setActiveSection] = useState<Section>('home');
  const [learnTopic, setLearnTopic] = useState<LearnTopic>('overview');
  const [learnMode, setLearnMode] = useState<LearnMode>('overview');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [testHistory, setTestHistory] = useState<TestResult[]>([]);
  const [completedTopics, setCompletedTopics] = useState<CompletedTopic[]>([]);
  const [viewingResult, setViewingResult] = useState<TestResult | null>(null);
  const [testConfig, setTestConfig] = useState<{ 
    mode: any, 
    company?: string, 
    role?: string,
    examName?: string,
    context?: string
  } | null>(null);
  const [careerPath, setCareerPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('careerPath') || 'Frontend Developer';
    }
    return 'Frontend Developer';
  });
  const [themeMode, setThemeMode] = useState<'light' | 'dark' | 'system'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('themeMode') as 'light' | 'dark' | 'system') || 'system';
    }
    return 'system';
  });

  const [accentColor, setAccentColor] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accentColor') || '#4f46e5';
    }
    return '#4f46e5';
  });

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showTeamMessage, setShowTeamMessage] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);

  useEffect(() => {
    // Show greeting after a short delay
    const timer = setTimeout(() => {
      setShowGreeting(true);
      // Hide after 5 seconds
      setTimeout(() => setShowGreeting(false), 5000);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      let isDark = false;
      if (themeMode === 'system') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      } else {
        isDark = themeMode === 'dark';
      }
      
      setIsDarkMode(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('themeMode', themeMode);
    };

    updateTheme();

    if (themeMode === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [themeMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
    localStorage.setItem('accentColor', accentColor);
  }, [accentColor]);

  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (userData?.careerPath) {
      setCareerPath(userData.careerPath);
    }
    if (userData?.accentColor) {
      setAccentColor(userData.accentColor);
    }
    if (userData?.themeMode) {
      setThemeMode(userData.themeMode);
    }
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('careerPath', careerPath);
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, { careerPath }, { merge: true })
        .catch(err => console.error('Failed to sync career path:', err));
    }
  }, [careerPath, user]);

  const [studyTime, setStudyTime] = useState<number>(0);

  // Study Session Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setStudyTime(prev => prev + 1);
    }, 60000); // Increment every minute

    return () => clearInterval(timer);
  }, []);

  // Sync Study Time to Firestore
  useEffect(() => {
    if (!user || studyTime === 0) return;

    const syncStudyTime = async () => {
      try {
        const userRef = doc(db, 'users', user.uid);
        // We'll store it as minutes and convert to hours in the UI
        await setDoc(userRef, { 
          totalStudyMinutes: studyTime 
        }, { merge: true });
      } catch (err) {
        console.error('Failed to sync study time:', err);
      }
    };

    // Sync every 5 minutes to avoid too many writes
    if (studyTime % 5 === 0) {
      syncStudyTime();
    }
  }, [studyTime, user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthReady(true);
      
      if (currentUser) {
        // Sync user profile
        const userRef = doc(db, 'users', currentUser.uid);
        setDoc(userRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          careerPath: careerPath
        }, { merge: true }).catch(err => handleFirestoreError(err, OperationType.WRITE, `users/${currentUser.uid}`));
      }
    });
    return () => unsubscribe();
  }, [careerPath]);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Sync Test Results
  useEffect(() => {
    if (!user || !isAuthReady) {
      setTestHistory([]);
      return;
    }

    const q = query(
      collection(db, 'testResults'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          time: data.createdAt instanceof Timestamp 
            ? new Date(data.createdAt.seconds * 1000).toLocaleString()
            : 'Just now'
        } as TestResult;
      });
      setTestHistory(results);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'testResults'));

    return () => unsubscribe();
  }, [user, isAuthReady]);

  // Sync Completed Topics
  useEffect(() => {
    if (!user || !isAuthReady) {
      setCompletedTopics([]);
      return;
    }

    const q = query(
      collection(db, 'completedTopics'),
      where('uid', '==', user.uid),
      orderBy('completedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const topics = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          completedAt: data.completedAt instanceof Timestamp 
            ? new Date(data.completedAt.seconds * 1000).toISOString()
            : new Date().toISOString()
        } as CompletedTopic;
      });
      setCompletedTopics(topics);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'completedTopics'));

    return () => unsubscribe();
  }, [user, isAuthReady]);

  const addTestResult = async (result: TestResult) => {
    if (!user) {
      setTestHistory(prev => [result, ...prev]);
      return;
    }

    try {
      const { id, time, ...rest } = result;
      await addDoc(collection(db, 'testResults'), {
        ...rest,
        uid: user.uid,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'testResults');
    }
  };

  const markTopicComplete = async (topicId: string, topicName: string, category: string) => {
    if (!user) return;

    // Check if already completed
    if (completedTopics.some(t => t.topicId === topicId)) return;

    try {
      await addDoc(collection(db, 'completedTopics'), {
        uid: user.uid,
        topicId,
        topicName,
        category,
        completedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'completedTopics');
    }
  };

  const startTest = (config: any) => {
    // Check if config is a string (legacy) or an object
    if (typeof config === 'string') {
      setTestConfig({ mode: config });
    } else {
      setTestConfig(config);
    }
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

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20 flex items-center justify-center"
        >
          <Logo className="text-white" size={32} />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-[#f8f9fa] dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300`}>
      {/* Navigation */}
      <AnimatePresence>
        {showGreeting && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 20 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-[60] pointer-events-none"
          >
            <div className="bg-indigo-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 backdrop-blur-md">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold opacity-80 uppercase tracking-tighter">System Greeting</p>
                <p className="text-sm font-bold">Good to see you again, {user.displayName?.split(' ')[0]}!</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 h-16">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Logo size={20} />
            </div>
            <span className="font-bold text-xl tracking-tight dark:text-white">DSAForge</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id as Section);
                    if (item.id === 'home') setViewingResult(null);
                  }}
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
              <div className="relative">
                <button 
                  onClick={() => setShowTeamMessage(!showTeamMessage)}
                  className={`p-2 transition-all relative rounded-xl ${showTeamMessage ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
                >
                  <Bell size={20} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse"></span>
                </button>

                <AnimatePresence>
                  {showTeamMessage && (
                    <>
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowTeamMessage(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95, x: -100 }}
                        animate={{ opacity: 1, y: 0, scale: 1, x: -100 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95, x: -100 }}
                        className="absolute top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-20 overflow-hidden"
                      >
                        <div className="p-4 bg-indigo-600 text-white">
                          <div className="flex items-center gap-2 mb-1">
                            <Zap size={16} />
                            <span className="text-xs font-bold uppercase tracking-wider">Message from Team</span>
                          </div>
                          <h4 className="font-bold">Welcome to DSAForge!</h4>
                        </div>
                        <div className="p-4 space-y-3">
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            Hello <span className="font-bold text-indigo-600 dark:text-indigo-400">{user.displayName?.split(' ')[0]}</span>! We're thrilled to have you here.
                          </p>
                          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                            <p className="text-xs italic text-slate-500 dark:text-slate-400">
                              "Success is not final, failure is not fatal: it is the courage to continue that counts."
                            </p>
                          </div>
                          <button 
                            onClick={() => setShowTeamMessage(false)}
                            className="w-full py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                          >
                            Got it, thanks!
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex items-center gap-3">
                <span className="hidden lg:block text-sm font-bold text-slate-600 dark:text-slate-400 mr-1">
                  Hi, {user.displayName?.split(' ')[0] || 'User'}
                </span>
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
                          {!user ? (
                            <button 
                              onClick={() => {
                                signInWithGoogle().catch(err => console.error(err));
                                setShowProfileMenu(false);
                              }}
                              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-indigo-600 font-bold"
                            >
                              <LogIn size={18} />
                              <span className="text-sm">Sign In with Google</span>
                            </button>
                          ) : (
                            <div className="p-3 mb-2 flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold">
                                {user.displayName?.charAt(0) || 'U'}
                              </div>
                              <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate dark:text-white">{user.displayName}</p>
                                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                              </div>
                            </div>
                          )}

                          <button 
                            onClick={() => {
                              setActiveSection('settings');
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            <SettingsIcon size={18} className="text-slate-400" />
                            <span className="text-sm font-medium dark:text-slate-200">Account Settings</span>
                          </button>
                        </div>
                        <div className="p-2 border-t border-slate-100 dark:border-slate-800">
                          {user ? (
                            <button 
                              onClick={() => {
                                logout().catch(err => console.error(err));
                                setShowProfileMenu(false);
                              }}
                              className="w-full text-left p-3 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors flex items-center gap-3"
                            >
                              <LogOut size={18} />
                              Sign Out
                            </button>
                          ) : (
                            <p className="p-3 text-[10px] text-slate-400 text-center italic">Sign in to sync your progress</p>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
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
              <Dashboard 
                history={testHistory} 
                completedTopics={completedTopics}
                onStartTest={startTest} 
                careerPath={careerPath}
                setCareerPath={setCareerPath}
                user={user}
                userData={userData}
                usernames={userData?.coding_usernames}
                onViewResult={(result) => {
                  setViewingResult(result);
                  setActiveSection('test');
                }}
                onGoToSettings={() => setActiveSection('settings')}
              />
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
                careerPath={careerPath}
                onMarkComplete={markTopicComplete}
                completedTopics={completedTopics}
                user={user}
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
              <PrepareSection careerPath={careerPath} onStartTest={startTest} />
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
                initialRole={testConfig?.role || careerPath}
                initialExamName={testConfig?.examName}
                initialContext={testConfig?.context}
                viewResult={viewingResult}
              />
            </motion.div>
          )}

          {activeSection === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Settings 
                user={user}
                userData={userData}
                careerPath={careerPath}
                setCareerPath={setCareerPath}
                themeMode={themeMode}
                setThemeMode={setThemeMode}
                accentColor={accentColor}
                setAccentColor={setAccentColor}
                onClose={() => setActiveSection('home')}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
    </ErrorBoundary>
  );
}

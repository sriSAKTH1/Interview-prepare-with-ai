import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Book, 
  Link2, 
  Bell, 
  Palette, 
  BarChart3, 
  Shield, 
  Lock, 
  ChevronRight, 
  Save,
  Github,
  Globe,
  Mail,
  Trash2,
  Download,
  AlertCircle,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

type SettingsTab = 
  | 'profile' 
  | 'learning' 
  | 'platforms' 
  | 'notifications' 
  | 'theme' 
  | 'progress' 
  | 'security' 
  | 'privacy';

export function Settings({ user, userData, careerPath, setCareerPath, themeMode, setThemeMode, accentColor, setAccentColor, onClose }: {
  user: any;
  userData: any;
  careerPath: string;
  setCareerPath: (path: string) => void;
  themeMode: 'light' | 'dark' | 'system';
  setThemeMode: (mode: 'light' | 'dark' | 'system') => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  onClose?: () => void;
}) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [connectingPlatform, setConnectingPlatform] = useState<any>(null);
  const [platformUsername, setPlatformUsername] = useState('');

  // Local state for all settings to be saved at once
  const [localDisplayName, setLocalDisplayName] = useState(userData?.displayName || user?.displayName || '');
  const [localBio, setLocalBio] = useState(userData?.bio || '');
  const [localCareerPath, setLocalCareerPath] = useState(careerPath);
  const [localThemeMode, setLocalThemeMode] = useState(themeMode);
  const [localAccentColor, setLocalAccentColor] = useState(accentColor);
  const [localLanguage, setLocalLanguage] = useState(userData?.preferredLanguage || 'JavaScript / TypeScript');
  const [localDailyGoal, setLocalDailyGoal] = useState(userData?.dailyGoal || 60);
  
  const [platforms, setPlatforms] = useState(() => {
    const saved = localStorage.getItem('coding_usernames');
    const usernames = saved ? JSON.parse(saved) : { leetcode: '', github: '', codeforces: '', codechef: '', hackerrank: '' };
    return [
      { name: 'LeetCode', icon: Globe, connected: !!usernames.leetcode, username: usernames.leetcode, url: usernames.leetcode ? `https://leetcode.com/${usernames.leetcode}` : undefined },
      { name: 'GitHub', icon: Github, connected: !!usernames.github, username: usernames.github, url: usernames.github ? `https://github.com/${usernames.github}` : undefined },
      { name: 'Codeforces', icon: Globe, connected: !!usernames.codeforces, username: usernames.codeforces, url: usernames.codeforces ? `https://codeforces.com/profile/${usernames.codeforces}` : undefined },
      { name: 'CodeChef', icon: Globe, connected: !!usernames.codechef, username: usernames.codechef, url: usernames.codechef ? `https://www.codechef.com/users/${usernames.codechef}` : undefined },
      { name: 'HackerRank', icon: Globe, connected: !!usernames.hackerrank, username: usernames.hackerrank, url: usernames.hackerrank ? `https://www.hackerrank.com/${usernames.hackerrank}` : undefined },
    ];
  });

  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    const saved = localStorage.getItem('notification_prefs');
    return saved ? JSON.parse(saved) : {
      studyReminders: { email: true, inApp: true },
      newChallenges: { email: false, inApp: true },
      weeklyProgress: { email: true, inApp: false },
      platformUpdates: { email: false, inApp: true },
    };
  });

  const [progressPrefs, setProgressPrefs] = useState(() => {
    const saved = localStorage.getItem('progress_prefs');
    return saved ? JSON.parse(saved) : {
      autoSyncFrequency: 'Every hour',
      publicProfile: true
    };
  });

  const [privacyPrefs, setPrivacyPrefs] = useState(() => {
    const saved = localStorage.getItem('privacy_prefs');
    return saved ? JSON.parse(saved) : {
      personalizedAds: false,
      shareUsageData: true,
      showEmail: false
    };
  });

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      // 1. Save Platform Usernames
      const usernames: any = {};
      platforms.forEach(p => {
        usernames[p.name.toLowerCase()] = p.connected ? p.username : '';
      });
      localStorage.setItem('coding_usernames', JSON.stringify(usernames));

      // 2. Save Notification Prefs
      localStorage.setItem('notification_prefs', JSON.stringify(notificationPrefs));

      // 3. Save Progress Prefs
      localStorage.setItem('progress_prefs', JSON.stringify(progressPrefs));

      // 4. Save Privacy Prefs
      localStorage.setItem('privacy_prefs', JSON.stringify(privacyPrefs));

      // 5. Update Parent State (Theme & Career Path)
      setCareerPath(localCareerPath);
      setThemeMode(localThemeMode);
      setAccentColor(localAccentColor);

      // 6. Sync to Firestore
      if (user) {
        const { doc, db, setDoc } = await import('../firebase');
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          displayName: localDisplayName,
          bio: localBio,
          careerPath: localCareerPath,
          preferredLanguage: localLanguage,
          dailyGoal: localDailyGoal,
          accentColor: localAccentColor,
          themeMode: localThemeMode,
          coding_usernames: usernames,
          notificationPrefs,
          progressPrefs,
          privacyPrefs,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      }

      // Success feedback
      setSaveStatus('success');
      setTimeout(() => {
        setIsSaving(false);
        setSaveStatus('idle');
        if (onClose) onClose();
      }, 1500);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSaveStatus('error');
      setTimeout(() => {
        setIsSaving(false);
        setSaveStatus('idle');
      }, 3000);
    }
  };

  const handleConnect = (platform: any) => {
    if (platform.connected) {
      window.open(platform.url || '#', '_blank');
      return;
    }
    setConnectingPlatform(platform);
    setPlatformUsername('');
  };

  const saveConnection = () => {
    if (!platformUsername.trim()) return;
    
    const newPlatforms = platforms.map(p => 
      p.name === connectingPlatform.name 
        ? { ...p, connected: true, username: platformUsername, url: `https://${p.name.toLowerCase()}.com/${platformUsername}` }
        : p
    );
    setPlatforms(newPlatforms);
    setConnectingPlatform(null);
  };

  const disconnectPlatform = (name: string) => {
    const newPlatforms = platforms.map(p => p.name === name ? { ...p, connected: false, username: '' } : p);
    setPlatforms(newPlatforms);
  };

  const handleTogglePref = (type: string, channel: 'email' | 'inApp') => {
    setNotificationPrefs(prev => ({
      ...prev,
      [type]: {
        ...prev[type as keyof typeof prev],
        [channel]: !prev[type as keyof typeof prev][channel]
      }
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'learning', label: 'Learning Preferences', icon: Book },
    { id: 'platforms', label: 'Coding Platform Integration', icon: Link2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'theme', label: 'Theme & UI', icon: Palette },
    { id: 'progress', label: 'Progress Tracking', icon: BarChart3 },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'privacy', label: 'Data & Privacy', icon: Lock },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Connection Modal */}
      <AnimatePresence>
        {connectingPlatform && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConnectingPlatform(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-sm">
                  <connectingPlatform.icon size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold dark:text-white">Connect {connectingPlatform.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Enter your platform details</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Username / Profile ID</label>
                  <input 
                    type="text" 
                    value={platformUsername}
                    onChange={(e) => setPlatformUsername(e.target.value)}
                    placeholder={`e.g. ${connectingPlatform.name.toLowerCase()}_user`}
                    className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    autoFocus
                  />
                </div>
                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setConnectingPlatform(null)}
                    className="flex-1 px-6 py-3 rounded-2xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={saveConnection}
                    className="flex-1 px-6 py-3 rounded-2xl font-bold bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/25 transition-all"
                  >
                    Save & Connect
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-72 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-4 shadow-sm sticky top-24">
            <h2 className="text-lg font-bold px-4 mb-4 dark:text-white">Account Settings</h2>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <tab.icon size={18} />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && (
                    <motion.div layoutId="activeTab" className="ml-auto">
                      <ChevronRight size={16} />
                    </motion.div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-10 shadow-sm min-h-[600px]"
          >
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <div className="space-y-8">
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-[2rem] bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 relative group">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="w-full h-full rounded-[2rem] object-cover" />
                      ) : (
                        <User size={40} />
                      )}
                      <button className="absolute inset-0 bg-black/40 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                        Change
                      </button>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold dark:text-white">{user?.displayName || 'User Name'}</h3>
                      <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Display Name</label>
                      <input 
                        type="text" 
                        value={localDisplayName}
                        onChange={(e) => setLocalDisplayName(e.target.value)}
                        className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Email Address</label>
                      <input 
                        type="email" 
                        defaultValue={user?.email}
                        disabled
                        className="w-full px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border-none text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Bio</label>
                      <textarea 
                        rows={3}
                        value={localBio}
                        onChange={(e) => setLocalBio(e.target.value)}
                        placeholder="Tell us about your coding journey..."
                        className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'learning' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold dark:text-white">Learning Preferences</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 dark:text-white">Target Career Path</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Data Scientist', 'Mobile Developer', 'DevOps Engineer'].map((path) => (
                          <button
                            key={path}
                            onClick={() => setLocalCareerPath(path)}
                            className={`px-5 py-4 rounded-2xl text-left font-bold transition-all border-2 ${
                              localCareerPath === path
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                            }`}
                          >
                            {path}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 dark:text-white">Preferred Language</h4>
                      <select 
                        value={localLanguage}
                        onChange={(e) => setLocalLanguage(e.target.value)}
                        className="w-full px-5 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                      >
                        <option>JavaScript / TypeScript</option>
                        <option>Python</option>
                        <option>Java</option>
                        <option>C++</option>
                        <option>Go</option>
                      </select>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 dark:text-white">Daily Goal</h4>
                      <div className="flex items-center gap-4">
                        {[15, 30, 60, 120].map((mins) => (
                          <button
                            key={mins}
                            onClick={() => setLocalDailyGoal(mins)}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                              localDailyGoal === mins
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600'
                            }`}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'platforms' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold dark:text-white">Platform Integration</h3>
                    <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full">
                      Real-time Sync Active
                    </span>
                  </div>

                  <div className="space-y-4">
                    {platforms.map((platform) => (
                      <div key={platform.name} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-slate-600 dark:text-slate-400 shadow-sm">
                            <platform.icon size={20} />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white">{platform.name}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {platform.connected ? `@${platform.username}` : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {platform.connected && (
                            <button 
                              onClick={() => handleConnect(platform)}
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-50 transition-all"
                            >
                              Open
                            </button>
                          )}
                          <button 
                            onClick={() => {
                              if (platform.connected) {
                                disconnectPlatform(platform.name);
                              } else {
                                handleConnect(platform);
                              }
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              platform.connected 
                                ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700'
                            }`}
                          >
                            {platform.connected ? 'Disconnect' : 'Connect'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold dark:text-white">Notifications</h3>
                  
                  <div className="space-y-6">
                    {[
                      { id: 'studyReminders', title: 'Study Reminders', desc: 'Get notified when it\'s time for your daily practice.', icon: Bell },
                      { id: 'newChallenges', title: 'New Challenges', desc: 'Alerts for new problems matching your career path.', icon: Zap },
                      { id: 'weeklyProgress', title: 'Weekly Progress', desc: 'Receive a summary of your learning activity every Monday.', icon: BarChart3 },
                      { id: 'platformUpdates', title: 'Platform Updates', desc: 'Important news about PrepMaster features and content.', icon: AlertCircle },
                    ].map((item) => (
                      <div key={item.title} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0">
                              <item.icon size={20} />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-x-12 gap-y-4 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Email</span>
                            <button 
                              onClick={() => handleTogglePref(item.id, 'email')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                notificationPrefs[item.id as keyof typeof notificationPrefs].email ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  notificationPrefs[item.id as keyof typeof notificationPrefs].email ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">In-App</span>
                            <button 
                              onClick={() => handleTogglePref(item.id, 'inApp')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                                notificationPrefs[item.id as keyof typeof notificationPrefs].inApp ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  notificationPrefs[item.id as keyof typeof notificationPrefs].inApp ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'theme' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold dark:text-white">Theme & UI</h3>
                  
                  <div className="space-y-8">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 dark:text-white">Accent Color</h4>
                      <div className="flex flex-wrap gap-4">
                        {['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#8b5cf6'].map((color) => (
                          <button 
                            key={color}
                            onClick={() => setLocalAccentColor(color)}
                            className={`w-12 h-12 rounded-full border-4 shadow-sm transition-all transform hover:scale-110 ${
                              localAccentColor === color ? 'border-indigo-600 scale-110' : 'border-white dark:border-slate-900'
                            }`}
                            style={{ backgroundColor: color }}
                          >
                            {localAccentColor === color && (
                              <CheckCircle2 size={20} className="text-white mx-auto drop-shadow-md" />
                            )}
                          </button>
                        ))}
                        <div className="flex items-center gap-3 ml-2">
                          <input 
                            type="color" 
                            value={localAccentColor}
                            onChange={(e) => setLocalAccentColor(e.target.value)}
                            className="w-12 h-12 rounded-full border-4 border-white dark:border-slate-900 shadow-sm cursor-pointer overflow-hidden"
                          />
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Custom</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'progress' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold dark:text-white">Progress Tracking</h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-slate-900 dark:text-white">Auto-Sync Frequency</h4>
                        <select 
                          value={progressPrefs.autoSyncFrequency}
                          onChange={(e) => setProgressPrefs(prev => ({ ...prev, autoSyncFrequency: e.target.value }))}
                          className="bg-white dark:bg-slate-900 border-none rounded-xl text-sm font-bold px-4 py-2"
                        >
                          <option>Every 15 mins</option>
                          <option>Every hour</option>
                          <option>Daily</option>
                        </select>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">How often we should fetch your latest stats from connected platforms.</p>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Public Profile</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Allow others to see your progress and rank.</p>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={progressPrefs.publicProfile}
                          onChange={() => setProgressPrefs(prev => ({ ...prev, publicProfile: !prev.publicProfile }))}
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold dark:text-white">Security</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 dark:text-white">Password</h4>
                      <button className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all">
                        Change Password
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 dark:text-white">Two-Factor Authentication</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Add an extra layer of security to your account.</p>
                      <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all">
                        Enable 2FA
                      </button>
                    </div>

                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                      <h4 className="font-bold text-red-600 mb-2">Danger Zone</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                      <button className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all">
                        <Trash2 size={18} />
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold dark:text-white">Data & Privacy</h3>
                  
                  <div className="space-y-6">
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl space-y-4">
                      <h4 className="font-bold text-slate-900 dark:text-white">Data Export</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Download a copy of all your data, including test results and learning history.</p>
                      <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                        <Download size={18} />
                        Export My Data
                      </button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold text-slate-900 dark:text-white">Privacy Settings</h4>
                      {[
                        { id: 'personalizedAds', label: 'Allow personalized ads' },
                        { id: 'shareUsageData', label: 'Share usage data for app improvement' },
                        { id: 'showEmail', label: 'Show my email to other users' }
                      ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span className="text-sm text-slate-600 dark:text-slate-400">{item.label}</span>
                          <div className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={privacyPrefs[item.id as keyof typeof privacyPrefs]}
                              onChange={() => setPrivacyPrefs(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof privacyPrefs] }))}
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>

            <div className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isSaving}
                className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                  saveStatus === 'success' 
                    ? 'bg-emerald-500 text-white' 
                    : saveStatus === 'error'
                    ? 'bg-rose-500 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/25'
                } ${isSaving ? 'opacity-80 cursor-not-allowed' : ''}`}
              >
                {saveStatus === 'saving' ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw size={20} />
                    </motion.div>
                    Saving...
                  </>
                ) : saveStatus === 'success' ? (
                  <>
                    <CheckCircle2 size={20} />
                    Saved!
                  </>
                ) : saveStatus === 'error' ? (
                  <>
                    <AlertCircle size={20} />
                    Failed to Save
                  </>
                ) : (
                  <>
                    <Save size={20} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

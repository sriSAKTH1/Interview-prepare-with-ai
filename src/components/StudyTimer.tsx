import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Clock, Zap, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db, auth } from '../firebase';
import { doc, setDoc, getDoc, increment } from 'firebase/firestore';

export function StudyTimer({ user }: { user: any }) {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial total study time
  useEffect(() => {
    if (user) {
      const fetchTotalTime = async () => {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setTotalMinutes(userDoc.data().totalStudyMinutes || 0);
        }
      };
      fetchTotalTime();
    }
  }, [user]);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  // Sync with Firestore when a minute passes or when paused
  useEffect(() => {
    if (seconds > 0 && seconds % 60 === 0) {
      syncStudyTime(1);
    }
  }, [seconds]);

  const syncStudyTime = async (minutes: number) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        totalStudyMinutes: increment(minutes)
      }, { merge: true });
      setTotalMinutes(prev => prev + minutes);
      
      // Show celebration every 30 minutes of session
      if (seconds > 0 && seconds % 1800 === 0) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 5000);
      }
    } catch (error) {
      console.error('Error syncing study time:', error);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full -mr-16 -mt-16 blur-2xl" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Clock size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Focus Timer</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track your learning session</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</p>
          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{(totalMinutes / 60).toFixed(1)}h</p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4 relative z-10">
        <div className="text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tighter mb-8">
          {formatTime(seconds)}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={resetTimer}
            className="p-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            title="Reset Timer"
          >
            <RotateCcw size={20} />
          </button>
          
          <button
            onClick={toggleTimer}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              isActive 
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200 dark:shadow-none' 
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200 dark:shadow-none'
            } text-white`}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
          </button>

          <div className="p-4 opacity-0 pointer-events-none">
            <RotateCcw size={20} />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 relative z-10">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          <span>Session Progress</span>
          <span>{Math.floor(seconds / 60)} / 60 min</span>
        </div>
        <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (seconds / 3600) * 100)}%` }}
          />
        </div>
      </div>

      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -20 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-indigo-600/95 text-white p-6 text-center rounded-3xl"
          >
            <Trophy size={48} className="mb-4 text-amber-300" />
            <h4 className="text-xl font-bold mb-2">Great Focus!</h4>
            <p className="text-sm text-indigo-100">You've completed 30 minutes of focused learning. Keep it up!</p>
            <button 
              onClick={() => setShowCelebration(false)}
              className="mt-6 px-6 py-2 bg-white text-indigo-600 rounded-xl font-bold text-sm"
            >
              Continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

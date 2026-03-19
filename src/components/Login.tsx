import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Code2, Rocket, Brain, Target, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { signInWithGoogle } from '../firebase';

const Login: React.FC = () => {
  const [isSignup, setIsSignup] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      await signInWithGoogle();
    } catch (err: any) {
      if (err.code === 'auth/popup-closed-by-user') {
        // Silently handle popup closed by user
        return;
      }
      setError('Authentication failed. Please try again.');
      console.error('Auth error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Branding (Fixed on Desktop) */}
      <div className="lg:w-1/2 bg-indigo-600 dark:bg-indigo-950 p-8 lg:p-16 flex flex-col justify-between relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-400 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl">
              <Code2 className="text-indigo-600" size={28} />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">PrepMaster</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl lg:text-7xl font-black text-white leading-[0.9] tracking-tighter mb-8">
              MASTER THE <br />
              <span className="text-indigo-200">CODING</span> <br />
              INTERVIEW.
            </h1>
            <p className="text-xl text-indigo-100 max-w-md font-medium leading-relaxed">
              The all-in-one platform to track your DSA progress, sync platform stats, and get personalized roadmaps.
            </p>
          </motion.div>
        </div>

        <div className="relative z-10 mt-12 lg:mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { icon: Rocket, title: 'Smart Roadmaps', desc: 'AI-driven learning paths' },
              { icon: Brain, title: 'Real-time Stats', desc: 'Sync LeetCode & GitHub' },
              { icon: Target, title: 'Mock Tests', desc: 'Company-specific prep' },
              { icon: Sparkles, title: 'Skill Analysis', desc: 'Identify your weak spots' }
            ].map((feature, idx) => (
              <motion.div 
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (idx * 0.1) }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                  <feature.icon size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{feature.title}</h3>
                  <p className="text-xs text-indigo-200">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Decorative Rail Text */}
        <div className="absolute right-4 bottom-24 writing-vertical-rl rotate-180 text-[10px] font-bold tracking-[0.2em] text-white/20 uppercase hidden lg:block">
          Elevate Your Career • PrepMaster v2.0 • 2026
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="lg:w-1/2 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-8 lg:p-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              {isSignup ? 'Join 10,000+ developers mastering DSA.' : 'Sign in to continue your learning journey.'}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                {error}
              </div>
            )}
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-4 px-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-700 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-sm group"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span>{isSignup ? 'Sign up with Google' : 'Sign in with Google'}</span>
              <ChevronRight size={18} className="ml-auto text-slate-300 group-hover:text-indigo-500 transition-colors" />
            </button>
            
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 mb-8 border border-indigo-100 dark:border-indigo-800/50">
            <div className="flex gap-3">
              <CheckCircle2 className="text-indigo-600 dark:text-indigo-400 shrink-0" size={20} />
              <p className="text-sm text-indigo-900 dark:text-indigo-200 font-medium">
                By signing in, you get access to our premium company-specific mock tests and real-time platform syncing.
              </p>
            </div>
          </div>

          <div className="text-center">
            <button 
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
            >
              {isSignup ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          <p className="mt-12 text-center text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] font-bold">
            Secure Authentication • Powered by Firebase
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

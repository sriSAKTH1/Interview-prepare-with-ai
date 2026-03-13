import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft,
  Info,
  Activity
} from 'lucide-react';

interface VizStep {
  data: any;
  highlights: number[];
  explanation: string;
}

interface StepVisualizerProps {
  type: string;
  steps: VizStep[];
}

export function StepVisualizer({ type, steps }: StepVisualizerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);

  useEffect(() => {
    let timer: any;
    if (isPlaying && currentStep < steps.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep === steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, steps.length, speed]);

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const renderData = () => {
    const step = steps[currentStep];
    if (!step) return null;

    if (type === 'array' || type === 'string') {
      const items = Array.isArray(step.data) ? step.data : String(step.data).split('');
      return (
        <div className="flex flex-wrap items-center justify-center gap-3 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl min-h-[160px] w-full max-w-3xl">
          {items.map((val: any, idx: number) => {
            const isHighlighted = step.highlights.includes(idx);
            return (
              <motion.div 
                key={`${idx}-${val}`}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: isHighlighted ? 1.1 : 1,
                  borderColor: isHighlighted ? '#10b981' : '#e2e8f0',
                  backgroundColor: isHighlighted ? '#ecfdf5' : '#ffffff',
                  color: isHighlighted ? '#059669' : '#1e293b'
                }}
                className={`w-12 h-14 border-2 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 ${isHighlighted ? 'dark:bg-emerald-900/20 dark:border-emerald-500 dark:text-emerald-400' : ''}`}
              >
                {val}
              </motion.div>
            );
          })}
        </div>
      );
    }

    if (type === 'stack' || type === 'queue') {
      const isStack = type === 'stack';
      const items = Array.isArray(step.data) ? (isStack ? [...step.data].reverse() : [...step.data]) : [];
      return (
        <div className="flex flex-col items-center justify-end gap-2 p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-xl min-h-[300px] w-full max-w-sm">
          <div className={`w-full border-slate-200 dark:border-slate-700 p-4 flex gap-2 ${isStack ? 'border-x-4 border-b-4 rounded-b-3xl flex-col-reverse' : 'border-y-4 rounded-xl flex-row'}`}>
            <AnimatePresence mode="popLayout">
              {items.map((val: any, idx: number) => {
                const actualIdx = isStack ? items.length - 1 - idx : idx;
                const isHighlighted = step.highlights.includes(actualIdx);
                return (
                  <motion.div 
                    key={`${actualIdx}-${val}`}
                    initial={{ opacity: 0, [isStack ? 'y' : 'x']: isStack ? -20 : 20 }}
                    animate={{ 
                      opacity: 1, 
                      [isStack ? 'y' : 'x']: 0,
                      backgroundColor: isHighlighted ? '#ecfdf5' : '#f8fafc',
                      borderColor: isHighlighted ? '#10b981' : '#e2e8f0'
                    }}
                    exit={{ opacity: 0, [isStack ? 'y' : 'x']: isStack ? 20 : -20 }}
                    className={`${isStack ? 'w-full py-3' : 'w-12 h-14'} border-2 rounded-xl flex items-center justify-center font-bold text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 ${isHighlighted ? 'dark:bg-emerald-900/20 dark:border-emerald-500 dark:text-emerald-400' : ''}`}
                  >
                    {val}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-4">
            {isStack ? 'Stack Bottom' : 'Queue (Front → Back)'}
          </span>
        </div>
      );
    }

    return <div className="text-slate-400 italic">Visualization for {type} coming soon...</div>;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-8">
        {renderData()}

        {/* Explanation Box */}
        <div className="w-full max-w-2xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl p-6 flex gap-4 items-start shadow-sm">
          <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200 dark:shadow-none">
            <Info size={20} />
          </div>
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Step {currentStep + 1} of {steps.length}</h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {steps[currentStep]?.explanation}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6 bg-white dark:bg-slate-900 px-8 py-4 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-lg">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isPlaying 
                  ? 'bg-rose-50 text-rose-500 hover:bg-rose-100' 
                  : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
              }`}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
            </button>

            <button 
              onClick={() => setCurrentStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={currentStep === steps.length - 1}
              className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          <button 
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-amber-600 transition-colors"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>

          <div className="w-px h-8 bg-slate-100 dark:bg-slate-800" />

          <div className="flex flex-col gap-1 w-32">
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Speed</span>
              <span>{speed}ms</span>
            </div>
            <input 
              type="range" 
              min="200" 
              max="2000" 
              step="200"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pseudocode } from './Pseudocode';
import { 
  Settings, 
  Play, 
  RotateCcw, 
  Code2,
  Info,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Search,
  RefreshCw,
  BarChart3,
  ArrowRight
} from 'lucide-react';

export function SearchingVisualizer({ initialAlgorithm = 'linear-search' }: { initialAlgorithm?: 'linear-search' | 'binary-search' }) {
  const [array, setArray] = useState<number[]>([10, 25, 30, 45, 50, 65, 70, 85, 90]);
  const [target, setTarget] = useState<number>(65);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [viewMode, setViewMode] = useState<'animation' | 'theory'>('animation');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [foundIndex, setFoundIndex] = useState<number | null>(null);
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [mid, setMid] = useState<number | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(initialAlgorithm);
  const [message, setMessage] = useState<string>('Searching algorithms find the position of a target value within a data structure.');

  useEffect(() => {
    setSelectedAlgorithm(initialAlgorithm);
    if (initialAlgorithm === 'binary-search') {
      setArray([...array].sort((a, b) => a - b));
    }
  }, [initialAlgorithm]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleReset = () => {
    setCurrentIndex(null);
    setFoundIndex(null);
    setLeft(null);
    setRight(null);
    setMid(null);
    setMessage('Visualization reset.');
  };

  const handleRandomize = () => {
    let newArray = Array.from({ length: 9 }, () => Math.floor(Math.random() * 90) + 10);
    if (selectedAlgorithm === 'binary-search') {
      newArray.sort((a, b) => a - b);
    }
    setArray(newArray);
    setTarget(newArray[Math.floor(Math.random() * newArray.length)]);
    handleReset();
    setMessage('Generated new random array.');
  };

  const linearSearch = async () => {
    setIsVisualizing(true);
    handleReset();
    let arr = [...array];

    for (let i = 0; i < arr.length; i++) {
      setCurrentIndex(i);
      setMessage(`Checking index ${i}: ${arr[i]}...`);
      await sleep(speed);

      if (arr[i] === target) {
        setFoundIndex(i);
        setMessage(`Found ${target} at index ${i}!`);
        setIsVisualizing(false);
        return;
      }
    }

    setMessage(`${target} not found in the array.`);
    setIsVisualizing(false);
  };

  const binarySearch = async () => {
    setIsVisualizing(true);
    handleReset();
    let arr = [...array];
    let l = 0;
    let r = arr.length - 1;

    setLeft(l);
    setRight(r);

    while (l <= r) {
      let m = Math.floor((l + r) / 2);
      setMid(m);
      setCurrentIndex(m);
      setMessage(`Checking middle element at index ${m}: ${arr[m]}...`);
      await sleep(speed);

      if (arr[m] === target) {
        setFoundIndex(m);
        setMessage(`Found ${target} at index ${m}!`);
        setIsVisualizing(false);
        return;
      }

      if (arr[m] < target) {
        setMessage(`${arr[m]} < ${target}, searching right half...`);
        l = m + 1;
        setLeft(l);
      } else {
        setMessage(`${arr[m]} > ${target}, searching left half...`);
        r = m - 1;
        setRight(r);
      }
      await sleep(speed);
    }

    setMessage(`${target} not found in the array.`);
    setIsVisualizing(false);
  };

  const startSearch = () => {
    if (selectedAlgorithm === 'linear-search') linearSearch();
    else binarySearch();
  };

  const pseudocode = selectedAlgorithm === 'linear-search' ? [
    "for each item in list:",
    "  if item == target:",
    "    return its index",
    "return -1"
  ] : [
    "low = 0, high = n - 1",
    "while low <= high:",
    "  mid = (low + high) / 2",
    "  if list[mid] == target:",
    "    return mid",
    "  else if list[mid] < target:",
    "    low = mid + 1",
    "  else:",
    "    high = mid - 1",
    "return -1"
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Search size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {selectedAlgorithm === 'linear-search' ? 'Linear Search' : 'Binary Search'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {selectedAlgorithm === 'linear-search' 
                ? 'Sequential search through every element.' 
                : 'Efficient search for sorted arrays using divide and conquer.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setViewMode(viewMode === 'animation' ? 'theory' : 'animation')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
              viewMode === 'theory' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {viewMode === 'theory' ? <BarChart3 size={18} /> : <BookOpen size={18} />}
            {viewMode === 'theory' ? 'Visualizer' : 'Theory'}
          </button>
          <button 
            onClick={() => setShowPseudocode(!showPseudocode)}
            className={`p-2 rounded-xl transition-all ${
              showPseudocode 
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            <Code2 size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'animation' ? (
          <motion.div 
            key="animation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Main Visualizer */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm min-h-[400px] flex flex-col justify-center">
                <div className="flex justify-center items-end gap-2 h-48">
                  {array.map((value, idx) => {
                    const isCurrent = currentIndex === idx;
                    const isFound = foundIndex === idx;
                    const isInRange = selectedAlgorithm === 'binary-search' && left !== null && right !== null && idx >= left && idx <= right;
                    const isMid = mid === idx;

                    return (
                      <motion.div
                        key={idx}
                        layout
                        className="relative flex flex-col items-center"
                      >
                        <motion.div
                          animate={{
                            height: value * 1.5,
                            backgroundColor: isFound 
                              ? '#10b981' 
                              : isCurrent 
                                ? '#6366f1' 
                                : isMid
                                  ? '#f59e0b'
                                  : isInRange 
                                    ? '#e2e8f0' 
                                    : '#f8fafc',
                            borderColor: isFound 
                              ? '#059669' 
                              : isCurrent 
                                ? '#4f46e5' 
                                : '#e2e8f0'
                          }}
                          className={`w-12 rounded-t-xl border-t-2 border-x-2 flex items-end justify-center pb-2 font-bold text-xs ${
                            isFound || isCurrent ? 'text-white' : 'text-slate-400'
                          }`}
                        >
                          {value}
                        </motion.div>
                        <div className="mt-2 text-[10px] font-bold text-slate-400">
                          {idx}
                        </div>
                        {isCurrent && (
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute -top-8 text-indigo-600"
                          >
                            <ArrowRight size={20} className="rotate-90" />
                          </motion.div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="mt-12 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center text-indigo-600">
                    <Info size={18} />
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{message}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Target Value</label>
                    <input 
                      type="number" 
                      value={target}
                      onChange={(e) => setTarget(parseInt(e.target.value) || 0)}
                      className="w-20 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Speed</label>
                    <input 
                      type="range" 
                      min="200" 
                      max="2000" 
                      step="200"
                      value={2200 - speed}
                      onChange={(e) => setSpeed(2200 - parseInt(e.target.value))}
                      className="w-32 accent-indigo-600"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleRandomize}
                    disabled={isVisualizing}
                    className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50"
                    title="Randomize Array"
                  >
                    <RefreshCw size={20} />
                  </button>
                  <button 
                    onClick={handleReset}
                    disabled={isVisualizing}
                    className="p-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-slate-200 transition-all disabled:opacity-50"
                    title="Reset"
                  >
                    <RotateCcw size={20} />
                  </button>
                  <button 
                    onClick={startSearch}
                    disabled={isVisualizing}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none flex items-center gap-2 disabled:opacity-50"
                  >
                    <Play size={20} /> Start Search
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {showPseudocode && (
                <Pseudocode 
                  code={pseudocode.join('\n')}
                  activeLine={currentIndex !== null ? (selectedAlgorithm === 'linear-search' ? 1 : 3) : -1}
                />
              )}

              <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings size={18} className="text-indigo-600" /> Complexity
                </h3>
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-slate-500">Time Complexity</span>
                      <span className="text-xs font-bold text-indigo-600">
                        {selectedAlgorithm === 'linear-search' ? 'O(n)' : 'O(log n)'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Space Complexity</span>
                      <span className="text-xs font-bold text-indigo-600">O(1)</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    {selectedAlgorithm === 'linear-search' 
                      ? 'Linear search checks every element. In the worst case, it takes n steps.' 
                      : 'Binary search halves the search space each step, making it extremely fast for large sorted datasets.'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="theory"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8"
          >
            <div className="max-w-3xl space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Understanding {selectedAlgorithm === 'linear-search' ? 'Linear' : 'Binary'} Search</h2>
              
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">How it works</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {selectedAlgorithm === 'linear-search' 
                    ? "Linear search is the most basic searching algorithm. It starts at the beginning of the list and checks every element one by one until it finds the target or reaches the end. It works on both sorted and unsorted data."
                    : "Binary search is a highly efficient searching algorithm that works on sorted arrays. It repeatedly divides the search interval in half. If the value of the search key is less than the item in the middle of the interval, narrow the interval to the lower half. Otherwise, narrow it to the upper half."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl border border-emerald-100 dark:border-emerald-800">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 size={18} /> Advantages
                  </h4>
                  <ul className="space-y-2 text-sm text-emerald-700 dark:text-emerald-300">
                    {selectedAlgorithm === 'linear-search' ? (
                      <>
                        <li>• Simple to implement</li>
                        <li>• Works on unsorted data</li>
                        <li>• No extra space needed</li>
                      </>
                    ) : (
                      <>
                        <li>• Extremely fast (Logarithmic)</li>
                        <li>• Efficient for large datasets</li>
                        <li>• Consistent performance</li>
                      </>
                    )}
                  </ul>
                </div>
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    <Info size={18} /> Use Cases
                  </h4>
                  <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                    {selectedAlgorithm === 'linear-search' ? (
                      <>
                        <li>• Small datasets</li>
                        <li>• Unsorted collections</li>
                        <li>• Searching for first occurrence</li>
                      </>
                    ) : (
                      <>
                        <li>• Large, sorted datasets</li>
                        <li>• Database indexing</li>
                        <li>• Dictionary lookups</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <ChevronRight size={16} />
                  <span>Ready to see it in action?</span>
                </div>
                <button 
                  onClick={() => setViewMode('animation')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
                >
                  Go to Visualizer <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

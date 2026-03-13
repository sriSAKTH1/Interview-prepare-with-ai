import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pseudocode } from './Pseudocode';
import { 
  Settings, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw, 
  Code2,
  Info,
  ChevronRight,
  ArrowDownAZ,
  RefreshCw,
  BarChart3,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function SortingVisualizer({ initialAlgorithm = 'bubble-sort' }: { initialAlgorithm?: string }) {
  const [array, setArray] = useState<number[]>([50, 20, 40, 10, 30]);
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [viewMode, setViewMode] = useState<'animation' | 'theory'>('animation');
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(initialAlgorithm);
  const [message, setMessage] = useState<string>('Sorting algorithms rearrange elements in a specific order (usually ascending).');

  useEffect(() => {
    setSelectedAlgorithm(initialAlgorithm);
  }, [initialAlgorithm]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleReset = () => {
    setArray([50, 20, 40, 10, 30]);
    setComparingIndices([]);
    setSortedIndices([]);
    setMessage('Array reset to initial state.');
  };

  const bubbleSort = async () => {
    setIsVisualizing(true);
    setSortedIndices([]);
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparingIndices([j, j + 1]);
        setMessage(`Comparing ${arr[j]} and ${arr[j+1]}...`);
        await sleep(speed);

        if (arr[j] > arr[j + 1]) {
          setMessage(`${arr[j]} > ${arr[j+1]}, swapping...`);
          let temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setArray([...arr]);
          await sleep(speed);
        }
      }
      setSortedIndices(prev => [...prev, n - i - 1]);
    }
    setSortedIndices(prev => [...prev, 0]);
    setComparingIndices([]);
    setMessage('Bubble Sort complete!');
    setIsVisualizing(false);
  };

  const selectionSort = async () => {
    setIsVisualizing(true);
    setSortedIndices([]);
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      setComparingIndices([i]);
      setMessage(`Finding minimum element in unsorted part...`);
      await sleep(speed);

      for (let j = i + 1; j < n; j++) {
        setComparingIndices([i, j]);
        setMessage(`Comparing ${arr[j]} with current minimum ${arr[minIdx]}...`);
        await sleep(speed);
        if (arr[j] < arr[minIdx]) {
          minIdx = j;
        }
      }

      if (minIdx !== i) {
        setMessage(`Swapping ${arr[i]} with minimum ${arr[minIdx]}...`);
        let temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
        setArray([...arr]);
        await sleep(speed);
      }
      setSortedIndices(prev => [...prev, i]);
    }
    setSortedIndices(prev => [...prev, n - 1]);
    setComparingIndices([]);
    setMessage('Selection Sort complete!');
    setIsVisualizing(false);
  };

  const insertionSort = async () => {
    setIsVisualizing(true);
    setSortedIndices([0]);
    let arr = [...array];
    let n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      setComparingIndices([i]);
      setMessage(`Inserting ${key} into sorted part...`);
      await sleep(speed);

      while (j >= 0 && arr[j] > key) {
        setComparingIndices([j, j + 1]);
        setMessage(`${arr[j]} > ${key}, shifting ${arr[j]} right...`);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        j = j - 1;
        await sleep(speed);
      }
      arr[j + 1] = key;
      setArray([...arr]);
      setSortedIndices(Array.from({length: i + 1}, (_, k) => k));
      await sleep(speed);
    }
    setComparingIndices([]);
    setMessage('Insertion Sort complete!');
    setIsVisualizing(false);
  };

  const handleSort = () => {
    if (selectedAlgorithm === 'bubble-sort' || selectedAlgorithm === 'sorting') bubbleSort();
    else if (selectedAlgorithm === 'selection-sort') selectionSort();
    else if (selectedAlgorithm === 'insertion-sort') insertionSort();
    else setMessage(`${selectedAlgorithm.replace('-', ' ')} visualization coming soon!`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-200">
            <ArrowDownAZ size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Sorting</h2>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={() => setViewMode('animation')}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  viewMode === 'animation' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <Play size={10} />
                Animation
              </button>
              <button 
                onClick={() => setViewMode('theory')}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  viewMode === 'theory' 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                <BookOpen size={10} />
                Theory
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Complexity</span>
              <span className="text-xs font-bold text-amber-600">O(n²)</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Space Complexity</span>
              <span className="text-xs font-bold text-amber-600">O(1)</span>
            </div>
          </div>
          <button 
            onClick={() => setShowPseudocode(!showPseudocode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${
              showPseudocode 
                ? 'bg-amber-600 text-white shadow-amber-200' 
                : 'bg-white text-slate-900 border border-slate-200 shadow-slate-100 hover:bg-slate-50'
            }`}
          >
            <Code2 size={18} />
            PSEUDOCODE
          </button>
        </div>
      </div>

      {viewMode === 'animation' ? (
        <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Controls */}
        <div className="w-72 bg-white border-r border-slate-100 p-6 space-y-8 overflow-y-auto">
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
              <Play size={14} />
              Algorithms
            </div>
            <div className="space-y-3">
              <button 
                onClick={handleSort}
                disabled={isVisualizing}
                className="w-full py-3 bg-amber-600 text-white rounded-xl text-sm font-bold hover:bg-amber-700 transition-all disabled:opacity-50 shadow-lg shadow-amber-100"
              >
                Start {selectedAlgorithm.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
              </button>
              <button 
                onClick={handleReset}
                disabled={isVisualizing}
                className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <RotateCcw size={16} /> Reset
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
              <Settings size={14} />
              Playback
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Speed</span>
                  <span>{speed}ms</span>
                </div>
                <input 
                  type="range" 
                  min="50" 
                  max="1000" 
                  step="50"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-amber-600"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Main Content - Visualization */}
        <div className="flex-1 p-12 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
          <AnimatePresence mode="wait">
            <motion.div 
              key="viz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              {/* Bars Container */}
              <div className="flex items-end justify-center gap-4 h-64 w-full max-w-4xl p-8 bg-white rounded-[2rem] border border-slate-100 shadow-2xl">
                {array.map((val, idx) => {
                  const isComparing = comparingIndices.includes(idx);
                  const isSorted = sortedIndices.includes(idx);
                  
                  return (
                    <motion.div 
                      key={`${idx}-${val}`}
                      layout
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div 
                        animate={{ 
                          height: val * 3,
                          backgroundColor: isComparing ? '#f59e0b' : isSorted ? '#10b981' : '#e2e8f0'
                        }}
                        className="w-12 rounded-t-xl shadow-sm relative"
                      >
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500">{val}</span>
                      </motion.div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{idx}</span>
                    </motion.div>
                  );
                })}
              </div>

              <div className="mt-24 text-center max-w-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Comparison Based Sorting</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {message}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Sidebar - Theory */}
          <AnimatePresence>
            {showPseudocode && (
              <motion.div 
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute top-0 right-0 bottom-0 w-96 bg-white border-l border-slate-100 shadow-2xl z-20 p-8 overflow-y-auto"
              >
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-amber-600">
                      <Info size={24} />
                      <h3 className="text-xl font-bold">Theory & Logic</h3>
                    </div>
                    <button onClick={() => setShowPseudocode(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Bubble Sort</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping the adjacent elements if they are in the wrong order.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Complexity</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Worst Case</div>
                          <div className="text-sm font-bold text-amber-600">O(n²)</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Average Case</div>
                          <div className="text-sm font-bold text-amber-600">O(n²)</div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                          <div className="text-[10px] font-bold text-emerald-400 uppercase">Best Case</div>
                          <div className="text-sm font-bold text-emerald-600">O(n)</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Space</div>
                          <div className="text-sm font-bold text-slate-600">O(1)</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pseudocode</h4>
                      <Pseudocode 
                        code={`for i from 0 to n-1:\n  for j from 0 to n-i-1:\n    if arr[j] > arr[j+1]:\n      swap(arr[j], arr[j+1])`}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    ) : (
        <div className="flex-1 overflow-y-auto bg-white p-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 text-amber-600">
                <Info size={24} />
                <h3 className="text-2xl font-bold text-slate-900">What is Sorting?</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                Sorting is the process of arranging data in a specific order, typically ascending or descending. It is one of the most fundamental operations in computer science, used to make data easier to search, analyze, and process.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                  <h4 className="font-bold text-amber-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Why Sort Data?
                  </h4>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li>• Enables efficient searching (Binary Search)</li>
                    <li>• Helps in finding duplicates easily</li>
                    <li>• Improves data readability and presentation</li>
                    <li>• Essential for many other algorithms</li>
                  </ul>
                </div>
                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                  <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Common Algorithms
                  </h4>
                  <ul className="space-y-2 text-sm text-rose-800">
                    <li>• <b>Bubble Sort:</b> Simple but slow (O(n²))</li>
                    <li>• <b>Quick Sort:</b> Fast, divide & conquer (O(n log n))</li>
                    <li>• <b>Merge Sort:</b> Stable, divide & conquer (O(n log n))</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Algorithm Comparison</h3>
              <div className="overflow-hidden border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Algorithm</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Best Case</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Average Case</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Worst Case</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Bubble Sort</td>
                      <td className="px-6 py-4 font-mono text-amber-600">O(n)</td>
                      <td className="px-6 py-4 font-mono text-amber-600">O(n²)</td>
                      <td className="px-6 py-4 font-mono text-amber-600">O(n²)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Selection Sort</td>
                      <td className="px-6 py-4 font-mono text-amber-600">O(n²)</td>
                      <td className="px-6 py-4 font-mono text-amber-600">O(n²)</td>
                      <td className="px-6 py-4 font-mono text-amber-600">O(n²)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Insertion Sort</td>
                      <td className="px-6 py-4 font-mono text-amber-600">O(n)</td>
                      <td className="px-6 py-4 font-mono text-amber-600">O(n²)</td>
                      <td className="px-6 py-4 font-mono text-amber-600">O(n²)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Merge Sort</td>
                      <td className="px-6 py-4 font-mono text-amber-600">O(n log n)</td>
                      <td className="px-6 py-4 font-mono text-amber-600">O(n log n)</td>
                      <td className="px-6 py-4 font-mono text-amber-600">O(n log n)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pseudocode } from './Pseudocode';
import { ALGORITHM_THEORY } from '../constants';
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
  AlertCircle,
  Target,
  Globe
} from 'lucide-react';

export function SortingVisualizer({ initialAlgorithm = 'bubble-sort' }: { initialAlgorithm?: string }) {
  const [array, setArray] = useState<number[]>([50, 20, 40, 10, 30]);
  const [customInput, setCustomInput] = useState<string>('');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [viewMode, setViewMode] = useState<'animation' | 'theory'>(initialAlgorithm === 'sorting' ? 'theory' : 'animation');
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [mergingIndices, setMergingIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(initialAlgorithm);
  const [selectedLanguage, setSelectedLanguage] = useState<'python' | 'java' | 'c' | 'cpp'>('python');
  const [message, setMessage] = useState<string>('Sorting algorithms rearrange elements in a specific order (usually ascending).');

  useEffect(() => {
    setSelectedAlgorithm(initialAlgorithm);
    if (initialAlgorithm === 'sorting') {
      setViewMode('theory');
    } else {
      setViewMode('animation');
    }
  }, [initialAlgorithm]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleReset = () => {
    setArray([50, 20, 40, 10, 30]);
    setComparingIndices([]);
    setSwappingIndices([]);
    setMergingIndices([]);
    setSortedIndices([]);
    setMessage('Array reset to initial state.');
  };

  const handleRandomize = () => {
    const newArray = Array.from({ length: 6 }, () => Math.floor(Math.random() * 90) + 10);
    setArray(newArray);
    setComparingIndices([]);
    setSwappingIndices([]);
    setMergingIndices([]);
    setSortedIndices([]);
    setMessage('Generated new random array.');
  };

  const handleCustomInput = () => {
    const numbers = customInput.split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n > 0 && n <= 100);
    
    if (numbers.length > 0) {
      setArray(numbers.slice(0, 10)); // Limit to 10 for visualization
      setComparingIndices([]);
      setSortedIndices([]);
      setCustomInput('');
      setMessage('Custom array applied.');
    } else {
      setMessage('Invalid input. Please enter comma-separated numbers (1-100).');
    }
  };

  const bubbleSort = async () => {
    setIsVisualizing(true);
    setSortedIndices([]);
    setSwappingIndices([]);
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setComparingIndices([j, j + 1]);
        setSwappingIndices([]);
        setMessage(`Comparing ${arr[j]} and ${arr[j+1]}...`);
        await sleep(speed);

        if (arr[j] > arr[j + 1]) {
          setSwappingIndices([j, j + 1]);
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
    setSwappingIndices([]);
    setMessage('Bubble Sort complete!');
    setIsVisualizing(false);
  };

  const selectionSort = async () => {
    setIsVisualizing(true);
    setSortedIndices([]);
    setSwappingIndices([]);
    let arr = [...array];
    let n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      setComparingIndices([i]);
      setSwappingIndices([]);
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
        setSwappingIndices([i, minIdx]);
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
    setSwappingIndices([]);
    setMessage('Selection Sort complete!');
    setIsVisualizing(false);
  };

  const insertionSort = async () => {
    setIsVisualizing(true);
    setSortedIndices([0]);
    setSwappingIndices([]);
    let arr = [...array];
    let n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      setComparingIndices([i]);
      setSwappingIndices([]);
      setMessage(`Inserting ${key} into sorted part...`);
      await sleep(speed);

      while (j >= 0 && arr[j] > key) {
        setComparingIndices([j, j + 1]);
        setSwappingIndices([j, j + 1]);
        setMessage(`${arr[j]} > ${key}, shifting ${arr[j]} right...`);
        arr[j + 1] = arr[j];
        setArray([...arr]);
        j = j - 1;
        await sleep(speed);
      }
      arr[j + 1] = key;
      setArray([...arr]);
      setSortedIndices(Array.from({length: i + 1}, (_, k) => k));
      setSwappingIndices([]);
      await sleep(speed);
    }
    setComparingIndices([]);
    setSwappingIndices([]);
    setMessage('Insertion Sort complete!');
    setIsVisualizing(false);
  };

  const mergeSort = async () => {
    setIsVisualizing(true);
    setSortedIndices([]);
    let arr = [...array];
    
    const merge = async (l: number, m: number, r: number) => {
      let n1 = m - l + 1;
      let n2 = r - m;
      let L = arr.slice(l, m + 1);
      let R = arr.slice(m + 1, r + 1);
      
      let i = 0, j = 0, k = l;
      setMergingIndices(Array.from({length: r - l + 1}, (_, idx) => l + idx));
      setMessage(`Merging subarrays [${l}...${m}] and [${m+1}...${r}]`);
      await sleep(speed);

      while (i < n1 && j < n2) {
        setComparingIndices([l + i, m + 1 + j]);
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          i++;
        } else {
          arr[k] = R[j];
          j++;
        }
        setArray([...arr]);
        k++;
        await sleep(speed);
      }

      while (i < n1) {
        arr[k] = L[i];
        setArray([...arr]);
        i++; k++;
        await sleep(speed);
      }
      while (j < n2) {
        arr[k] = R[j];
        setArray([...arr]);
        j++; k++;
        await sleep(speed);
      }
      setMergingIndices([]);
    };

    const sort = async (l: number, r: number) => {
      if (l >= r) return;
      let m = Math.floor(l + (r - l) / 2);
      await sort(l, m);
      await sort(m + 1, r);
      await merge(l, m, r);
      if (l === 0 && r === arr.length - 1) {
        setSortedIndices(Array.from({length: arr.length}, (_, i) => i));
      }
    };

    await sort(0, arr.length - 1);
    setComparingIndices([]);
    setMessage('Merge Sort complete!');
    setIsVisualizing(false);
  };

  const quickSort = async () => {
    setIsVisualizing(true);
    setSortedIndices([]);
    let arr = [...array];

    const partition = async (low: number, high: number) => {
      let pivot = arr[high];
      setMessage(`Pivot selected: ${pivot} (index ${high})`);
      setComparingIndices([high]);
      await sleep(speed);

      let i = low - 1;
      for (let j = low; j < high; j++) {
        setComparingIndices([j, high]);
        setMessage(`Comparing ${arr[j]} with pivot ${pivot}...`);
        await sleep(speed);
        if (arr[j] < pivot) {
          i++;
          setSwappingIndices([i, j]);
          setMessage(`${arr[j]} < ${pivot}, swapping indices ${i} and ${j}`);
          [arr[i], arr[j]] = [arr[j], arr[i]];
          setArray([...arr]);
          await sleep(speed);
          setSwappingIndices([]);
        }
      }
      setSwappingIndices([i + 1, high]);
      setMessage(`Placing pivot ${pivot} at index ${i + 1}`);
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      setArray([...arr]);
      await sleep(speed);
      setSwappingIndices([]);
      setSortedIndices(prev => [...prev, i + 1]);
      return i + 1;
    };

    const sort = async (low: number, high: number) => {
      if (low < high) {
        let pi = await partition(low, high);
        await sort(low, pi - 1);
        await sort(pi + 1, high);
      } else if (low === high) {
        setSortedIndices(prev => [...prev, low]);
      }
    };

    await sort(0, arr.length - 1);
    setComparingIndices([]);
    setMessage('Quick Sort complete!');
    setIsVisualizing(false);
  };

  const heapSort = async () => {
    setIsVisualizing(true);
    setSortedIndices([]);
    let arr = [...array];
    let n = arr.length;

    const heapify = async (n: number, i: number) => {
      let largest = i;
      let l = 2 * i + 1;
      let r = 2 * i + 2;

      setComparingIndices([i, l, r].filter(idx => idx < n));
      setMessage(`Heapifying subtree at index ${i}...`);
      await sleep(speed);

      if (l < n && arr[l] > arr[largest]) largest = l;
      if (r < n && arr[r] > arr[largest]) largest = r;

      if (largest !== i) {
        setSwappingIndices([i, largest]);
        setMessage(`Swapping ${arr[i]} with ${arr[largest]}`);
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        setArray([...arr]);
        await sleep(speed);
        setSwappingIndices([]);
        await heapify(n, largest);
      }
    };

    setMessage('Building Max Heap...');
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      await heapify(n, i);
    }

    setMessage('Extracting elements from heap...');
    for (let i = n - 1; i > 0; i--) {
      setSwappingIndices([0, i]);
      setMessage(`Swapping root ${arr[0]} with last element ${arr[i]}`);
      [arr[0], arr[i]] = [arr[i], arr[0]];
      setArray([...arr]);
      await sleep(speed);
      setSwappingIndices([]);
      setSortedIndices(prev => [...prev, i]);
      await heapify(i, 0);
    }
    setSortedIndices(prev => [...prev, 0]);
    setComparingIndices([]);
    setMessage('Heap Sort complete!');
    setIsVisualizing(false);
  };

  const bucketSort = async () => {
    setIsVisualizing(true);
    setSortedIndices([]);
    let arr = [...array];
    let n = arr.length;
    
    // For visualization, we'll use 3 buckets: 0-33, 34-66, 67-100
    setMessage('Distributing elements into buckets...');
    let buckets: number[][] = [[], [], []];
    for (let i = 0; i < n; i++) {
      setComparingIndices([i]);
      let bIdx = Math.min(Math.floor(arr[i] / 34), 2);
      setMessage(`Element ${arr[i]} goes to Bucket ${bIdx + 1}`);
      buckets[bIdx].push(arr[i]);
      await sleep(speed);
    }

    setMessage('Sorting each bucket and merging...');
    let k = 0;
    for (let i = 0; i < 3; i++) {
      buckets[i].sort((a, b) => a - b);
      for (let val of buckets[i]) {
        setMergingIndices([k]);
        setMessage(`Placing ${val} from Bucket ${i+1} back to array`);
        arr[k] = val;
        setArray([...arr]);
        await sleep(speed);
        setSortedIndices(prev => [...prev, k]);
        k++;
      }
    }

    setComparingIndices([]);
    setMergingIndices([]);
    setMessage('Bucket Sort complete!');
    setIsVisualizing(false);
  };

  const handleSort = () => {
    if (selectedAlgorithm === 'sorting') return;
    if (selectedAlgorithm === 'bubble-sort') bubbleSort();
    else if (selectedAlgorithm === 'selection-sort') selectionSort();
    else if (selectedAlgorithm === 'insertion-sort') insertionSort();
    else if (selectedAlgorithm === 'merge-sort') mergeSort();
    else if (selectedAlgorithm === 'quick-sort') quickSort();
    else if (selectedAlgorithm === 'heap-sort') heapSort();
    else if (selectedAlgorithm === 'bucket-sort') bucketSort();
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
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">
              {selectedAlgorithm === 'sorting' ? 'Sorting Overview' : 'Sorting'}
            </h2>
            {selectedAlgorithm !== 'sorting' && (
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
            )}
          </div>
        </div>
        <div className="flex items-center gap-6">
          {selectedAlgorithm !== 'sorting' && ALGORITHM_THEORY[selectedAlgorithm] && (
            <div className="hidden md:flex items-center gap-4">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Time Complexity</span>
                <span className="text-xs font-bold text-amber-600">
                  {ALGORITHM_THEORY[selectedAlgorithm].complexity.time}
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Space Complexity</span>
                <span className="text-xs font-bold text-amber-600">
                  {ALGORITHM_THEORY[selectedAlgorithm].complexity.space}
                </span>
              </div>
            </div>
          )}
          {selectedAlgorithm !== 'sorting' && (
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
          )}
        </div>
      </div>

      {viewMode === 'animation' && selectedAlgorithm !== 'sorting' ? (
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
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleRandomize}
                  disabled={isVisualizing}
                  className="py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RefreshCw size={16} /> Random
                </button>
                <button 
                  onClick={handleReset}
                  disabled={isVisualizing}
                  className="py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} /> Reset
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
              <Plus size={14} />
              Custom Data
            </div>
            <div className="space-y-3">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. 10, 50, 30, 90"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  disabled={isVisualizing}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all disabled:opacity-50"
                />
              </div>
              <button 
                onClick={handleCustomInput}
                disabled={isVisualizing || !customInput.trim()}
                className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
              >
                Apply Custom Values
              </button>
              <p className="text-[10px] text-slate-400 leading-relaxed px-1">
                Enter comma-separated numbers between 1 and 100.
              </p>
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
                  const isSwapping = swappingIndices.includes(idx);
                  const isMerging = mergingIndices.includes(idx);
                  const isSorted = sortedIndices.includes(idx);
                  
                  let barColor = '#3b82f6'; // Unsorted (Blue)
                  if (isSorted) barColor = '#22c55e'; // Sorted (Green)
                  if (isMerging) barColor = '#f97316'; // Merging (Orange)
                  if (isSwapping) barColor = '#ef4444'; // Swapping (Red)
                  if (isComparing) barColor = '#eab308'; // Comparing (Yellow)
                  
                  return (
                    <motion.div 
                      key={`${idx}-${val}`}
                      layout
                      className="flex flex-col items-center gap-2"
                    >
                      <motion.div 
                        animate={{ 
                          height: val * 3,
                          backgroundColor: barColor,
                          scale: isSwapping ? 1.15 : isComparing ? 1.05 : 1,
                          y: isSwapping ? -15 : 0,
                          boxShadow: isSwapping 
                            ? '0 20px 25px -5px rgba(239, 68, 68, 0.5), 0 8px 10px -6px rgba(239, 68, 68, 0.5)' 
                            : isComparing
                            ? '0 10px 15px -3px rgba(234, 179, 8, 0.3)'
                            : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
                          zIndex: isSwapping ? 10 : isComparing ? 5 : 1
                        }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                          mass: 1
                        }}
                        className="w-12 rounded-t-xl relative"
                      >
                        <span className={`absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-bold transition-colors ${isSwapping ? 'text-red-600 scale-125' : isComparing ? 'text-amber-600' : 'text-slate-500'}`}>{val}</span>
                      </motion.div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{idx}</span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-12 flex items-center gap-6 px-8 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-[#3b82f6]" />
                  <span className="text-xs font-bold text-slate-600">Unsorted</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-[#eab308]" />
                  <span className="text-xs font-bold text-slate-600">Comparing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-[#ef4444]" />
                  <span className="text-xs font-bold text-slate-600">Swapping</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-[#f97316]" />
                  <span className="text-xs font-bold text-slate-600">Merging</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-md bg-[#22c55e]" />
                  <span className="text-xs font-bold text-slate-600">Sorted</span>
                </div>
              </div>

              <div className="mt-12 text-center max-w-xl">
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
                className="absolute top-0 right-0 bottom-0 w-96 bg-white border-l border-slate-100 shadow-2xl z-20 p-8 overflow-y-auto custom-scrollbar"
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

                  {ALGORITHM_THEORY[selectedAlgorithm] ? (
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">👉 Idea</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {ALGORITHM_THEORY[selectedAlgorithm].idea}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">👉 Example</h4>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 whitespace-pre-line font-mono">
                          {ALGORITHM_THEORY[selectedAlgorithm].example}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">👉 Complexity</h4>
                        <div className="grid grid-cols-1 gap-2">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Time</div>
                            <div className="text-sm font-bold text-amber-600">{ALGORITHM_THEORY[selectedAlgorithm].complexity.time}</div>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Space</div>
                            <div className="text-sm font-bold text-slate-600">{ALGORITHM_THEORY[selectedAlgorithm].complexity.space}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">👉 Use Case</h4>
                        <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                          {ALGORITHM_THEORY[selectedAlgorithm].useCase.map((use, idx) => (
                            <li key={idx}>{use}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4 pt-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">👉 Code</h4>
                          <div className="flex bg-slate-100 p-1 rounded-lg gap-1">
                            {(['python', 'java', 'c', 'cpp'] as const).map((lang) => (
                              <button
                                key={lang}
                                onClick={() => setSelectedLanguage(lang)}
                                className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${
                                  selectedLanguage === lang 
                                    ? 'bg-white text-amber-600 shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                              >
                                {lang.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                        <Pseudocode 
                          code={ALGORITHM_THEORY[selectedAlgorithm].code[selectedLanguage]}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Info size={32} />
                      </div>
                      <p className="text-slate-400 text-sm">Select an algorithm to view its theory.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    ) : (
        <div className="flex-1 overflow-y-auto bg-white p-12 custom-scrollbar">
          <div className="max-w-4xl mx-auto space-y-12">
            {selectedAlgorithm === 'sorting' ? (
              <>
                {/* What is Sorting? */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-amber-600">
                    <Info size={24} />
                    <h3 className="text-2xl font-bold text-slate-900">👉 What is Sorting?</h3>
                  </div>
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4">
                    <p className="text-slate-600 leading-relaxed text-lg">
                      Sorting means arranging data in a specific order:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <span className="font-bold text-slate-900 block mb-1">Ascending</span>
                        <span className="text-amber-600 font-mono text-sm">(small → large) → 1, 2, 3, 4</span>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <span className="font-bold text-slate-900 block mb-1">Descending</span>
                        <span className="text-amber-600 font-mono text-sm">(large → small) → 4, 3, 2, 1</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Why Sorting is Important? */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-amber-600">
                    <Target size={24} />
                    <h3 className="text-2xl font-bold text-slate-900">👉 Why Sorting is Important?</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 space-y-2">
                      <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center mb-2">
                        <RefreshCw size={20} />
                      </div>
                      <h4 className="font-bold text-indigo-900">Faster Searching</h4>
                      <p className="text-xs text-indigo-800/70 leading-relaxed">Binary Search needs sorted data to work efficiently.</p>
                    </div>
                    <div className="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 space-y-2">
                      <div className="w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center mb-2">
                        <BarChart3 size={20} />
                      </div>
                      <h4 className="font-bold text-emerald-900">Data Organization</h4>
                      <p className="text-xs text-emerald-800/70 leading-relaxed">Keeps information structured and easy to manage.</p>
                    </div>
                    <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100 space-y-2">
                      <div className="w-10 h-10 bg-amber-600 text-white rounded-xl flex items-center justify-center mb-2">
                        <Globe size={20} />
                      </div>
                      <h4 className="font-bold text-amber-900">Real-world Systems</h4>
                      <p className="text-xs text-amber-800/70 leading-relaxed">Used in databases, apps, and almost all digital systems.</p>
                    </div>
                  </div>
                </section>

                {/* Types of Sorting */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 text-amber-600">
                    <Code2 size={24} />
                    <h3 className="text-2xl font-bold text-slate-900">👉 Types of Sorting & Complexities</h3>
                  </div>
                  
                  <div className="overflow-hidden border border-slate-200 rounded-[2rem] shadow-xl shadow-slate-100">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white">
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-70">Category</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-70">Algorithm</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-70">Best TC</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-70">Avg TC</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-70">Worst TC</th>
                          <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest opacity-70">SC</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {/* Simple Sorting */}
                        <tr className="bg-slate-50/50">
                          <td rowSpan={3} className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase [writing-mode:vertical-lr] rotate-180 text-center border-r border-slate-100">Simple</td>
                          <td className="px-6 py-4 font-bold text-slate-900">Bubble Sort</td>
                          <td className="px-6 py-4 font-mono text-xs text-amber-600">O(n)</td>
                          <td className="px-6 py-4 font-mono text-xs text-amber-600">O(n²)</td>
                          <td className="px-6 py-4 font-mono text-xs text-amber-600">O(n²)</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">O(1)</td>
                        </tr>
                        <tr className="bg-slate-50/50">
                          <td className="px-6 py-4 font-bold text-slate-900">Selection Sort</td>
                          <td className="px-6 py-4 font-mono text-xs text-amber-600">O(n²)</td>
                          <td className="px-6 py-4 font-mono text-xs text-amber-600">O(n²)</td>
                          <td className="px-6 py-4 font-mono text-xs text-amber-600">O(n²)</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">O(1)</td>
                        </tr>
                        <tr className="bg-slate-50/50">
                          <td className="px-6 py-4 font-bold text-slate-900">Insertion Sort</td>
                          <td className="px-6 py-4 font-mono text-xs text-amber-600">O(n)</td>
                          <td className="px-6 py-4 font-mono text-xs text-amber-600">O(n²)</td>
                          <td className="px-6 py-4 font-mono text-xs text-amber-600">O(n²)</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">O(1)</td>
                        </tr>

                        {/* Efficient Sorting */}
                        <tr>
                          <td rowSpan={3} className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase [writing-mode:vertical-lr] rotate-180 text-center border-r border-slate-100">Efficient</td>
                          <td className="px-6 py-4 font-bold text-slate-900">Merge Sort</td>
                          <td className="px-6 py-4 font-mono text-xs text-emerald-600">O(n log n)</td>
                          <td className="px-6 py-4 font-mono text-xs text-emerald-600">O(n log n)</td>
                          <td className="px-6 py-4 font-mono text-xs text-emerald-600">O(n log n)</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">O(n)</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-bold text-slate-900">Quick Sort</td>
                          <td className="px-6 py-4 font-mono text-xs text-emerald-600">O(n log n)</td>
                          <td className="px-6 py-4 font-mono text-xs text-emerald-600">O(n log n)</td>
                          <td className="px-6 py-4 font-mono text-xs text-amber-600">O(n²)</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">O(log n)</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 font-bold text-slate-900">Heap Sort</td>
                          <td className="px-6 py-4 font-mono text-xs text-emerald-600">O(n log n)</td>
                          <td className="px-6 py-4 font-mono text-xs text-emerald-600">O(n log n)</td>
                          <td className="px-6 py-4 font-mono text-xs text-emerald-600">O(n log n)</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">O(1)</td>
                        </tr>

                        {/* Special Sorting */}
                        <tr className="bg-slate-50/50">
                          <td className="px-6 py-4 font-bold text-slate-400 text-[10px] uppercase [writing-mode:vertical-lr] rotate-180 text-center border-r border-slate-100">Special</td>
                          <td className="px-6 py-4 font-bold text-slate-900">Bucket Sort</td>
                          <td className="px-6 py-4 font-mono text-xs text-emerald-600">O(n+k)</td>
                          <td className="px-6 py-4 font-mono text-xs text-emerald-600">O(n+k)</td>
                          <td className="px-6 py-4 font-mono text-xs text-amber-600">O(n²)</td>
                          <td className="px-6 py-4 font-mono text-xs text-slate-500">O(n)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            ) : (
              <div className="space-y-12">
                {ALGORITHM_THEORY[selectedAlgorithm] && (
                  <div className="bg-white border border-slate-100 rounded-[2rem] shadow-xl shadow-slate-100 overflow-hidden">
                    <div className="bg-slate-900 px-8 py-8 flex items-center justify-between">
                      <h4 className="text-3xl font-bold text-white flex items-center gap-4">
                        <span className="text-amber-500">🔶</span> {ALGORITHM_THEORY[selectedAlgorithm].title}
                      </h4>
                      <div className="flex gap-8">
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Time Complexity</div>
                          <div className="text-xl font-bold text-amber-500">{ALGORITHM_THEORY[selectedAlgorithm].complexity.time}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Space Complexity</div>
                          <div className="text-xl font-bold text-slate-400">{ALGORITHM_THEORY[selectedAlgorithm].complexity.space}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-12 space-y-12">
                      <div className="space-y-4">
                        <h5 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-3">
                          <span className="text-amber-600">👉</span> Idea
                        </h5>
                        <p className="text-slate-600 text-lg leading-relaxed">
                          {ALGORITHM_THEORY[selectedAlgorithm].idea}
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-3">
                          <span className="text-amber-600">👉</span> Example
                        </h5>
                        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 text-sm text-slate-600 font-mono whitespace-pre-line leading-relaxed">
                          {ALGORITHM_THEORY[selectedAlgorithm].example}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-3">
                          <span className="text-amber-600">👉</span> Use Case
                        </h5>
                        <div className="flex flex-wrap gap-3">
                          {ALGORITHM_THEORY[selectedAlgorithm].useCase.map((use, i) => (
                            <span key={i} className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100 uppercase tracking-wider">
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="flex items-center justify-between">
                          <h5 className="text-lg font-bold text-slate-900 uppercase tracking-wider flex items-center gap-3">
                            <span className="text-amber-600">👉</span> Implementation
                          </h5>
                          <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
                            {(['python', 'java', 'c', 'cpp'] as const).map((lang) => (
                              <button
                                key={lang}
                                onClick={() => setSelectedLanguage(lang)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                                  selectedLanguage === lang 
                                    ? 'bg-white text-amber-600 shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                              >
                                {lang.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                        <Pseudocode code={ALGORITHM_THEORY[selectedAlgorithm].code[selectedLanguage]} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

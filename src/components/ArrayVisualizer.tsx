import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pseudocode } from './Pseudocode';
import { 
  Settings, 
  Plus, 
  Trash2, 
  RefreshCw, 
  Search, 
  Play, 
  Pause, 
  RotateCcw, 
  Code2,
  Info,
  ChevronRight,
  ChevronLeft,
  Grid3X3,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  ArrowDown
} from 'lucide-react';

export function ArrayVisualizer() {
  const [array, setArray] = useState<number[]>([10, 20, 30, 40, 50]);
  const [inputValue, setInputValue] = useState<string>('10, 20, 30, 40, 50');
  const [opValue, setOpValue] = useState<string>('');
  const [opIndex, setOpIndex] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('Arrays store elements in contiguous memory locations. This allows O(1) random access but makes insertion/deletion O(n) as elements must shift.');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [viewMode, setViewMode] = useState<'animation' | 'theory'>('animation');

  const handleSetArray = () => {
    const newArray = inputValue.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    setArray(newArray);
    setMessage('Array initialized with new values.');
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleInsert = async () => {
    const val = parseInt(opValue);
    const idx = parseInt(opIndex);
    if (isNaN(val) || isNaN(idx) || idx < 0 || idx > array.length) {
      setMessage('Invalid value or index for insertion.');
      return;
    }

    setIsVisualizing(true);
    setMessage(`Inserting ${val} at index ${idx}...`);
    
    // Visualization steps
    for (let i = array.length - 1; i >= idx; i--) {
      setHighlightedIndex(i);
      setMessage(`Shifting element at index ${i} to ${i + 1}...`);
      await sleep(speed);
    }

    const newArray = [...array];
    newArray.splice(idx, 0, val);
    setArray(newArray);
    setHighlightedIndex(idx);
    setMessage(`Inserted ${val} at index ${idx}.`);
    await sleep(speed);
    setHighlightedIndex(null);
    setIsVisualizing(false);
  };

  const handleDelete = async () => {
    const idx = parseInt(opIndex);
    if (isNaN(idx) || idx < 0 || idx >= array.length) {
      setMessage('Invalid index for deletion.');
      return;
    }

    setIsVisualizing(true);
    setMessage(`Deleting element at index ${idx}...`);
    setHighlightedIndex(idx);
    await sleep(speed);

    for (let i = idx + 1; i < array.length; i++) {
      setHighlightedIndex(i);
      setMessage(`Shifting element at index ${i} to ${i - 1}...`);
      await sleep(speed);
    }

    const newArray = [...array];
    newArray.splice(idx, 1);
    setArray(newArray);
    setHighlightedIndex(null);
    setMessage(`Deleted element at index ${idx}.`);
    setIsVisualizing(false);
  };

  const handleUpdate = async () => {
    const val = parseInt(opValue);
    const idx = parseInt(opIndex);
    if (isNaN(val) || isNaN(idx) || idx < 0 || idx >= array.length) {
      setMessage('Invalid value or index for update.');
      return;
    }

    setIsVisualizing(true);
    setHighlightedIndex(idx);
    setMessage(`Updating index ${idx} to ${val}...`);
    await sleep(speed);

    const newArray = [...array];
    newArray[idx] = val;
    setArray(newArray);
    setMessage(`Updated index ${idx} to ${val}.`);
    await sleep(speed);
    setHighlightedIndex(null);
    setIsVisualizing(false);
  };

  const handleSearch = async () => {
    const val = parseInt(opValue);
    if (isNaN(val)) {
      setMessage('Invalid value for search.');
      return;
    }

    setIsVisualizing(true);
    let found = false;
    for (let i = 0; i < array.length; i++) {
      setHighlightedIndex(i);
      setMessage(`Checking index ${i}...`);
      await sleep(speed);
      if (array[i] === val) {
        setMessage(`Found ${val} at index ${i}!`);
        found = true;
        break;
      }
    }

    if (!found) {
      setMessage(`${val} not found in the array.`);
      setHighlightedIndex(null);
    }
    setIsVisualizing(false);
  };

  const handlePush = async () => {
    const val = parseInt(opValue);
    if (isNaN(val)) {
      setMessage('Invalid value for push.');
      return;
    }

    setIsVisualizing(true);
    setMessage(`Pushing ${val} to the end...`);
    
    const newArray = [...array, val];
    setArray(newArray);
    setHighlightedIndex(newArray.length - 1);
    await sleep(speed);
    
    setMessage(`Pushed ${val} to the end of the array.`);
    setHighlightedIndex(null);
    setIsVisualizing(false);
  };

  const handlePop = async () => {
    if (array.length === 0) {
      setMessage('Array is empty, cannot pop.');
      return;
    }

    setIsVisualizing(true);
    const lastIdx = array.length - 1;
    setHighlightedIndex(lastIdx);
    setMessage(`Popping element from the end...`);
    await sleep(speed);

    const newArray = array.slice(0, -1);
    setArray(newArray);
    setHighlightedIndex(null);
    setMessage(`Popped element from the end.`);
    setIsVisualizing(false);
  };

  const handleResize = async () => {
    const newSize = parseInt(opValue);
    if (isNaN(newSize) || newSize < 0) {
      setMessage('Invalid size for resize.');
      return;
    }

    setIsVisualizing(true);
    setMessage(`Resizing array to ${newSize}...`);
    await sleep(speed);

    let newArray = [...array];
    if (newSize > array.length) {
      // Padding with zeros
      for (let i = array.length; i < newSize; i++) {
        newArray.push(0);
        setArray([...newArray]);
        setHighlightedIndex(i);
        setMessage(`Adding empty slot at index ${i}...`);
        await sleep(speed / 2);
      }
    } else if (newSize < array.length) {
      // Truncating
      for (let i = array.length - 1; i >= newSize; i--) {
        setHighlightedIndex(i);
        setMessage(`Removing slot at index ${i}...`);
        await sleep(speed / 2);
        newArray.pop();
        setArray([...newArray]);
      }
    }

    setHighlightedIndex(null);
    setMessage(`Array resized to ${newSize}.`);
    setIsVisualizing(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Grid3X3 size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Array</h2>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={() => setViewMode('animation')}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  viewMode === 'animation' 
                    ? 'bg-indigo-600 text-white' 
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
                    ? 'bg-indigo-600 text-white' 
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
              <span className="text-xs font-bold text-indigo-600">O(n)</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Space Complexity</span>
              <span className="text-xs font-bold text-indigo-600">O(n)</span>
            </div>
          </div>
          <button 
            onClick={() => setShowPseudocode(!showPseudocode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${
              showPseudocode 
                ? 'bg-indigo-600 text-white shadow-indigo-200' 
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
          {/* Configuration */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
              <Settings size={14} />
              Configuration
            </div>
            <div className="space-y-3">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="e.g. 10, 20, 30"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-mono"
              />
              <button 
                onClick={handleSetArray}
                disabled={isVisualizing}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100"
              >
                Set Array
              </button>
            </div>
          </section>

          {/* Operations */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
              <Plus size={14} />
              Operations
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Value</label>
                  <input 
                    type="text" 
                    value={opValue}
                    onChange={(e) => setOpValue(e.target.value)}
                    placeholder="42"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Index</label>
                  <input 
                    type="text" 
                    value={opIndex}
                    onChange={(e) => setOpIndex(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={handleInsert}
                  disabled={isVisualizing}
                  className="py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  Insert
                </button>
                <button 
                  onClick={handleDelete}
                  disabled={isVisualizing}
                  className="py-2.5 bg-rose-500 text-white rounded-xl text-xs font-bold hover:bg-rose-600 transition-all disabled:opacity-50"
                >
                  Delete
                </button>
                <button 
                  onClick={handleUpdate}
                  disabled={isVisualizing}
                  className="py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
                >
                  Update
                </button>
                <button 
                  onClick={handleSearch}
                  disabled={isVisualizing}
                  className="py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
                >
                  Search
                </button>
                <button 
                  onClick={handlePush}
                  disabled={isVisualizing}
                  className="py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all disabled:opacity-50"
                >
                  Push
                </button>
                <button 
                  onClick={handlePop}
                  disabled={isVisualizing}
                  className="py-2.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all disabled:opacity-50"
                >
                  Pop
                </button>
                <button 
                  onClick={handleResize}
                  disabled={isVisualizing}
                  className="py-2.5 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold hover:bg-amber-100 transition-all disabled:opacity-50"
                >
                  Resize
                </button>
              </div>
            </div>
          </section>

          {/* Playback */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
              <Play size={14} />
              Playback
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><RotateCcw size={20} /></button>
                <button className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shadow-sm"><Pause size={24} /></button>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><ChevronRight size={20} /></button>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Speed</span>
                  <span>{speed}ms</span>
                </div>
                <input 
                  type="range" 
                  min="100" 
                  max="2000" 
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Main Content - Visualization */}
        <div className="flex-1 p-12 flex flex-col items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key="viz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex items-center justify-center gap-4 min-h-[240px] w-full max-w-4xl overflow-x-auto">
                {array.map((val, idx) => (
                  <motion.div 
                    key={`${idx}-${val}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: highlightedIndex === idx ? 1.1 : 1,
                      borderColor: highlightedIndex === idx ? '#4f46e5' : '#e2e8f0',
                      backgroundColor: highlightedIndex === idx ? '#f5f3ff' : '#ffffff'
                    }}
                    className="relative flex flex-col items-center shrink-0"
                  >
                    <div className={`w-16 h-20 border-2 rounded-2xl flex items-center justify-center text-xl font-bold transition-colors shadow-sm ${highlightedIndex === idx ? 'text-indigo-600' : 'text-slate-700'}`}>
                      {val}
                    </div>
                    <span className="absolute -bottom-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{idx}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-24 text-center max-w-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Contiguous Memory</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {message}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Sidebar - Theory (Toggled) */}
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
                    <div className="flex items-center gap-3 text-indigo-600">
                      <Info size={24} />
                      <h3 className="text-xl font-bold">Theory & Logic</h3>
                    </div>
                    <button onClick={() => setShowPseudocode(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Definition</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        An array is a linear data structure that collects elements of the same data type and stores them in contiguous and adjacent memory locations.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Key Properties</h4>
                      <ul className="space-y-2">
                        {[
                          'Index starts from 0',
                          'Fixed size (in most languages)',
                          'Constant time access O(1)',
                          'Linear time insertion/deletion O(n)'
                        ].map((prop, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                            {prop}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Complexity Table</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Access</div>
                          <div className="text-sm font-bold text-indigo-600">O(1)</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Search</div>
                          <div className="text-sm font-bold text-indigo-600">O(n)</div>
                        </div>
                        <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                          <div className="text-[10px] font-bold text-rose-400 uppercase">Insert</div>
                          <div className="text-sm font-bold text-rose-600">O(n)</div>
                        </div>
                        <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                          <div className="text-[10px] font-bold text-rose-400 uppercase">Delete</div>
                          <div className="text-sm font-bold text-rose-600">O(n)</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pseudocode (Delete)</h4>
                      <Pseudocode 
                        code={`if index is invalid: return\nvalue = array[index]\nfor i from index to length-1\n  array[i] = array[i+1]\nlength--\nreturn value`}
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
              <div className="flex items-center gap-3 text-indigo-600">
                <Info size={24} />
                <h3 className="text-2xl font-bold text-slate-900">What is an Array?</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                An array is a collection of items stored at contiguous memory locations. The idea is to store multiple items of the same type together. This makes it easier to calculate the position of each element by simply adding an offset to a base value, i.e., the memory location of the first element of the array (generally denoted by the name of the array).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Key Characteristics
                  </h4>
                  <ul className="space-y-2 text-sm text-indigo-800">
                    <li>• Fixed size (usually, unless dynamic)</li>
                    <li>• Contiguous memory allocation</li>
                    <li>• Homogeneous elements (same data type)</li>
                    <li>• Random access via index (O(1))</li>
                  </ul>
                </div>
                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                  <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Common Limitations
                  </h4>
                  <ul className="space-y-2 text-sm text-rose-800">
                    <li>• Insertion/Deletion is slow (O(n))</li>
                    <li>• Fixed size can lead to memory waste</li>
                    <li>• Memory must be contiguous</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Basic Operations</h3>
              <div className="overflow-hidden border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Operation</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Description</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Complexity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Access</td>
                      <td className="px-6 py-4 text-slate-600">Retrieve element at a specific index</td>
                      <td className="px-6 py-4 font-mono text-indigo-600">O(1)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Search</td>
                      <td className="px-6 py-4 text-slate-600">Find the index of a specific value</td>
                      <td className="px-6 py-4 font-mono text-indigo-600">O(n)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Insertion</td>
                      <td className="px-6 py-4 text-slate-600">Add element at a specific position</td>
                      <td className="px-6 py-4 font-mono text-indigo-600">O(n)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Deletion</td>
                      <td className="px-6 py-4 text-slate-600">Remove element from a specific position</td>
                      <td className="px-6 py-4 font-mono text-indigo-600">O(n)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-slate-900 rounded-[2.5rem] p-12 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-bold">Why use Arrays?</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Arrays are best suited for scenarios where you need fast access to elements and the number of elements is known in advance or doesn't change frequently. They are the building blocks for many other data structures like Stacks, Queues, and Hash Tables.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/10">Fast Access</span>
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/10">Cache Friendly</span>
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/10">Simple Implementation</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

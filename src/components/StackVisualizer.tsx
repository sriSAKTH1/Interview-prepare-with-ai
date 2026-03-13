import { useState } from 'react';
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
  Layers,
  ArrowUp,
  ArrowDown,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function StackVisualizer() {
  const [stack, setStack] = useState<number[]>([10, 20, 30]);
  const [opValue, setOpValue] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('A Stack is a LIFO (Last In, First Out) data structure. Elements are added and removed from the same end, called the Top.');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [viewMode, setViewMode] = useState<'animation' | 'theory'>('animation');

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handlePush = async () => {
    const val = parseInt(opValue);
    if (isNaN(val)) {
      setMessage('Please enter a valid number to push.');
      return;
    }

    setIsVisualizing(true);
    setMessage(`Pushing ${val} onto the stack...`);
    
    // Animation for pushing
    await sleep(speed);
    const newStack = [...stack, val];
    setStack(newStack);
    setHighlightedIndex(newStack.length - 1);
    await sleep(speed);
    
    setMessage(`Pushed ${val} onto the stack. It is now the new Top.`);
    setHighlightedIndex(null);
    setIsVisualizing(false);
    setOpValue('');
  };

  const handlePop = async () => {
    if (stack.length === 0) {
      setMessage('Stack Underflow! Cannot pop from an empty stack.');
      return;
    }

    setIsVisualizing(true);
    const topIdx = stack.length - 1;
    setHighlightedIndex(topIdx);
    setMessage(`Popping the top element (${stack[topIdx]})...`);
    await sleep(speed);

    const newStack = stack.slice(0, -1);
    setStack(newStack);
    setHighlightedIndex(null);
    setMessage(`Popped the top element. The new Top is ${newStack.length > 0 ? newStack[newStack.length - 1] : 'none'}.`);
    setIsVisualizing(false);
  };

  const handlePeek = async () => {
    if (stack.length === 0) {
      setMessage('Stack is empty.');
      return;
    }
    setIsVisualizing(true);
    const topIdx = stack.length - 1;
    setHighlightedIndex(topIdx);
    setMessage(`Peeking at the top: ${stack[topIdx]}`);
    await sleep(speed * 1.5);
    setHighlightedIndex(null);
    setIsVisualizing(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
            <Layers size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Stack</h2>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={() => setViewMode('animation')}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  viewMode === 'animation' 
                    ? 'bg-purple-600 text-white' 
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
                    ? 'bg-purple-600 text-white' 
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
              <span className="text-xs font-bold text-purple-600">O(1)</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Space Complexity</span>
              <span className="text-xs font-bold text-purple-600">O(n)</span>
            </div>
          </div>
          <button 
            onClick={() => setShowPseudocode(!showPseudocode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${
              showPseudocode 
                ? 'bg-purple-600 text-white shadow-purple-200' 
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
              <Plus size={14} />
              Operations
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Value</label>
                <input 
                  type="text" 
                  value={opValue}
                  onChange={(e) => setOpValue(e.target.value)}
                  placeholder="Enter value"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={handlePush}
                  disabled={isVisualizing}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ArrowUp size={16} /> Push
                </button>
                <button 
                  onClick={handlePop}
                  disabled={isVisualizing}
                  className="w-full py-3 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ArrowDown size={16} /> Pop
                </button>
                <button 
                  onClick={handlePeek}
                  disabled={isVisualizing}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
                >
                  Peek
                </button>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
              <Play size={14} />
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
                  min="100" 
                  max="2000" 
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Main Content - Visualization */}
        <div className="flex-1 p-12 flex flex-col items-center justify-end relative overflow-hidden bg-slate-50">
          <AnimatePresence mode="wait">
            <motion.div 
              key="viz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center h-full"
            >
              {/* Stack Container */}
              <div className="relative w-48 h-[400px] border-x-4 border-b-4 border-slate-300 rounded-b-3xl flex flex-col-reverse items-center p-4 gap-2 bg-white/50 backdrop-blur-sm shadow-inner">
                {stack.map((val, idx) => (
                  <motion.div 
                    key={`${idx}-${val}`}
                    layout
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: highlightedIndex === idx ? 1.05 : 1,
                      backgroundColor: highlightedIndex === idx ? '#f5f3ff' : '#ffffff',
                      borderColor: highlightedIndex === idx ? '#9333ea' : '#e2e8f0'
                    }}
                    className={`w-full h-14 border-2 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm transition-colors relative ${highlightedIndex === idx ? 'text-purple-600' : 'text-slate-700'}`}
                  >
                    {val}
                    {idx === stack.length - 1 && (
                      <div className="absolute -right-16 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse" />
                        <span className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Top</span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {stack.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                    Empty Stack
                  </div>
                )}
              </div>

              <div className="mt-12 text-center max-w-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-2">LIFO Principle</h3>
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
                    <div className="flex items-center gap-3 text-purple-600">
                      <Info size={24} />
                      <h3 className="text-xl font-bold">Theory & Logic</h3>
                    </div>
                    <button onClick={() => setShowPseudocode(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">What is a Stack?</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        A stack is a linear data structure that follows the Last-In-First-Out (LIFO) principle. Think of it like a stack of plates; you can only add or remove the top plate.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Operations</h4>
                      <ul className="space-y-2">
                        {[
                          'Push: Add element to top',
                          'Pop: Remove element from top',
                          'Peek: View top element',
                          'isEmpty: Check if stack is empty'
                        ].map((prop, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                            {prop}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Complexity</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Push</div>
                          <div className="text-sm font-bold text-purple-600">O(1)</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Pop</div>
                          <div className="text-sm font-bold text-purple-600">O(1)</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Peek</div>
                          <div className="text-sm font-bold text-purple-600">O(1)</div>
                        </div>
                        <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                          <div className="text-[10px] font-bold text-rose-400 uppercase">Search</div>
                          <div className="text-sm font-bold text-rose-600">O(n)</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pseudocode (Push)</h4>
                      <Pseudocode 
                        code={`if stack is full: return overflow\ntop = top + 1\nstack[top] = value`}
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
              <div className="flex items-center gap-3 text-purple-600">
                <Info size={24} />
                <h3 className="text-2xl font-bold text-slate-900">What is a Stack?</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                A Stack is a linear data structure that follows the <b>Last-In-First-Out (LIFO)</b> principle. This means the last element added to the stack will be the first one to be removed. Think of it like a stack of plates—you can only add or remove the top plate.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Key Characteristics
                  </h4>
                  <ul className="space-y-2 text-sm text-purple-800">
                    <li>• LIFO (Last-In-First-Out) order</li>
                    <li>• Single point of entry/exit (Top)</li>
                    <li>• Dynamic or fixed size</li>
                    <li>• Efficient O(1) Push and Pop</li>
                  </ul>
                </div>
                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                  <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Common Use Cases
                  </h4>
                  <ul className="space-y-2 text-sm text-rose-800">
                    <li>• Function call management (Call Stack)</li>
                    <li>• Undo/Redo mechanisms in editors</li>
                    <li>• Expression evaluation & parsing</li>
                    <li>• Backtracking algorithms (DFS)</li>
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
                      <td className="px-6 py-4 font-bold text-slate-900">Push</td>
                      <td className="px-6 py-4 text-slate-600">Add an element to the top of the stack</td>
                      <td className="px-6 py-4 font-mono text-purple-600">O(1)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Pop</td>
                      <td className="px-6 py-4 text-slate-600">Remove the top element from the stack</td>
                      <td className="px-6 py-4 font-mono text-purple-600">O(1)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Peek / Top</td>
                      <td className="px-6 py-4 text-slate-600">View the top element without removing it</td>
                      <td className="px-6 py-4 font-mono text-purple-600">O(1)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">isEmpty</td>
                      <td className="px-6 py-4 text-slate-600">Check if the stack has no elements</td>
                      <td className="px-6 py-4 font-mono text-purple-600">O(1)</td>
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

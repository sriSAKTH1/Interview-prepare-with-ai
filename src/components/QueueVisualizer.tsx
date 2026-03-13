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
  Users,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export function QueueVisualizer() {
  const [queue, setQueue] = useState<number[]>([10, 20, 30]);
  const [opValue, setOpValue] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('A Queue is a FIFO (First In, First Out) data structure. Elements are added at the Rear and removed from the Front.');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [viewMode, setViewMode] = useState<'animation' | 'theory'>('animation');

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleEnqueue = async () => {
    const val = parseInt(opValue);
    if (isNaN(val)) {
      setMessage('Please enter a valid number to enqueue.');
      return;
    }

    setIsVisualizing(true);
    setMessage(`Enqueuing ${val} at the Rear...`);
    
    await sleep(speed);
    const newQueue = [...queue, val];
    setQueue(newQueue);
    setHighlightedIndex(newQueue.length - 1);
    await sleep(speed);
    
    setMessage(`Enqueued ${val}. It is now the new Rear.`);
    setHighlightedIndex(null);
    setIsVisualizing(false);
    setOpValue('');
  };

  const handleDequeue = async () => {
    if (queue.length === 0) {
      setMessage('Queue Underflow! Cannot dequeue from an empty queue.');
      return;
    }

    setIsVisualizing(true);
    setHighlightedIndex(0);
    setMessage(`Dequeuing from the Front (${queue[0]})...`);
    await sleep(speed);

    const newQueue = queue.slice(1);
    setQueue(newQueue);
    setHighlightedIndex(null);
    setMessage(`Dequeued the front element. The new Front is ${newQueue.length > 0 ? newQueue[0] : 'none'}.`);
    setIsVisualizing(false);
  };

  const handlePeek = async () => {
    if (queue.length === 0) {
      setMessage('Queue is empty.');
      return;
    }
    setIsVisualizing(true);
    setHighlightedIndex(0);
    setMessage(`Front element is: ${queue[0]}`);
    await sleep(speed * 1.5);
    setHighlightedIndex(null);
    setIsVisualizing(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Users size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Queue</h2>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={() => setViewMode('animation')}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  viewMode === 'animation' 
                    ? 'bg-emerald-600 text-white' 
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
                    ? 'bg-emerald-600 text-white' 
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
              <span className="text-xs font-bold text-emerald-600">O(1)</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Space Complexity</span>
              <span className="text-xs font-bold text-emerald-600">O(n)</span>
            </div>
          </div>
          <button 
            onClick={() => setShowPseudocode(!showPseudocode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${
              showPseudocode 
                ? 'bg-emerald-600 text-white shadow-emerald-200' 
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={handleEnqueue}
                  disabled={isVisualizing}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ArrowRight size={16} /> Enqueue
                </button>
                <button 
                  onClick={handleDequeue}
                  disabled={isVisualizing}
                  className="w-full py-3 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <ArrowLeft size={16} /> Dequeue
                </button>
                <button 
                  onClick={handlePeek}
                  disabled={isVisualizing}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all disabled:opacity-50"
                >
                  Peek Front
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
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-emerald-600"
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
              {/* Queue Container */}
              <div className="relative flex items-center gap-2 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-2xl min-h-[160px] w-full max-w-4xl overflow-x-auto">
                {queue.map((val, idx) => (
                  <motion.div 
                    key={`${idx}-${val}`}
                    layout
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      scale: highlightedIndex === idx ? 1.1 : 1,
                      backgroundColor: highlightedIndex === idx ? '#ecfdf5' : '#ffffff',
                      borderColor: highlightedIndex === idx ? '#059669' : '#e2e8f0'
                    }}
                    className={`w-16 h-20 border-2 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm transition-colors relative shrink-0 ${highlightedIndex === idx ? 'text-emerald-600' : 'text-slate-700'}`}
                  >
                    {val}
                    {idx === 0 && (
                      <div className="absolute -top-10 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Front</span>
                        <ArrowDown size={14} className="text-emerald-600" />
                      </div>
                    )}
                    {idx === queue.length - 1 && (
                      <div className="absolute -bottom-10 flex flex-col items-center">
                        <ArrowUp size={14} className="text-emerald-600" />
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Rear</span>
                      </div>
                    )}
                  </motion.div>
                ))}
                {queue.length === 0 && (
                  <div className="w-full text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                    Empty Queue
                  </div>
                )}
              </div>

              <div className="mt-24 text-center max-w-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-2">FIFO Principle</h3>
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
                    <div className="flex items-center gap-3 text-emerald-600">
                      <Info size={24} />
                      <h3 className="text-xl font-bold">Theory & Logic</h3>
                    </div>
                    <button onClick={() => setShowPseudocode(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">What is a Queue?</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        A queue is a linear data structure that follows the First-In-First-Out (FIFO) principle. Think of it like a line of people waiting for a bus; the first person in line is the first one to get on.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Operations</h4>
                      <ul className="space-y-2">
                        {[
                          'Enqueue: Add element to rear',
                          'Dequeue: Remove element from front',
                          'Peek: View front element',
                          'isFull: Check if queue is full'
                        ].map((prop, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                            {prop}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Complexity</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Enqueue</div>
                          <div className="text-sm font-bold text-emerald-600">O(1)</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Dequeue</div>
                          <div className="text-sm font-bold text-emerald-600">O(1)</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Peek</div>
                          <div className="text-sm font-bold text-emerald-600">O(1)</div>
                        </div>
                        <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                          <div className="text-[10px] font-bold text-rose-400 uppercase">Search</div>
                          <div className="text-sm font-bold text-rose-600">O(n)</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pseudocode (Enqueue)</h4>
                      <Pseudocode 
                        code={`if queue is full: return overflow\nrear = rear + 1\nqueue[rear] = value`}
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
              <div className="flex items-center gap-3 text-emerald-600">
                <Info size={24} />
                <h3 className="text-2xl font-bold text-slate-900">What is a Queue?</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                A Queue is a linear data structure that follows the <b>First-In-First-Out (FIFO)</b> principle. This means the first element added to the queue will be the first one to be removed. Think of it like a line of people waiting for a bus—the person who gets in line first is the first one to board.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Key Characteristics
                  </h4>
                  <ul className="space-y-2 text-sm text-emerald-800">
                    <li>• FIFO (First-In-First-Out) order</li>
                    <li>• Two points of entry/exit (Front & Rear)</li>
                    <li>• Elements added at Rear (Enqueue)</li>
                    <li>• Elements removed from Front (Dequeue)</li>
                  </ul>
                </div>
                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                  <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Common Use Cases
                  </h4>
                  <ul className="space-y-2 text-sm text-rose-800">
                    <li>• Task scheduling (CPU, Disk)</li>
                    <li>• Handling of interrupts in real-time systems</li>
                    <li>• Buffering for data streams</li>
                    <li>• Breadth-First Search (BFS) algorithm</li>
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
                      <td className="px-6 py-4 font-bold text-slate-900">Enqueue</td>
                      <td className="px-6 py-4 text-slate-600">Add an element to the rear of the queue</td>
                      <td className="px-6 py-4 font-mono text-emerald-600">O(1)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Dequeue</td>
                      <td className="px-6 py-4 text-slate-600">Remove the front element from the queue</td>
                      <td className="px-6 py-4 font-mono text-emerald-600">O(1)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Peek / Front</td>
                      <td className="px-6 py-4 text-slate-600">View the front element without removing it</td>
                      <td className="px-6 py-4 font-mono text-emerald-600">O(1)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">isFull / isEmpty</td>
                      <td className="px-6 py-4 text-slate-600">Check the status of the queue capacity</td>
                      <td className="px-6 py-4 font-mono text-emerald-600">O(1)</td>
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

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
  Link as LinkIcon,
  ArrowRight,
  RefreshCw,
  BookOpen,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Node {
  id: number;
  value: number;
}

export function LinkedListVisualizer() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 1, value: 10 },
    { id: 2, value: 20 },
    { id: 3, value: 30 }
  ]);
  const [opValue, setOpValue] = useState<string>('');
  const [opIndex, setOpIndex] = useState<string>('');
  const [highlightedId, setHighlightedId] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('A Linked List is a linear data structure where elements are stored in nodes. Each node contains a value and a pointer to the next node.');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [viewMode, setViewMode] = useState<'animation' | 'theory'>('animation');

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleInsertAtHead = async () => {
    const val = parseInt(opValue);
    if (isNaN(val)) return;

    setIsVisualizing(true);
    setMessage(`Inserting ${val} at the Head...`);
    
    const newNode = { id: Date.now(), value: val };
    setNodes([newNode, ...nodes]);
    setHighlightedId(newNode.id);
    await sleep(speed);
    
    setMessage(`Inserted ${val} as the new Head.`);
    setHighlightedId(null);
    setIsVisualizing(false);
    setOpValue('');
  };

  const handleInsertAtTail = async () => {
    const val = parseInt(opValue);
    if (isNaN(val)) return;

    setIsVisualizing(true);
    setMessage(`Traversing to the end of the list...`);
    
    for (const node of nodes) {
      setHighlightedId(node.id);
      await sleep(speed / 2);
    }

    const newNode = { id: Date.now(), value: val };
    setNodes([...nodes, newNode]);
    setHighlightedId(newNode.id);
    setMessage(`Inserted ${val} at the Tail.`);
    await sleep(speed);
    
    setHighlightedId(null);
    setIsVisualizing(false);
    setOpValue('');
  };

  const handleDeleteAtHead = async () => {
    if (nodes.length === 0) return;

    setIsVisualizing(true);
    setHighlightedId(nodes[0].id);
    setMessage(`Deleting the Head node...`);
    await sleep(speed);

    setNodes(nodes.slice(1));
    setHighlightedId(null);
    setMessage(`Head node deleted.`);
    setIsVisualizing(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <LinkIcon size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Linked List</h2>
            <div className="flex items-center gap-2 mt-1">
              <button 
                onClick={() => setViewMode('animation')}
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                  viewMode === 'animation' 
                    ? 'bg-blue-600 text-white' 
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
                    ? 'bg-blue-600 text-white' 
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
              <span className="text-xs font-bold text-blue-600">O(n)</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Space Complexity</span>
              <span className="text-xs font-bold text-blue-600">O(n)</span>
            </div>
          </div>
          <button 
            onClick={() => setShowPseudocode(!showPseudocode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-lg ${
              showPseudocode 
                ? 'bg-blue-600 text-white shadow-blue-200' 
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
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={handleInsertAtHead}
                  disabled={isVisualizing}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  Insert at Head
                </button>
                <button 
                  onClick={handleInsertAtTail}
                  disabled={isVisualizing}
                  className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  Insert at Tail
                </button>
                <button 
                  onClick={handleDeleteAtHead}
                  disabled={isVisualizing}
                  className="w-full py-3 bg-rose-500 text-white rounded-xl text-sm font-bold hover:bg-rose-600 transition-all disabled:opacity-50"
                >
                  Delete Head
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
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
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
              {/* List Container */}
              <div className="flex items-center gap-4 p-8 bg-white rounded-[2rem] border border-slate-100 shadow-2xl min-h-[160px] w-full max-w-4xl overflow-x-auto">
                {nodes.map((node, idx) => (
                  <div key={node.id} className="flex items-center gap-4 shrink-0">
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ 
                        opacity: 1, 
                        scale: highlightedId === node.id ? 1.1 : 1,
                        backgroundColor: highlightedId === node.id ? '#eff6ff' : '#ffffff',
                        borderColor: highlightedId === node.id ? '#2563eb' : '#e2e8f0'
                      }}
                      className={`w-20 h-20 border-2 rounded-2xl flex flex-col items-center justify-center shadow-sm transition-colors relative ${highlightedId === node.id ? 'text-blue-600' : 'text-slate-700'}`}
                    >
                      <div className="text-xl font-bold">{node.value}</div>
                      <div className="text-[8px] font-bold text-slate-400 uppercase mt-1">Next →</div>
                      {idx === 0 && (
                        <div className="absolute -top-8 text-[10px] font-bold text-blue-600 uppercase tracking-widest">Head</div>
                      )}
                    </motion.div>
                    {idx < nodes.length - 1 && (
                      <ArrowRight className="text-slate-300" size={24} />
                    )}
                    {idx === nodes.length - 1 && (
                      <div className="flex items-center gap-2">
                        <ArrowRight className="text-slate-300" size={24} />
                        <div className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-400 uppercase tracking-widest">NULL</div>
                      </div>
                    )}
                  </div>
                ))}
                {nodes.length === 0 && (
                  <div className="w-full text-center text-slate-300 font-bold uppercase tracking-widest text-xs">
                    Empty List (NULL)
                  </div>
                )}
              </div>

              <div className="mt-24 text-center max-w-xl">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Dynamic Memory</h3>
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
                    <div className="flex items-center gap-3 text-blue-600">
                      <Info size={24} />
                      <h3 className="text-xl font-bold">Theory & Logic</h3>
                    </div>
                    <button onClick={() => setShowPseudocode(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">What is a Linked List?</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        A linked list is a linear data structure where elements are not stored at contiguous memory locations. The elements in a linked list are linked using pointers.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Advantages</h4>
                      <ul className="space-y-2">
                        {[
                          'Dynamic size',
                          'Ease of insertion/deletion',
                          'No memory wastage',
                        ].map((prop, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm text-slate-500">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                            {prop}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Complexity</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Access</div>
                          <div className="text-sm font-bold text-blue-600">O(n)</div>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Search</div>
                          <div className="text-sm font-bold text-blue-600">O(n)</div>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                          <div className="text-[10px] font-bold text-emerald-400 uppercase">Insert (Head)</div>
                          <div className="text-sm font-bold text-emerald-600">O(1)</div>
                        </div>
                        <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                          <div className="text-[10px] font-bold text-rose-400 uppercase">Delete (Head)</div>
                          <div className="text-sm font-bold text-rose-600">O(1)</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pseudocode (Insert Head)</h4>
                      <Pseudocode 
                        code={`newNode = new Node(value)\nnewNode.next = head\nhead = newNode`}
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
              <div className="flex items-center gap-3 text-blue-600">
                <Info size={24} />
                <h3 className="text-2xl font-bold text-slate-900">What is a Linked List?</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                A Linked List is a linear data structure where elements are not stored at contiguous memory locations. Instead, each element (called a <b>Node</b>) contains a data field and a reference (or pointer) to the next node in the sequence.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Key Characteristics
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Dynamic size (grows/shrinks easily)</li>
                    <li>• Non-contiguous memory allocation</li>
                    <li>• Efficient insertion/deletion at head (O(1))</li>
                    <li>• Sequential access only (no O(1) indexing)</li>
                  </ul>
                </div>
                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                  <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Common Variations
                  </h4>
                  <ul className="space-y-2 text-sm text-rose-800">
                    <li>• <b>Singly Linked List:</b> Forward pointers only</li>
                    <li>• <b>Doubly Linked List:</b> Forward & backward pointers</li>
                    <li>• <b>Circular Linked List:</b> Last node points to head</li>
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
                      <td className="px-6 py-4 text-slate-600">Retrieve element at index (must traverse)</td>
                      <td className="px-6 py-4 font-mono text-blue-600">O(n)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Search</td>
                      <td className="px-6 py-4 text-slate-600">Find node with specific value</td>
                      <td className="px-6 py-4 font-mono text-blue-600">O(n)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Insert (Head)</td>
                      <td className="px-6 py-4 text-slate-600">Add a new node at the beginning</td>
                      <td className="px-6 py-4 font-mono text-blue-600">O(1)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Insert (Tail)</td>
                      <td className="px-6 py-4 text-slate-600">Add a new node at the end</td>
                      <td className="px-6 py-4 font-mono text-blue-600">O(n)*</td>
                    </tr>
                  </tbody>
                </table>
                <p className="p-4 text-[10px] text-slate-400 italic">*O(1) if tail pointer is maintained.</p>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

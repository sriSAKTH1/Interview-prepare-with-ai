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
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Network,
  GitBranch,
  Search,
  ArrowRight
} from 'lucide-react';

interface TreeNode {
  id: number;
  value: number;
  left?: number;
  right?: number;
  x: number;
  y: number;
}

export function TreeVisualizer({ initialViewMode = 'animation' }: { initialViewMode?: 'animation' | 'theory' }) {
  const [nodes, setNodes] = useState<TreeNode[]>([
    { id: 1, value: 1, left: 2, right: 3, x: 400, y: 80 },
    { id: 2, value: 2, left: 4, right: 5, x: 250, y: 180 },
    { id: 3, value: 3, x: 550, y: 180 },
    { id: 4, value: 2, x: 150, y: 280 },
    { id: 5, value: 3, x: 350, y: 280 },
  ]);
  
  const [highlightedNode, setHighlightedNode] = useState<number | null>(null);
  const [traversalOrder, setTraversalOrder] = useState<number[]>([]);
  const [message, setMessage] = useState<string>('A Tree is a non-linear data structure that represents a hierarchical relationship between nodes.');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [viewMode, setViewMode] = useState<'animation' | 'theory'>(initialViewMode);
  const [traversalType, setTraversalType] = useState<'inorder' | 'preorder' | 'postorder'>('inorder');

  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const getInorder = (nodeId: number | undefined, result: number[] = []) => {
    if (nodeId === undefined) return result;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return result;
    getInorder(node.left, result);
    result.push(node.id);
    getInorder(node.right, result);
    return result;
  };

  const getPreorder = (nodeId: number | undefined, result: number[] = []) => {
    if (nodeId === undefined) return result;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return result;
    result.push(node.id);
    getPreorder(node.left, result);
    getPreorder(node.right, result);
    return result;
  };

  const getPostorder = (nodeId: number | undefined, result: number[] = []) => {
    if (nodeId === undefined) return result;
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return result;
    getPostorder(node.left, result);
    getPostorder(node.right, result);
    result.push(node.id);
    return result;
  };

  const handleTraverse = async () => {
    if (isVisualizing) return;
    setIsVisualizing(true);
    setTraversalOrder([]);
    
    let order: number[] = [];
    if (traversalType === 'inorder') order = getInorder(1);
    else if (traversalType === 'preorder') order = getPreorder(1);
    else order = getPostorder(1);

    setMessage(`Starting ${traversalType} traversal...`);
    
    for (const nodeId of order) {
      setHighlightedNode(nodeId);
      const node = nodes.find(n => n.id === nodeId);
      setMessage(`Visiting node with value ${node?.value}`);
      setTraversalOrder(prev => [...prev, nodeId]);
      await sleep(speed);
    }

    setHighlightedNode(null);
    setMessage(`${traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} traversal completed.`);
    setIsVisualizing(false);
  };

  const reset = () => {
    setHighlightedNode(null);
    setTraversalOrder([]);
    setMessage('Visualization reset.');
    setIsVisualizing(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
            <Network size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Binary Tree</h2>
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
              <span className="text-xs font-bold text-purple-600">O(n)</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Space Complexity</span>
              <span className="text-xs font-bold text-purple-600">O(h)</span>
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
                <Settings size={14} />
                Traversal Type
              </div>
              <div className="grid grid-cols-1 gap-2">
                {(['inorder', 'preorder', 'postorder'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTraversalType(type)}
                    disabled={isVisualizing}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between ${
                      traversalType === type 
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                    {traversalType === type && <CheckCircle2 size={14} />}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
                <Play size={14} />
                Actions
              </div>
              <div className="space-y-3">
                <button 
                  onClick={handleTraverse}
                  disabled={isVisualizing}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl text-sm font-bold hover:bg-purple-700 transition-all disabled:opacity-50 shadow-lg shadow-purple-100 flex items-center justify-center gap-2"
                >
                  <Play size={16} />
                  Start Traversal
                </button>
                <button 
                  onClick={reset}
                  disabled={isVisualizing}
                  className="w-full py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  Reset
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
                <Settings size={14} />
                Playback Speed
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>Speed</span>
                  <span>{speed}ms</span>
                </div>
                <input 
                  type="range" 
                  min="200" 
                  max="2000" 
                  step="100"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            </section>
          </div>

          {/* Main Content - Visualization */}
          <div className="flex-1 p-12 flex flex-col items-center justify-center relative overflow-hidden bg-white">
            <div className="relative w-full h-full max-w-4xl max-h-[600px]">
              <svg className="w-full h-full absolute inset-0 pointer-events-none">
                {nodes.map(node => {
                  const leftChild = nodes.find(n => n.id === node.left);
                  const rightChild = nodes.find(n => n.id === node.right);
                  return (
                    <g key={`edges-${node.id}`}>
                      {leftChild && (
                        <motion.line
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          x1={node.x} y1={node.y}
                          x2={leftChild.x} y2={leftChild.y}
                          stroke="#2dd4bf"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      )}
                      {rightChild && (
                        <motion.line
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          x1={node.x} y1={node.y}
                          x2={rightChild.x} y2={rightChild.y}
                          stroke="#2dd4bf"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {nodes.map(node => (
                <motion.div
                  key={node.id}
                  initial={{ scale: 0 }}
                  animate={{ 
                    scale: 1,
                    backgroundColor: highlightedNode === node.id ? '#a855f7' : '#9333ea',
                    boxShadow: highlightedNode === node.id ? '0 0 20px rgba(168, 85, 247, 0.6)' : '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                  style={{ left: node.x - 25, top: node.y - 25 }}
                  className="absolute w-[50px] h-[50px] rounded-full flex items-center justify-center text-white font-bold text-lg z-10 border-2 border-white/20"
                >
                  {node.value}
                </motion.div>
              ))}
            </div>

            {/* Traversal Result */}
            <div className="absolute bottom-12 left-12 right-12 flex flex-col items-center">
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-xl w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                    <Search size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">Traversal Result</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <AnimatePresence>
                    {traversalOrder.map((nodeId, idx) => {
                      const node = nodes.find(n => n.id === nodeId);
                      return (
                        <motion.div
                          key={`res-${idx}-${nodeId}`}
                          initial={{ opacity: 0, scale: 0.5, x: -20 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          className="flex items-center gap-2"
                        >
                          <div className="w-10 h-10 bg-purple-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-purple-100">
                            {node?.value}
                          </div>
                          {idx < traversalOrder.length - 1 && <ArrowRight size={14} className="text-slate-300" />}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  {traversalOrder.length === 0 && (
                    <span className="text-slate-400 text-sm italic">Start traversal to see results here...</span>
                  )}
                </div>
              </div>
              
              <div className="mt-6 text-center max-w-xl">
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  {message}
                </p>
              </div>
            </div>

            {/* Pseudocode Overlay */}
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
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Definition</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          A Tree is a hierarchical data structure consisting of nodes connected by edges. It has a root node and each node can have zero or more child nodes.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Binary Tree Traversal</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                            <h5 className="font-bold text-purple-900 text-xs uppercase mb-2">Inorder (L-Root-R)</h5>
                            <p className="text-xs text-purple-700">Visit left subtree, then root, then right subtree. In a BST, this gives sorted order.</p>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                            <h5 className="font-bold text-purple-900 text-xs uppercase mb-2">Preorder (Root-L-R)</h5>
                            <p className="text-xs text-purple-700">Visit root, then left subtree, then right subtree. Useful for cloning trees.</p>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
                            <h5 className="font-bold text-purple-900 text-xs uppercase mb-2">Postorder (L-R-Root)</h5>
                            <p className="text-xs text-purple-700">Visit left subtree, then right subtree, then root. Useful for deleting trees.</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pseudocode (Inorder)</h4>
                        <Pseudocode 
                          code={`function inorder(node):\n  if node is null: return\n  inorder(node.left)\n  visit(node)\n  inorder(node.right)`}
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
                <h3 className="text-2xl font-bold text-slate-900">What is a Tree?</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                A tree is a non-linear data structure, compared to arrays, linked lists, stacks and queues which are linear data structures. A tree can be empty with no nodes or a tree is a structure consisting of one node called the root and zero or one or more subtrees.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Key Terminology
                  </h4>
                  <ul className="space-y-2 text-sm text-purple-800">
                    <li>• <strong>Root:</strong> Topmost node of the tree</li>
                    <li>• <strong>Edge:</strong> Link between two nodes</li>
                    <li>• <strong>Leaf:</strong> Node with no children</li>
                    <li>• <strong>Height:</strong> Number of edges on longest path to leaf</li>
                    <li>• <strong>Depth:</strong> Number of edges from root to node</li>
                  </ul>
                </div>
                <div className="bg-teal-50 p-6 rounded-2xl border border-teal-100">
                  <h4 className="font-bold text-teal-900 mb-2 flex items-center gap-2">
                    <GitBranch size={18} />
                    Types of Trees
                  </h4>
                  <ul className="space-y-2 text-sm text-teal-800">
                    <li>• Binary Tree (max 2 children)</li>
                    <li>• Binary Search Tree (BST)</li>
                    <li>• AVL Tree (Self-balancing)</li>
                    <li>• B-Tree (Used in databases)</li>
                    <li>• Trie (Prefix tree)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Tree Traversal</h3>
              <div className="overflow-hidden border border-slate-200 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Method</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Order</th>
                      <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-slate-500">Complexity</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Inorder</td>
                      <td className="px-6 py-4 text-slate-600">Left → Root → Right</td>
                      <td className="px-6 py-4 font-mono text-purple-600">O(n)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Preorder</td>
                      <td className="px-6 py-4 text-slate-600">Root → Left → Right</td>
                      <td className="px-6 py-4 font-mono text-purple-600">O(n)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Postorder</td>
                      <td className="px-6 py-4 text-slate-600">Left → Right → Root</td>
                      <td className="px-6 py-4 font-mono text-purple-600">O(n)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Level Order</td>
                      <td className="px-6 py-4 text-slate-600">Breadth-First Search</td>
                      <td className="px-6 py-4 font-mono text-purple-600">O(n)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 text-purple-600">
                <Search size={24} />
                <h3 className="text-2xl font-bold text-slate-900">Binary Search Tree (BST)</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                A Binary Search Tree is a node-based binary tree data structure which has the following additional properties:
              </p>
              <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 shrink-0 font-bold text-xs">1</div>
                  <p className="text-slate-700 font-medium">The left subtree of a node contains only nodes with keys <strong>less than</strong> the node's key.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 shrink-0 font-bold text-xs">2</div>
                  <p className="text-slate-700 font-medium">The right subtree of a node contains only nodes with keys <strong>greater than</strong> the node's key.</p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 shrink-0 font-bold text-xs">3</div>
                  <p className="text-slate-700 font-medium">The left and right subtree each must also be a binary search tree.</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-slate-900">Common Applications</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Efficient Searching", desc: "Used in databases and file systems for quick data retrieval." },
                    { title: "Sorting", desc: "In-order traversal of a BST results in sorted elements." },
                    { title: "Symbol Tables", desc: "Used in compilers to store and look up identifiers." }
                  ].map((app, i) => (
                    <div key={i} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <h5 className="font-bold text-purple-600 mb-1">{app.title}</h5>
                      <p className="text-xs text-slate-500 leading-relaxed">{app.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-slate-900 rounded-[2.5rem] p-12 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-bold">Why use Trees?</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Trees are used to represent data with a natural hierarchy (like file systems), provide efficient search/insertion (BSTs), and are the basis for many complex algorithms in computer science.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/10">Hierarchical Data</span>
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/10">Efficient Search</span>
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/10">Dynamic Size</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

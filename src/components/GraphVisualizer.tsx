import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pseudocode } from './Pseudocode';
import { 
  Settings, 
  Plus,
  Play, 
  RotateCcw, 
  Code2,
  Info,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  GitBranch,
  Search,
  ArrowRight,
  Share2
} from 'lucide-react';

interface Neighbor {
  id: string;
  weight: number;
}

interface GraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
  neighbors: Neighbor[];
}

export function GraphVisualizer({ initialViewMode = 'animation' }: { initialViewMode?: 'animation' | 'theory' }) {
  const [nodes, setNodes] = useState<GraphNode[]>([
    { id: 'A', label: 'A', x: 150, y: 150, neighbors: [{ id: 'B', weight: 4 }, { id: 'C', weight: 2 }, { id: 'D', weight: 7 }] },
    { id: 'B', label: 'B', x: 450, y: 80, neighbors: [{ id: 'A', weight: 4 }, { id: 'C', weight: 5 }, { id: 'E', weight: 10 }] },
    { id: 'C', label: 'C', x: 100, y: 450, neighbors: [{ id: 'A', weight: 2 }, { id: 'B', weight: 5 }] },
    { id: 'D', label: 'D', x: 400, y: 350, neighbors: [{ id: 'A', weight: 7 }, { id: 'E', weight: 3 }, { id: 'F', weight: 8 }] },
    { id: 'E', label: 'E', x: 700, y: 400, neighbors: [{ id: 'B', weight: 10 }, { id: 'D', weight: 3 }] },
    { id: 'F', label: 'F', x: 600, y: 550, neighbors: [{ id: 'D', weight: 8 }] },
  ]);
  
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [visitedNodes, setVisitedNodes] = useState<string[]>([]);
  const [traversalOrder, setTraversalOrder] = useState<string[]>([]);
  const [message, setMessage] = useState<string>('A Graph is a non-linear data structure consisting of vertices (nodes) and edges that connect them.');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [viewMode, setViewMode] = useState<'animation' | 'theory'>(initialViewMode);
  const [traversalType, setTraversalType] = useState<'BFS' | 'DFS'>('BFS');

  // New states for adding edges
  const [newEdgeFrom, setNewEdgeFrom] = useState<string>('A');
  const [newEdgeTo, setNewEdgeTo] = useState<string>('B');
  const [newEdgeWeight, setNewEdgeWeight] = useState<number>(1);

  useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleBFS = async (startNodeId: string) => {
    setIsVisualizing(true);
    setTraversalOrder([]);
    setVisitedNodes([]);
    
    const queue: string[] = [startNodeId];
    const visited = new Set<string>([startNodeId]);
    const order: string[] = [];

    setMessage(`Starting BFS from node ${startNodeId}...`);
    await sleep(speed);

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      setHighlightedNode(nodeId);
      order.push(nodeId);
      setTraversalOrder([...order]);
      setVisitedNodes(Array.from(visited));
      
      const node = nodes.find(n => n.id === nodeId);
      setMessage(`Visiting node ${nodeId}`);
      await sleep(speed);

      if (node) {
        for (const neighbor of node.neighbors) {
          const neighborId = neighbor.id;
          if (!visited.has(neighborId)) {
            visited.add(neighborId);
            queue.push(neighborId);
            setMessage(`Adding neighbor ${neighborId} to queue`);
            setVisitedNodes(Array.from(visited));
            await sleep(speed / 2);
          }
        }
      }
    }

    setHighlightedNode(null);
    setMessage('BFS traversal completed.');
    setIsVisualizing(false);
  };

  const handleDFS = async (startNodeId: string) => {
    setIsVisualizing(true);
    setTraversalOrder([]);
    setVisitedNodes([]);
    
    const visited = new Set<string>();
    const order: string[] = [];

    const dfsRecursive = async (nodeId: string) => {
      visited.add(nodeId);
      setVisitedNodes(Array.from(visited));
      setHighlightedNode(nodeId);
      order.push(nodeId);
      setTraversalOrder([...order]);
      
      setMessage(`Visiting node ${nodeId}`);
      await sleep(speed);

      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        for (const neighbor of node.neighbors) {
          const neighborId = neighbor.id;
          if (!visited.has(neighborId)) {
            setMessage(`Moving to neighbor ${neighborId}`);
            await dfsRecursive(neighborId);
            setHighlightedNode(nodeId);
            setMessage(`Backtracking to ${nodeId}`);
            await sleep(speed / 2);
          }
        }
      }
    };

    setMessage(`Starting DFS from node ${startNodeId}...`);
    await dfsRecursive(startNodeId);

    setHighlightedNode(null);
    setMessage('DFS traversal completed.');
    setIsVisualizing(false);
  };

  const handleTraverse = () => {
    if (isVisualizing) return;
    if (traversalType === 'BFS') handleBFS('A');
    else handleDFS('A');
  };

  const reset = () => {
    setHighlightedNode(null);
    setVisitedNodes([]);
    setTraversalOrder([]);
    setMessage('Visualization reset.');
    setIsVisualizing(false);
  };

  const handleAddEdge = () => {
    if (newEdgeFrom === newEdgeTo) {
      setMessage("Cannot add edge to the same node.");
      return;
    }

    setNodes(prevNodes => {
      return prevNodes.map(node => {
        if (node.id === newEdgeFrom) {
          // Check if edge already exists
          const existing = node.neighbors.find(n => n.id === newEdgeTo);
          if (existing) {
            return {
              ...node,
              neighbors: node.neighbors.map(n => n.id === newEdgeTo ? { ...n, weight: newEdgeWeight } : n)
            };
          }
          return {
            ...node,
            neighbors: [...node.neighbors, { id: newEdgeTo, weight: newEdgeWeight }]
          };
        }
        if (node.id === newEdgeTo) {
          const existing = node.neighbors.find(n => n.id === newEdgeFrom);
          if (existing) {
            return {
              ...node,
              neighbors: node.neighbors.map(n => n.id === newEdgeFrom ? { ...n, weight: newEdgeWeight } : n)
            };
          }
          return {
            ...node,
            neighbors: [...node.neighbors, { id: newEdgeFrom, weight: newEdgeWeight }]
          };
        }
        return node;
      });
    });
    setMessage(`Edge added between ${newEdgeFrom} and ${newEdgeTo} with weight ${newEdgeWeight}`);
  };

  // Unique edges to avoid double drawing
  const edges: { from: string; to: string; weight: number }[] = [];
  const seenEdges = new Set<string>();
  nodes.forEach(node => {
    node.neighbors.forEach(neighbor => {
      const edgeKey = [node.id, neighbor.id].sort().join('-');
      if (!seenEdges.has(edgeKey)) {
        edges.push({ from: node.id, to: neighbor.id, weight: neighbor.weight });
        seenEdges.add(edgeKey);
      }
    });
  });

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <Share2 size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">Graph</h2>
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
              <span className="text-xs font-bold text-indigo-600">O(V + E)</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Space Complexity</span>
              <span className="text-xs font-bold text-indigo-600">O(V)</span>
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
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
                <Plus size={14} />
                Add Weighted Edge
              </div>
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">From</label>
                    <select 
                      value={newEdgeFrom}
                      onChange={(e) => setNewEdgeFrom(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    >
                      {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">To</label>
                    <select 
                      value={newEdgeTo}
                      onChange={(e) => setNewEdgeTo(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                    >
                      {nodes.map(n => <option key={n.id} value={n.id}>{n.label}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Weight</label>
                  <input 
                    type="number" 
                    min="1"
                    max="99"
                    value={newEdgeWeight}
                    onChange={(e) => setNewEdgeWeight(parseInt(e.target.value) || 1)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold"
                  />
                </div>
                <button 
                  onClick={handleAddEdge}
                  className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                >
                  Add Edge
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
                <Settings size={14} />
                Traversal Type
              </div>
              <div className="grid grid-cols-1 gap-2">
                {(['BFS', 'DFS'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTraversalType(type)}
                    disabled={isVisualizing}
                    className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all text-left flex items-center justify-between ${
                      traversalType === type 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {type}
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
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <Play size={16} />
                  Start {traversalType}
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
                  className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-indigo-600"
                />
              </div>
            </section>
          </div>

          {/* Main Content - Visualization */}
          <div className="flex-1 p-12 flex flex-col items-center justify-center relative overflow-hidden bg-white">
            <div className="relative w-full h-full max-w-4xl max-h-[600px]">
              <svg className="w-full h-full absolute inset-0 pointer-events-none overflow-visible">
                {edges.map(({ from, to, weight }) => {
                  const fromNode = nodes.find(n => n.id === from)!;
                  const toNode = nodes.find(n => n.id === to)!;
                  const midX = (fromNode.x + toNode.x) / 2;
                  const midY = (fromNode.y + toNode.y) / 2;

                  return (
                    <g key={`edge-${from}-${to}`}>
                      <motion.line
                        initial={{ pathLength: 0, opacity: 0.2 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        x1={fromNode.x} y1={fromNode.y}
                        x2={toNode.x} y2={toNode.y}
                        stroke="#cbd5e1"
                        strokeWidth="2"
                      />
                      <rect 
                        x={midX - 12} 
                        y={midY - 12} 
                        width="24" 
                        height="24" 
                        rx="6" 
                        fill="white" 
                        stroke="#e2e8f0" 
                        strokeWidth="1"
                      />
                      <text
                        x={midX}
                        y={midY}
                        dy="4"
                        textAnchor="middle"
                        className="text-[10px] font-bold fill-indigo-600"
                      >
                        {weight}
                      </text>
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
                    backgroundColor: highlightedNode === node.id 
                      ? '#4f46e5' 
                      : visitedNodes.includes(node.id) 
                        ? '#e0e7ff' 
                        : '#f8fafc',
                    color: highlightedNode === node.id ? '#ffffff' : '#475569',
                    borderColor: highlightedNode === node.id ? '#4338ca' : '#cbd5e1',
                    boxShadow: highlightedNode === node.id ? '0 0 20px rgba(79, 70, 229, 0.4)' : '0 1px 2px rgba(0,0,0,0.05)'
                  }}
                  style={{ left: node.x - 25, top: node.y - 25 }}
                  className="absolute w-[50px] h-[50px] rounded-full flex items-center justify-center font-bold text-lg z-10 border-2 transition-colors duration-300"
                >
                  {node.label}
                </motion.div>
              ))}
            </div>

            {/* Traversal Result */}
            <div className="absolute bottom-12 left-12 right-12 flex flex-col items-center">
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-100 shadow-xl w-full max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                    <Search size={16} />
                  </div>
                  <span className="text-sm font-bold text-slate-900 uppercase tracking-widest">Traversal Order</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  <AnimatePresence>
                    {traversalOrder.map((nodeId, idx) => (
                      <motion.div
                        key={`res-${idx}-${nodeId}`}
                        initial={{ opacity: 0, scale: 0.5, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-indigo-100">
                          {nodeId}
                        </div>
                        {idx < traversalOrder.length - 1 && <ArrowRight size={14} className="text-slate-300" />}
                      </motion.div>
                    ))}
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
                          A Graph is a collection of nodes (vertices) and connections (edges). Unlike trees, graphs can have cycles and multiple paths between nodes.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Graph Algorithms</h4>
                        <div className="space-y-4">
                          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <h5 className="font-bold text-indigo-900 text-xs uppercase mb-2">BFS (Breadth-First Search)</h5>
                            <p className="text-xs text-indigo-700">Explores neighbors layer by layer. Uses a <strong>Queue</strong>. Best for finding shortest paths in unweighted graphs.</p>
                          </div>
                          <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <h5 className="font-bold text-indigo-900 text-xs uppercase mb-2">DFS (Depth-First Search)</h5>
                            <p className="text-xs text-indigo-700">Explores as far as possible along each branch before backtracking. Uses a <strong>Stack</strong> (or recursion).</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 pt-4">
                        <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Pseudocode (BFS)</h4>
                        <Pseudocode 
                          code={`BFS(G, start_v):\n  let Q be a queue\n  label start_v as visited\n  Q.enqueue(start_v)\n  while Q is not empty:\n    v = Q.dequeue()\n    for all neighbors w of v:\n      if w is not labeled as visited:\n        label w as visited\n        Q.enqueue(w)`}
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
                <h3 className="text-2xl font-bold text-slate-900">What is a Graph?</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                A Graph is a non-linear data structure consisting of vertices and edges. The vertices are sometimes also referred to as nodes and the edges are lines or arcs that connect any two nodes in the graph. More formally a Graph is composed of a set of vertices(V) and a set of edges(E).
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                  <h4 className="font-bold text-indigo-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Core Components
                  </h4>
                  <ul className="space-y-2 text-sm text-indigo-800">
                    <li>• <strong>Vertices:</strong> Fundamental units of a graph</li>
                    <li>• <strong>Edges:</strong> Connections between vertices</li>
                    <li>• <strong>Degree:</strong> Number of edges connected to a vertex</li>
                    <li>• <strong>Path:</strong> Sequence of edges between two vertices</li>
                    <li>• <strong>Cycle:</strong> Path that starts and ends at same vertex</li>
                  </ul>
                </div>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <GitBranch size={18} />
                    Graph Types
                  </h4>
                  <ul className="space-y-2 text-sm text-emerald-800">
                    <li>• Directed vs Undirected</li>
                    <li>• Weighted vs Unweighted</li>
                    <li>• Cyclic vs Acyclic (DAG)</li>
                    <li>• Connected vs Disconnected</li>
                    <li>• Dense vs Sparse</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Representations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3">Adjacency Matrix</h4>
                  <p className="text-sm text-slate-600 mb-4">A 2D array where V[i][j] = 1 if an edge exists between vertex i and j.</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                    <span>Space: O(V²)</span>
                    <span>•</span>
                    <span>Edge Lookup: O(1)</span>
                  </div>
                </div>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-3">Adjacency List</h4>
                  <p className="text-sm text-slate-600 mb-4">An array of lists where each list contains the neighbors of a vertex.</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
                    <span>Space: O(V + E)</span>
                    <span>•</span>
                    <span>Edge Lookup: O(V)</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-slate-900 rounded-[2.5rem] p-12 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-bold">Real-world Applications</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Graphs are everywhere. They power social networks (friend suggestions), navigation apps (Google Maps), search engines (PageRank), and recommendation systems (Netflix/Amazon).
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/10">Social Networks</span>
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/10">GPS Navigation</span>
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/10">Network Routing</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

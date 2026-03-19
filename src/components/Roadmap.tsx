import { motion } from 'motion/react';
import { ChevronLeft, MapPin, Zap, BookOpen, Code2, Target, Trophy, Activity, Globe, Star, X } from 'lucide-react';

interface RoadmapNode {
  id: string;
  title: string;
  subtopics?: string[];
  icon: any;
  color: string;
  position: { x: number; y: number };
}

const nodes: RoadmapNode[] = [
  { id: '1', title: 'ARRAY', icon: Code2, color: 'bg-blue-500', position: { x: 50, y: 50 } },
  { id: '2', title: 'STRING', icon: BookOpen, color: 'bg-indigo-500', position: { x: 150, y: 120 } },
  { id: '3', title: 'STACK ←→ QUEUE', icon: Activity, color: 'bg-violet-500', position: { x: 50, y: 220 } },
  { id: '4', title: 'LINKED LIST', icon: Globe, color: 'bg-purple-500', position: { x: 150, y: 320 } },
  { id: '5', title: 'TREE', icon: Zap, color: 'bg-fuchsia-500', position: { x: 50, y: 420 } },
  { id: '6', title: 'GRAPH', icon: Target, color: 'bg-pink-500', position: { x: 150, y: 520 } },
  { 
    id: '7', 
    title: 'SEARCHING', 
    subtopics: ['Linear Search', 'Binary Search (Sorted Array)'],
    icon: Star, 
    color: 'bg-rose-500', 
    position: { x: 50, y: 650 } 
  },
  { 
    id: '8', 
    title: 'SORTING', 
    subtopics: ['Basic (Bubble, Selection, Insertion)', 'Advanced (Merge, Quick, Heap, Bucket)'],
    icon: Trophy, 
    color: 'bg-orange-500', 
    position: { x: 150, y: 800 } 
  },
  { 
    id: '9', 
    title: 'GRAPH ALGORITHMS', 
    subtopics: ['BFS (Queue)', 'DFS (Stack/Recursion)'],
    icon: MapPin, 
    color: 'bg-amber-500', 
    position: { x: 50, y: 950 } 
  },
];

export function Roadmap({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] bg-slate-50 dark:bg-slate-950 overflow-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Learning Roadmap</h1>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-full">
          <MapPin size={16} className="text-indigo-600 dark:text-indigo-400" />
          <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">DSA Highway</span>
        </div>
      </div>

      {/* Map Content */}
      <div className="max-w-4xl mx-auto p-12 relative min-h-[1200px]">
        {/* The Path (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: '1200px' }}>
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
          <motion.path
            d={generatePath(nodes)}
            fill="none"
            stroke="url(#pathGradient)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray="20 15"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
          {/* Road markings */}
          <motion.path
            d={generatePath(nodes)}
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="5 10"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="opacity-50"
          />
        </svg>

        {/* Nodes */}
        <div className="relative z-10">
          {nodes.map((node, index) => (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.2 }}
              className="absolute"
              style={{ 
                left: `${node.position.x}%`, 
                top: `${node.position.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="flex flex-col items-center group">
                <div className={`w-16 h-16 ${node.color} rounded-2xl shadow-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform cursor-pointer border-4 border-white dark:border-slate-900`}>
                  <node.icon size={32} />
                </div>
                <div className="bg-white dark:bg-slate-900 px-4 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 text-center min-w-[140px]">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{node.title}</p>
                  {node.subtopics && (
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      {node.subtopics.map(sub => (
                        <p key={sub} className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">• {sub}</p>
                      ))}
                    </div>
                  )}
                </div>
                {/* Connector Arrow */}
                {index < nodes.length - 1 && (
                  <div className="mt-4 text-slate-300 dark:text-slate-700">
                    <span className="text-2xl">↓</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={onClose}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition-colors z-50"
      >
        <X size={24} />
      </button>
    </div>
  );
}

function generatePath(nodes: RoadmapNode[]) {
  if (nodes.length < 2) return '';
  let d = `M ${nodes[0].position.x}% ${nodes[0].position.y}`;
  for (let i = 1; i < nodes.length; i++) {
    const prev = nodes[i-1];
    const curr = nodes[i];
    const midY = (prev.position.y + curr.position.y) / 2;
    d += ` C ${prev.position.x}% ${midY}, ${curr.position.x}% ${midY}, ${curr.position.x}% ${curr.position.y}`;
  }
  return d;
}

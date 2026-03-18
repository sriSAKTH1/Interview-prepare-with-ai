import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Clock, 
  Activity, 
  Target, 
  Check, 
  Zap, 
  ListChecks, 
  ChevronDown, 
  Search, 
  Grid3X3, 
  Layers, 
  XCircle, 
  CheckCircle2 
} from 'lucide-react';

export function ComplexityAnalysis() {
  const [activeTab, setActiveTab] = useState<'time' | 'space'>('time');
  const [showAnalyzer, setShowAnalyzer] = useState<number | null>(null);

  const complexityData = [
    { n: 1, constant: 1, log: 0, linear: 1, linearLog: 0, quadratic: 1 },
    { n: 2, constant: 1, log: 1, linear: 2, linearLog: 2, quadratic: 4 },
    { n: 4, constant: 1, log: 2, linear: 4, linearLog: 8, quadratic: 16 },
    { n: 8, constant: 1, log: 3, linear: 8, linearLog: 24, quadratic: 64 },
    { n: 16, constant: 1, log: 4, linear: 16, linearLog: 64, quadratic: 256 },
    { n: 32, constant: 1, log: 5, linear: 32, linearLog: 160, quadratic: 1024 },
  ];

  const analyzerCode = [
    {
      title: "Single Loop",
      code: "for i in range(n):\n    print(i)",
      complexity: "O(n)",
      explanation: "The loop runs 'n' times, so execution time grows linearly with input size."
    },
    {
      title: "Nested Loop",
      code: "for i in range(n):\n    for j in range(n):\n        print(i, j)",
      complexity: "O(n²)",
      explanation: "For every 'i', the inner loop runs 'n' times. Total operations: n * n = n²."
    },
    {
      title: "Binary Search Pattern",
      code: "while n > 1:\n    n = n // 2",
      complexity: "O(log n)",
      explanation: "The input size is halved in each step, leading to logarithmic growth."
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      {/* Header Section */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
          <Clock size={14} /> Performance Analysis
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">What is Complexity Analysis?</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Activity size={18} className="text-indigo-600" /> Complexity analysis measures:
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" /> How fast an algorithm runs (Time Complexity ⏱️)</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" /> How much memory it uses (Space Complexity 💾)</li>
            </ul>
          </div>
          <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Target size={18} className="text-indigo-600" /> Why is it Important?
            </h3>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Helps choose the best algorithm</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Improves performance</li>
              <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500" /> Important for coding interviews</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Interactive Tabs */}
      <div className="space-y-8">
        <div className="flex gap-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('time')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'time' 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Time Complexity
          </button>
          <button
            onClick={() => setActiveTab('space')}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'space' 
                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Space Complexity
          </button>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'time' ? (
            <motion.div
              key="time"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-8"
            >
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/30">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">👉 What is Time Complexity?</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Time complexity measures how execution time increases with input size (n). It's not about the actual time in seconds (which depends on the hardware), but the number of operations performed.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">👉 Common Time Complexities:</h4>
                  <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 dark:bg-slate-800">
                        <tr>
                          <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Complexity</th>
                          <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Name</th>
                          <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Example</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {[
                          { c: "O(1)", n: "Constant", e: "Access array" },
                          { c: "O(log n)", n: "Logarithmic", e: "Binary Search" },
                          { c: "O(n)", n: "Linear", e: "Loop" },
                          { c: "O(n log n)", n: "Linear Log", e: "Merge Sort" },
                          { c: "O(n²)", n: "Quadratic", e: "Nested loops" }
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="px-4 py-3 font-mono text-indigo-600 dark:text-indigo-400">{row.c}</td>
                            <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{row.n}</td>
                            <td className="px-4 py-3 text-slate-500 dark:text-slate-500">{row.e}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white">👉 Examples:</h4>
                  <div className="space-y-4">
                    {[
                      { title: "O(1) – Constant Time", code: "def get_first(arr):\n    return arr[0]" },
                      { title: "O(n) – Linear Time", code: "def print_all(arr):\n    for x in arr:\n        print(x)" },
                      { title: "O(n²) – Quadratic Time", code: "def pairs(arr):\n    for i in arr:\n        for j in arr:\n            print(i, j)" }
                    ].map((ex, i) => (
                      <div key={i} className="bg-slate-900 rounded-2xl p-4">
                        <p className="text-xs font-bold text-emerald-400 mb-2">✅ {ex.title}</p>
                        <pre className="text-xs font-mono text-slate-300 leading-relaxed overflow-x-auto">
                          {ex.code}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="space"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[2.5rem] border border-indigo-100 dark:border-indigo-800/30">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">👉 What is Space Complexity?</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  Space complexity measures memory used by an algorithm. It includes both the input size and the auxiliary space (extra memory used by the algorithm).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">👉 Types:</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <p className="font-bold text-indigo-600 dark:text-indigo-400">Auxiliary Space</p>
                      <p className="text-sm text-slate-500">Extra memory used by the algorithm (e.g., temporary variables, stacks).</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                      <p className="font-bold text-indigo-600 dark:text-indigo-400">Input Space</p>
                      <p className="text-sm text-slate-500">Memory required to store the input data.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-4">👉 Example:</h4>
                  <div className="bg-slate-900 rounded-2xl p-6 mb-4">
                    <pre className="text-sm font-mono text-slate-300 leading-relaxed">
{`def sum_array(arr):
    total = 0
    for x in arr:
        total += x
    return total`}
                    </pre>
                  </div>
                  <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">👉 Space = O(1) (no extra memory used regardless of input size)</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Big-O Notation Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600">
              <Zap size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">🔶 Big-O Notation</h2>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">👉 What is Big-O?</h4>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              Big-O describes worst-case performance. It gives an upper bound on the time or space required.
            </p>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-3 text-xs uppercase tracking-widest">👉 Growth Order (Best → Worst)</h4>
              <p className="font-mono text-indigo-600 dark:text-indigo-400 text-center text-lg">
                O(1) &lt; O(log n) &lt; O(n) &lt; O(n log n) &lt; O(n²) &lt; O(2ⁿ)
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center text-emerald-600">
              <ListChecks size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">🔶 Important Rules</h2>
          </div>
          <div className="space-y-4">
            {[
              { title: "1. Ignore Constants", desc: "O(2n) → O(n). We care about the growth rate, not absolute numbers." },
              { title: "2. Drop Lower Terms", desc: "O(n² + n) → O(n²). As n grows, the highest power dominates." },
              { title: "3. Different Inputs", desc: "O(n + m) when two separate inputs are processed." }
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shrink-0">
                  <Check size={12} />
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">{rule.title}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Complexity Patterns */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">🔶 Time Complexity Patterns</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Single Loop", code: "for i in range(n):", complexity: "O(n)" },
            { title: "Nested Loop", code: "for i in range(n):\n    for j in range(n):", complexity: "O(n²)" },
            { title: "Halving Problem", code: "while n > 1:\n    n = n // 2", complexity: "O(log n)" }
          ].map((pattern, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <h4 className="font-bold text-slate-900 dark:text-white mb-3">👉 {pattern.title}</h4>
              <div className="bg-slate-900 rounded-xl p-4 mb-3">
                <pre className="text-xs font-mono text-slate-300">{pattern.code}</pre>
              </div>
              <p className="text-indigo-600 dark:text-indigo-400 font-bold">👉 {pattern.complexity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Real Examples & Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">🔶 Real Examples</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: "Binary Search", comp: "O(log n)" },
              { name: "Merge Sort", comp: "O(n log n)" },
              { name: "Bubble Sort", comp: "O(n²)" },
              { name: "Hash Map Access", comp: "O(1)" }
            ].map((ex, i) => (
              <div key={i} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{ex.name}</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 text-xs font-bold">→ {ex.comp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">🔶 Best, Average, Worst Case</h2>
          <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Case</th>
                  <th className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { c: "Best Case", m: "Fastest possible execution (e.g., finding item at first index)" },
                  { c: "Average Case", m: "Normal execution time across all possible inputs" },
                  { c: "Worst Case", m: "Slowest possible execution (Big-O focus)" }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{row.c}</td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{row.m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interactive Complexity Graph */}
      <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">🚀 Interactive Complexity Graph</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Visualize how different complexities grow as input size (n) increases.</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Activity size={12} /> Live Visualization
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={complexityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis 
                dataKey="n" 
                label={{ value: 'Input Size (n)', position: 'insideBottomRight', offset: -10, fontSize: 12 }} 
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                label={{ value: 'Operations', angle: -90, position: 'insideLeft', fontSize: 12 }} 
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                itemStyle={{ fontSize: '12px' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line type="monotone" dataKey="constant" name="O(1)" stroke="#94a3b8" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="log" name="O(log n)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="linear" name="O(n)" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="linearLog" name="O(n log n)" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="quadratic" name="O(n²)" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Complexity Analyzer & Tradeoff */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">🚀 Code Complexity Analyzer</h2>
          <div className="space-y-4">
            {analyzerCode.map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div 
                  onClick={() => setShowAnalyzer(showAnalyzer === i ? null : i)}
                  className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                >
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">{item.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-md text-[10px] font-bold">{item.complexity}</span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform ${showAnalyzer === i ? 'rotate-180' : ''}`} />
                  </div>
                </div>
                <AnimatePresence>
                  {showAnalyzer === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-4">
                        <div className="bg-slate-900 rounded-xl p-4">
                          <pre className="text-xs font-mono text-slate-300">{item.code}</pre>
                        </div>
                        <p className="text-xs text-slate-500 italic">👉 {item.explanation}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-[2.5rem] p-10 text-white space-y-6 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-6">🔶 Time vs Space Tradeoff</h2>
            <div className="space-y-6">
              <p className="text-indigo-100 leading-relaxed">
                Sometimes you have to choose between speed and memory. This is called the Time-Space Tradeoff.
              </p>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="font-bold text-white mb-1">Faster algorithm → More memory</p>
                  <p className="text-xs text-indigo-200">Example: Memoization in Dynamic Programming.</p>
                </div>
                <div className="p-4 bg-white/10 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="font-bold text-white mb-1">Less memory → Slower algorithm</p>
                  <p className="text-xs text-indigo-200">Example: Iterative vs Recursive solutions.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Final Comparison Table */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">🔷 Final Comparison Table</h2>
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm">
          <table className="w-full text-left text-sm bg-white dark:bg-slate-900">
            <thead className="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Algorithm</th>
                <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Time Complexity</th>
                <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">Space Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { a: "Binary Search", t: "O(log n)", s: "O(1)" },
                { a: "Merge Sort", t: "O(n log n)", s: "O(n)" },
                { a: "Quick Sort", t: "O(n log n)", s: "O(log n)" },
                { a: "Bubble Sort", t: "O(n²)", s: "O(1)" }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{row.a}</td>
                  <td className="px-6 py-4 font-mono text-indigo-600 dark:text-indigo-400">{row.t}</td>
                  <td className="px-6 py-4 font-mono text-emerald-600 dark:text-emerald-400">{row.s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Practice Problems Section */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Target size={24} className="text-indigo-600" /> Practice Problems
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              q: "Find the complexity: A loop runs from 1 to N, and inside it, another loop runs from 1 to 10.",
              hint: "The inner loop is constant (10 iterations).",
              answer: "O(N)",
              icon: Search
            },
            {
              q: "Find the complexity: A loop runs from 1 to N, and inside it, another loop runs from 1 to N.",
              hint: "Both loops depend on N.",
              answer: "O(N²)",
              icon: Grid3X3
            },
            {
              q: "What is the space complexity of a recursive function that goes N levels deep?",
              hint: "Each recursive call adds a frame to the call stack.",
              answer: "O(N)",
              icon: Layers
            },
            {
              q: "Complexity of Binary Search on a sorted array of size N?",
              hint: "The search space is halved in each step.",
              answer: "O(log N)",
              icon: Zap
            }
          ].map((prob, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <prob.icon size={20} />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{prob.q}</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    const hintEl = e.currentTarget.nextElementSibling;
                    if (hintEl) hintEl.classList.toggle('hidden');
                  }}
                  className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Show Hint
                </button>
                <span className="hidden text-[10px] text-slate-500 italic">👉 {prob.hint}</span>
              </div>
              <button 
                onClick={(e) => {
                  const ansEl = e.currentTarget.nextElementSibling;
                  if (ansEl) ansEl.classList.toggle('hidden');
                }}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
              >
                Reveal Answer
              </button>
              <div className="hidden p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-center font-bold text-sm border border-emerald-100 dark:border-emerald-800">
                {prob.answer}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Common Mistakes & Conclusion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-rose-50 dark:bg-rose-900/10 p-10 rounded-[2.5rem] border border-rose-100 dark:border-rose-900/30">
          <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-400 mb-6 flex items-center gap-3">
            <XCircle size={24} /> 🔷 Common Mistakes ❌
          </h2>
          <ul className="space-y-4">
            {[
              "Ignoring nested loops (O(n²))",
              "Not considering the worst-case scenario",
              "Confusing O(n log n) with O(n²)",
              "Ignoring auxiliary space in recursion"
            ].map((mistake, i) => (
              <li key={i} className="flex items-center gap-3 text-rose-800 dark:text-rose-300 font-medium">
                <div className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                {mistake}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-10 rounded-[2.5rem] border border-emerald-100 dark:border-emerald-900/30 flex flex-col justify-center text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-400 mb-4">🎯 Conclusion</h2>
          <div className="space-y-2 text-emerald-800 dark:text-emerald-300 font-medium">
            <p>Time Complexity → Speed</p>
            <p>Space Complexity → Memory</p>
            <p>Big-O helps compare algorithms effectively</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

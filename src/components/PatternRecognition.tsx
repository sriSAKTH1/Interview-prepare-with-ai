import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Brain, 
  ArrowLeftRight, 
  Maximize2, 
  Search, 
  Repeat, 
  Undo2, 
  Coins, 
  Table2,
  Info,
  CheckCircle2,
  ChevronRight,
  Code,
  Lightbulb,
  Zap,
  Target,
  ExternalLink
} from 'lucide-react';

interface PatternRecognitionProps {
  topic: string;
}

type Language = 'python' | 'java' | 'c';

interface CodeBlockProps {
  codes: Record<Language, string>;
  filename: string;
}

function CodeBlock({ codes, filename }: CodeBlockProps) {
  const [lang, setLang] = useState<Language>('python');

  const languages: { id: Language; label: string }[] = [
    { id: 'python', label: 'Python' },
    { id: 'java', label: 'Java' },
    { id: 'c', label: 'C' }
  ];

  return (
    <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20" />
            <div className="w-3 h-3 rounded-full bg-amber-500/20" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
          </div>
          <span className="text-slate-500 font-mono text-xs">{filename}</span>
        </div>
        <div className="flex bg-slate-800 rounded-lg p-1">
          {languages.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all ${
                lang === l.id 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>
      <div className="p-6 text-slate-300 font-mono text-sm overflow-x-auto">
        <pre><code>{codes[lang]}</code></pre>
      </div>
    </div>
  );
}

export function PatternRecognition({ topic }: PatternRecognitionProps) {
  if (topic === 'pattern-recognition') {
    return <PatternOverview />;
  }

  switch (topic) {
    case 'two-pointer':
      return <TwoPointerContent />;
    case 'sliding-window':
      return <SlidingWindowContent />;
    case 'binary-search-pattern':
      return <BinarySearchPatternContent />;
    case 'recursion':
      return <RecursionContent />;
    case 'backtracking':
      return <BacktrackingContent />;
    case 'greedy':
      return <GreedyContent />;
    case 'dynamic-programming':
      return <DynamicProgrammingContent />;
    default:
      return <PatternOverview />;
  }
}

function PatternOverview() {
  const patterns = [
    {
      id: 'two-pointer',
      title: 'Two Pointer',
      icon: ArrowLeftRight,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      description: 'Using two pointers to traverse data from different directions or at different speeds.',
      complexity: 'O(n) Time, O(1) Space'
    },
    {
      id: 'sliding-window',
      title: 'Sliding Window',
      icon: Maximize2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      description: 'Maintaining a window over a portion of data to track a specific property.',
      complexity: 'O(n) Time, O(1) Space'
    },
    {
      id: 'binary-search-pattern',
      title: 'Binary Search',
      icon: Search,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      description: 'Efficiently searching in a sorted space by repeatedly halving the search area.',
      complexity: 'O(log n) Time, O(1) Space'
    },
    {
      id: 'recursion',
      title: 'Recursion',
      icon: Repeat,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      description: 'Solving a problem by breaking it down into smaller sub-problems of the same type.',
      complexity: 'Varies, O(n) Stack Space'
    },
    {
      id: 'backtracking',
      title: 'Backtracking',
      icon: Undo2,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      description: 'Exploring all possible solutions and abandoning paths that don\'t lead to a solution.',
      complexity: 'Exponential Time'
    },
    {
      id: 'greedy',
      title: 'Greedy',
      icon: Coins,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      description: 'Making the locally optimal choice at each step with the hope of finding a global optimum.',
      complexity: 'O(n log n) or O(n)'
    },
    {
      id: 'dynamic-programming',
      title: 'Dynamic Programming',
      icon: Table2,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50',
      description: 'Breaking down problems into overlapping sub-problems and storing their results.',
      complexity: 'O(n*m) Time & Space'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
              <Brain size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Pattern Recognition</h1>
              <p className="text-indigo-100 text-lg">Master the core problem-solving templates of DSA.</p>
            </div>
          </div>
          <p className="max-w-2xl text-indigo-50 leading-relaxed text-lg">
            Most DSA problems follow a set of predictable patterns. Once you recognize the pattern, 
            the solution becomes a matter of applying a standard template.
          </p>
        </div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patterns.map((pattern) => (
          <motion.div
            key={pattern.id}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className={`w-12 h-12 ${pattern.bg} ${pattern.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <pattern.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{pattern.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">
              {pattern.description}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {pattern.complexity}
              </span>
              <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <ChevronRight size={18} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Table2 className="text-indigo-500" size={20} /> Pattern Comparison
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">Pattern</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">Use Case</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100 dark:border-slate-800">Complexity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {[
                { name: 'Two Pointer', use: 'Sorted arrays', comp: 'O(n)' },
                { name: 'Sliding Window', use: 'Subarrays', comp: 'O(n)' },
                { name: 'Binary Search', use: 'Searching', comp: 'O(log n)' },
                { name: 'Recursion', use: 'Divide problems', comp: 'Varies' },
                { name: 'Backtracking', use: 'All combinations', comp: 'O(2ⁿ)' },
                { name: 'Greedy', use: 'Local optimal', comp: 'O(n)' },
                { name: 'Dynamic Programming', use: 'Optimization problems', comp: 'O(n) / more' }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-sm font-bold text-slate-900 dark:text-white">{row.name}</td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">{row.use}</td>
                  <td className="p-4 text-sm font-mono text-indigo-600 dark:text-indigo-400">{row.comp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-8 border border-slate-200 dark:border-slate-800">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <Zap className="text-amber-500" /> Why Patterns Matter?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Speed', desc: 'Identify solutions in seconds during interviews.' },
            { title: 'Confidence', desc: 'No more "blank screen" syndrome when starting.' },
            { title: 'Scalability', desc: 'One pattern can solve hundreds of different problems.' }
          ].map((item, i) => (
            <div key={i} className="space-y-2">
              <h4 className="font-bold text-slate-900 dark:text-white">{item.title}</h4>
              <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TwoPointerContent() {
  const [step, setStep] = useState(0);
  const array = [1, 2, 3, 4, 6, 8, 9];
  const target = 10;
  
  // Animation steps for Two Sum in sorted array
  const steps = [
    { left: 0, right: 6, sum: 10, msg: "Initialize Left at 0, Right at end." },
    { left: 0, right: 6, sum: 10, msg: "1 + 9 = 10. Found it!" }
  ];

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Two Pointer Pattern" 
        icon={ArrowLeftRight} 
        color="text-blue-600"
        description="Using two indices to traverse a data structure, typically from both ends towards the middle or at different speeds."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Theory</h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30 mb-4">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2 text-sm">
                  <Brain size={16} /> Idea:
                </h4>
                <p className="text-sm">Use two pointers (left & right) to reduce time complexity.</p>
              </div>
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2 text-sm">
                  <Lightbulb size={16} /> When to Use:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Sorted arrays</li>
                  <li>Pair problems</li>
                </ul>
              </div>
            </div>
          </div>

          <CodeBlock 
            filename="two_sum_sorted"
            codes={{
              python: `def two_sum_sorted(arr, target):
    left, right = 0, len(arr)-1
    while left < right:
        s = arr[left] + arr[right]
        if s == target:
            return [left, right]
        elif s < target:
            left += 1
        else:
            right -= 1`,
              java: `public int[] twoSumSorted(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) {
            return new int[]{left, right};
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return new int[]{-1, -1};
}`,
              c: `int* twoSumSorted(int* arr, int size, int target) {
    int left = 0, right = size - 1;
    static int res[2];
    while (left < right) {
        int sum = arr[left] + arr[right];
        if (sum == target) {
            res[0] = left; res[1] = right;
            return res;
        } else if (sum < target) {
            left++;
        } else {
            right--;
        }
    }
    return NULL;
}`
            }}
          />

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target size={20} className="text-indigo-500" /> LeetCode Problems
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <ProblemLink name="Two Sum II" />
              <ProblemLink name="Container With Most Water" />
              <ProblemLink name="3Sum" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Animation: Two Sum</h3>
            <div className="flex flex-col items-center gap-8">
              <div className="flex gap-2">
                {array.map((val, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      backgroundColor: i === steps[step].left || i === steps[step].right ? '#4f46e5' : '#f1f5f9',
                      color: i === steps[step].left || i === steps[step].right ? '#ffffff' : '#64748b',
                      scale: i === steps[step].left || i === steps[step].right ? 1.1 : 1
                    }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg relative"
                  >
                    {val}
                    {i === steps[step].left && (
                      <motion.div layoutId="left-ptr" className="absolute -top-8 text-blue-600 font-black text-xs">LEFT</motion.div>
                    )}
                    {i === steps[step].right && (
                      <motion.div layoutId="right-ptr" className="absolute -top-8 text-rose-600 font-black text-xs">RIGHT</motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl w-full text-center">
                <p className="text-slate-600 dark:text-slate-400 font-medium">{steps[step].msg}</p>
                <p className="text-indigo-600 font-bold mt-1">Sum: {array[steps[step].left]} + {array[steps[step].right]} = {array[steps[step].left] + array[steps[step].right]}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(0)}
                  className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setStep(prev => Math.min(steps.length - 1, prev + 1))}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800/30">
            <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-2">
              <Target size={18} /> Pro Tip
            </h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-400 leading-relaxed">
              If the array is NOT sorted, you can\'t use the Two Pointer approach for Two Sum. 
              In that case, use a Hash Map to achieve O(n) time complexity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SlidingWindowContent() {
  const [step, setStep] = useState(0);
  const array = [2, 1, 5, 1, 3, 2];
  const k = 3;
  
  const steps = [
    { start: 0, end: 2, sum: 8, msg: "Initial window of size 3. Sum = 2+1+5 = 8" },
    { start: 1, end: 3, sum: 7, msg: "Slide right: subtract 2, add 1. Sum = 8-2+1 = 7" },
    { start: 2, end: 4, sum: 9, msg: "Slide right: subtract 1, add 3. Sum = 7-1+3 = 9" },
    { start: 3, end: 5, sum: 6, msg: "Slide right: subtract 5, add 2. Sum = 9-5+2 = 6" }
  ];

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Sliding Window Pattern" 
        icon={Maximize2} 
        color="text-emerald-600"
        description="Maintaining a sub-array or sub-string window that slides over the data to solve problems involving contiguous sequences."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Theory</h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/30 mb-4">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-2 flex items-center gap-2 text-sm">
                  <Brain size={16} /> Idea:
                </h4>
                <p className="text-sm">Maintain a window (range) and slide it across array/string.</p>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl border border-teal-100 dark:border-teal-800/30">
                <h4 className="font-bold text-teal-900 dark:text-teal-300 mb-2 flex items-center gap-2 text-sm">
                  <Lightbulb size={16} /> When to Use:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Subarray / substring problems</li>
                  <li>Fixed or variable window size</li>
                </ul>
              </div>
            </div>
          </div>

          <CodeBlock 
            filename="max_sum_subarray"
            codes={{
              python: `def max_sum_subarray(arr, k):
    window_sum = sum(arr[:k])
    max_sum = window_sum

    for i in range(k, len(arr)):
        window_sum += arr[i] - arr[i-k]
        max_sum = max(max_sum, window_sum)

    return max_sum`,
              java: `public int maxSumSubarray(int[] arr, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;

    for (int i = k; i < arr.length; i++) {
        windowSum += arr[i] - arr[i - k];
        maxSum = Math.max(maxSum, windowSum);
    }
    return maxSum;
}`,
              c: `int maxSumSubarray(int* arr, int size, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += arr[i];
    int maxSum = windowSum;

    for (int i = k; i < size; i++) {
        windowSum += arr[i] - arr[i - k];
        if (windowSum > maxSum) maxSum = windowSum;
    }
    return maxSum;
}`
            }}
          />

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target size={20} className="text-emerald-500" /> LeetCode Problems
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <ProblemLink name="Maximum Subarray" />
              <ProblemLink name="Longest Substring Without Repeating Characters" />
              <ProblemLink name="Minimum Window Substring" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Animation: Max Sum Subarray (k=3)</h3>
            <div className="flex flex-col items-center gap-8">
              <div className="flex gap-2 relative p-4">
                {array.map((val, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-600 dark:text-slate-400"
                  >
                    {val}
                  </div>
                ))}
                <motion.div
                  animate={{
                    x: steps[step].start * 56, // 48px width + 8px gap
                    width: k * 56 - 8
                  }}
                  className="absolute top-3 bottom-3 border-4 border-emerald-500 rounded-2xl pointer-events-none"
                />
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl w-full text-center">
                <p className="text-slate-600 dark:text-slate-400 font-medium">{steps[step].msg}</p>
                <p className="text-emerald-600 font-bold mt-1 text-xl">Current Sum: {steps[step].sum}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(0)}
                  className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setStep(prev => Math.min(steps.length - 1, prev + 1))}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BinarySearchPatternContent() {
  const [step, setStep] = useState(0);
  const array = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
  const target = 14;
  
  const steps = [
    { low: 0, high: 9, mid: 4, msg: "Initial range: [0, 9]. Mid = 4 (val: 10). 10 < 14, search right." },
    { low: 5, high: 9, mid: 7, msg: "Range: [5, 9]. Mid = 7 (val: 16). 16 > 14, search left." },
    { low: 5, high: 6, mid: 5, msg: "Range: [5, 6]. Mid = 5 (val: 12). 12 < 14, search right." },
    { low: 6, high: 6, mid: 6, msg: "Range: [6, 6]. Mid = 6 (val: 14). Found target!" }
  ];

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Binary Search Pattern" 
        icon={Search} 
        color="text-indigo-600"
        description="Efficiently searching in a sorted search space by repeatedly dividing the search interval in half."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Theory</h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/30 mb-4">
                <h4 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2 flex items-center gap-2 text-sm">
                  <Brain size={16} /> Idea:
                </h4>
                <p className="text-sm">Divide the search space into halves.</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/30">
                <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2 text-sm">
                  <Lightbulb size={16} /> When to Use:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Sorted arrays</li>
                  <li>Search problems</li>
                </ul>
              </div>
            </div>
          </div>

          <CodeBlock 
            filename="binary_search"
            codes={{
              python: `def binary_search(arr, target):
    left, right = 0, len(arr)-1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
              java: `public int binarySearch(int[] arr, int target) {
    int left = 0, right = arr.length - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`,
              c: `int binarySearch(int* arr, int size, int target) {
    int left = 0, right = size - 1;
    while (left <= right) {
        int mid = left + (right - left) / 2;
        if (arr[mid] == target) return mid;
        if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}`
            }}
          />

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target size={20} className="text-indigo-500" /> LeetCode Problems
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <ProblemLink name="Binary Search" />
              <ProblemLink name="Search in Rotated Sorted Array" />
              <ProblemLink name="First Bad Version" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Animation: Finding {target}</h3>
            <div className="flex flex-col items-center gap-8">
              <div className="grid grid-cols-5 gap-2">
                {array.map((val, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      opacity: i >= steps[step].low && i <= steps[step].high ? 1 : 0.3,
                      backgroundColor: i === steps[step].mid ? '#4f46e5' : '#f1f5f9',
                      color: i === steps[step].mid ? '#ffffff' : '#64748b',
                      scale: i === steps[step].mid ? 1.1 : 1
                    }}
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg relative"
                  >
                    {val}
                    {i === steps[step].mid && (
                      <div className="absolute -bottom-6 text-[10px] font-black text-indigo-600">MID</div>
                    )}
                  </motion.div>
                ))}
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl w-full text-center">
                <p className="text-slate-600 dark:text-slate-400 font-medium">{steps[step].msg}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(0)}
                  className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setStep(prev => Math.min(steps.length - 1, prev + 1))}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecursionContent() {
  const [n, setN] = useState(3);
  
  const getFib = (num: number): number => {
    if (num <= 1) return num;
    return getFib(num - 1) + getFib(num - 2);
  };

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Recursion Pattern" 
        icon={Repeat} 
        color="text-purple-600"
        description="A method where the solution to a problem depends on solutions to smaller instances of the same problem."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Theory</h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800/30 mb-4">
                <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2 text-sm">
                  <Brain size={16} /> Idea:
                </h4>
                <p className="text-sm">Function calls itself to solve smaller problems.</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">1</div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Base Case:</span> The condition that stops the recursion.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">2</div>
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Recursive Step:</span> The part where the function calls itself with a smaller input.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <CodeBlock 
            filename="factorial"
            codes={{
              python: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n-1)`,
              java: `public int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}`,
              c: `int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n - 1);
}`
            }}
          />

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target size={20} className="text-purple-500" /> LeetCode Problems
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <ProblemLink name="Fibonacci Number" />
              <ProblemLink name="Power of Two" />
              <ProblemLink name="Climbing Stairs" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Visualizing Fibonacci Tree</h3>
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-bold text-slate-600">n = {n}</span>
                <input 
                  type="range" min="1" max="5" value={n} 
                  onChange={(e) => setN(parseInt(e.target.value))}
                  className="w-32 accent-purple-600"
                />
              </div>
              
              <div className="relative w-full h-64 flex justify-center">
                <RecursiveTree n={n} />
              </div>

              <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800/30 w-full text-center">
                <p className="text-purple-900 dark:text-purple-300 font-bold">Result: fib({n}) = {getFib(n)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecursiveTree({ n, level = 0 }: { n: number, level?: number }) {
  if (n <= 1) {
    return (
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500"
      >
        {n}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-lg"
      >
        {n}
      </motion.div>
      <div className="flex gap-8">
        <RecursiveTree n={n - 1} level={level + 1} />
        <RecursiveTree n={n - 2} level={level + 1} />
      </div>
    </div>
  );
}

function BacktrackingContent() {
  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Backtracking Pattern" 
        icon={Undo2} 
        color="text-rose-600"
        description="A refined brute-force approach that tries all possibilities but abandons a path as soon as it determines it can't lead to a solution."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Theory</h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-2xl border border-rose-100 dark:border-rose-800/30 mb-4">
                <h4 className="font-bold text-rose-900 dark:text-rose-300 mb-2 flex items-center gap-2 text-sm">
                  <Brain size={16} /> Idea:
                </h4>
                <p className="text-sm">Try all possibilities and backtrack when wrong.</p>
              </div>
              <div className="bg-pink-50 dark:bg-pink-900/20 p-4 rounded-2xl border border-pink-100 dark:border-pink-800/30">
                <h4 className="font-bold text-pink-900 dark:text-pink-300 mb-2 flex items-center gap-2 text-sm">
                  <Lightbulb size={16} /> When to Use:
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Combinations & Permutations</li>
                  <li>Constraints problems</li>
                </ul>
              </div>
            </div>
          </div>

          <CodeBlock 
            filename="subsets"
            codes={{
              python: `def subsets(nums):
    result = []

    def backtrack(start, path):
        result.append(path)
        for i in range(start, len(nums)):
            backtrack(i+1, path + [nums[i]])

    backtrack(0, [])
    return result`,
              java: `public List<List<Integer>> subsets(int[] nums) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(result, new ArrayList<>(), nums, 0);
    return result;
}

private void backtrack(List<List<Integer>> res, List<Integer> path, int[] nums, int start) {
    res.add(new ArrayList<>(path));
    for (int i = start; i < nums.length; i++) {
        path.add(nums[i]);
        backtrack(res, path, nums, i + 1);
        path.remove(path.size() - 1);
    }
}`,
              c: `// C implementation involves dynamic allocation and recursion
void backtrack(int** res, int* resSize, int** colSizes, int* path, int pathSize, int* nums, int numsSize, int start) {
    res[*resSize] = malloc(pathSize * sizeof(int));
    memcpy(res[*resSize], path, pathSize * sizeof(int));
    (*colSizes)[*resSize] = pathSize;
    (*resSize)++;
    for (int i = start; i < numsSize; i++) {
        path[pathSize] = nums[i];
        backtrack(res, resSize, colSizes, path, pathSize + 1, nums, numsSize, i + 1);
    }
}`
            }}
          />

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target size={20} className="text-rose-500" /> LeetCode Problems
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <ProblemLink name="Subsets" />
              <ProblemLink name="Permutations" />
              <ProblemLink name="N-Queens" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">N-Queens Visualization (4x4)</h3>
            <div className="grid grid-cols-4 gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl w-fit mx-auto">
              {[...Array(16)].map((_, i) => {
                const row = Math.floor(i / 4);
                const col = i % 4;
                const isQueen = (row === 0 && col === 1) || (row === 1 && col === 3) || (row === 2 && col === 0) || (row === 3 && col === 2);
                return (
                  <div 
                    key={i} 
                    className={`w-12 h-12 flex items-center justify-center rounded-md ${
                      (row + col) % 2 === 0 ? 'bg-white dark:bg-slate-700' : 'bg-slate-100 dark:bg-slate-600'
                    }`}
                  >
                    {isQueen && (
                      <motion.div 
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="text-rose-600 font-bold text-2xl"
                      >
                        ♛
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
            <p className="text-center text-sm text-slate-500 mt-4 italic">
              A valid 4-Queens solution found by exploring and backtracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function GreedyContent() {
  const [step, setStep] = useState(0);
  const coins = [25, 10, 5, 1];
  const target = 36;
  
  const steps = [
    { current: 0, picked: [], msg: "Target: 36. Starting with largest coin: 25." },
    { current: 25, picked: [25], msg: "Picked 25. Remaining: 11. Largest coin <= 11 is 10." },
    { current: 35, picked: [25, 10], msg: "Picked 10. Remaining: 1. Largest coin <= 1 is 1." },
    { current: 36, picked: [25, 10, 1], msg: "Picked 1. Remaining: 0. Done!" }
  ];

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Greedy Pattern" 
        icon={Coins} 
        color="text-amber-600"
        description="Making the locally optimal choice at each stage with the intent of finding a global optimum."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Theory</h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-2xl border border-amber-100 dark:border-amber-800/30 mb-4">
                <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2 text-sm">
                  <Brain size={16} /> Idea:
                </h4>
                <p className="text-sm">Choose the best option at each step.</p>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={18} />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Greedy Choice Property:</span> A global optimum can be reached by choosing a local optimum.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-amber-500 shrink-0 mt-1" size={18} />
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">Optimal Substructure:</span> An optimal solution to the problem contains optimal solutions to sub-problems.
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <CodeBlock 
            filename="min_coins"
            codes={{
              python: `def min_coins(coins, amount):
    coins.sort(reverse=True)
    count = 0

    for coin in coins:
        while amount >= coin:
            amount -= coin
            count += 1

    return count`,
              java: `public int minCoins(int[] coins, int amount) {
    Arrays.sort(coins);
    int count = 0;
    for (int i = coins.length - 1; i >= 0; i--) {
        while (amount >= coins[i]) {
            amount -= coins[i];
            count++;
        }
    }
    return count;
}`,
              c: `int minCoins(int* coins, int size, int amount) {
    // Sort coins in descending order first
    int count = 0;
    for (int i = 0; i < size; i++) {
        while (amount >= coins[i]) {
            amount -= coins[i];
            count++;
        }
    }
    return count;
}`
            }}
          />

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target size={20} className="text-amber-500" /> LeetCode Problems
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <ProblemLink name="Assign Cookies" />
              <ProblemLink name="Jump Game" />
              <ProblemLink name="Gas Station" />
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-3xl border border-amber-100 dark:border-amber-800/30">
            <h4 className="font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-2">
              <Info size={18} /> Classic Example: Coin Change
            </h4>
            <p className="text-sm text-amber-700 dark:text-amber-400 leading-relaxed">
              To give change for 36 cents using [25, 10, 5, 1], greedy picks 25, then 10, then 1. 
              This works for US coins, but NOT for all coin systems!
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Animation: Coin Change (36¢)</h3>
            <div className="flex flex-col items-center gap-8">
              <div className="flex gap-4">
                {coins.map((coin) => (
                  <div key={coin} className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-500 flex items-center justify-center font-bold text-amber-600">
                      {coin}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 min-h-[60px] items-center">
                <AnimatePresence>
                  {steps[step].picked.map((coin, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold shadow-lg"
                    >
                      {coin}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl w-full text-center">
                <p className="text-slate-600 dark:text-slate-400 font-medium">{steps[step].msg}</p>
                <p className="text-amber-600 font-bold mt-1">Total: {steps[step].current} / 36</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(0)}
                  className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setStep(prev => Math.min(steps.length - 1, prev + 1))}
                  className="px-6 py-2 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DynamicProgrammingContent() {
  const [step, setStep] = useState(0);
  const fib = [0, 1, 1, 2, 3, 5, 8, 13];
  
  const steps = [
    { idx: 1, msg: "Base cases: dp[0]=0, dp[1]=1" },
    { idx: 2, msg: "dp[2] = dp[1] + dp[0] = 1 + 0 = 1" },
    { idx: 3, msg: "dp[3] = dp[2] + dp[1] = 1 + 1 = 2" },
    { idx: 4, msg: "dp[4] = dp[3] + dp[2] = 2 + 1 = 3" },
    { idx: 5, msg: "dp[5] = dp[4] + dp[3] = 3 + 2 = 5" },
    { idx: 6, msg: "dp[6] = dp[5] + dp[4] = 5 + 3 = 8" },
    { idx: 7, msg: "dp[7] = dp[6] + dp[5] = 8 + 5 = 13" }
  ];

  return (
    <div className="space-y-8">
      <SectionHeader 
        title="Dynamic Programming Pattern" 
        icon={Table2} 
        color="text-cyan-600"
        description="Solving complex problems by breaking them down into simpler sub-problems and storing the results of sub-problems to avoid redundant work."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Theory</h3>
            <div className="space-y-4 text-slate-600 dark:text-slate-400 leading-relaxed">
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-2xl border border-cyan-100 dark:border-cyan-800/30 mb-4">
                <h4 className="font-bold text-cyan-900 dark:text-cyan-300 mb-2 flex items-center gap-2 text-sm">
                  <Brain size={16} /> Idea:
                </h4>
                <p className="text-sm">Store results to avoid recomputation.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-2xl border border-cyan-100 dark:border-cyan-800/30">
                  <h5 className="font-bold text-cyan-900 dark:text-cyan-300 text-sm mb-1">Memoization</h5>
                  <p className="text-xs text-cyan-700 dark:text-cyan-400">Top-Down approach using recursion.</p>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800/30">
                  <h5 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm mb-1">Tabulation</h5>
                  <p className="text-xs text-indigo-700 dark:text-indigo-400">Bottom-Up approach using iteration.</p>
                </div>
              </div>
            </div>
          </div>

          <CodeBlock 
            filename="fibonacci_dp"
            codes={{
              python: `def fibonacci(n):
    dp = [0]*(n+1)
    dp[1] = 1

    for i in range(2, n+1):
        dp[i] = dp[i-1] + dp[i-2]

    return dp[n]`,
              java: `public int fibonacci(int n) {
    if (n <= 1) return n;
    int[] dp = new int[n + 1];
    dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`,
              c: `int fibonacci(int n) {
    if (n <= 1) return n;
    int dp[n + 1];
    dp[0] = 0; dp[1] = 1;
    for (int i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
    }
    return dp[n];
}`
            }}
          />

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Target size={20} className="text-cyan-500" /> LeetCode Problems
            </h3>
            <div className="grid grid-cols-1 gap-3">
              <ProblemLink name="Climbing Stairs" />
              <ProblemLink name="House Robber" />
              <ProblemLink name="Longest Increasing Subsequence" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Animation: Tabulation (Fibonacci)</h3>
            <div className="flex flex-col items-center gap-8">
              <div className="flex flex-wrap gap-2 justify-center">
                {fib.map((val, i) => (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <motion.div
                      animate={{
                        backgroundColor: i <= steps[step].idx ? '#0891b2' : '#f1f5f9',
                        color: i <= steps[step].idx ? '#ffffff' : '#64748b',
                        scale: i === steps[step].idx ? 1.1 : 1,
                        opacity: i <= steps[step].idx ? 1 : 0.3
                      }}
                      className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm"
                    >
                      {i <= steps[step].idx ? val : '?'}
                    </motion.div>
                    <span className="text-[10px] font-bold text-slate-400">dp[{i}]</span>
                  </div>
                ))}
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl w-full text-center">
                <p className="text-slate-600 dark:text-slate-400 font-medium">{steps[step].msg}</p>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(0)}
                  className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Reset
                </button>
                <button 
                  onClick={() => setStep(prev => Math.min(steps.length - 1, prev + 1))}
                  className="px-6 py-2 bg-cyan-600 text-white rounded-xl font-bold hover:bg-cyan-700 shadow-lg shadow-cyan-200 transition-all"
                >
                  Next Step
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProblemLink({ name }: { name: string }) {
  const searchUrl = `https://www.google.com/search?q=leetcode+${name.replace(/\s+/g, '+')}`;
  return (
    <a 
      href={searchUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all group"
    >
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{name}</span>
      <ExternalLink size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
    </a>
  );
}

function SectionHeader({ title, icon: Icon, color, description }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${color}`}>
          <Icon size={24} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{title}</h2>
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl leading-relaxed">
        {description}
      </p>
    </div>
  );
}

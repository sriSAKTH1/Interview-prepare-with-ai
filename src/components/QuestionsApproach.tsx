import { motion } from 'motion/react';
import { 
  Search, 
  Brain, 
  Zap, 
  Database, 
  GitBranch, 
  Code, 
  Activity, 
  Clock, 
  Rocket, 
  Trophy, 
  Target, 
  Lightbulb 
} from 'lucide-react';

export function QuestionsApproach() {
  const steps = [
    {
      icon: Search,
      title: "1. Understand the Problem",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">👉 Ask:</h4>
            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 ml-2">
              <li>What is the input?</li>
              <li>What is the output?</li>
              <li>Any constraints?</li>
            </ul>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-xs uppercase tracking-widest opacity-50">👉 Example</h4>
            <div className="text-sm space-y-1">
              <p className="text-slate-600 dark:text-slate-400"><span className="font-bold">Input:</span> [2,7,11,15], Target = 9</p>
              <p className="text-slate-600 dark:text-slate-400"><span className="font-bold">Output:</span> [0,1]</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Brain,
      title: "2. Brute Force Approach",
      color: "text-rose-600",
      bg: "bg-rose-50",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">👉 Idea:</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">Solve the problem in the simplest way first.</p>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Example (Two Sum)</span>
            </div>
            <pre className="text-[10px] font-mono text-rose-300 leading-relaxed overflow-x-auto">
{`def two_sum(nums, target):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]`}
            </pre>
          </div>
          <p className="text-xs font-bold text-rose-600 dark:text-rose-400">Complexity: Time O(n²)</p>
        </div>
      )
    },
    {
      icon: Zap,
      title: "3. Optimize the Solution",
      color: "text-amber-600",
      bg: "bg-amber-50",
      content: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">👉 Think:</h4>
            <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1 ml-2">
              <li>Can we reduce time complexity?</li>
              <li>Use a better data structure?</li>
            </ul>
          </div>
          <div className="bg-slate-900 rounded-xl p-4 overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Optimized (HashMap)</span>
            </div>
            <pre className="text-[10px] font-mono text-amber-300 leading-relaxed overflow-x-auto">
{`def two_sum(nums, target):
    d = {}
    for i, num in enumerate(nums):
        if target - num in d:
            return [d[target - num], i]
        d[num] = i`}
            </pre>
          </div>
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400">Complexity: Time O(n)</p>
        </div>
      )
    },
    {
      icon: Database,
      title: "4. Choose Right Data Structure",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      content: (
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">👉 Common Choices:</h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { name: "Array", use: "Index-based" },
              { name: "HashMap", use: "Fast lookup" },
              { name: "Stack", use: "LIFO" },
              { name: "Queue", use: "BFS" },
              { name: "Tree", use: "Hierarchy" },
              { name: "Graph", use: "Networks" }
            ].map(ds => (
              <div key={ds.name} className="p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700">
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{ds.name}</p>
                <p className="text-[10px] text-slate-500">→ {ds.use}</p>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      icon: GitBranch,
      title: "5. Identify Pattern",
      color: "text-blue-600",
      bg: "bg-blue-50",
      content: (
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">👉 Common Patterns:</h4>
          <div className="flex flex-wrap gap-2">
            {["Two Pointer", "Sliding Window", "Binary Search", "Recursion", "Backtracking", "Greedy", "Dynamic Programming"].map(p => (
              <span key={p} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md text-[10px] font-bold">{p}</span>
            ))}
          </div>
        </div>
      )
    },
    {
      icon: Code,
      title: "6. Write Clean Code",
      color: "text-violet-600",
      bg: "bg-violet-50",
      content: (
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">👉 Tips:</h4>
          <ul className="space-y-2">
            {[
              "Use meaningful variable names",
              "Keep code simple",
              "Follow structure"
            ].map((tip, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="w-1.5 h-1.5 bg-violet-400 rounded-full" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      icon: Activity,
      title: "7. Dry Run (Very Important 🔥)",
      color: "text-orange-600",
      bg: "bg-orange-50",
      content: (
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">👉 Manually test:</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Small inputs</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Edge cases</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 italic">Example: Empty array, Single element</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Clock,
      title: "8. Analyze Complexity",
      color: "text-cyan-600",
      bg: "bg-cyan-50",
      content: (
        <div className="space-y-4">
          <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">👉 Check:</h4>
          <div className="space-y-3">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-cyan-600">Time Complexity</p>
              <p className="text-[10px] text-slate-500">→ Fast or slow?</p>
            </div>
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
              <p className="text-xs font-bold text-cyan-600">Space Complexity</p>
              <p className="text-[10px] text-slate-500">→ Memory usage</p>
            </div>
          </div>
        </div>
      )
    },
    {
      icon: Rocket,
      title: "9. Optimize Further",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      content: (
        <div className="space-y-4">
          <ul className="space-y-2">
            {[
              "Reduce loops",
              "Avoid extra space",
              "Use better algorithms"
            ].map((opt, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full" />
                {opt}
              </li>
            ))}
          </ul>
        </div>
      )
    },
    {
      icon: Trophy,
      title: "10. Practice & Repeat",
      color: "text-yellow-600",
      bg: "bg-yellow-50",
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            👉 The more problems you solve, the better you get.
          </p>
          <div className="p-4 bg-yellow-100/50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-900/50">
            <p className="text-xs font-bold text-yellow-700 dark:text-yellow-400 text-center">Consistency is key! 🚀</p>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-20"
    >
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold uppercase tracking-widest">
          <Target size={14} /> Problem Solving Guide
        </div>
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">How to Approach DSA Questions</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg max-w-3xl">
          A systematic 10-step framework to tackle any coding problem, from understanding requirements to delivering an optimized solution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all flex flex-col"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-12 h-12 ${step.bg} dark:bg-slate-800 ${step.color} rounded-2xl flex items-center justify-center shrink-0`}>
                <step.icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
            </div>
            <div className="flex-1">
              {step.content}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-slate-900 dark:bg-indigo-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden">
        <div className="relative z-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
              <Lightbulb size={20} className="text-amber-400" />
            </div>
            <h2 className="text-2xl font-bold">Pro Interview Tips</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-300">Think Aloud</h4>
              <p className="text-slate-400 text-sm">Always communicate your thought process. Interviewers are more interested in HOW you think than just the final code.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-300">Don't Jump to Code</h4>
              <p className="text-slate-400 text-sm">Wait until the interviewer agrees with your logic. Coding a wrong approach is a waste of time.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-300">Handle Constraints</h4>
              <p className="text-slate-400 text-sm">If N is 10^5, an O(N^2) solution will likely TLE. Aim for O(N log N) or O(N).</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-bold text-indigo-300">Test Your Code</h4>
              <p className="text-slate-400 text-sm">Before saying "I'm done", manually trace your code with a small example to find bugs.</p>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
      </div>
    </motion.div>
  );
}

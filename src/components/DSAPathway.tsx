import React from 'react';
import { motion } from 'motion/react';
import { Zap, Target, BookOpen, Code2, Award, Star, ChevronRight, Layout, Cpu } from 'lucide-react';

export function DSAPathway() {
  const sections = [
    {
      title: "PRE-REQUISITES",
      icon: <Zap className="text-amber-500" />,
      items: [
        "Master Time and Space Complexity. It is the language of efficiency.",
        "Java or Python basics are your tools. Choose one and master it."
      ]
    },
    {
      title: "OUR MASTERY FORMULA",
      icon: <Target className="text-red-500" />,
      items: [
        "Introduce the structure",
        "Visualize with diagrams",
        "Solve typical problems",
        "Know when to use it",
        "Understand why it works best",
        "Analyze Time and Space",
        "Code sample problems",
        "Practice with extra references"
      ]
    },
    {
      title: "MONTH 1 FOUNDATION BASICS",
      icon: <Layout className="text-blue-500" />,
      items: [
        "Week 1 Arrays manipulation traversal and problems. The building blocks of memory.",
        "Week 2 Strings manipulation pattern matching and algorithms. Text processing mastery.",
        "Week 3 Hashing and Matrix hash tables collisions and 2D problems. Constant time lookups are magic.",
        "Week 4 Sorting and Two Pointers sorting algorithms and 2 pointer use cases. Efficiency starts here.",
        "Pro Tip Two pointers can often turn an O N squared solution into O N Always look for it in sorted arrays"
      ]
    },
    {
      title: "MONTH 2 CORE DATA STRUCTURES",
      icon: <BookOpen className="text-emerald-500" />,
      items: [
        "Week 5 Binary Search variations and mastery. Divide and conquer your way to O log N",
        "Week 6 Stacks and Queues LIFO FIFO and real world applications",
        "Week 7 Linked Lists operations and problems. Master pointers and references",
        "Week 8 Recursion and Backtracking recursive thinking and backtracking",
        "Fun Fact Recursion is just a stack under the hood If you understand Stacks you understand Recursion"
      ]
    },
    {
      title: "MONTH 3 ADVANCED DATA STRUCTURES",
      icon: <Award className="text-purple-500" />,
      subtitle: "Get ready for big tech interviews at Google Meta and Amazon",
      items: [
        "Week 9 Heap priority queues and heap algorithms. Top K elements made easy",
        "Week 10 Sliding Window efficient substring and subarray problems",
        "Week 11 Trees Theory binary trees traversals and properties",
        "Week 12 Trees Problems advanced tree problems",
        "Interview Insight 80 percent of Tree problems can be solved using simple DFS or BFS Master the traversals"
      ]
    },
    {
      title: "MONTH 4 GRAPHS AND DYNAMIC PROGRAMMING",
      icon: <Cpu className="text-indigo-500" />,
      items: [
        "Week 13 Graphs Theory and Problems representation and basic algorithms",
        "Week 14 Advanced Graph Problems real world network applications",
        "Week 15 DP Basics and Theory introduction to dynamic programming",
        "Week 16 Advanced DP Problems optimization and intense practice",
        "Pro Tip DP is just Recursion plus Memoization Do not be afraid of it"
      ]
    },
    {
      title: "MONTH 5 ADVANCED TOPICS AND DESIGN",
      icon: <Star className="text-pink-500" />,
      items: [
        "Week 17 Trie and System Design introduction",
        "Week 18 Design Problems advanced architectural thinking",
        "Week 19 Bit Manipulation bitwise operations The fastest way to compute",
        "Week 20 Math mathematical algorithms and number theory"
      ]
    },
    {
      title: "MONTH 6 FAMOUS NAMED ALGORITHMS",
      icon: <Award className="text-yellow-500" />,
      subtitle: "For those tricky high level interviews",
      items: [
        "Master Dijkstra Floyd Warshall Kruskal and Prim",
        "Deep dive into implementation and optimization",
        "Interesting Fact Most complex systems like Google Maps or Social Networks are just massive combinations of these fundamental algorithms"
      ]
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-12 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-4xl font-black tracking-tighter dark:text-white">DSA PATHWAY</h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Your comprehensive 6-month roadmap to mastering Data Structures and Algorithms.
        </p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {sections.map((section, idx) => (
          <motion.div 
            key={idx}
            variants={item}
            className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-800 pb-8 last:pb-0"
          >
            <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm">
              {section.icon}
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                  {section.title}
                </h2>
                {section.subtitle && (
                  <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium italic mt-1">
                    {section.subtitle}
                  </p>
                )}
              </div>

              <div className="grid gap-3">
                {section.items.map((text, i) => {
                  const isTip = text.startsWith('Pro Tip') || text.startsWith('Fun Fact') || text.startsWith('Interview Insight') || text.startsWith('Interesting Fact');
                  
                  return (
                    <motion.div 
                      key={i}
                      whileHover={{ x: 5 }}
                      className={`p-4 rounded-2xl border transition-all ${
                        isTip 
                          ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800/50 italic text-indigo-700 dark:text-indigo-300' 
                          : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md dark:text-slate-300'
                      }`}
                    >
                      <div className="flex gap-3">
                        {!isTip && <ChevronRight size={18} className="text-slate-400 shrink-0 mt-0.5" />}
                        <p className="text-sm leading-relaxed">{text}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

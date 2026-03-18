import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Pseudocode } from './Pseudocode';
import { 
  Settings, 
  RefreshCw, 
  Search, 
  Play, 
  Pause, 
  RotateCcw, 
  Code2,
  Info,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Type,
  ArrowRightLeft,
  ScanSearch,
  History
} from 'lucide-react';

export function StringVisualizer() {
  const [str, setStr] = useState<string>('HELLO');
  const [inputValue, setInputValue] = useState<string>('HELLO');
  const [opValue, setOpValue] = useState<string>('');
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([]);
  const [message, setMessage] = useState<string>('A string is a sequence of characters. In many languages, strings are immutable, meaning they cannot be changed after creation.');
  const [isVisualizing, setIsVisualizing] = useState(false);
  const [speed, setSpeed] = useState(600);
  const [showPseudocode, setShowPseudocode] = useState(false);
  const [viewMode, setViewMode] = useState<'animation' | 'theory'>('animation');

  const handleSetString = () => {
    if (!inputValue.trim()) {
      setMessage('Please enter a valid string.');
      return;
    }
    setStr(inputValue.toUpperCase());
    setHighlightedIndices([]);
    setMessage(`String set to: "${inputValue.toUpperCase()}"`);
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleReverse = async () => {
    setIsVisualizing(true);
    setMessage('Reversing string using two pointers...');
    let chars = str.split('');
    let left = 0;
    let right = chars.length - 1;

    while (left < right) {
      setHighlightedIndices([left, right]);
      setMessage(`Swapping characters at index ${left} and ${right}...`);
      await sleep(speed);

      // Swap
      [chars[left], chars[right]] = [chars[right], chars[left]];
      setStr(chars.join(''));
      
      await sleep(speed);
      left++;
      right--;
    }

    setHighlightedIndices([]);
    setMessage('String reversal complete!');
    setIsVisualizing(false);
  };

  const handlePalindromeCheck = async () => {
    setIsVisualizing(true);
    setMessage('Checking if string is a palindrome...');
    let chars = str.split('');
    let left = 0;
    let right = chars.length - 1;
    let isPalindrome = true;

    while (left < right) {
      setHighlightedIndices([left, right]);
      setMessage(`Comparing characters at index ${left} and ${right}...`);
      await sleep(speed);

      if (chars[left] !== chars[right]) {
        setMessage(`Characters don't match! Not a palindrome.`);
        isPalindrome = false;
        break;
      }
      
      left++;
      right--;
    }

    if (isPalindrome) {
      setMessage(`All characters matched! "${str}" is a palindrome.`);
    }
    
    await sleep(speed);
    setHighlightedIndices([]);
    setIsVisualizing(false);
  };

  const handleAnagramCheck = async () => {
    if (!opValue) {
      setMessage('Enter a second string in the search box to check for anagram.');
      return;
    }

    setIsVisualizing(true);
    const s1 = str.toUpperCase().replace(/\s/g, '');
    const s2 = opValue.toUpperCase().replace(/\s/g, '');

    setMessage(`Checking if "${str}" and "${opValue}" are anagrams...`);
    await sleep(speed);

    if (s1.length !== s2.length) {
      setMessage(`Lengths differ! Not anagrams.`);
      setIsVisualizing(false);
      return;
    }

    setMessage('Sorting both strings and comparing...');
    const sorted1 = s1.split('').sort();
    const sorted2 = s2.split('').sort();

    for (let i = 0; i < sorted1.length; i++) {
      setHighlightedIndices([i]);
      setMessage(`Comparing sorted characters: ${sorted1[i]} vs ${sorted2[i]}`);
      await sleep(speed);
      if (sorted1[i] !== sorted2[i]) {
        setMessage(`Characters don't match! Not anagrams.`);
        setHighlightedIndices([]);
        setIsVisualizing(false);
        return;
      }
    }

    setMessage(`All characters matched! They are anagrams.`);
    setHighlightedIndices([]);
    setIsVisualizing(false);
  };

  const handleCompression = async () => {
    setIsVisualizing(true);
    setMessage('Compressing string (Run-length encoding)...');
    let result = '';
    let count = 1;
    let chars = str.split('');

    for (let i = 0; i < chars.length; i++) {
      setHighlightedIndices([i]);
      setMessage(`Processing character: ${chars[i]}`);
      await sleep(speed);

      if (i + 1 < chars.length && chars[i] === chars[i + 1]) {
        count++;
        setMessage(`Found duplicate! Count for ${chars[i]} is now ${count}`);
      } else {
        result += chars[i] + count;
        setMessage(`End of run. Added ${chars[i]}${count} to result.`);
        count = 1;
      }
      await sleep(speed);
    }

    setMessage(`Compression complete: ${result}`);
    setHighlightedIndices([]);
    setIsVisualizing(false);
  };

  const handleSearch = async () => {
    if (!opValue) {
      setMessage('Enter a character or substring to search.');
      return;
    }

    setIsVisualizing(true);
    const pattern = opValue.toUpperCase();
    setMessage(`Searching for "${pattern}"...`);
    
    let found = false;
    for (let i = 0; i <= str.length - pattern.length; i++) {
      const currentIndices = Array.from({ length: pattern.length }, (_, k) => i + k);
      setHighlightedIndices(currentIndices);
      setMessage(`Checking substring starting at index ${i}...`);
      await sleep(speed);

      if (str.substring(i, i + pattern.length) === pattern) {
        setMessage(`Found "${pattern}" starting at index ${i}!`);
        found = true;
        break;
      }
    }

    if (!found) {
      setMessage(`"${pattern}" not found in the string.`);
      setHighlightedIndices([]);
    }
    setIsVisualizing(false);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="bg-white px-8 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Type size={20} />
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 uppercase tracking-tight">String</h2>
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
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Access</span>
              <span className="text-xs font-bold text-emerald-600">O(1)</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search</span>
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
          {/* Configuration */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
              <Settings size={14} />
              Configuration
            </div>
            <div className="space-y-3">
              <input 
                type="text" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter string..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-mono"
              />
              <button 
                onClick={handleSetString}
                disabled={isVisualizing}
                className="w-full py-3 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-100"
              >
                Set String
              </button>
            </div>
          </section>

          {/* Operations */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
              <RefreshCw size={14} />
              Operations
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Search Pattern</label>
                <input 
                  type="text" 
                  value={opValue}
                  onChange={(e) => setOpValue(e.target.value)}
                  placeholder="e.g. LL"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                />
              </div>
              <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={handleReverse}
                  disabled={isVisualizing}
                  className="flex items-center justify-center gap-2 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                >
                  <ArrowRightLeft size={14} />
                  Reverse String
                </button>
                <button 
                  onClick={handlePalindromeCheck}
                  disabled={isVisualizing}
                  className="flex items-center justify-center gap-2 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
                >
                  <ScanSearch size={14} />
                  Palindrome Check
                </button>
                <button 
                  onClick={handleAnagramCheck}
                  disabled={isVisualizing}
                  className="flex items-center justify-center gap-2 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-all disabled:opacity-50"
                >
                  <ArrowRightLeft size={14} />
                  Anagram Check
                </button>
                <button 
                  onClick={handleCompression}
                  disabled={isVisualizing}
                  className="flex items-center justify-center gap-2 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-all disabled:opacity-50"
                >
                  <RefreshCw size={14} />
                  String Compression
                </button>
                <button 
                  onClick={handleSearch}
                  disabled={isVisualizing}
                  className="flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold hover:bg-emerald-100 transition-all disabled:opacity-50"
                >
                  <Search size={14} />
                  Search Substring
                </button>
              </div>
            </div>
          </section>

          {/* Playback */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-widest opacity-50">
              <Play size={14} />
              Playback
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><RotateCcw size={20} /></button>
                <button className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center shadow-sm"><Pause size={24} /></button>
                <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors"><ChevronRight size={20} /></button>
              </div>
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
        <div className="flex-1 p-12 flex flex-col items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div 
              key="viz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full flex flex-col items-center"
            >
              <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 flex items-center justify-center gap-4 min-h-[240px] w-full max-w-4xl overflow-x-auto">
                {str.split('').map((char, idx) => (
                  <motion.div 
                    key={`${idx}-${char}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: 1, 
                      scale: highlightedIndices.includes(idx) ? 1.1 : 1,
                      borderColor: highlightedIndices.includes(idx) ? '#10b981' : '#e2e8f0',
                      backgroundColor: highlightedIndices.includes(idx) ? '#ecfdf5' : '#ffffff',
                      y: highlightedIndices.includes(idx) ? -10 : 0
                    }}
                    className="relative flex flex-col items-center shrink-0"
                  >
                    <div className={`w-16 h-20 border-2 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all shadow-sm ${highlightedIndices.includes(idx) ? 'text-emerald-600' : 'text-slate-700'}`}>
                      {char}
                    </div>
                    <span className="absolute -bottom-8 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{idx}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-24 text-center max-w-xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4">
                  <History size={12} />
                  Status Log
                </div>
                <p className="text-slate-600 text-lg font-medium leading-relaxed">
                  {message}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Sidebar - Pseudocode (Toggled) */}
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
                      <Code2 size={24} />
                      <h3 className="text-xl font-bold">Logic & Algorithms</h3>
                    </div>
                    <button onClick={() => setShowPseudocode(false)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                      <ChevronRight size={20} />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Reverse String</h4>
                      <Pseudocode 
                        code={`left = 0\nright = length - 1\nwhile left < right:\n  swap(str[left], str[right])\n  left++\n  right--`}
                      />
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Palindrome Check</h4>
                      <Pseudocode 
                        code={`left = 0\nright = length - 1\nwhile left < right:\n  if str[left] != str[right]:\n    return false\n  left++\n  right--\nreturn true`}
                      />
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Anagram Check</h4>
                      <Pseudocode 
                        code={`s1 = sort(str1.removeSpaces())\ns2 = sort(str2.removeSpaces())\nif s1.length != s2.length: return false\nfor i from 0 to s1.length - 1:\n  if s1[i] != s2[i]: return false\nreturn true`}
                      />
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">String Compression</h4>
                      <Pseudocode 
                        code={`result = ""\ncount = 1\nfor i from 0 to n - 1:\n  if i + 1 < n and str[i] == str[i+1]:\n    count++\n  else:\n    result += str[i] + count\n    count = 1\nreturn result`}
                      />
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Substring Search</h4>
                      <Pseudocode 
                        code={`for i from 0 to n - m:\n  match = true\n  for j from 0 to m - 1:\n    if str[i+j] != pattern[j]:\n      match = false; break\n  if match: return i\nreturn -1`}
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
                <h3 className="text-2xl font-bold text-slate-900">What is a String?</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg">
                A string is a sequence of characters. It is one of the most fundamental data types in programming, used to represent text. While often treated as a simple array of characters, strings have unique properties and operations.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Key Characteristics
                  </h4>
                  <ul className="space-y-2 text-sm text-emerald-800">
                    <li>• Sequence of characters (Unicode/ASCII)</li>
                    <li>• Immutable in many languages (Java, Python)</li>
                    <li>• Null-terminated in C/C++</li>
                    <li>• Supports rich set of operations (Concat, Split, Search)</li>
                  </ul>
                </div>
                <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                  <h4 className="font-bold text-rose-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={18} />
                    Immutability Note
                  </h4>
                  <p className="text-sm text-rose-800">
                    When a string is immutable, modifying it actually creates a new string in memory. This is why using `StringBuilder` or joining lists is more efficient for heavy modifications.
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h3 className="text-2xl font-bold text-slate-900">Common Operations</h3>
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
                      <td className="px-6 py-4 font-bold text-slate-900">Length</td>
                      <td className="px-6 py-4 text-slate-600">Get number of characters</td>
                      <td className="px-6 py-4 font-mono text-emerald-600">O(1)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Concatenation</td>
                      <td className="px-6 py-4 text-slate-600">Join two strings together</td>
                      <td className="px-6 py-4 font-mono text-emerald-600">O(n + m)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Substring</td>
                      <td className="px-6 py-4 text-slate-600">Extract part of a string</td>
                      <td className="px-6 py-4 font-mono text-emerald-600">O(k)</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-bold text-slate-900">Search</td>
                      <td className="px-6 py-4 text-slate-600">Find pattern in string</td>
                      <td className="px-6 py-4 font-mono text-emerald-600">O(n * m)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bg-slate-900 rounded-[2.5rem] p-12 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
              <div className="relative z-10 space-y-6">
                <h3 className="text-3xl font-bold">String Algorithms</h3>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Strings are central to many advanced algorithms like KMP (Knuth-Morris-Pratt) for pattern searching, Tries for prefix matching, and Dynamic Programming for Longest Common Subsequence.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/10">Two Pointers</span>
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/10">Sliding Window</span>
                  <span className="px-4 py-2 bg-white/10 rounded-xl text-sm font-medium border border-white/10">Hashing</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

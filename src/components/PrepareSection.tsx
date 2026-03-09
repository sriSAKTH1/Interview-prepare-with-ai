import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  FileText, 
  MessageSquare, 
  Video, 
  Briefcase, 
  Lightbulb, 
  ArrowRight,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  Map,
  Layout,
  Code2,
  FileQuestion,
  Upload,
  ChevronRight,
  Loader2,
  Target,
  BookOpen,
  Trophy,
  Zap,
  Building2,
  ExternalLink,
  Globe
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

type PrepareMode = 'overview' | 'role-plan' | 'dsa-plan' | 'roadmap' | 'resume-questions' | 'company-exam';

export function PrepareSection({ careerPath, onStartTest }: { 
  careerPath?: string,
  onStartTest?: (config: any) => void 
}) {
  const [mode, setMode] = useState<PrepareMode>('overview');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [userInput, setUserInput] = useState('');
  const [selectedRole, setSelectedRole] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('prepare_selectedRole') || careerPath || 'Frontend Developer';
    }
    return careerPath || 'Frontend Developer';
  });
  const [selectedDuration, setSelectedDuration] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('prepare_selectedDuration') || '30';
    }
    return '30';
  });
  const [selectedDsaDuration, setSelectedDsaDuration] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('prepare_selectedDsaDuration') || '90';
    }
    return '90';
  });
  const [companyOrExam, setCompanyOrExam] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('prepare_companyOrExam') || '';
    }
    return '';
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    localStorage.setItem('prepare_selectedRole', selectedRole);
  }, [selectedRole]);

  useEffect(() => {
    localStorage.setItem('prepare_selectedDuration', selectedDuration);
  }, [selectedDuration]);

  useEffect(() => {
    localStorage.setItem('prepare_selectedDsaDuration', selectedDsaDuration);
  }, [selectedDsaDuration]);

  useEffect(() => {
    localStorage.setItem('prepare_companyOrExam', companyOrExam);
  }, [companyOrExam]);

  const roles = ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'AI Engineer'];
  const durations = [
    { label: '7 Days', value: '7' },
    { label: '15 Days', value: '15' },
    { label: '30 Days', value: '30' },
    { label: '60 Days', value: '60' },
  ];

  const dsaDurations = [
    { label: '3 Months', value: '90' },
    { label: '6 Months', value: '180' },
    { label: '9 Months', value: '270' },
  ];

  const prepareOptions = [
    {
      id: 'role-plan',
      title: 'Role-Based Study Plan',
      description: `Get a personalized ${selectedDuration}-day preparation plan tailored to your target role.`,
      icon: Layout,
      color: 'bg-indigo-500',
      tag: 'Personalized'
    },
    {
      id: 'dsa-plan',
      title: 'DSA Mastery Plan',
      description: `A structured ${selectedDsaDuration === '90' ? '3-month' : selectedDsaDuration === '180' ? '6-month' : selectedDsaDuration === '270' ? '9-month' : selectedDsaDuration + '-day'} path to master Data Structures and Algorithms.`,
      icon: Code2,
      color: 'bg-emerald-500',
      tag: 'Technical'
    },
    {
      id: 'roadmap',
      title: 'Career Roadmap',
      description: 'Visualize the skills and technologies you need to master for your dream role.',
      icon: Map,
      color: 'bg-amber-500',
      tag: 'Strategic'
    },
    {
      id: 'resume-questions',
      title: 'Resume Interviewer',
      description: 'Upload your resume and get AI-generated questions specific to your experience.',
      icon: FileQuestion,
      color: 'bg-rose-500',
      tag: 'AI Powered'
    },
    {
      id: 'company-exam',
      title: 'Company & Exam Prep',
      description: 'Get deep insights, patterns, and a study plan for specific companies or competitive exams.',
      icon: Building2,
      color: 'bg-violet-500',
      tag: 'Search Grounded'
    }
  ];

  const generateRolePlan = async () => {
    setLoading(true);
    setGeneratedContent(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a ${selectedDuration}-day study plan for a ${selectedRole} position. 
        Divide it into logical phases or weeks. Each phase should have a focus and daily topics.
        Include key resources or concepts to study.
        Return the response as a JSON object with this schema:
        {
          "title": "string",
          "weeks": [
            {
              "week": number,
              "focus": "string",
              "days": [
                { "day": number, "topic": "string", "details": "string" }
              ]
            }
          ]
        }`,
        config: { responseMimeType: "application/json" }
      });
      setGeneratedContent(JSON.parse(response.text));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateDSAPlan = async () => {
    setLoading(true);
    setGeneratedContent(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a structured ${selectedDsaDuration === '90' ? '3-month' : selectedDsaDuration === '180' ? '6-month' : selectedDsaDuration === '270' ? '9-month' : selectedDsaDuration + '-day'} DSA study plan based on the following curriculum:

        Curriculum Reference:
        - Foundation: Arrays, Strings, Hashing, Matrix, Sorting, Two Pointers.
        - Core: Binary Search, Stacks, Queues, Linked Lists, Recursion, Backtracking.
        - Advanced DS: Heap, Sliding Window, Trees (Theory & Problems).
        - Algorithms: Graphs (Theory & Advanced), Dynamic Programming (Basics & Advanced).
        - Specialized: Trie, System Design intro, Bit Manipulation, Math (Number Theory).
        - Famous Algos: Dijkstra, Floyd-Warshall, Kruskal, Prim, etc.

        Adapt this curriculum to fit exactly ${selectedDsaDuration === '90' ? '3 months' : selectedDsaDuration === '180' ? '6 months' : '9 months'}.
        - For 3 months: Condense topics, focus on high-frequency patterns.
        - For 6 months: Follow the curriculum as provided.
        - For 9 months: Add more depth, extra practice problems, and deep implementation details.

        Pre-requisites to mention: 
        1. Time/Space Complexity (Link: https://youtu.be/SQQ-2ElsQZo?si=VLP3waM9RVqRa1CB)
        2. Java/Python basics.

        Return the response as a JSON object with this schema:
        {
          "title": "string",
          "prerequisites": [
            { "topic": "string", "link": "string (optional)", "description": "string" }
          ],
          "months": [
            {
              "month": "string (e.g., Month 1: Foundation)",
              "weeks": [
                {
                  "week": "string (e.g., Week 1: Arrays)",
                  "topics": [
                    { 
                      "name": "string", 
                      "concepts": ["string"], 
                      "problems": ["string"],
                      "approach": "string (How to cover: Introduce -> Explain -> Problems -> Complexity)"
                    }
                  ]
                }
              ]
            }
          ]
        }`,
        config: { responseMimeType: "application/json" }
      });
      setGeneratedContent(JSON.parse(response.text));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateCompanyExamPlan = async () => {
    if (!companyOrExam) return;
    setLoading(true);
    setGeneratedContent(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a comprehensive preparation guide for ${companyOrExam} (Company/Role or Exam).
        1. Explain the full interview/exam pattern.
        2. Provide expert tricks and tips for success.
        3. Create a ${selectedDuration}-day learning plan.
        4. Provide 3-5 high-quality external resource links (Google search results/official links).
        5. Explain how AI can specifically help in this preparation.
        
        IMPORTANT: For the mock test configuration, ensure it reflects the actual exam/interview pattern. 
        When generating questions later, the AI should use Google Search to find previous year questions or similar high-quality patterns.
        
        Return the response as a JSON object with this schema:
        {
          "title": "string",
          "pattern": [
            { "step": "string", "details": "string" }
          ],
          "tips": ["string"],
          "plan": [
            { "phase": "string", "duration": "string", "topics": ["string"] }
          ],
          "links": [
            { "title": "string", "url": "string" }
          ],
          "aiUtility": "string",
          "mockTestConfig": {
            "mode": "string (either 'comprehensive-company-test' or 'company-round')",
            "company": "string",
            "role": "string",
            "examName": "string",
            "context": "string (detailed context about the pattern and topics to focus on)"
          }
        }`,
        config: { 
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }]
        }
      });
      setGeneratedContent(JSON.parse(response.text));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const generateRoadmap = async () => {
    setLoading(true);
    setGeneratedContent(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a career roadmap for a ${selectedRole}. 
        List the stages of learning from fundamentals to advanced specialization.
        For each stage, list the required skills and tools.
        Also suggest a Lucide icon name (e.g., 'Book', 'Code', 'Layers', 'Cpu', 'Rocket') that represents the stage.
        Return the response as a JSON object with this schema:
        {
          "role": "string",
          "stages": [
            {
              "name": "string",
              "description": "string",
              "icon": "string",
              "skills": ["string"],
              "tools": ["string"]
            }
          ]
        }`,
        config: { responseMimeType: "application/json" }
      });
      setGeneratedContent(JSON.parse(response.text));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const generateResumeQuestions = async () => {
    if (!userInput && !selectedFile) return;
    setLoading(true);
    setGeneratedContent(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      let contents: any;
      if (selectedFile) {
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onload = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
          };
          reader.readAsDataURL(selectedFile);
        });
        const base64Data = await base64Promise;
        
        contents = {
          parts: [
            {
              inlineData: {
                mimeType: selectedFile.type || 'application/pdf',
                data: base64Data
              }
            },
            {
              text: "Analyze this resume and generate 10 to 20 interview questions tailored to the experience and skills mentioned. For each question, provide a 'Why we ask' explanation and a 'Good answer' tip. Return the response as a JSON object with this schema: { \"questions\": [ { \"question\": \"string\", \"why\": \"string\", \"tip\": \"string\" } ] }"
            }
          ]
        };
      } else {
        contents = `Analyze this resume text and generate 10 to 20 interview questions tailored to the experience and skills mentioned.
        For each question, provide a "Why we ask" explanation and a "Good answer" tip.
        Resume Text: ${userInput}
        Return the response as a JSON object with this schema:
        {
          "questions": [
            { "question": "string", "why": "string", "tip": "string" }
          ]
        }`;
      }

      const response = await ai.models.generateContent({
        model: selectedFile ? "gemini-3.1-pro-preview" : "gemini-3-flash-preview",
        contents: contents,
        config: { responseMimeType: "application/json" }
      });
      setGeneratedContent(JSON.parse(response.text));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'overview') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Preparation Center</h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Everything you need to go from candidate to employee.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prepareOptions.map((option) => (
            <motion.button
              key={option.id}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setMode(option.id as PrepareMode);
                setGeneratedContent(null);
                setUserInput('');
              }}
              className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all text-left group relative overflow-hidden"
            >
              <div className={`w-16 h-16 ${option.color} rounded-2xl flex items-center justify-center text-white mb-6 group-hover:rotate-6 transition-transform`}>
                <option.icon size={32} />
              </div>
              
              <div className="absolute top-8 right-8">
                <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-xs font-bold uppercase tracking-widest">
                  {option.tag}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">{option.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{option.description}</p>
              
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold">
                Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Decorative background element */}
              <div className={`absolute -bottom-12 -right-12 w-32 h-32 ${option.color} opacity-[0.03] rounded-full`} />
            </motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => setMode('overview')}
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-medium mb-8"
      >
        <ArrowRight size={18} className="rotate-180" />
        Back to Overview
      </button>
      
      <div className="space-y-8">
        {/* Mode Header */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-10 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 ${prepareOptions.find(o => o.id === mode)?.color} rounded-2xl flex items-center justify-center text-white`}>
                {(() => {
                  const Icon = prepareOptions.find(o => o.id === mode)?.icon || Sparkles;
                  return <Icon size={32} />;
                })()}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{prepareOptions.find(o => o.id === mode)?.title}</h2>
                <p className="text-slate-500 dark:text-slate-400">{prepareOptions.find(o => o.id === mode)?.description}</p>
              </div>
            </div>
            
            {(mode === 'role-plan' || mode === 'roadmap' || mode === 'company-exam') && !generatedContent && (
              <div className="flex flex-wrap items-center gap-3">
                {mode === 'company-exam' ? (
                  <input
                    type="text"
                    placeholder="Enter Company (e.g. Google) or Exam (e.g. GATE)"
                    value={companyOrExam}
                    onChange={(e) => setCompanyOrExam(e.target.value)}
                    className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white min-w-[300px]"
                  />
                ) : (
                  <select 
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    {roles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                )}
                
                {(mode === 'role-plan' || mode === 'company-exam') && (
                  <select 
                    value={selectedDuration}
                    onChange={(e) => setSelectedDuration(e.target.value)}
                    className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    {durations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                )}
                <button 
                  onClick={mode === 'role-plan' ? generateRolePlan : mode === 'roadmap' ? generateRoadmap : generateCompanyExamPlan}
                  disabled={loading || (mode === 'company-exam' && !companyOrExam)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  Generate
                </button>
              </div>
            )}

            {mode === 'dsa-plan' && !generatedContent && (
              <div className="flex flex-wrap items-center gap-3">
                <select 
                  value={selectedDsaDuration}
                  onChange={(e) => setSelectedDsaDuration(e.target.value)}
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-500 dark:text-white"
                >
                  {dsaDurations.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
                <button 
                  onClick={generateDSAPlan}
                  disabled={loading}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  Generate DSA Path
                </button>
              </div>
            )}
          </div>

          {mode === 'resume-questions' && !generatedContent && (
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Option 1: Paste Resume Text</label>
                  <textarea 
                    placeholder="Paste your resume text here..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full h-64 p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl text-sm outline-none focus:ring-2 focus:ring-rose-500 dark:text-white resize-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Option 2: Upload Resume (PDF/DOC)</label>
                  <div 
                    className={`w-full h-64 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center p-6 transition-all cursor-pointer ${
                      selectedFile ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-700'
                    }`}
                    onClick={() => document.getElementById('resume-upload')?.click()}
                  >
                    <input 
                      id="resume-upload"
                      type="file" 
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    {selectedFile ? (
                      <>
                        <CheckCircle2 size={48} className="text-emerald-500 mb-4" />
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-full px-4">{selectedFile.name}</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                          className="mt-2 text-xs text-rose-500 font-bold hover:underline"
                        >
                          Remove File
                        </button>
                      </>
                    ) : (
                      <>
                        <Upload size={48} className="text-slate-300 mb-4" />
                        <p className="text-sm font-bold text-slate-900 dark:text-white text-center">Click to Upload PDF or DOC</p>
                        <p className="text-xs text-slate-400 mt-2">Max size: 5MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={generateResumeQuestions}
                disabled={loading || (!userInput && !selectedFile)}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                Analyze Resume & Generate Questions
              </button>
            </div>
          )}
        </div>

        {/* Generated Content */}
        {loading && (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
              <Sparkles size={32} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">AI is crafting your personalized preparation path...</p>
          </div>
        )}

        {generatedContent && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {mode === 'role-plan' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedContent.weeks.map((week: any) => (
                  <div key={week.week} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Week {week.week}</h3>
                      <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {week.focus}
                      </span>
                    </div>
                    <div className="space-y-4">
                      {week.days.map((day: any) => (
                        <div key={day.day} className="flex gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition-colors group">
                          <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                            {day.day}
                          </div>
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{day.topic}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{day.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mode === 'dsa-plan' && (
              <div className="space-y-16">
                {generatedContent.prerequisites && (
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-[2.5rem] p-8 space-y-6">
                    <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 size={24} />
                      <h3 className="text-2xl font-bold">Pre-requisites</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {generatedContent.prerequisites.map((pre: any, i: number) => (
                        <div key={i} className="bg-white dark:bg-slate-900/50 p-6 rounded-2xl border border-emerald-100 dark:border-emerald-900/20 space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-slate-900 dark:text-white">{pre.topic}</h4>
                            {pre.link && (
                              <a 
                                href={pre.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1 text-xs font-bold"
                              >
                                <Video size={14} /> Watch
                              </a>
                            )}
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{pre.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {generatedContent.months.map((month: any, mIdx: number) => (
                  <div key={mIdx} className="space-y-10">
                    <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                      <div className="w-16 h-16 bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg shadow-emerald-200 dark:shadow-none">
                        {mIdx + 1}
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{month.month}</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm">Targeted mastery for this phase</p>
                      </div>
                    </div>

                    <div className="space-y-12">
                      {month.weeks.map((week: any, wIdx: number) => (
                        <div key={wIdx} className="space-y-6">
                          <div className="flex items-center gap-3">
                            <div className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                              {week.week}
                            </div>
                            <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {week.topics.map((topic: any, i: number) => (
                              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:border-emerald-500 transition-all hover:shadow-xl hover:shadow-emerald-500/5 group">
                                <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">{topic.name}</h4>
                                
                                {topic.approach && (
                                  <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[10px] text-slate-500 dark:text-slate-400 italic leading-relaxed border border-slate-100 dark:border-slate-800">
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 not-italic uppercase tracking-tighter mr-1">Approach:</span>
                                    {topic.approach}
                                  </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                  {topic.concepts.map((c: string) => (
                                    <span key={c} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[10px] font-medium">
                                      {c}
                                    </span>
                                  ))}
                                </div>
                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                                  <div className="space-y-2">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Problems</div>
                                    {topic.problems.map((p: string) => (
                                      <div key={p} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                        {p}
                                      </div>
                                    ))}
                                  </div>
                                  <button
                                    onClick={() => onStartTest?.({ mode: 'coding-topic', initialContext: topic.name })}
                                    className="w-full py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-[10px] font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 group/btn"
                                  >
                                    <Code2 size={14} className="group-hover/btn:rotate-12 transition-transform" />
                                    Practice Now
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mode === 'roadmap' && (
              <div className="relative space-y-12 before:absolute before:left-8 before:top-0 before:bottom-0 before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                {generatedContent.stages.map((stage: any, i: number) => (
                  <div key={i} className="relative pl-20 group">
                    <div className="absolute left-4 top-0 w-8 h-8 bg-white dark:bg-slate-900 border-4 border-indigo-600 rounded-full z-10 group-hover:scale-125 transition-transform flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
                    </div>
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-4 hover:shadow-xl transition-all relative overflow-hidden">
                      {/* Background Number */}
                      <div className="absolute -top-4 -right-4 text-8xl font-black text-slate-50 dark:text-slate-800/50 pointer-events-none">
                        {i + 1}
                      </div>

                      <div className="flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center">
                            <Map size={24} />
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stage.name}</h3>
                        </div>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed relative z-10">{stage.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 relative z-10">
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                            <Target size={14} /> Skills to Master
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {stage.skills.map((s: string) => (
                              <span key={s} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-medium">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                            <Zap size={14} /> Tools & Tech
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {stage.tools.map((t: string) => (
                              <span key={t} className="px-3 py-1 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-xs font-medium">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {mode === 'company-exam' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Pattern & Info */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 space-y-6">
                      <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                        <Layout size={24} />
                        <h3 className="text-2xl font-bold">Exam & Interview Pattern</h3>
                      </div>
                      <div className="space-y-6">
                        {generatedContent.pattern.map((item: any, i: number) => (
                          <div key={i} className="flex gap-6 group">
                            <div className="flex flex-col items-center">
                              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold border border-indigo-100 dark:border-indigo-800 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                {i + 1}
                              </div>
                              {i < generatedContent.pattern.length - 1 && (
                                <div className="w-px h-full bg-slate-100 dark:bg-slate-800 my-2" />
                              )}
                            </div>
                            <div className="pb-6">
                              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{item.step}</h4>
                              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{item.details}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 space-y-6">
                      <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
                        <Lightbulb size={24} />
                        <h3 className="text-2xl font-bold">Tricks & Expert Tips</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {generatedContent.tips.map((tip: string, i: number) => (
                          <div key={i} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm">
                              {i + 1}
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{tip}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 space-y-6">
                      <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400">
                        <Clock size={24} />
                        <h3 className="text-2xl font-bold">{selectedDuration}-Day Study Plan</h3>
                      </div>
                      <div className="space-y-4">
                        {generatedContent.plan.map((phase: any, i: number) => (
                          <div key={i} className="relative pl-12 pb-8 last:pb-0 before:absolute before:left-4 before:top-8 before:bottom-0 before:w-px before:bg-slate-100 dark:before:bg-slate-800 last:before:hidden">
                            <div className="absolute left-0 top-0 w-8 h-8 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center font-bold text-xs border-2 border-emerald-500">
                              {i + 1}
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-slate-900 dark:text-white">{phase.phase}</h4>
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{phase.duration}</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {phase.topics.map((topic: string) => (
                                  <span key={topic} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[10px] font-medium">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar: Links & AI Utility */}
                  <div className="space-y-8">
                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white space-y-6">
                      <div className="flex items-center gap-3">
                        <Sparkles size={24} />
                        <h3 className="text-xl font-bold">AI Assistance</h3>
                      </div>
                      <p className="text-indigo-100 text-sm leading-relaxed">
                        {generatedContent.aiUtility}
                      </p>
                      <button 
                        onClick={() => onStartTest?.(generatedContent.mockTestConfig)}
                        className="w-full py-4 bg-white text-indigo-600 rounded-2xl font-bold hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                      >
                        <Trophy size={18} />
                        Start Mock Test
                      </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6">
                      <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                        <Globe size={20} />
                        <h3 className="text-lg font-bold">External Resources</h3>
                      </div>
                      <div className="space-y-3">
                        {generatedContent.links.map((link: any, i: number) => (
                          <a 
                            key={i}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500 transition-all group"
                          >
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 transition-colors">{link.title}</span>
                            <ExternalLink size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mode === 'resume-questions' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {generatedContent.questions.map((q: any, i: number) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-4 hover:border-rose-500 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 rounded-xl flex items-center justify-center font-bold shrink-0">
                        {i + 1}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{q.question}</h3>
                    </div>
                    <div className="space-y-3 pt-4">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Why we ask</div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{q.why}</p>
                      </div>
                      <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                        <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Good Answer Tip</div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">{q.tip}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-center pt-8">
              <button 
                onClick={() => setGeneratedContent(null)}
                className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Generate New Plan
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

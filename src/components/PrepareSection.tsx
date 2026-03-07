import { useState } from 'react';
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
  Zap
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

type PrepareMode = 'overview' | 'role-plan' | 'dsa-plan' | 'roadmap' | 'resume-questions';

export function PrepareSection() {
  const [mode, setMode] = useState<PrepareMode>('overview');
  const [loading, setLoading] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [userInput, setUserInput] = useState('');
  const [selectedRole, setSelectedRole] = useState('Frontend Developer');

  const roles = ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'AI Engineer'];

  const prepareOptions = [
    {
      id: 'role-plan',
      title: 'Role-Based Study Plan',
      description: 'Get a personalized 30-day preparation plan tailored to your target role.',
      icon: Layout,
      color: 'bg-indigo-500',
      tag: 'Personalized'
    },
    {
      id: 'dsa-plan',
      title: 'DSA Mastery Plan',
      description: 'A structured path to master Data Structures and Algorithms from scratch.',
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
    }
  ];

  const generateRolePlan = async () => {
    setLoading(true);
    setGeneratedContent(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a 30-day study plan for a ${selectedRole} position. 
        Divide it into 4 weeks. Each week should have a focus and daily topics.
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
        contents: `Generate a structured DSA study plan. 
        Divide it into levels: Beginner, Intermediate, Advanced.
        For each level, list the topics and key problems to solve.
        Return the response as a JSON object with this schema:
        {
          "title": "string",
          "levels": [
            {
              "level": "string",
              "topics": [
                { "name": "string", "concepts": ["string"], "problems": ["string"] }
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
        Return the response as a JSON object with this schema:
        {
          "role": "string",
          "stages": [
            {
              "name": "string",
              "description": "string",
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
    if (!userInput) return;
    setLoading(true);
    setGeneratedContent(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze this resume text and generate 10 interview questions tailored to the experience and skills mentioned.
        For each question, provide a "Why we ask" explanation and a "Good answer" tip.
        Resume Text: ${userInput}
        Return the response as a JSON object with this schema:
        {
          "questions": [
            { "question": "string", "why": "string", "tip": "string" }
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
            
            {(mode === 'role-plan' || mode === 'roadmap') && !generatedContent && (
              <div className="flex items-center gap-3">
                <select 
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                >
                  {roles.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <button 
                  onClick={mode === 'role-plan' ? generateRolePlan : generateRoadmap}
                  disabled={loading}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  Generate
                </button>
              </div>
            )}

            {mode === 'dsa-plan' && !generatedContent && (
              <button 
                onClick={generateDSAPlan}
                disabled={loading}
                className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                Generate DSA Path
              </button>
            )}
          </div>

          {mode === 'resume-questions' && !generatedContent && (
            <div className="mt-8 space-y-4">
              <textarea 
                placeholder="Paste your resume text here..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="w-full h-48 p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl text-sm outline-none focus:ring-2 focus:ring-rose-500 dark:text-white resize-none"
              />
              <button 
                onClick={generateResumeQuestions}
                disabled={loading || !userInput}
                className="w-full py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
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
              <div className="space-y-8">
                {generatedContent.levels.map((level: any) => (
                  <div key={level.level} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs ${
                        level.level === 'Beginner' ? 'bg-emerald-500' : 
                        level.level === 'Intermediate' ? 'bg-amber-500' : 'bg-rose-500'
                      }`}>
                        {level.level[0]}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{level.level} Mastery</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {level.topics.map((topic: any, i: number) => (
                        <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-4 hover:border-indigo-500 transition-colors">
                          <h4 className="font-bold text-slate-900 dark:text-white">{topic.name}</h4>
                          <div className="flex flex-wrap gap-2">
                            {topic.concepts.map((c: string) => (
                              <span key={c} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md text-[10px] font-medium">
                                {c}
                              </span>
                            ))}
                          </div>
                          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Key Problems</div>
                            {topic.problems.map((p: string) => (
                              <div key={p} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                                <CheckCircle2 size={12} className="text-emerald-500" />
                                {p}
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
                    <div className="absolute left-4 top-0 w-8 h-8 bg-white dark:bg-slate-900 border-4 border-indigo-600 rounded-full z-10 group-hover:scale-125 transition-transform" />
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-4 hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{stage.name}</h3>
                        <span className="text-4xl font-black text-slate-100 dark:text-slate-800">0{i + 1}</span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{stage.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
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

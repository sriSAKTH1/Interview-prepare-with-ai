import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardCheck, 
  Code2, 
  Briefcase, 
  Building2, 
  Mic, 
  ChevronRight, 
  Trophy, 
  Brain, 
  Repeat, 
  Sparkles, 
  Zap, 
  Target, 
  Award,
  Rocket,
  Info,
  CheckCircle2,
  Clock,
  Loader2,
  Globe,
  Smartphone,
  ShoppingCart,
  Database,
  Terminal,
  Activity,
  Book,
  Check,
  Share2,
  Timer,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  XCircle,
  RefreshCw,
  FileText,
  BookOpen,
  MessageSquare,
  History,
  Play,
  Settings,
  Maximize2,
  ChevronDown,
  Lock
} from 'lucide-react';
import { TestMode, TestResult } from '../types';
import { GoogleGenAI, Type } from "@google/genai";
import ReactMarkdown from 'react-markdown';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number | string;
  explanation: string;
  distractorAnalysis: string[];
  category?: 'Aptitude' | 'Technical';
  type?: 'mcq' | 'fill' | 'code-fill';
}

const APTITUDE_CATEGORIES = {
  'Numerical': ['Arithmetic', 'Algebra', 'Geometry', 'Data Interpretation', 'Number System', 'Profit & Loss', 'Time & Work', 'Speed & Distance'],
  'Reasoning': ['Logical Reasoning', 'Verbal Reasoning', 'Non-Verbal Reasoning', 'Analytical Reasoning', 'Syllogism', 'Blood Relations', 'Coding-Decoding', 'Series'],
  'Verbal': ['Reading Comprehension', 'Grammar', 'Vocabulary', 'Synonyms & Antonyms', 'Sentence Correction', 'Para Jumbles', 'Idioms & Phrases']
};

export function TestSection({ 
  onComplete, 
  initialMode, 
  initialCompany, 
  initialRole, 
  initialExamName, 
  initialContext,
  viewResult
}: { 
  onComplete: (result: TestResult) => void,
  initialMode?: TestMode,
  initialCompany?: string,
  initialRole?: string,
  initialExamName?: string,
  initialContext?: string,
  viewResult?: TestResult | null
}) {
  const [mode, setMode] = useState<TestMode>(initialMode || 'overview');
  const [testStep, setTestStep] = useState<'overview' | 'difficulty' | 'role-selection' | 'topic-selection' | 'company-config' | 'generating' | 'evaluating' | 'pre-test-summary' | 'rules' | 'active' | 'results' | 'coding-active' | 'coding-results' | 'aptitude-config' | 'io-config'>(viewResult ? 'results' : (initialMode ? 'generating' : 'overview'));
  const [ioLanguage, setIoLanguage] = useState<string>('C');
  const [aptitudeSubMode, setAptitudeSubMode] = useState<'custom' | 'random' | 'company'>('random');
  const [selectedAptitudeCategories, setSelectedAptitudeCategories] = useState<string[]>([]);
  const [selectedAptitudeTopics, setSelectedAptitudeTopics] = useState<string[]>([]);
  const [aptitudeQuestionCount, setAptitudeQuestionCount] = useState<number>(20);
  const [aptitudeCompany, setAptitudeCompany] = useState<string>('');
  const [aptitudeExam, setAptitudeExam] = useState<string>('');
  const [aptitudeContext, setAptitudeContext] = useState<string>('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('test_difficulty') as any) || 'Easy';
    }
    return 'Easy';
  });
  const [companyName, setCompanyName] = useState<string>(() => {
    if (initialCompany) return initialCompany;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('test_companyName') || '';
    }
    return '';
  });
  const [companyRole, setCompanyRole] = useState<string>(() => {
    if (initialRole) return initialRole;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('test_companyRole') || '';
    }
    return '';
  });
  const [jobDescription, setJobDescription] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('test_jobDescription') || '';
    }
    return '';
  });
  const [examName, setExamName] = useState<string>(() => {
    if (initialExamName) return initialExamName;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('test_examName') || '';
    }
    return '';
  });
  const [prepContext, setPrepContext] = useState<string>(initialContext || '');
  const [experienceLevel, setExperienceLevel] = useState<'Fresher' | '1+ Year'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('test_experienceLevel') as any) || 'Fresher';
    }
    return 'Fresher';
  });
  const [selectedRole, setSelectedRole] = useState<string>(() => {
    if (initialRole) return initialRole;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('test_selectedRole') || '';
    }
    return '';
  });
  const [selectedTopic, setSelectedTopic] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('test_selectedTopic') || '';
    }
    return '';
  });

  useEffect(() => {
    localStorage.setItem('test_difficulty', difficulty);
  }, [difficulty]);

  useEffect(() => {
    if (!initialCompany) localStorage.setItem('test_companyName', companyName);
  }, [companyName, initialCompany]);

  useEffect(() => {
    if (!initialRole) localStorage.setItem('test_companyRole', companyRole);
  }, [companyRole, initialRole]);

  useEffect(() => {
    localStorage.setItem('test_jobDescription', jobDescription);
  }, [jobDescription]);

  useEffect(() => {
    if (!initialExamName) localStorage.setItem('test_examName', examName);
  }, [examName, initialExamName]);

  useEffect(() => {
    localStorage.setItem('test_experienceLevel', experienceLevel);
  }, [experienceLevel]);

  useEffect(() => {
    if (!initialRole) localStorage.setItem('test_selectedRole', selectedRole);
  }, [selectedRole, initialRole]);

  useEffect(() => {
    localStorage.setItem('test_selectedTopic', selectedTopic);
  }, [selectedTopic]);
  const [customRole, setCustomRole] = useState<string>('');

  // Test State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | string)[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [testStartTime, setTestStartTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Coding Challenge State
  const [codingProblem, setCodingProblem] = useState<any>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [customQuestionCount, setCustomQuestionCount] = useState<string>('');
  const [testInsights, setTestInsights] = useState<{
    companyInfo?: string;
    roleExpectations?: string;
    keyTopics?: string[];
    preparationTips?: string[];
    deepAnalysis?: string;
    interviewPattern?: string;
  } | null>(null);
  const [leftTab, setLeftTab] = useState<'description' | 'editorial' | 'solutions' | 'submissions'>('description');
  const [bottomTab, setBottomTab] = useState<'testcase' | 'testresult'>('testcase');
  const [selectedCase, setSelectedCase] = useState(0);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  const roles = ['Frontend Developer', 'Backend Developer', 'Fullstack Developer', 'Data Scientist', 'DevOps Engineer', 'Mobile Developer', 'UI/UX Designer'];
  const topics = ['Random', 'Arrays & Hashing', 'Two Pointers', 'Sliding Window', 'Stack', 'Binary Search', 'Linked List', 'Trees', 'Graphs', 'Dynamic Programming', 'Bit Manipulation'];

  useEffect(() => {
    if (viewResult) {
      if (viewResult.questions) setQuestions(viewResult.questions);
      if (viewResult.userAnswers) setUserAnswers(viewResult.userAnswers);
      setTestStep('results');
    }
  }, [viewResult]);

  useEffect(() => {
    if (initialMode && !viewResult) {
      generateQuestions(initialMode, initialCompany, initialRole, initialExamName, initialContext);
    }
  }, [initialMode, viewResult]);

  const generateQuestions = async (overrideMode?: TestMode, overrideCompany?: string, overrideRole?: string, overrideExamName?: string, overrideContext?: string) => {
    const activeMode = overrideMode || mode;
    const activeCompany = overrideCompany || companyName;
    const activeRole = overrideRole || companyRole;
    const activeExamName = overrideExamName || examName;
    const activePrepContext = overrideContext || prepContext;

    setIsGenerating(true);
    setTestStep('generating');
    setMode(activeMode);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      if (activeMode === 'input-output') {
        const prompt = `Generate 10 high-quality "Input/Output & Code Completion" questions for ${ioLanguage === 'Zoho question' ? 'Zoho interview pattern' : ioLanguage}.
        Difficulty: ${difficulty}
        
        Rules:
        1. Mix of question types: 
           - "mcq": Multiple choice questions with 4 options (Predict the output).
           - "fill": Fill in the blank questions where user must type the exact output.
           - "code-fill": Code completion questions. Provide a code snippet with one or more lines replaced by "[BLANK]". The user must provide the exact code that should go in the blank.
        2. For "mcq", correctAnswer is the index (0-3) as a string.
        3. For "fill", correctAnswer is the exact string output.
        4. For "code-fill", correctAnswer is the exact line(s) of code that fill the [BLANK].
        5. Each question must include a code snippet in markdown.
        6. For "Zoho question", focus on C/C++ dry run, pattern printing, and logical series.
        
        Return the response as a JSON object with the following schema:
        {
          "insights": {
            "whatIsThis": "string",
            "whyUseThis": "string",
            "roleExpectations": "string",
            "keyTopics": ["string"],
            "preparationTips": ["string"],
            "deepAnalysis": "string",
            "interviewPattern": "string"
          },
          "questions": [
            {
              "id": "string",
              "type": "mcq" | "fill" | "code-fill",
              "question": "string (include the code snippet in markdown code blocks. For code-fill, use [BLANK] inside the code block)",
              "options": ["string"],
              "correctAnswer": "string",
              "explanation": "string",
              "distractorAnalysis": ["string"]
            }
          ]
        }`;

        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            tools: ioLanguage === 'Zoho question' ? [{ googleSearch: {} }] : [],
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                insights: {
                  type: Type.OBJECT,
                  properties: {
                    whatIsThis: { type: Type.STRING },
                    whyUseThis: { type: Type.STRING },
                    roleExpectations: { type: Type.STRING },
                    keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                    preparationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                    deepAnalysis: { type: Type.STRING },
                    interviewPattern: { type: Type.STRING }
                  },
                  required: ["whatIsThis", "whyUseThis", "roleExpectations", "keyTopics", "preparationTips", "deepAnalysis", "interviewPattern"]
                },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ["mcq", "fill", "code-fill"] },
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.STRING },
                      explanation: { type: Type.STRING },
                      distractorAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["id", "type", "question", "options", "correctAnswer", "explanation", "distractorAnalysis"]
                  }
                }
              },
              required: ["insights", "questions"]
            }
          }
        });

        const data = JSON.parse(result.text);
        setQuestions(data.questions);
        setTestInsights(data.insights);
        setUserAnswers(new Array(data.questions.length).fill(''));
        setTestStep('pre-test-summary');
        setIsGenerating(false);
        return;
      }

      if (activeMode === 'aptitude') {
        let aptitudeContextStr = "";
        let qCount = aptitudeQuestionCount;

        if (aptitudeSubMode === 'random') {
          aptitudeContextStr = "Random mix of Numerical, Reasoning, and Verbal aptitude questions.";
          qCount = 20;
        } else if (aptitudeSubMode === 'custom') {
          aptitudeContextStr = `Custom selection. Categories: ${selectedAptitudeCategories.join(', ')}. Topics: ${selectedAptitudeTopics.join(', ')}.`;
        } else if (aptitudeSubMode === 'company') {
          aptitudeContextStr = `Company Specific Aptitude. Company: ${aptitudeCompany}, Exam: ${aptitudeExam}. ${aptitudeContext ? `Additional Context: ${aptitudeContext}` : ''}`;
          qCount = 20;
        }

        const prompt = `Generate ${qCount} high-quality multiple choice questions for an Aptitude Assessment.
        Context: ${aptitudeContextStr}
        Difficulty: ${difficulty}
        
        IMPORTANT: For company-specific requests, use Google Search to find actual previous year patterns for ${aptitudeCompany} ${aptitudeExam}.
        
        Return the response as a JSON object with the following schema:
        {
          "insights": {
            "whatIsThis": "string (explain what this specific aptitude test covers)",
            "whyUseThis": "string (explain why this aptitude test is important for the user's goal)",
            "roleExpectations": "string",
            "keyTopics": ["string"],
            "preparationTips": ["string"],
            "deepAnalysis": "string",
            "interviewPattern": "string"
          },
          "questions": [
            {
              "id": "string",
              "question": "string",
              "options": ["string", "string", "string", "string"],
              "correctAnswer": number (0-3),
              "explanation": "string",
              "distractorAnalysis": ["string", "string", "string", "string"]
            }
          ]
        }`;

        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            tools: aptitudeSubMode === 'company' ? [{ googleSearch: {} }] : [],
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                insights: {
                  type: Type.OBJECT,
                  properties: {
                    whatIsThis: { type: Type.STRING },
                    whyUseThis: { type: Type.STRING },
                    roleExpectations: { type: Type.STRING },
                    keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                    preparationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                    deepAnalysis: { type: Type.STRING },
                    interviewPattern: { type: Type.STRING }
                  },
                  required: ["whatIsThis", "whyUseThis", "roleExpectations", "keyTopics", "preparationTips", "deepAnalysis", "interviewPattern"]
                },
                questions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING }, minItems: 4, maxItems: 4 },
                      correctAnswer: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                      distractorAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["id", "question", "options", "correctAnswer", "explanation", "distractorAnalysis"]
                  }
                }
              },
              required: ["insights", "questions"]
            }
          }
        });

        const data = JSON.parse(result.text);
        setQuestions(data.questions);
        setTestInsights(data.insights);
        setUserAnswers(new Array(data.questions.length).fill(-1));
        setTestStep('pre-test-summary');
        setIsGenerating(false);
        return;
      }

      if (activeMode === 'comprehensive-company-test') {
        const prompt = `Generate a comprehensive mock test for ${activeExamName || activeCompany} for the role of ${activeRole}.
        ${activePrepContext ? `STRICTLY FOLLOW THIS FORMAT ANALYSIS: ${activePrepContext}` : ''}
        
        The test should have the EXACT number of questions and sections specified in the format analysis above.
        - If the analysis specifies 60 questions (e.g., 20 Aptitude, 40 Technical), you MUST generate all 60 questions.
        - Do NOT truncate or provide a sample. Provide the FULL test.
        - Include a coding challenge ONLY if the format analysis mentions coding, programming, or a hands-on technical round.
        
        Standard sections to include if mentioned:
        1. Aptitude questions (MCQ)
        2. Technical MCQs
        3. A coding challenge (similar to LeetCode)
        
        Difficulty: ${difficulty}
        Level: ${experienceLevel}
        
        IMPORTANT: Use Google Search to find actual previous year questions or very similar patterns for ${activeExamName || activeCompany}.
        
        Also provide a deep analysis of the company's interview process and the typical interview pattern for this role.
        
        Return the response as a JSON object with the following schema:
        {
          "insights": {
            "whatIsThis": "string (explain what this specific test covers)",
            "whyUseThis": "string (explain why this test is important for the user's goal)",
            "companyInfo": "string",
            "roleExpectations": "string",
            "keyTopics": ["string"],
            "preparationTips": ["string"],
            "deepAnalysis": "string (detailed analysis of company culture and interview style)",
            "interviewPattern": "string (step-by-step interview process)"
          },
          "aptitudeQuestions": [
            { 
              "id": "string", 
              "question": "string", 
              "options": ["string", "string", "string", "string"], 
              "correctAnswer": number, 
              "explanation": "string",
              "distractorAnalysis": ["string", "string", "string", "string"]
            }
          ],
          "technicalQuestions": [
            { 
              "id": "string", 
              "question": "string", 
              "options": ["string", "string", "string", "string"], 
              "correctAnswer": number, 
              "explanation": "string",
              "distractorAnalysis": ["string", "string", "string", "string"]
            }
          ],
          "codingProblem": {
            "title": "string",
            "description": "string",
            "examples": [{ "input": "string", "output": "string", "explanation": "string" }],
            "constraints": ["string"],
            "starterCode": "string",
            "testCases": [{ "input": "string", "expected": "string" }]
          }
        }`;

        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            responseMimeType: "application/json",
            tools: [{ googleSearch: {} }],
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                insights: {
                  type: Type.OBJECT,
                  properties: {
                    whatIsThis: { type: Type.STRING },
                    whyUseThis: { type: Type.STRING },
                    companyInfo: { type: Type.STRING },
                    roleExpectations: { type: Type.STRING },
                    keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                    preparationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                    deepAnalysis: { type: Type.STRING },
                    interviewPattern: { type: Type.STRING }
                  },
                  required: ["whatIsThis", "whyUseThis", "roleExpectations", "keyTopics", "preparationTips", "deepAnalysis", "interviewPattern"]
                },
                aptitudeQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                      distractorAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["id", "question", "options", "correctAnswer", "explanation", "distractorAnalysis"]
                  }
                },
                technicalQuestions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      question: { type: Type.STRING },
                      options: { type: Type.ARRAY, items: { type: Type.STRING } },
                      correctAnswer: { type: Type.INTEGER },
                      explanation: { type: Type.STRING },
                      distractorAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["id", "question", "options", "correctAnswer", "explanation", "distractorAnalysis"]
                  }
                },
                codingProblem: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    examples: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          input: { type: Type.STRING },
                          output: { type: Type.STRING },
                          explanation: { type: Type.STRING }
                        }
                      }
                    },
                    constraints: { type: Type.ARRAY, items: { type: Type.STRING } },
                    starterCode: { type: Type.STRING },
                    testCases: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          input: { type: Type.STRING },
                          expected: { type: Type.STRING }
                        }
                      }
                    }
                  },
                  required: ["title", "description", "examples", "constraints", "starterCode", "testCases"]
                }
              },
              required: ["insights", "aptitudeQuestions", "technicalQuestions"]
            }
          }
        });

        const data = JSON.parse(result.text);
        const combinedQuestions = [
          ...data.aptitudeQuestions.map((q: any) => ({ ...q, category: 'Aptitude' })),
          ...data.technicalQuestions.map((q: any) => ({ ...q, category: 'Technical' }))
        ];
        setQuestions(combinedQuestions);
        setCodingProblem(data.codingProblem);
        setUserCode(data.codingProblem.starterCode);
        setTestInsights(data.insights);
        setUserAnswers(new Array(combinedQuestions.length).fill(-1));
        setTestStep('pre-test-summary');
        return;
      }

      let context = "";
      if (activeMode === 'mcq-dsa') context = `Data Structures and Algorithms topic: ${selectedTopic === 'Random' ? 'Mixed DSA topics' : selectedTopic}`;
      else if (activeMode === 'mcq-role') context = `Role: ${selectedRole === 'Custom' ? customRole : selectedRole}`;
      else if (activeMode === 'sql-optimization') context = "SQL Query Optimization, Database Performance Tuning, Indexing, and Efficient Query Writing";
      else context = "General technical interview questions";

      const finalQuestionCount = customQuestionCount ? Math.min(parseInt(customQuestionCount) || 10, 50) : questionCount;

      const prompt = `Generate ${finalQuestionCount} high-quality multiple choice questions for a technical assessment.
      Context: ${context}
      Difficulty: ${difficulty}
      
      IMPORTANT: Use Google Search to find actual previous year questions or very similar patterns for ${activeExamName || activeCompany}.
      
      ${(activeMode === 'mcq-role') ? 'IMPORTANT: Include a significant number of questions on fundamental concepts, core principles, and foundational knowledge relevant to this specific company and role.' : ''}
      
      Also provide deep insights about the role and topic.
      If this is a company-specific round, include a detailed analysis of their interview process and typical patterns.
      
      Return the response as a JSON object with the following schema:
      {
        "insights": {
          "whatIsThis": "string (explain what this specific test covers)",
          "whyUseThis": "string (explain why this test is important for the user's goal)",
          "companyInfo": "string (brief info about company, only if comprehensive-company-test)",
          "roleExpectations": "string (what is expected for this role/topic)",
          "keyTopics": ["string", "string"],
          "preparationTips": ["string", "string"],
          "deepAnalysis": "string (detailed analysis of company culture and interview style)",
          "interviewPattern": "string (step-by-step interview process)"
        },
        "questions": [
          {
            "id": "string",
            "question": "string",
            "options": ["string", "string", "string", "string"],
            "correctAnswer": number (0-3),
            "explanation": "string",
            "distractorAnalysis": ["string", "string", "string", "string"],
            "category": "string (e.g., 'Aptitude', 'Technical', 'Verbal', 'Reasoning')"
          }
        ]
      }`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          tools: [{ googleSearch: {} }],
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              insights: {
                type: Type.OBJECT,
                properties: {
                  whatIsThis: { type: Type.STRING },
                  whyUseThis: { type: Type.STRING },
                  companyInfo: { type: Type.STRING },
                  roleExpectations: { type: Type.STRING },
                  keyTopics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  preparationTips: { type: Type.ARRAY, items: { type: Type.STRING } },
                  deepAnalysis: { type: Type.STRING },
                  interviewPattern: { type: Type.STRING }
                },
                required: ["whatIsThis", "whyUseThis", "roleExpectations", "keyTopics", "preparationTips", "deepAnalysis", "interviewPattern"]
              },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    question: { type: Type.STRING },
                    options: { 
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      minItems: 4,
                      maxItems: 4
                    },
                    correctAnswer: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                    distractorAnalysis: { type: Type.ARRAY, items: { type: Type.STRING } },
                    category: { type: Type.STRING }
                  },
                  required: ["id", "question", "options", "correctAnswer", "explanation", "distractorAnalysis"]
                }
              }
            },
            required: ["insights", "questions"]
          }
        }
      });

      const data = JSON.parse(result.text);
      setQuestions(data.questions);
      setTestInsights(data.insights);
      setUserAnswers(new Array(data.questions.length).fill(-1));
      setTestStep('pre-test-summary');
    } catch (error) {
      console.error("Error generating questions:", error);
      
      if (activeMode === 'comprehensive-company-test') {
        const fallbackProblem = {
          title: "Two Sum",
          description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
          examples: [
            { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." }
          ],
          constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
          starterCode: "def twoSum(nums, target):\n    # Write your code here\n    pass",
          testCases: [
            { input: "[2,7,11,15], 9", expected: "[0,1]" }
          ]
        };
        setMode(activeMode);
        setCodingProblem(fallbackProblem);
        setUserCode(fallbackProblem.starterCode);
        setTestInsights({
          roleExpectations: "Focus on efficient algorithms and clean code.",
          keyTopics: ["Arrays", "Hash Maps", "Time Complexity"],
          preparationTips: ["Think about O(n) solutions", "Handle edge cases"]
        });
        setQuestions([]);
        setTestStep('pre-test-summary');
      } else {
        // Fallback questions if AI fails
        setTestInsights({
          roleExpectations: "Standard technical interview expectations for this level.",
          keyTopics: ["Core Data Structures", "Algorithms", "Time Complexity"],
          preparationTips: ["Stay calm", "Read carefully", "Think about edge cases"]
        });
        setQuestions([
          {
            id: '1',
            question: 'What is the time complexity of searching an element in a balanced Binary Search Tree?',
            options: ['O(1)', 'O(n)', 'O(log n)', 'O(n log n)'],
            correctAnswer: 2,
            explanation: 'In a balanced BST, each comparison halves the search space, leading to logarithmic time complexity.',
            distractorAnalysis: [
              'O(1) is constant time, which is only possible with direct access like an array index or hash map.',
              'O(n) is linear time, characteristic of searching in an unsorted array or linked list.',
              'O(log n) is correct as the search space is halved at each step.',
              'O(n log n) is typically the complexity of efficient sorting algorithms, not searching in a BST.'
            ]
          }
        ]);
        setUserAnswers([-1]);
        setTestStep('pre-test-summary');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
      if (initialMode === 'comprehensive-company-test' && initialCompany && initialRole) {
        setCompanyName(initialCompany);
        setCompanyRole(initialRole);
        generateQuestions(initialMode, initialCompany, initialRole);
      }
    }
  }, [initialMode, initialCompany, initialRole]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setSubmissionResult(null);
    setBottomTab('testresult');
    setIsConsoleOpen(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `Evaluate this Python code for the following problem. 
      This is a "Run" operation, so only evaluate against the provided example test cases.
      
      Problem: ${codingProblem?.title}
      Description: ${codingProblem?.description}
      Code:
      ${userCode}
      
      Example Test Cases:
      ${codingProblem?.examples ? JSON.stringify(codingProblem.examples.map(ex => ({ input: ex.input, output: ex.output, explanation: ex.explanation }))) : '[]'}
      
      Return the response as a JSON object with the following schema:
      {
        "status": "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded",
        "feedback": "string (brief feedback)",
        "testResults": [
          { "input": "string", "expected": "string", "actual": "string", "passed": boolean }
        ]
      }`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              feedback: { type: Type.STRING },
              testResults: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    input: { type: Type.STRING },
                    expected: { type: Type.STRING },
                    actual: { type: Type.STRING },
                    passed: { type: Type.BOOLEAN }
                  },
                  required: ["input", "expected", "actual", "passed"]
                }
              }
            },
            required: ["status", "feedback", "testResults"]
          }
        }
      });

      const evaluation = JSON.parse(result.text);
      setSubmissionResult(evaluation);
    } catch (error) {
      console.error("Error running code:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    setIsSubmitting(true);
    setSubmissionResult(null);
    setBottomTab('testresult');
    setIsConsoleOpen(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      
      // Combine examples and test cases for full evaluation
      const allTestCases = [
        ...codingProblem!.examples.map(ex => ({ input: ex.input, expected: ex.output })),
        ...codingProblem!.testCases
      ];

      const prompt = `Evaluate this Python code for the following problem. 
      This is a "Submit" operation, so evaluate against ALL provided test cases.
      
      Problem: ${codingProblem?.title}
      Description: ${codingProblem?.description}
      Code:
      ${userCode}
      
      Test Cases:
      ${JSON.stringify(allTestCases.map(tc => ({ input: tc.input, expected: tc.expected })))}
      
      Return the response as a JSON object with the following schema:
      {
        "status": "Accepted" | "Wrong Answer" | "Runtime Error" | "Time Limit Exceeded",
        "feedback": "string (detailed feedback)",
        "testResults": [
          { "input": "string", "expected": "string", "actual": "string", "passed": boolean }
        ]
      }`;

      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING },
              feedback: { type: Type.STRING },
              testResults: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    input: { type: Type.STRING },
                    expected: { type: Type.STRING },
                    actual: { type: Type.STRING },
                    passed: { type: Type.BOOLEAN }
                  },
                  required: ["input", "expected", "actual", "passed"]
                }
              }
            },
            required: ["status", "feedback", "testResults"]
          }
        }
      });

      const evaluation = JSON.parse(result.text);
      setSubmissionResult(evaluation);
      
      if (evaluation.status === 'Accepted') {
        // Delay slightly for dramatic effect
        setTimeout(() => {
          if (mode === 'comprehensive-company-test') {
            finishTest();
          } else {
            onComplete({
              id: Math.random().toString(36).substr(2, 9),
              title: `Coding: ${codingProblem?.title}`,
              score: "100/100",
              total: 100,
              correct: 100,
              time: new Date().toLocaleTimeString(),
              status: 'Completed',
              feedback: "Excellent! Your solution passed all test cases.",
              weaknesses: [],
              improvements: ["Try optimizing for space complexity"]
            });
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting code:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const value = e.currentTarget.value;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      setUserCode(newValue);
      
      // Set cursor position after update
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const startTest = () => {
    console.log("Starting test with mode:", mode);
    if (mode === 'comprehensive-company-test') {
      setTestStep('coding-active');
      setTimeLeft(45 * 60); // 45 minutes for coding
      setTestStartTime(Date.now());
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setTestStep('results');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    setTestStep('active');
    setCurrentQuestionIndex(0);
    setTimeLeft(questions.length * 60); // 1 minute per question
    setTestStartTime(Date.now());
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          finishTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const getCorrectCount = () => {
    let count = 0;
    userAnswers.forEach((ans, idx) => {
      const q = questions[idx];
      if (!q || ans === undefined || ans === null || ans === '') return;
      
      const userAnswer = ans.toString().trim();
      const correctAnswer = q.correctAnswer.toString().trim();
      
      if (q.type === 'code-fill') {
        if (userAnswer === correctAnswer) count++;
      } else {
        if (userAnswer.toLowerCase() === correctAnswer.toLowerCase()) count++;
      }
    });
    return count;
  };

  const finishTest = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (codingProblem && testStep !== 'coding-active' && testStep !== 'coding-results') {
      setTestStep('coding-active');
      setTimeLeft(45 * 60); // 45 minutes for coding section
      setTestStartTime(Date.now());
      
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return;
    }

    const correctCount = getCorrectCount();
    const score = `${correctCount}/${questions.length}`;
    const percentage = (correctCount / questions.length) * 100;

    if (mode === 'aptitude') {
      const currentAptitude = localStorage.getItem('aptitude_mastery_score');
      let newAptitude = currentAptitude ? parseFloat(currentAptitude) : 68;
      if (percentage >= 70) {
        newAptitude = Math.min(70, newAptitude + 5);
      } else if (percentage >= 40) {
        newAptitude = Math.min(70, newAptitude + 2);
      }
      localStorage.setItem('aptitude_mastery_score', newAptitude.toString());
      localStorage.setItem('aptitude_last_decay_date', new Date().toISOString());
    }

    const resultData: TestResult = {
      id: Math.random().toString(36).substr(2, 9),
      title: mode === 'comprehensive-company-test'
        ? `${companyName}${examName ? ` - ${examName}` : ''} (${companyRole})`
        : mode === 'mcq-role'
        ? `${selectedRole === 'Custom' ? customRole : selectedRole} - ${difficulty}`
        : `${String(mode).replace('-', ' ').toUpperCase()} - ${difficulty}`,
      score: score,
      total: questions.length,
      correct: correctCount,
      time: new Date().toLocaleTimeString(),
      status: 'Completed',
      feedback: percentage >= 70 ? "Great job! You have a solid understanding." : "Keep practicing! Review the explanations to improve.",
      weaknesses: [],
      improvements: ["Review the topics you missed", "Try a higher difficulty next time"],
      questions: questions,
      userAnswers: userAnswers
    };

    if (mode === 'comprehensive-company-test') {
      setIsEvaluating(true);
      setTestStep('evaluating');
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
        const prompt = `Evaluate the following mock interview performance for the role of ${companyRole} at ${companyName}.
        
        MCQ Results: ${correctCount}/${questions.length} correct.
        ${codingProblem && submissionResult ? `Coding Challenge: ${submissionResult.status === 'Accepted' ? 'Passed' : 'Failed'}. Feedback: ${submissionResult.feedback}` : ''}
        
        Questions and User Answers:
        ${questions.map((q, i) => `Q${i+1}: ${q.question}\nUser Answer: ${userAnswers[i]}\nCorrect Answer: ${q.correctAnswer}\n`).join('\n')}
        
        Provide a comprehensive evaluation including:
        1. A numerical score out of 100 (Interview Readiness Score).
        2. Detailed feedback on strengths and weaknesses.
        3. Specific improvement suggestions.
        
        Return the response as a JSON object:
        {
          "score": number,
          "feedback": "string",
          "weaknesses": ["string"],
          "improvements": ["string"]
        }`;

        const result = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: { responseMimeType: "application/json" }
        });

        const evaluation = JSON.parse(result.text);
        
        const finalResult: TestResult = {
          ...resultData,
          interviewScore: evaluation.score,
          feedback: evaluation.feedback,
          weaknesses: evaluation.weaknesses,
          improvements: evaluation.improvements
        };
        
        onComplete(finalResult);
      } catch (error) {
        console.error("Evaluation failed:", error);
        onComplete(resultData);
      } finally {
        setIsEvaluating(false);
        setTestStep('results');
      }
    } else {
      setTestStep('results');
      onComplete(resultData);
    }
  };

  const handleAnswerSelect = (answer: number | string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const testOptions = [
    { 
      id: 'mcq-dsa', 
      title: 'DSA MCQ Test', 
      description: 'Test your theoretical knowledge of Data Structures and Algorithms with multiple-choice questions.',
      icon: Code2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      id: 'mcq-role', 
      title: 'Role-Based MCQ', 
      description: 'Assess your skills in specific roles like Frontend, Backend, Fullstack, or Mobile development.',
      icon: Briefcase,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    { 
      id: 'comprehensive-company-test', 
      title: 'Company Specific Round', 
      description: 'Simulate actual placement rounds (Aptitude + Technical + Coding) for top tech companies like Google, Amazon, Microsoft, etc.',
      icon: Building2,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    { 
      id: 'aptitude', 
      title: 'Aptitude Test', 
      description: 'Master Numerical, Reasoning, and Verbal skills with custom, random, or company-specific aptitude challenges.',
      icon: Brain,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50'
    },
    { 
      id: 'input-output', 
      title: 'Input/Output & Code Completion', 
      description: 'Predict the output of code snippets or complete missing lines of code in various languages like C, C++, Java, and Python.',
      icon: Terminal,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    { 
      id: 'sql-optimization', 
      title: 'SQL Query Optimization', 
      description: 'Learn to write efficient database queries, understand indexing, and master performance tuning.',
      icon: Database,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50'
    }
  ];

  const handleStartTest = (optionId: TestMode) => {
    setMode(optionId);
    if (optionId === 'aptitude') {
      setTestStep('aptitude-config');
    } else if (optionId === 'input-output') {
      setTestStep('io-config');
    } else {
      setTestStep('difficulty');
    }
  };

  return (
    <div className={(testStep === 'coding-active' || testStep === 'coding-results') ? "w-full h-[calc(100vh-64px)] p-2 overflow-hidden" : "max-w-6xl mx-auto"}>
      <AnimatePresence mode="wait">
        {testStep === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8 py-12"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Assessment Center</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  Tailored tests for <span className="text-indigo-600 dark:text-indigo-400 font-bold">{initialRole || 'your career'}</span>.
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-semibold">
                <Trophy size={18} />
                <span>Rank: Pro</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleStartTest(option.id as TestMode)}
                  className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 text-left hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-xl hover:shadow-indigo-50 dark:hover:shadow-indigo-900/10 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${option.bgColor} dark:bg-opacity-10 ${option.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <option.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{option.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{option.description}</p>
                  <div className="mt-6 flex items-center text-indigo-600 dark:text-indigo-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Assessment <ChevronRight size={16} className="ml-1" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {testStep === 'io-config' && (
          <motion.div
            key="io-config"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto space-y-8"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Input/Output Test Config</h2>
              <p className="text-slate-500 dark:text-slate-400">Choose your preferred language or category.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['C', 'C++', 'Java', 'Python', 'JavaScript', 'Zoho question'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setIoLanguage(lang)}
                  className={`p-6 rounded-3xl border-2 transition-all text-center space-y-2 group ${
                    ioLanguage === lang
                      ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 ${
                    ioLanguage === lang ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    <Code2 size={20} />
                  </div>
                  <span className="font-bold text-sm">{lang}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-center gap-4 pt-6">
              <button onClick={() => setTestStep('overview')} className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Back</button>
              <button
                onClick={() => setTestStep('difficulty')}
                className="px-10 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20"
              >
                Next Step
              </button>
            </div>
          </motion.div>
        )}

        {testStep === 'difficulty' && (
          <motion.div
            key="difficulty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-2xl mx-auto text-center space-y-8 py-12"
          >
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Select Difficulty</h2>
              <p className="text-slate-500 dark:text-slate-400">Choose a level that matches your current expertise.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['Easy', 'Medium', 'Hard'] as const).map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    difficulty === level 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-lg font-bold">{level}</div>
                  <div className="text-xs mt-1 opacity-60">
                    {level === 'Easy' ? 'Fundamentals' : level === 'Medium' ? 'Intermediate' : 'Advanced'}
                  </div>
                </button>
              ))}
            </div>
            <div className="pt-6">
              <button
                onClick={() => {
                  if (mode === 'mcq-role') setTestStep('role-selection');
                  else if (mode === 'mcq-dsa') setTestStep('topic-selection');
                  else if (mode === 'comprehensive-company-test') setTestStep('company-config');
                  else generateQuestions();
                }}
                className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center gap-2 mx-auto"
              >
                Continue <ArrowRight size={18} />
              </button>
              <button onClick={() => setTestStep(mode === 'aptitude' ? 'aptitude-config' : 'overview')} className="mt-4 text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-medium">Go Back</button>
            </div>
          </motion.div>
        )}

        {testStep === 'aptitude-config' && (
          <motion.div
            key="aptitude-config"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-4xl mx-auto space-y-8 py-12"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Configure Aptitude Test</h2>
              <p className="text-slate-500 dark:text-slate-400">Choose how you want to be assessed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'custom', title: 'Custom Selection', description: 'Choose specific categories and topics.', icon: Settings, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
                { id: 'random', title: 'Random Mix', description: '20 questions across all aptitude topics.', icon: Repeat, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
                { id: 'company', title: 'Company Based', description: 'Tailored to a specific company exam pattern.', icon: Building2, color: 'text-amber-600', bgColor: 'bg-amber-50' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAptitudeSubMode(opt.id as any)}
                  className={`p-6 rounded-3xl border-2 text-left transition-all ${
                    aptitudeSubMode === opt.id 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg shadow-indigo-100 dark:shadow-none' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl ${opt.bgColor} dark:bg-opacity-10 ${opt.color} flex items-center justify-center mb-4`}>
                    <opt.icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{opt.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{opt.description}</p>
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
              {aptitudeSubMode === 'custom' && (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Select Categories</label>
                    <div className="flex flex-wrap gap-3">
                      {Object.keys(APTITUDE_CATEGORIES).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedAptitudeCategories(prev => 
                              prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
                            );
                          }}
                          className={`px-6 py-2 rounded-full border-2 text-sm font-bold transition-all ${
                            selectedAptitudeCategories.includes(cat)
                              ? 'border-indigo-600 bg-indigo-600 text-white'
                              : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {selectedAptitudeCategories.length > 0 && (
                    <div className="space-y-4">
                      <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Select Topics</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedAptitudeCategories.flatMap(cat => APTITUDE_CATEGORIES[cat as keyof typeof APTITUDE_CATEGORIES]).map((topic) => (
                          <button
                            key={topic}
                            onClick={() => {
                              setSelectedAptitudeTopics(prev => 
                                prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
                              );
                            }}
                            className={`p-3 rounded-xl border-2 text-xs font-bold transition-all text-center ${
                              selectedAptitudeTopics.includes(topic)
                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                                : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                            }`}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Number of Questions</label>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="5" 
                        max="50" 
                        step="5"
                        value={aptitudeQuestionCount}
                        onChange={(e) => setAptitudeQuestionCount(parseInt(e.target.value))}
                        className="flex-1 accent-indigo-600"
                      />
                      <span className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center font-bold">
                        {aptitudeQuestionCount}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {aptitudeSubMode === 'random' && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto">
                    <Repeat size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Ready for a surprise?</h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    We'll pick 20 questions from all categories (Numerical, Reasoning, Verbal) to test your overall aptitude.
                  </p>
                </div>
              )}

              {aptitudeSubMode === 'company' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Company Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. TCS, Infosys, Google..."
                        value={aptitudeCompany}
                        onChange={(e) => setAptitudeCompany(e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-300 dark:focus:border-indigo-700 outline-none dark:bg-slate-900 dark:text-white transition-all font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Exam Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. NQT, AMCAT, On-Campus..."
                        value={aptitudeExam}
                        onChange={(e) => setAptitudeExam(e.target.value)}
                        className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-300 dark:focus:border-indigo-700 outline-none dark:bg-slate-900 dark:text-white transition-all font-bold"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-widest">Additional Context / Pattern</label>
                    <textarea 
                      placeholder="Paste any specific exam pattern or topics mentioned in the job description..."
                      value={aptitudeContext}
                      onChange={(e) => setAptitudeContext(e.target.value)}
                      rows={4}
                      className="w-full p-4 rounded-2xl border-2 border-slate-100 dark:border-slate-800 focus:border-indigo-300 dark:focus:border-indigo-700 outline-none dark:bg-slate-900 dark:text-white transition-all font-medium resize-none"
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-center gap-4 pt-6">
                <button onClick={() => setTestStep('overview')} className="px-10 py-4 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Back</button>
                <button
                  disabled={
                    (aptitudeSubMode === 'custom' && (selectedAptitudeCategories.length === 0 || selectedAptitudeTopics.length === 0)) ||
                    (aptitudeSubMode === 'company' && (!aptitudeCompany || !aptitudeExam))
                  }
                  onClick={() => {
                    if (aptitudeSubMode === 'company') {
                      generateQuestions();
                    } else {
                      setTestStep('difficulty');
                    }
                  }}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {aptitudeSubMode === 'company' ? 'Analyze & Generate' : 'Next Step'} <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {testStep === 'role-selection' && (
          <motion.div
            key="role-selection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl mx-auto space-y-8 py-12"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Choose Your Role</h2>
              <p className="text-slate-500 dark:text-slate-400">We'll tailor the questions to your specific career path.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setSelectedRole(role);
                    setCustomRole('');
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-sm font-bold ${
                    selectedRole === role && !customRole
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {role}
                </button>
              ))}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Custom Role..."
                  value={customRole}
                  onChange={(e) => {
                    setCustomRole(e.target.value);
                    setSelectedRole('Custom');
                  }}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-sm font-bold outline-none ${
                    customRole 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                      : 'border-slate-100 dark:border-slate-800 focus:border-indigo-300 dark:focus:border-indigo-700 dark:bg-slate-900 dark:text-white'
                  }`}
                />
                {customRole && <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">Custom</div>}
              </div>
            </div>
            <div className="flex justify-center gap-4 pt-6">
              <button onClick={() => setTestStep('difficulty')} className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Back</button>
              <button
                disabled={!selectedRole || (selectedRole === 'Custom' && !customRole)}
                onClick={() => generateQuestions()}
                className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                Generate Test
              </button>
            </div>
          </motion.div>
        )}

        {testStep === 'topic-selection' && (
          <motion.div
            key="topic-selection"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-3xl mx-auto space-y-8 py-12"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                Select DSA Topic
              </h2>
              <p className="text-slate-500 dark:text-slate-400">
                Focus your assessment on a specific area of algorithms.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`p-4 rounded-xl border-2 transition-all text-sm font-bold ${
                    selectedTopic === topic 
                      ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>

            {mode === 'mcq-dsa' && (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300">Number of Questions</label>
                <div className="grid grid-cols-5 gap-2">
                  {[5, 10, 20, 30].map((count) => (
                    <button
                      key={count}
                      onClick={() => {
                        setQuestionCount(count);
                        setCustomQuestionCount('');
                      }}
                      className={`p-3 rounded-xl border-2 transition-all text-sm font-bold ${
                        questionCount === count && !customQuestionCount
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                          : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {count}
                    </button>
                  ))}
                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Custom"
                      value={customQuestionCount}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '' || (parseInt(val) >= 1 && parseInt(val) <= 50)) {
                          setCustomQuestionCount(val);
                        }
                      }}
                      className={`w-full p-3 rounded-xl border-2 transition-all text-sm font-bold outline-none ${
                        customQuestionCount 
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                          : 'border-slate-100 dark:border-slate-800 focus:border-indigo-300 dark:focus:border-indigo-700 dark:bg-slate-900 dark:text-white'
                      }`}
                    />
                    {customQuestionCount && <div className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">Custom</div>}
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 dark:text-slate-400 italic">Max 50 questions for custom count.</p>
              </div>
            )}

            <div className="flex justify-center gap-4 pt-6">
              <button onClick={() => setTestStep('difficulty')} className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Back</button>
              <button
                disabled={!selectedTopic}
                onClick={() => generateQuestions()}
                className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                Generate Test
              </button>
            </div>
          </motion.div>
        )}

        {testStep === 'company-config' && (
          <motion.div
            key="company-config"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-xl mx-auto space-y-8 py-12"
          >
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Company Details</h2>
              <p className="text-slate-500 dark:text-slate-400">Specify the target company for a realistic simulation.</p>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Company Name</label>
                  <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google, Amazon"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Role</label>
                  <input 
                    type="text" 
                    value={companyRole}
                    onChange={(e) => setCompanyRole(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Exam or Interview Name (Optional)</label>
                <input 
                  type="text" 
                  value={examName}
                  onChange={(e) => setExamName(e.target.value)}
                  placeholder="e.g. Technical Round 1, OA"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Job Description (Optional)</label>
                <textarea 
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here for better question targeting..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Experience Level</label>
                <div className="grid grid-cols-2 gap-4">
                  {(['Fresher', '1+ Year'] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setExperienceLevel(level)}
                      className={`p-3 rounded-xl border-2 font-bold transition-all ${
                        experienceLevel === level 
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' 
                          : 'border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-4 pt-6">
              <button onClick={() => setTestStep('difficulty')} className="px-8 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">Back</button>
              <button
                disabled={!companyName || !companyRole}
                onClick={() => generateQuestions()}
                className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
              >
                Generate Test
              </button>
            </div>
          </motion.div>
        )}

        {testStep === 'generating' && (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-xl mx-auto py-20 text-center space-y-8"
          >
            <div className="relative w-24 h-24 mx-auto">
              <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Brain size={32} />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI is Crafting Your Test</h2>
              <p className="text-slate-500 dark:text-slate-400">Generating unique questions based on your preferences...</p>
            </div>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Analyzing {mode === 'mcq-role' ? (selectedRole === 'Custom' ? customRole : selectedRole) : String(mode).replace('-', ' ')} patterns</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Calibrating {difficulty} difficulty</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-400">
                <Loader2 size={16} className="animate-spin text-indigo-600 dark:text-indigo-400" />
                <span>Structuring assessment data</span>
              </div>
            </div>
          </motion.div>
        )}

        {testStep === 'evaluating' && (
          <motion.div
            key="evaluating"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center space-y-8 py-20"
          >
            <div className="relative w-32 h-32 mx-auto">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-4 border-emerald-500 border-b-transparent rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                <Sparkles size={40} className="animate-pulse" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">AI is Evaluating Your Performance</h2>
              <p className="text-slate-500 dark:text-slate-400">Analyzing your answers and coding logic to provide a detailed readiness score...</p>
            </div>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Reviewing MCQ accuracy</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-400">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <span>Analyzing coding challenge results</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400 dark:text-slate-400">
                <Loader2 size={16} className="animate-spin text-indigo-600 dark:text-indigo-400" />
                <span>Generating readiness score & feedback</span>
              </div>
            </div>
          </motion.div>
        )}

        {testStep === 'pre-test-summary' && testInsights && (
          <motion.div
            key="pre-test-summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-2xl space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles size={32} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">AI Assessment Insights</h2>
              <p className="text-slate-500 dark:text-slate-400">
                Here's what we've prepared for your {
                  mode === 'comprehensive-company-test' ? 'Company Round' : 
                  mode === 'mcq-role' ? `${selectedRole === 'Custom' ? customRole : selectedRole} Assessment` :
                  mode === 'mcq-dsa' ? `${selectedTopic} DSA Assessment` :
                  'Assessment'
                }.
              </p>
            </div>

            {/* AI Explanation Header */}
            {((testInsights as any).whatIsThis || (testInsights as any).whyUseThis) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(testInsights as any).whatIsThis && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-2">
                    <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                      <BookOpen size={16} />
                      <h3 className="font-bold uppercase tracking-widest text-[10px]">What is this?</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{(testInsights as any).whatIsThis}</p>
                  </div>
                )}
                {(testInsights as any).whyUseThis && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <Target size={16} />
                      <h3 className="font-bold uppercase tracking-widest text-[10px]">Why use this?</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{(testInsights as any).whyUseThis}</p>
                  </div>
                )}
              </div>
            )}

            <div className="space-y-6">
              {testInsights.companyInfo && mode === 'comprehensive-company-test' && (
                <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                    <Building2 size={18} className="text-indigo-600 dark:text-indigo-400" />
                    About {companyName}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{testInsights.companyInfo}</p>
                </div>
              )}

              <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <Target size={18} className="text-indigo-600 dark:text-indigo-400" />
                  {mode === 'comprehensive-company-test' ? `${companyRole} Expectations` : 'Role Expectations'}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{testInsights.roleExpectations}</p>
              </div>

              {testInsights.deepAnalysis && (
                <div className="p-5 bg-violet-50 dark:bg-violet-900/10 rounded-3xl border border-violet-100 dark:border-violet-900/20 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-violet-900 dark:text-violet-300">
                    <History size={18} className="text-violet-600 dark:text-violet-400" />
                    Deep Analysis
                  </div>
                  <p className="text-sm text-violet-800 dark:text-violet-400 leading-relaxed">{testInsights.deepAnalysis}</p>
                </div>
              )}

              {testInsights.interviewPattern && (
                <div className="p-5 bg-emerald-50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100 dark:border-emerald-900/20 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                    <Repeat size={18} className="text-emerald-600 dark:text-emerald-400" />
                    Interview Pattern
                  </div>
                  <p className="text-sm text-emerald-800 dark:text-emerald-400 leading-relaxed">{testInsights.interviewPattern}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/20 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-indigo-900 dark:text-indigo-300">
                    <Brain size={18} className="text-indigo-600 dark:text-indigo-400" />
                    Key Topics
                  </div>
                  <ul className="space-y-1.5">
                    {testInsights.keyTopics?.map((topic, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-indigo-700 dark:text-indigo-400">
                        <div className="w-1 h-1 bg-indigo-400 dark:bg-indigo-600 rounded-full" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-3xl border border-emerald-100/50 dark:border-emerald-900/20 space-y-3">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300">
                    <Zap size={18} className="text-emerald-600 dark:text-emerald-400" />
                    Prep Tips
                  </div>
                  <ul className="space-y-1.5">
                    {testInsights.preparationTips?.map((tip, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400">
                        <div className="w-1 h-1 bg-emerald-400 dark:bg-emerald-600 rounded-full" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => setTestStep('rules')}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-indigo-900/20 flex items-center justify-center gap-2 group"
              >
                OK GO HEAD <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}

        {testStep === 'rules' && (
          <motion.div
            key="rules"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-xl space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Test Rules & Info</h2>
              <p className="text-slate-500 dark:text-slate-400">Please read carefully before starting the assessment.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-start gap-3">
                <Timer className="text-indigo-600 dark:text-indigo-400 mt-1" size={20} />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Time Limit</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {mode === 'comprehensive-company-test' ? '45 Minutes total' : `${questions.length} Minutes total`}
                  </div>
                </div>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-start gap-3">
                <Target className="text-emerald-600 dark:text-emerald-400 mt-1" size={20} />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">Assessment</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {mode === 'comprehensive-company-test' ? '1 Coding Problem' : `${questions.length} MCQs`}
                  </div>
                </div>
              </div>
            </div>

            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                Once started, the timer cannot be paused.
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                {mode === 'comprehensive-company-test' ? 'You can submit your code multiple times.' : 'Each question has only one correct answer.'}
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-600 dark:bg-indigo-400 rounded-full"></div>
                Feedback and explanations will be provided at the end.
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={startTest}
                className="w-full py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all shadow-xl shadow-slate-200 dark:shadow-indigo-900/20 flex items-center justify-center gap-2"
              >
                Start Assessment Now <Zap size={18} />
              </button>
            </div>
          </motion.div>
        )}

        {testStep === 'active' && (
          <motion.div
            key="active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            {/* Header / Progress */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="text-sm font-bold text-slate-400 dark:text-slate-400">
                  Question <span className="text-slate-900 dark:text-white">{currentQuestionIndex + 1}</span> of {questions.length}
                </div>
                <div className="w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              <div className={`flex items-center gap-2 font-mono font-bold ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-slate-600 dark:text-slate-400'}`}>
                <Timer size={18} />
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-10 shadow-sm space-y-8 min-h-[400px] flex flex-col justify-between">
              <div className="space-y-6">
                {questions[currentQuestionIndex].category && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">
                      Section
                    </div>
                    <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-900/40">
                      {questions[currentQuestionIndex].category}
                    </div>
                  </div>
                )}
                <div className="prose dark:prose-invert max-w-none">
                  <ReactMarkdown
                    components={{
                      p: ({ children }) => <div className="mb-4 last:mb-0">{children}</div>,
                      code({ node, inline, className, children, ...props }: any) {
                        const match = /language-(\w+)/.exec(className || '');
                        if (!inline) {
                          const codeString = String(children).replace(/\n$/, '');
                          const lines = codeString.split('\n');
                          return (
                            <div className="bg-slate-900 rounded-2xl p-6 my-4 overflow-x-auto border border-slate-800 relative group">
                              <div className="flex gap-4">
                                <div className="flex flex-col text-slate-600 font-mono text-sm text-right select-none border-r border-slate-800 pr-4 min-w-[2.5rem]">
                                  {lines.map((_, i) => (
                                    <span key={i}>{i + 1}</span>
                                  ))}
                                </div>
                                <code className="text-indigo-300 font-mono text-sm leading-relaxed whitespace-pre" {...props}>
                                  {children}
                                </code>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono text-xs" {...props}>
                            {children}
                          </code>
                        );
                      }
                    }}
                  >
                    {questions[currentQuestionIndex].question}
                  </ReactMarkdown>
                </div>
                
                {questions[currentQuestionIndex].type === 'fill' || questions[currentQuestionIndex].type === 'code-fill' ? (
                  <div className="space-y-4">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                      {questions[currentQuestionIndex].type === 'fill' ? 'Type your output here:' : 'Complete the missing code line(s):'}
                    </label>
                    {questions[currentQuestionIndex].type === 'fill' ? (
                      <input
                        type="text"
                        value={userAnswers[currentQuestionIndex] || ''}
                        onChange={(e) => handleAnswerSelect(e.target.value)}
                        placeholder="Enter the exact output..."
                        className="w-full p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-indigo-600 outline-none transition-all font-mono"
                      />
                    ) : (
                      <textarea
                        value={userAnswers[currentQuestionIndex] || ''}
                        onChange={(e) => handleAnswerSelect(e.target.value)}
                        placeholder="Type the missing code here..."
                        rows={4}
                        className="w-full p-5 rounded-2xl border-2 border-slate-100 dark:border-slate-800 bg-slate-900 text-indigo-300 focus:border-indigo-600 outline-none transition-all font-mono text-sm leading-relaxed"
                      />
                    )}
                    <p className="text-xs text-slate-500">
                      {questions[currentQuestionIndex].type === 'fill' 
                        ? 'Note: Output must be exact (case-insensitive, including spaces if any).'
                        : 'Note: Provide the exact code to replace [BLANK]. Maintain proper indentation.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {questions[currentQuestionIndex].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswerSelect(idx)}
                        className={`p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
                          userAnswers[currentQuestionIndex] === idx || userAnswers[currentQuestionIndex] === idx.toString()
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                            : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <span className="font-medium">{option}</span>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                          userAnswers[currentQuestionIndex] === idx || userAnswers[currentQuestionIndex] === idx.toString()
                            ? 'border-indigo-600 bg-indigo-600 text-white'
                            : 'border-slate-200 dark:border-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-600'
                        }`}>
                          {(userAnswers[currentQuestionIndex] === idx || userAnswers[currentQuestionIndex] === idx.toString()) && <Check size={14} strokeWidth={3} />}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-8 border-t border-slate-100 dark:border-slate-800">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="flex items-center gap-2 text-slate-400 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-bold transition-colors disabled:opacity-0"
                >
                  <ArrowLeft size={18} /> Previous
                </button>
                
                {currentQuestionIndex === questions.length - 1 ? (
                  <button
                    onClick={finishTest}
                    className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 flex items-center gap-2"
                  >
                    {codingProblem ? (
                      <>
                        Next Section: Coding <ArrowRight size={18} />
                      </>
                    ) : (
                      'Finish Assessment'
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                    className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-bold transition-colors"
                  >
                    {questions[currentQuestionIndex].category !== questions[currentQuestionIndex + 1].category ? (
                      <>
                        Next Section: {questions[currentQuestionIndex + 1].category} <ArrowRight size={18} />
                      </>
                    ) : (
                      <>
                        Next Question <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {testStep === 'coding-active' && (
          codingProblem ? (
            <motion.div
              key="coding-active"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col gap-2"
            >
              {/* Top Bar: Navigation & Actions */}
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center gap-4">
                  <div 
                    onClick={() => setTestStep('overview')}
                    className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer transition-colors group"
                  >
                    <div className="p-1.5 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-all">
                      <ArrowLeft size={18} />
                    </div>
                    <span className="text-sm font-bold">Back</span>
                  </div>
                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-colors">
                    <FileText size={18} />
                    <span className="text-sm font-bold">Problem List</span>
                  </div>
                  <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
                  <div className="flex items-center gap-3">
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all">
                      <ArrowLeft size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all">
                      <ArrowRight size={16} />
                    </button>
                    <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-all">
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>

                  <div className="flex items-center gap-4">
                    <div className={`flex items-center gap-2 px-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full font-mono text-sm font-bold border border-slate-100 dark:border-slate-800 ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-600 dark:text-slate-400'}`}>
                      <Clock size={16} />
                      {formatTime(timeLeft)}
                    </div>
                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
                    <button
                      onClick={handleRunCode}
                      disabled={isSubmitting || isRunning}
                      className="px-5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} fill="currentColor" />}
                      Run
                    </button>
                    <button
                      onClick={submitCode}
                      disabled={isSubmitting || isRunning}
                      className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20 flex items-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} fill="currentColor" />}
                      Submit
                    </button>
                  </div>

                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 dark:text-slate-400 transition-all"><Settings size={20} /></button>
                  <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">SM</div>
                </div>
              </div>

              {/* Main Content: Split View */}
              <div className="flex-1 flex gap-2 overflow-hidden">
                {/* Left Panel: Problem Info */}
                <div className="w-[45%] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm">
                  {/* Tabs Header */}
                  <div className="flex items-center bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-2">
                    {[
                      { id: 'description', label: 'Description', icon: FileText },
                      { id: 'editorial', label: 'Editorial', icon: BookOpen },
                      { id: 'solutions', label: 'Solutions', icon: MessageSquare },
                      { id: 'submissions', label: 'Submissions', icon: History }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setLeftTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-3 text-xs font-bold transition-all border-b-2 ${
                          leftTab === tab.id 
                            ? 'border-indigo-600 text-indigo-600 bg-white dark:bg-slate-900' 
                            : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300'
                        }`}
                      >
                        <tab.icon size={14} />
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {leftTab === 'description' && (
                      <>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2">
                                <div className="px-2 py-0.5 bg-indigo-600 text-white rounded text-[8px] font-bold uppercase tracking-wider">
                                  Section
                                </div>
                                <div className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded text-[8px] font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-900/40">
                                  Coding
                                </div>
                              </div>
                              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{codingProblem.title}</h1>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              difficulty === 'Easy' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' :
                              difficulty === 'Medium' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                            }`}>
                              {difficulty}
                            </div>
                          </div>
                        
                        <div className="flex items-center gap-3">
                          <button className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-all">
                            <Target size={14} /> Topics
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-all">
                            <Building2 size={14} /> Companies
                          </button>
                          <button className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-all">
                            <Brain size={14} /> Hint
                          </button>
                        </div>

                        <div className="text-slate-600 dark:text-slate-400 leading-relaxed prose prose-slate dark:prose-invert max-w-none text-sm">
                          {codingProblem.description}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {codingProblem.examples.map((ex, i) => (
                          <div key={i} className="space-y-2">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Example {i + 1}:</h4>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 font-mono text-xs space-y-1">
                              <div><span className="font-bold text-slate-500 dark:text-slate-400">Input:</span> <span className="text-slate-900 dark:text-slate-200">{ex.input}</span></div>
                              <div><span className="font-bold text-slate-500 dark:text-slate-400">Output:</span> <span className="text-slate-900 dark:text-slate-200">{ex.output}</span></div>
                              {ex.explanation && (
                                <div className="mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                                  <span className="font-bold text-slate-500 dark:text-slate-400">Explanation:</span> <span className="text-slate-900 dark:text-slate-200">{ex.explanation}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Constraints:</h4>
                        <ul className="space-y-1.5">
                          {codingProblem.constraints.map((c, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <div className="w-1 h-1 bg-slate-300 dark:bg-slate-600 rounded-full mt-1.5 flex-shrink-0" />
                              <code className="bg-slate-100 dark:bg-slate-800 px-1 rounded">{c}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                  {leftTab !== 'description' && (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-400 space-y-4">
                      <Lock size={48} strokeWidth={1} />
                      <p className="text-sm font-medium">This section is locked during the assessment</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Panel: Editor & Console */}
              <div className="flex-1 flex flex-col gap-2 overflow-hidden">
                {/* Editor Section */}
                <div className="flex-1 bg-slate-900 rounded-2xl overflow-hidden flex flex-col border border-slate-800 shadow-lg">
                  <div className="bg-slate-800/50 px-4 py-2 flex items-center justify-between border-b border-slate-700/50">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-lg text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        Python 3 <ChevronDown size={12} />
                      </button>
                      <div className="h-4 w-px bg-slate-700" />
                      <div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                        <Terminal size={14} /> solution.py
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setUserCode(codingProblem.starterCode)}
                        className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-500 transition-all flex items-center gap-1.5 text-[10px] font-bold uppercase"
                      >
                        <RefreshCw size={14} /> Reset
                      </button>
                      <button className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-500 transition-all"><Maximize2 size={14} /></button>
                    </div>
                  </div>
                  <div className="flex-1 relative group">
                    {/* Line Numbers Simulation */}
                    <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-800/20 border-r border-slate-800/50 flex flex-col items-center py-6 text-[10px] font-mono text-slate-600 select-none">
                      {Array.from({ length: Math.max(userCode.split('\n').length, 20) }).map((_, i) => (
                        <div key={i} className="h-6 leading-6">{i + 1}</div>
                      ))}
                    </div>
                    <textarea
                      ref={editorRef}
                      value={userCode}
                      onChange={(e) => setUserCode(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="absolute inset-0 left-12 bg-transparent text-slate-300 p-6 font-mono text-sm outline-none resize-none leading-6"
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Console Section */}
                <div className={`${isConsoleOpen ? 'h-[35%]' : 'h-12'} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-sm transition-all duration-300`}>
                  <div className="flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 px-2">
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          setIsConsoleOpen(true);
                          setBottomTab('testcase');
                        }}
                        className={`flex items-center gap-2 px-4 py-3 text-[10px] font-bold transition-all border-b-2 ${
                          bottomTab === 'testcase' && isConsoleOpen
                            ? 'border-emerald-600 text-emerald-600 bg-white dark:bg-slate-900' 
                            : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300'
                        }`}
                      >
                        <CheckCircle2 size={14} />
                        Test Case
                      </button>
                      <button
                        onClick={() => {
                          setIsConsoleOpen(true);
                          setBottomTab('testresult');
                        }}
                        className={`flex items-center gap-2 px-4 py-3 text-[10px] font-bold transition-all border-b-2 ${
                          bottomTab === 'testresult' && isConsoleOpen
                            ? 'border-indigo-600 text-indigo-600 bg-white dark:bg-slate-900' 
                            : 'border-transparent text-slate-400 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300'
                        }`}
                      >
                        <Terminal size={14} />
                        Test Result
                      </button>
                    </div>
                    <button 
                      onClick={() => setIsConsoleOpen(!isConsoleOpen)}
                      className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    >
                      <ChevronDown size={16} className={`transition-transform duration-300 ${isConsoleOpen ? '' : 'rotate-180'}`} />
                    </button>
                  </div>

                  {isConsoleOpen && (
                    <div className="flex-1 overflow-y-auto p-5">
                      {bottomTab === 'testcase' && (
                        <div className="space-y-4">
                          <div className="flex gap-2">
                            {codingProblem.examples.map((_, i) => (
                              <button 
                                key={i} 
                                onClick={() => setSelectedCase(i)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${selectedCase === i ? 'bg-slate-900 dark:bg-slate-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                              >
                                Case {i + 1}
                              </button>
                            ))}
                          </div>
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider font-mono">Input</div>
                              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
                                {codingProblem.examples[selectedCase]?.input || ''}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider font-mono">Expected Output</div>
                              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300">
                                {codingProblem.examples[selectedCase]?.output || ''}
                              </div>
                            </div>
                            {codingProblem.examples[selectedCase]?.explanation && (
                              <div className="space-y-1.5">
                                <div className="text-[10px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider font-mono">Explanation</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 italic leading-relaxed">
                                  {codingProblem.examples[selectedCase].explanation}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {bottomTab === 'testresult' && (
                        <div className="h-full">
                          {!submissionResult && !isSubmitting && !isRunning && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-400 space-y-2">
                              <p className="text-xs font-medium">You must run your code first</p>
                            </div>
                          )}

                          {(isSubmitting || isRunning) && (
                            <div className="flex flex-col items-center justify-center h-full text-indigo-600 dark:text-indigo-400 space-y-3">
                              <Loader2 size={24} className="animate-spin" />
                              <p className="text-[10px] font-bold animate-pulse uppercase tracking-widest">Running tests...</p>
                            </div>
                          )}

                          {submissionResult && (
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className={`text-sm font-bold ${submissionResult.status === 'Accepted' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                                  {submissionResult.status}
                                </div>
                                <div className="text-[10px] text-slate-400 dark:text-slate-400 font-mono">Runtime: 42ms</div>
                              </div>
                              <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 italic">
                                {submissionResult.feedback}
                              </div>
                              <div className="space-y-2">
                                {submissionResult.testResults.map((res: any, i: number) => (
                                  <div key={i} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl text-[10px]">
                                    <div className="flex items-center gap-3">
                                      <div className={`w-1.5 h-1.5 rounded-full ${res.passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                      <span className="text-slate-400 dark:text-slate-400">Case {i + 1}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="text-slate-400 dark:text-slate-400">Exp: <span className="text-slate-900 dark:text-slate-200 font-mono">{res.expected}</span></div>
                                      <div className={res.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}>
                                        Act: <span className="font-bold font-mono">{res.actual}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {submissionResult.status === 'Accepted' && (
                                <button
                                  onClick={() => setTestStep('coding-results')}
                                  className="w-full py-3 bg-slate-900 dark:bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all text-xs"
                                >
                                  Finish Challenge
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          ) : (
            <motion.div
              key="coding-error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                <AlertCircle size={40} />
              </div>
              <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Problem Not Found</h2>
                <p className="text-slate-500 dark:text-slate-400">
                  We encountered an issue loading the coding challenge. This can happen if the AI generation was interrupted or returned invalid data.
                </p>
              </div>
              <button
                onClick={() => setTestStep('overview')}
                className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Return to Overview
              </button>
            </motion.div>
          )
        )}

        {(testStep === 'results' || testStep === 'coding-results') && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={(testStep === 'coding-results') ? "h-full overflow-y-auto space-y-8 py-4 pb-20" : "max-w-4xl mx-auto space-y-8 py-12 pb-20"}
          >
            {/* Result Header */}
            <div className="bg-slate-900 dark:bg-slate-950 rounded-[2.5rem] p-12 text-white text-center space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500 rounded-full blur-[100px]" />
              </div>

              <div className="relative z-10 space-y-4">
                <div className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Award size={40} className="text-amber-400" />
                </div>
                <h1 className="text-4xl font-bold">Assessment Complete!</h1>
                <p className="text-slate-400 max-w-md mx-auto">
                  You've completed the {
                    mode === 'aptitude' ? 'Aptitude' :
                    mode === 'mcq-role' ? (selectedRole === 'Custom' ? customRole : selectedRole) : 
                    String(mode).replace('-', ' ')
                  } challenge. Here's how you performed.
                </p>
                
                <div className="flex justify-center gap-12 pt-8">
                  {questions.length > 0 && (
                    <>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-white">
                          {getCorrectCount()}
                          <span className="text-slate-400 text-xl">/{questions.length}</span>
                        </div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">MCQ Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-4xl font-bold text-emerald-400">
                          {Math.round((getCorrectCount() / questions.length) * 100)}%
                        </div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">MCQ Accuracy</div>
                      </div>
                    </>
                  )}
                  {codingProblem && submissionResult && (
                    <div className="text-center">
                      <div className={`text-4xl font-bold ${submissionResult.status === 'Accepted' ? 'text-emerald-400' : 'text-red-400'}`}>
                        {submissionResult.status}
                      </div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mt-1">Coding Status</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Detailed Feedback */}
            <div className="space-y-6">
              {codingProblem && submissionResult && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Coding Challenge Review</h2>
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">{codingProblem.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${submissionResult.status === 'Accepted' ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'}`}>
                        {submissionResult.status}
                      </span>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 italic">
                      {submissionResult.feedback}
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Test Case Results:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {submissionResult.testResults.map((res: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${res.passed ? 'bg-emerald-500' : 'bg-red-500'}`} />
                              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Case {i + 1}</span>
                            </div>
                            <span className={`text-xs font-bold ${res.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                              {res.passed ? 'Passed' : 'Failed'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {questions.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">MCQ Review & Explanations</h2>
                  <div className="space-y-4">
                    {questions.map((q, idx) => {
                      const isCorrect = userAnswers[idx]?.toString().trim().toLowerCase() === q.correctAnswer?.toString().trim().toLowerCase();
                      return (
                        <div key={q.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Question {idx + 1}</span>
                                {isCorrect ? (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                                    <CheckCircle2 size={10} /> Correct
                                  </span>
                                ) : (
                                  <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                                    <XCircle size={10} /> Incorrect
                                  </span>
                                )}
                              </div>
                              <div className="prose dark:prose-invert max-w-none">
                                <ReactMarkdown
                                  components={{
                                    p: ({ children }) => <div className="mb-2 last:mb-0">{children}</div>,
                                    code({ node, inline, className, children, ...props }: any) {
                                      if (!inline) {
                                        const codeString = String(children).replace(/\n$/, '');
                                        const lines = codeString.split('\n');
                                        return (
                                          <div className="bg-slate-900 rounded-xl p-4 my-2 overflow-x-auto border border-slate-800 relative group">
                                            <div className="flex gap-4">
                                              <div className="flex flex-col text-slate-600 font-mono text-[10px] text-right select-none border-r border-slate-800 pr-3 min-w-[2rem]">
                                                {lines.map((_, i) => (
                                                  <span key={i}>{i + 1}</span>
                                                ))}
                                              </div>
                                              <code className="text-indigo-300 font-mono text-xs leading-relaxed whitespace-pre" {...props}>
                                                {children}
                                              </code>
                                            </div>
                                          </div>
                                        );
                                      }
                                      return (
                                        <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono text-xs" {...props}>
                                          {children}
                                        </code>
                                      );
                                    }
                                  }}
                                >
                                  {q.question}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>

                          {q.type === 'fill' ? (
                            <div className="space-y-3">
                              <div className="flex flex-col gap-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Your Answer:</span>
                                <div className={`p-4 rounded-xl border-2 text-sm font-mono ${isCorrect ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-red-200 bg-red-50 text-red-700'}`}>
                                  {userAnswers[idx] || '(No answer)'}
                                </div>
                              </div>
                              {!isCorrect && (
                                <div className="flex flex-col gap-2">
                                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Correct Answer:</span>
                                  <div className="p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-mono font-bold">
                                    {q.correctAnswer}
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.options.map((opt, optIdx) => {
                                const isCorrectOption = optIdx.toString() === q.correctAnswer.toString();
                                const isUserSelected = userAnswers[idx]?.toString() === optIdx.toString();
                                
                                let style = "border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400";
                                if (isCorrectOption) style = "border-emerald-200 dark:border-emerald-900/50 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-bold";
                                else if (isUserSelected && !isCorrect) style = "border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 font-bold";
                                
                                return (
                                  <div key={optIdx} className={`p-4 rounded-xl border-2 text-sm ${style}`}>
                                    {opt}
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          <div className="space-y-4">
                            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-start gap-3">
                              <Info className="text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" size={18} />
                              <div className="text-sm text-indigo-900 dark:text-indigo-300 leading-relaxed">
                                <span className="font-bold">Explanation: </span>
                                <ReactMarkdown
                                  components={{
                                    p: ({ children }) => <span className="inline">{children}</span>,
                                    code({ node, inline, className, children, ...props }: any) {
                                      if (!inline) {
                                        const codeString = String(children).replace(/\n$/, '');
                                        const lines = codeString.split('\n');
                                        return (
                                          <div className="bg-slate-900 rounded-xl p-4 my-2 overflow-x-auto border border-slate-800 relative group">
                                            <div className="flex gap-4">
                                              <div className="flex flex-col text-slate-600 font-mono text-[10px] text-right select-none border-r border-slate-800 pr-3 min-w-[2rem]">
                                                {lines.map((_, i) => (
                                                  <span key={i}>{i + 1}</span>
                                                ))}
                                              </div>
                                              <code className="text-indigo-300 font-mono text-xs leading-relaxed whitespace-pre" {...props}>
                                                {children}
                                              </code>
                                            </div>
                                          </div>
                                        );
                                      }
                                      return (
                                        <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono text-xs" {...props}>
                                          {children}
                                        </code>
                                      );
                                    }
                                  }}
                                >
                                  {q.explanation}
                                </ReactMarkdown>
                              </div>
                            </div>

                            {!isCorrect && userAnswers[idx] !== -1 && q.type !== 'fill' && (
                              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-start gap-3 border border-red-100 dark:border-red-900/30">
                                <AlertCircle className="text-red-600 dark:text-red-400 mt-0.5 shrink-0" size={18} />
                                <div className="space-y-1">
                                  <p className="text-sm text-red-900 dark:text-red-300 font-bold">Why your answer was incorrect:</p>
                                  <div className="text-sm text-red-800 dark:text-red-400 leading-relaxed">
                                    <ReactMarkdown
                                      components={{
                                        p: ({ children }) => <span className="inline">{children}</span>,
                                        code({ node, inline, className, children, ...props }: any) {
                                          if (!inline) {
                                            const codeString = String(children).replace(/\n$/, '');
                                            const lines = codeString.split('\n');
                                            return (
                                              <div className="bg-slate-900 rounded-xl p-4 my-2 overflow-x-auto border border-slate-800 relative group">
                                                <div className="flex gap-4">
                                                  <div className="flex flex-col text-slate-600 font-mono text-[10px] text-right select-none border-r border-slate-800 pr-3 min-w-[2rem]">
                                                    {lines.map((_, i) => (
                                                      <span key={i}>{i + 1}</span>
                                                    ))}
                                                  </div>
                                                  <code className="text-indigo-300 font-mono text-xs leading-relaxed whitespace-pre" {...props}>
                                                    {children}
                                                  </code>
                                                </div>
                                              </div>
                                            );
                                          }
                                          return (
                                            <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono text-xs" {...props}>
                                              {children}
                                            </code>
                                          );
                                        }
                                      }}
                                    >
                                      {q.distractorAnalysis[userAnswers[idx]]}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
              <button
                onClick={() => setTestStep('overview')}
                className="px-10 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-800 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => generateQuestions()}
                className="px-10 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Retake Test
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

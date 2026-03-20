import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { FileText, Save, Trash2, Plus, Search, Clock, ChevronRight, Eye, Edit3, Pin, PinOff, Calendar, Bell, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import DatePicker from 'react-datepicker';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { User as FirebaseUser } from 'firebase/auth';
import { DSAPathway } from './DSAPathway';
import { 
  db, 
  handleFirestoreError, 
  OperationType,
  collection,
  doc,
  setDoc,
  addDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  deleteDoc
} from '../firebase';

interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: number;
  dueDate?: number;
  isPinned?: boolean;
  uid?: string;
}

interface NotepadSectionProps {
  user: FirebaseUser | null;
}

export function NotepadSection({ user }: NotepadSectionProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  
  const initialLoadDone = useRef(false);

  // Load initial notes (from localStorage or defaults)
  useEffect(() => {
    if (initialLoadDone.current) return;
    
    const saved = localStorage.getItem('dsaforge_notes');
    let initialNotes = saved ? JSON.parse(saved) : [];
    
    // Ensure DSA Pathway exists
    const hasPathway = initialNotes.some((n: any) => n.id === 'dsa-pathway');
    if (!hasPathway) {
      const pathwayNote = {
        id: 'dsa-pathway',
        title: 'DSA Pathway',
        content: `PRE-REQUISITES

Master Time and Space Complexity. It is the language of efficiency.
Java or Python basics are your tools. Choose one and master it.

OUR MASTERY FORMULA

Introduce the structure

Visualize with diagrams

Solve typical problems

Know when to use it

Understand why it works best

Analyze Time and Space

Code sample problems

Practice with extra references

MONTH 1 FOUNDATION BASICS

Week 1 Arrays manipulation traversal and problems. The building blocks of memory.

Week 2 Strings manipulation pattern matching and algorithms. Text processing mastery.

Week 3 Hashing and Matrix hash tables collisions and 2D problems. Constant time lookups are magic.

Week 4 Sorting and Two Pointers sorting algorithms and 2 pointer use cases. Efficiency starts here.

Pro Tip Two pointers can often turn an O N squared solution into O N Always look for it in sorted arrays

MONTH 2 CORE DATA STRUCTURES

Week 5 Binary Search variations and mastery. Divide and conquer your way to O log N

Week 6 Stacks and Queues LIFO FIFO and real world applications

Week 7 Linked Lists operations and problems. Master pointers and references

Week 8 Recursion and Backtracking recursive thinking and backtracking

Fun Fact Recursion is just a stack under the hood If you understand Stacks you understand Recursion

MONTH 3 ADVANCED DATA STRUCTURES

Get ready for big tech interviews at Google Meta and Amazon

Week 9 Heap priority queues and heap algorithms. Top K elements made easy

Week 10 Sliding Window efficient substring and subarray problems

Week 11 Trees Theory binary trees traversals and properties

Week 12 Trees Problems advanced tree problems

Interview Insight 80 percent of Tree problems can be solved using simple DFS or BFS Master the traversals

MONTH 4 GRAPHS AND DYNAMIC PROGRAMMING

Week 13 Graphs Theory and Problems representation and basic algorithms

Week 14 Advanced Graph Problems real world network applications

Week 15 DP Basics and Theory introduction to dynamic programming

Week 16 Advanced DP Problems optimization and intense practice

Pro Tip DP is just Recursion plus Memoization Do not be afraid of it

MONTH 5 ADVANCED TOPICS AND DESIGN

Week 17 Trie and System Design introduction

Week 18 Design Problems advanced architectural thinking

Week 19 Bit Manipulation bitwise operations The fastest way to compute

Week 20 Math mathematical algorithms and number theory

MONTH 6 FAMOUS NAMED ALGORITHMS

For those tricky high level interviews

Master Dijkstra Floyd Warshall Kruskal and Prim

Deep dive into implementation and optimization

Interesting Fact Most complex systems like Google Maps or Social Networks are just massive combinations of these fundamental algorithms`,
        updatedAt: Date.now()
      };
      initialNotes = [pathwayNote, ...initialNotes];
    }
    
    if (initialNotes.length === 1 && initialNotes[0].id === 'dsa-pathway') {
      initialNotes.push({
        id: '1',
        title: 'Welcome to your Notepad',
        content: 'Use this space to jot down important DSA concepts, patterns, or interview tips.',
        updatedAt: Date.now(),
        isPinned: true
      });
    }

    const finalNotes = initialNotes.map((n: any) => n.id === '1' ? { ...n, isPinned: true } : n);
    setNotes(finalNotes);
    setActiveNoteId(finalNotes[0]?.id || null);
    initialLoadDone.current = true;
  }, []);

  // Firestore Sync
  useEffect(() => {
    if (!user) return;

    setIsSyncing(true);
    const q = query(
      collection(db, 'notes'),
      where('uid', '==', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreNotes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Note[];

      setNotes(prevNotes => {
        // Merge Firestore notes with local notes (prefer Firestore)
        const merged = [...firestoreNotes];
        
        // Add local notes that aren't in Firestore yet (e.g., default notes)
        prevNotes.forEach(localNote => {
          if (!merged.some(fn => fn.id === localNote.id)) {
            merged.push(localNote);
          }
        });

        // Ensure Welcome note is pinned
        return merged.map(n => n.id === '1' ? { ...n, isPinned: true } : n);
      });
      setIsSyncing(false);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'notes');
      setIsSyncing(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Save to localStorage (fallback)
  useEffect(() => {
    localStorage.setItem('dsaforge_notes', JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const addNote = async () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      updatedAt: Date.now(),
      uid: user?.uid
    };

    if (user) {
      try {
        const { id, ...rest } = newNote;
        const docRef = await addDoc(collection(db, 'notes'), rest);
        setActiveNoteId(docRef.id);
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, 'notes');
      }
    } else {
      setNotes([newNote, ...notes]);
      setActiveNoteId(newNote.id);
    }
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    const updatedAt = Date.now();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates, updatedAt } : n));

    if (user && id !== 'dsa-pathway' && id !== '1') {
      try {
        const noteRef = doc(db, 'notes', id);
        await setDoc(noteRef, { ...updates, updatedAt, uid: user.uid }, { merge: true });
      } catch (err) {
        // If it's a local note that needs to be moved to Firestore
        if (err instanceof Error && err.message.includes('NOT_FOUND')) {
          const note = notes.find(n => n.id === id);
          if (note) {
            const { id: _, ...rest } = { ...note, ...updates, updatedAt, uid: user.uid };
            await addDoc(collection(db, 'notes'), rest);
          }
        } else {
          console.error('Failed to sync note update:', err);
        }
      }
    }
  };

  const deleteNote = async (id: string) => {
    const newNotes = notes.filter(n => n.id !== id);
    setNotes(newNotes);
    
    if (activeNoteId === id) {
      setActiveNoteId(newNotes[0]?.id || null);
    }
    setDeleteConfirmId(null);

    if (user && id !== 'dsa-pathway' && id !== '1') {
      try {
        await deleteDoc(doc(db, 'notes', id));
      } catch (err) {
        console.error('Failed to delete note from Firestore:', err);
      }
    }
  };

  const filteredNotes = notes
    .filter(n => 
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      n.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });

  const getDueDateLabel = (dueDate: number) => {
    const date = new Date(dueDate);
    if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow at ${format(date, 'h:mm a')}`;
    return format(date, 'MMM d, yyyy h:mm a');
  };

  const isOverdue = (dueDate: number) => {
    return isPast(new Date(dueDate)) && !isToday(new Date(dueDate));
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold dark:text-white flex items-center gap-2">
                <FileText size={20} className="text-indigo-600" />
                My Notes
                {isSyncing && (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-indigo-400"
                  >
                    <Clock size={12} />
                  </motion.div>
                )}
              </h2>
              <button 
                onClick={addNote}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => setActiveNoteId(note.id)}
                className={`w-full text-left p-3 rounded-xl transition-all group cursor-pointer ${
                  activeNoteId === note.id 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-100 dark:border-indigo-800' 
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-sm truncate ${
                    activeNoteId === note.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'
                  }`}>
                    {note.title || 'Untitled Note'}
                  </h3>
                  <div className="flex items-center gap-1">
                    {note.dueDate && (
                      <div className={`p-1 ${isOverdue(note.dueDate) ? 'text-red-500' : 'text-indigo-500'}`} title={`Due: ${getDueDateLabel(note.dueDate)}`}>
                        <Bell size={12} className={isOverdue(note.dueDate) ? "animate-pulse" : ""} />
                      </div>
                    )}
                    {note.id === '1' ? (
                      <div className="p-1 text-indigo-600" title="Always Pinned">
                        <Pin size={14} className="fill-indigo-600" />
                      </div>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateNote(note.id, { isPinned: !note.isPinned });
                        }}
                        className={`p-1 transition-all ${
                          note.isPinned 
                            ? 'text-indigo-600 opacity-100' 
                            : 'text-slate-400 opacity-0 group-hover:opacity-100 hover:text-indigo-500'
                        }`}
                        title={note.isPinned ? "Unpin Note" : "Pin Note"}
                      >
                        <Pin size={14} className={note.isPinned ? "fill-indigo-600" : ""} />
                      </button>
                    )}
                    {deleteConfirmId === note.id ? (
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                          className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          title="Confirm Delete"
                        >
                          <Save size={14} />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteConfirmId(null);
                          }}
                          className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded"
                          title="Cancel"
                        >
                          <Plus className="rotate-45" size={14} />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(note.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all"
                        title="Delete Note"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                  {note.content || 'No content...'}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                  {note.dueDate && (
                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full ${
                      isOverdue(note.dueDate) 
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                        : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    }`}>
                      <Calendar size={10} />
                      {getDueDateLabel(note.dueDate)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 bg-white dark:bg-slate-950 flex flex-col">
          {activeNote ? (
            <>
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <input 
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                  placeholder="Note Title"
                  className="text-xl font-bold bg-transparent border-none focus:ring-0 w-full dark:text-white"
                />
                <div className="flex items-center gap-3">
                  <div className="relative group/datepicker">
                    <DatePicker
                      selected={activeNote.dueDate ? new Date(activeNote.dueDate) : null}
                      onChange={(date) => updateNote(activeNote.id, { dueDate: date ? date.getTime() : undefined })}
                      showTimeSelect
                      dateFormat="MMMM d, yyyy h:mm aa"
                      placeholderText="Set Due Date"
                      customInput={
                        <button className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          activeNote.dueDate 
                            ? isOverdue(activeNote.dueDate)
                              ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-800'
                              : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}>
                          <Calendar size={14} />
                          {activeNote.dueDate ? getDueDateLabel(activeNote.dueDate) : 'Set Due Date'}
                          {activeNote.dueDate && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateNote(activeNote.id, { dueDate: undefined });
                              }}
                              className="ml-1 hover:text-red-500"
                            >
                              <Plus className="rotate-45" size={12} />
                            </button>
                          )}
                        </button>
                      }
                    />
                  </div>
                  <button
                    onClick={() => setIsPreview(!isPreview)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isPreview 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {isPreview ? (
                      <>
                        <Edit3 size={14} />
                        Edit Mode
                      </>
                    ) : (
                      <>
                        <Eye size={14} />
                        Preview Mode
                      </>
                    )}
                  </button>
                  <span className="text-xs text-slate-400 italic hidden sm:inline">
                    {isSyncing ? 'Syncing...' : 'Auto-saved'}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                {isPreview ? (
                  activeNote.id === 'dsa-pathway' ? (
                    <DSAPathway />
                  ) : (
                    <div className="p-8 prose dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 dark:text-white">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-xl font-bold mb-3 mt-6 dark:text-white">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-lg font-bold mb-2 mt-4 dark:text-white">{children}</h3>,
                          p: ({ children }) => <p className="text-slate-700 dark:text-slate-300 mb-4 leading-relaxed">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-slate-700 dark:text-slate-300">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-2 text-slate-700 dark:text-slate-300">{children}</ol>,
                          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                          blockquote: ({ children }) => (
                            <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 italic bg-indigo-50 dark:bg-indigo-900/10 rounded-r-lg my-4 text-slate-600 dark:text-slate-400">
                              {children}
                            </blockquote>
                          ),
                          code: ({ children }) => (
                            <code className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400 font-mono text-sm">
                              {children}
                            </code>
                          ),
                          pre: ({ children }) => (
                            <pre className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto my-4 font-mono text-sm border border-slate-800">
                              {children}
                            </pre>
                          ),
                          hr: () => <hr className="my-8 border-slate-200 dark:border-slate-800" />,
                          strong: ({ children }) => <strong className="font-bold text-slate-900 dark:text-white">{children}</strong>,
                        }}
                      >
                        {activeNote.content || '*No content yet...*'}
                      </ReactMarkdown>
                    </div>
                  )
                ) : (
                  <textarea 
                    value={activeNote.content}
                    onChange={(e) => updateNote(activeNote.id, { content: e.target.value })}
                    placeholder="Start writing your thoughts using Markdown..."
                    className="w-full h-full p-8 text-slate-700 dark:text-slate-300 bg-transparent border-none focus:ring-0 resize-none font-mono text-sm leading-relaxed"
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center text-slate-300 dark:text-slate-700">
                <FileText size={40} />
              </div>
              <div>
                <h3 className="text-lg font-bold dark:text-white">No Note Selected</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Select a note from the sidebar or create a new one.</p>
              </div>
              <button 
                onClick={addNote}
                className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
              >
                <Plus size={18} />
                Create New Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

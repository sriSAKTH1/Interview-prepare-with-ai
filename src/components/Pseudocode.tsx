import React from 'react';

interface PseudocodeProps {
  code: string;
  activeLine?: number | null;
}

export const Pseudocode: React.FC<PseudocodeProps> = ({ code, activeLine }) => {
  const lines = code.split('\n');

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm font-mono text-sm leading-relaxed">
      <div className="flex">
        {/* Line Numbers */}
        <div className="bg-slate-50 border-r border-slate-100 px-3 py-4 text-right select-none text-slate-300 w-12">
          {lines.map((_, i) => (
            <div key={i} className={`h-6 ${activeLine === i + 1 ? 'text-indigo-400 font-bold' : ''}`}>
              {i + 1}
            </div>
          ))}
        </div>
        
        {/* Code Content */}
        <div className="p-4 flex-1 overflow-x-auto text-slate-700">
          {lines.map((line, i) => {
            // Simple syntax highlighting for common pseudocode keywords
            const highlightedLine = line.split(' ').map((word, idx) => {
              const keywords = ['if', 'else', 'for', 'from', 'to', 'while', 'return', 'new', 'is', 'invalid'];
              const isKeyword = keywords.includes(word.toLowerCase().replace(':', ''));
              
              return (
                <span key={idx} className={isKeyword ? 'text-blue-600 font-medium' : ''}>
                  {word}{' '}
                </span>
              );
            });

            return (
              <div 
                key={i} 
                className={`h-6 whitespace-pre transition-colors ${activeLine === i + 1 ? 'bg-indigo-50 -mx-4 px-4 text-indigo-900 font-medium' : ''}`}
              >
                {highlightedLine}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

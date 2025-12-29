
import React, { useState, useEffect } from 'react';
import { WhiteboardStep, Language } from '../types';
import { UI_COLORS, TRANSLATIONS } from '../constants';

interface WhiteboardProps {
  steps: WhiteboardStep[];
  lang: Language;
  onStart?: () => void;
  onComplete?: () => void;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ steps, lang, onStart, onComplete }) => {
  const [visibleStepsCount, setVisibleStepsCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    setVisibleStepsCount(0);
    setIsAnimating(false);
  }, [steps]);

  useEffect(() => {
    if (isAnimating && visibleStepsCount < steps.length) {
      const timer = setTimeout(() => {
        setVisibleStepsCount(prev => {
          const next = prev + 1;
          if (next === steps.length && onComplete) {
            onComplete();
          }
          return next;
        });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, visibleStepsCount, steps.length, onComplete]);

  const handleStart = () => {
    setIsAnimating(true);
    setVisibleStepsCount(0);
    if (onStart) onStart();
  };

  return (
    <div className="bg-white border-8 border-gray-300 rounded-xl whiteboard-shadow p-6 min-h-[350px] relative flex flex-col overflow-hidden">
      <div className={`absolute top-2 ${lang === 'ar' ? 'right-4' : 'left-4'} flex space-x-2 space-x-reverse z-10`}>
        <div className="w-3 h-3 rounded-full bg-red-400"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
        <div className="w-3 h-3 rounded-full bg-green-400"></div>
      </div>

      {!isAnimating && visibleStepsCount === 0 && (
        <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[2px] z-20 flex items-center justify-center p-4">
          <button
            onClick={handleStart}
            className="group flex flex-col items-center gap-4 bg-white p-6 md:p-8 rounded-full shadow-2xl hover:scale-105 transition-all duration-300 border-4 border-pink-500"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-600 rounded-full flex items-center justify-center text-white shadow-inner group-hover:bg-pink-700">
              <svg className={`w-8 h-8 md:w-10 md:h-10 ${lang === 'ar' ? 'mr-1' : 'ml-1'}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M4.5 2.691l11 6.309-11 6.309V2.691z" />
              </svg>
            </div>
            <span className="text-pink-700 font-bold text-lg md:text-xl text-center">{t.whiteboardStart}</span>
          </button>
        </div>
      )}
      
      <div className={`mt-4 flex-1 space-y-6 font-mono text-xl md:text-3xl relative ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
        {steps.slice(0, visibleStepsCount).map((step, idx) => (
          <div 
            key={idx} 
            className={`${UI_COLORS[step.color]} animate-writing flex items-start gap-3`}
          >
             <span className="opacity-30 text-sm mt-2">●</span>
             <span className="leading-tight">{step.content}</span>
          </div>
        ))}

        {isAnimating && visibleStepsCount < steps.length && (
          <div className="flex items-center gap-2 text-gray-400 animate-pulse">
            <span className="w-3 h-8 bg-pink-500/50 rounded-full"></span>
            <span className="text-lg italic">{t.whiteboardWriting}</span>
          </div>
        )}

        {visibleStepsCount === steps.length && steps.length > 0 && (
          <div className="mt-6 flex items-center gap-2 text-green-600 animate-bounce">
             <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
             <span className="text-sm font-bold">{t.whiteboardExplaining}</span>
          </div>
        )}
      </div>
      
      <div className="mt-8 pt-4 border-t border-gray-100 text-xs text-gray-400 flex justify-between items-center">
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-500"></span>
          <span>{t.whiteboardFooter}</span>
        </div>
        <span>{t.whiteboardCurriculum}</span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes writing {
          from { width: 0; opacity: 0; transform: translateX(${lang === 'ar' ? '10px' : '-10px'}); }
          to { width: 100%; opacity: 1; transform: translateX(0); }
        }
        .animate-writing {
          animation: writing 1.2s ease-out forwards;
        }
      `}} />
    </div>
  );
};

export default Whiteboard;


import React, { useState, useRef, ClipboardEvent, useEffect } from 'react';
import { InputMode, MathSolution, Language, TeacherStatus } from './types';
import { solveMathProblem, speakExplanation } from './services/geminiService';
import Whiteboard from './components/Whiteboard';
import VoiceRecorder from './components/VoiceRecorder';
import { TRANSLATIONS } from './constants';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('ar');
  const [inputMode, setInputMode] = useState<InputMode>(InputMode.TEXT);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<MathSolution | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [teacherStatus, setTeacherStatus] = useState<TeacherStatus>('ready');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[lang];

  // تشغيل الشرح الصوتي تلقائياً فور ظهور الحل النصي
  useEffect(() => {
    if (solution) {
      handleStartAudio('explaining_text');
    }
  }, [solution]);

  const handleStartAudio = async (status: TeacherStatus) => {
    if (solution) {
      setTeacherStatus(status);
      await speakExplanation(solution.audioScript, lang);
      setTeacherStatus('ready');
    }
  };

  const handleSolve = async () => {
    if (!inputText && !selectedImage) {
      setError(t.errorInput);
      return;
    }

    setIsLoading(true);
    setTeacherStatus('thinking');
    setError(null);
    setSolution(null);

    try {
      const res = await solveMathProblem(inputText, lang, selectedImage || undefined);
      setSolution(res);
    } catch (err: any) {
      setError(err.message || t.errorGeneral);
      setTeacherStatus('ready');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setInputMode(InputMode.TEXT); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setSelectedImage(reader.result as string);
          };
          reader.readAsDataURL(blob);
        }
      }
    }
  };

  const handleStartBoard = () => {
    setTeacherStatus('explaining_board');
  };

  const handleFinishBoardAnimation = () => {
    // بعد انتهاء أنيميشن البورد، تبدأ المعلمة بالشرح الصوتي مرة أخرى
    handleStartAudio('explaining_text');
  };

  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    setSolution(null);
    setError(null);
    setTeacherStatus('ready');
  };

  return (
    <div className={`min-h-screen pb-20 relative overflow-x-hidden ${lang === 'en' ? 'font-sans' : 'font-tajawal'}`} dir={t.dir}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-pink-100 py-4 px-4 mb-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="bg-pink-100 p-2 md:p-3 rounded-full border-2 border-pink-200 shadow-sm transition-transform hover:scale-110">
                  <span className="text-3xl md:text-4xl">👩‍🏫</span>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-white ${
                  teacherStatus === 'thinking' ? 'bg-orange-500 animate-pulse' : 
                  teacherStatus === 'explaining_text' ? 'bg-green-500 animate-bounce' : 
                  teacherStatus === 'explaining_board' ? 'bg-blue-500 animate-pulse' : 
                  'bg-pink-500'
                }`}></div>
              </div>
              <span className={`text-[8px] md:text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full text-center min-w-[80px] ${
                teacherStatus === 'ready' ? 'text-pink-600 bg-pink-50' :
                teacherStatus === 'thinking' ? 'text-orange-600 bg-orange-50' :
                teacherStatus === 'explaining_text' ? 'text-green-600 bg-green-50' :
                'text-blue-600 bg-blue-50'
              }`}>
                {teacherStatus === 'ready' && t.statusReady}
                {teacherStatus === 'thinking' && t.statusThinking}
                {teacherStatus === 'explaining_text' && t.statusExplainingText}
                {teacherStatus === 'explaining_board' && t.statusExplainingBoard}
              </span>
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">{t.title}</h1>
              <p className="text-pink-600 text-xs md:text-sm font-medium">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:block text-gray-400 text-xs italic font-medium">
              {t.motto}
            </div>
            <button 
              onClick={toggleLanguage}
              className="px-4 py-2 rounded-full border-2 border-pink-200 text-pink-600 font-bold hover:bg-pink-50 transition-colors text-sm"
            >
              {lang === 'ar' ? 'English' : 'العربية'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 space-y-8 relative z-10">
        {/* Input Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setInputMode(InputMode.TEXT)}
              className={`flex-1 min-w-[120px] py-4 text-center font-bold transition-colors whitespace-nowrap ${inputMode === InputMode.TEXT ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {t.modeText}
            </button>
            <button 
              onClick={() => setInputMode(InputMode.VOICE)}
              className={`flex-1 min-w-[120px] py-4 text-center font-bold transition-colors whitespace-nowrap ${inputMode === InputMode.VOICE ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {t.modeVoice}
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className={`flex-1 min-w-[120px] py-4 text-center font-bold transition-colors whitespace-nowrap ${inputMode === InputMode.CAMERA ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              {t.modeCamera}
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleImageUpload}
              capture="environment"
            />
          </div>

          <div className="p-6">
            {inputMode === InputMode.TEXT && (
              <div className="space-y-4">
                <textarea 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onPaste={handlePaste}
                  placeholder={t.placeholder}
                  className={`w-full h-32 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none text-lg shadow-inner ${lang === 'ar' ? 'text-right' : 'text-left'}`}
                  dir={t.dir}
                />
                {selectedImage && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-xs text-gray-500 mb-2 font-bold">{t.previewImage}</p>
                    <div className="relative inline-block">
                      <img src={selectedImage} alt="Problem Preview" className="max-h-48 rounded-lg border border-gray-300 shadow-sm" />
                      <button 
                        onClick={() => setSelectedImage(null)}
                        className={`absolute -top-3 ${lang === 'ar' ? '-right-3' : '-left-3'} bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm shadow-md hover:bg-red-600 transition-colors`}
                        title="Delete Image"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
                <button 
                  onClick={handleSolve}
                  disabled={isLoading}
                  className="w-full py-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl font-bold text-lg shadow-md transition-all flex items-center justify-center gap-2 transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {t.solving}
                    </>
                  ) : (
                    t.solveBtn
                  )}
                </button>
              </div>
            )}

            {inputMode === InputMode.VOICE && (
              <VoiceRecorder onTranscription={(t) => {
                setInputText(t);
                setInputMode(InputMode.TEXT);
              }} />
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 text-center font-medium animate-shake">
            {error}
          </div>
        )}

        {solution && (
          <div className="space-y-12 animate-fade-in">
            <section className="bg-pink-50 p-6 rounded-2xl border border-pink-100">
              <h2 className="text-xl font-bold text-pink-800 mb-4 flex items-center gap-2">
                {t.understandingHeader}
              </h2>
              <p className="text-gray-800 text-lg leading-relaxed">{solution.understanding}</p>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                {t.stepsHeader}
              </h2>
              <div className="space-y-4">
                {solution.textSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <span className="bg-pink-600 text-white w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold mt-1">
                      {idx + 1}
                    </span>
                    <p className="text-gray-700 text-lg">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                {t.whiteboardHeader}
              </h2>
              <Whiteboard 
                steps={solution.whiteboardSteps} 
                lang={lang}
                onStart={handleStartBoard}
                onComplete={handleFinishBoardAnimation} 
              />
              <p className="mt-4 text-sm text-gray-500 text-center italic">
                {t.whiteboardSub}
              </p>
            </section>

            <section className="bg-green-600 p-8 rounded-2xl text-white shadow-xl text-center">
              <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
                {t.finalHeader}
              </h2>
              <p className="text-3xl md:text-4xl font-extrabold mb-4 drop-shadow-sm">{solution.finalResult.split('.')[0]}</p>
              <div className="inline-block bg-white/20 px-6 py-2 rounded-full font-medium text-lg border border-white/30">
                🌟 {solution.finalResult.split('.').slice(1).join('.')}
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Decorative Math Elements */}
      <div className="mt-20 px-4 max-w-4xl mx-auto flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-20 pointer-events-none select-none">
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12 md:w-16 md:h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 4H4v7m14 0v7a2 2 0 01-2 2H8a2 2 0 01-2-2v-7m12 0H4M20 7l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span className="text-[10px] md:text-xs font-bold text-gray-800">{t.toolsTitle}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12 md:w-16 md:h-16 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <circle cx="12" cy="12" r="10" strokeWidth="1.5" />
             <line x1="12" y1="12" x2="12" y2="2" strokeWidth="1.5" />
             <line x1="12" y1="12" x2="22" y2="12" strokeWidth="1.5" />
          </svg>
          <span className="text-[10px] md:text-xs font-bold text-gray-800">{t.circle}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
           <svg className="w-12 h-12 md:w-16 md:h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 19L12 5L20 19H4Z" />
           </svg>
           <span className="text-[10px] md:text-xs font-bold text-gray-800">{t.triangle}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
           <svg className="w-12 h-12 md:w-16 md:h-16 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <rect x="4" y="4" width="16" height="16" strokeWidth="1.5" rx="2" />
              <line x1="4" y1="4" x2="20" y2="20" strokeWidth="1.5" />
           </svg>
           <span className="text-[10px] md:text-xs font-bold text-gray-800">{t.square}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
           <span className="text-4xl md:text-5xl font-extrabold text-orange-400">∑</span>
           <span className="text-[10px] md:text-xs font-bold text-gray-800">{t.algebra}</span>
        </div>
        <div className="flex flex-col items-center gap-2">
           <span className="text-4xl md:text-5xl font-extrabold text-indigo-400">π</span>
           <span className="text-[10px] md:text-xs font-bold text-gray-800">{t.pi}</span>
        </div>
      </div>

      <footer className="mt-12 py-10 border-t border-gray-100 text-center text-gray-400 text-sm">
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out infinite;
          animation-iteration-count: 2;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default App;

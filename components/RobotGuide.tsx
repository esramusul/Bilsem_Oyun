import React, { useEffect, useState } from 'react';
import { MessageCircle } from 'lucide-react';

interface RobotGuideProps {
  message: string;
  isSpeaking: boolean;
  onSpeakStart?: () => void;
  onSpeakEnd?: () => void;
}

const RobotGuide: React.FC<RobotGuideProps> = ({ message, isSpeaking: externalIsSpeaking, onSpeakStart, onSpeakEnd }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!message) return;

    // TTS Logic
    const speak = () => {
      window.speechSynthesis.cancel(); // Stop previous
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'tr-TR'; // Turkish
      utterance.rate = 0.9; // Slightly slower for kids
      utterance.pitch = 1.1; // Slightly higher/friendly

      utterance.onstart = () => {
        setIsAnimating(true);
        onSpeakStart?.();
      };

      utterance.onend = () => {
        setIsAnimating(false);
        onSpeakEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    };

    speak();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [message]);

  return (
    <div className="fixed bottom-0 left-0 z-50 flex flex-col items-start p-2 origin-bottom-left transform scale-75 md:scale-100 pointer-events-none">
      {/* Speech Bubble */}
      {message && (
        <div className="mb-2 ml-2 bg-white p-3 rounded-2xl shadow-xl border-4 border-blue-400 relative max-w-[200px] md:max-w-xs animate-bounce-slow pointer-events-auto">
            <p className="text-sm md:text-xl font-bold text-slate-800 text-center leading-tight">{message}</p>
            <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-[10px] border-l-transparent border-t-[15px] border-t-blue-400 border-r-[10px] border-r-transparent"></div>
        </div>
      )}

      {/* Robot Visual */}
      <div className={`w-24 h-24 md:w-32 md:h-32 relative transition-transform duration-300 pointer-events-auto ${isAnimating ? 'scale-110' : 'scale-100'}`}>
         {/* Head */}
         <div className="absolute w-16 h-12 md:w-20 md:h-16 bg-slate-300 rounded-xl top-0 left-4 md:left-6 border-4 border-slate-500 overflow-hidden shadow-lg z-10">
            {/* Eyes */}
            <div className="absolute top-3 left-2 md:top-4 md:left-3 w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full animate-pulse"></div>
            <div className="absolute top-3 right-2 md:top-4 md:right-3 w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full animate-pulse"></div>
            {/* Mouth */}
            <div className={`absolute bottom-2 left-4 md:bottom-3 md:left-6 w-6 md:w-8 h-1 bg-slate-700 rounded transition-all duration-200 ${isAnimating ? 'h-2 md:h-3' : 'h-1'}`}></div>
         </div>
         {/* Antennas */}
         <div className="absolute -top-3 left-3 md:-top-4 md:left-4 w-1 h-5 md:h-6 bg-slate-400 -rotate-12"></div>
         <div className="absolute -top-4 left-2 md:-top-6 md:left-3 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-ping"></div>
         
         {/* Body */}
         <div className="absolute top-10 md:top-14 left-3 md:left-4 w-18 h-12 md:w-24 md:h-16 bg-blue-500 rounded-2xl border-4 border-blue-700 shadow-lg flex items-center justify-center">
            <div className="w-8 h-6 md:w-12 md:h-8 bg-blue-200 rounded opacity-50"></div>
         </div>

         {/* Arms */}
         <div className={`absolute top-12 md:top-16 -left-1 md:-left-2 w-6 h-16 md:w-8 md:h-20 bg-slate-400 rounded-full border-2 border-slate-600 origin-top transform transition-transform ${isAnimating ? 'rotate-45' : 'rotate-12'}`}></div>
         <div className={`absolute top-12 md:top-16 right-0 md:-right-2 w-6 h-16 md:w-8 md:h-20 bg-slate-400 rounded-full border-2 border-slate-600 origin-top transform transition-transform ${isAnimating ? '-rotate-45' : '-rotate-12'}`}></div>
      </div>
      <div className="mt-1 ml-2 bg-slate-800 text-white px-2 py-0.5 rounded-full text-xs font-bold opacity-80">RoboRehber</div>
    </div>
  );
};

export default RobotGuide;
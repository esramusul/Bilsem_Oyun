import React, { useState, useEffect } from 'react';
import RobotGuide from '../components/RobotGuide';
import VoiceInput from '../components/VoiceInput';
import { generateAnimationFrames } from '../services/geminiService';
import { Character } from '../types';
import { ArrowLeft, Play, Pause, Loader2 } from 'lucide-react';

interface Props {
  onBack: () => void;
  myCharacters: Character[];
}

const VideoCreateScreen: React.FC<Props> = ({ onBack, myCharacters }) => {
  const [step, setStep] = useState<'select' | 'prompt' | 'generating' | 'playing'>('select');
  const [selectedChar, setSelectedChar] = useState<Character | null>(null);
  const [promptText, setPromptText] = useState('');
  const [frames, setFrames] = useState<string[]>([]);
  const [robotMessage, setRobotMessage] = useState("Kimi videoda oynatalım? Bir karakter seç.");
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const defaultChar: Character = {
      id: 'def', name: 'Mavi Robot', description: 'Blue friendly robot', 
      imageUrl: 'https://cdn.pixabay.com/photo/2022/01/18/07/39/robot-6946636_1280.png', 
      type: 'robot'
  };

  const handleSelectChar = (char: Character) => {
      setSelectedChar(char);
      setStep('prompt');
      setRobotMessage(`Harika seçim! Şimdi ${char.name} ne yapsın? Mesela 'zıplasın', 'dans etsin' de.`);
  };

  const handleVoiceResult = async (text: string) => {
      setPromptText(text);
      setStep('generating');
      setRobotMessage("Video hazırlanıyor! Lütfen bekle, kare kare çiziyorum...");
      
      const charDesc = selectedChar ? selectedChar.description : defaultChar.description;
      const resultFrames = await generateAnimationFrames(charDesc, text);
      
      if (resultFrames && resultFrames.length > 0) {
          setFrames(resultFrames);
          setStep('playing');
          setRobotMessage("İşte videon hazır! Harika görünüyor.");
      } else {
          setStep('prompt');
          setRobotMessage("Bir sorun oldu. Lütfen tekrar dene.");
      }
  };

  useEffect(() => {
      if (step === 'playing' && isPlaying && frames.length > 0) {
          const interval = setInterval(() => {
              setCurrentFrame(prev => (prev + 1) % frames.length);
          }, 250); 
          return () => clearInterval(interval);
      }
  }, [step, isPlaying, frames]);

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-32">
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 p-3 rounded-full text-white z-50">
        <ArrowLeft />
      </button>

      {/* STEP 1: SELECT CHARACTER */}
      {step === 'select' && (
        <div className="w-full max-w-4xl mt-12 animate-in fade-in">
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-8 drop-shadow-md">Karakterini Seç</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                 {/* User Characters */}
                 {myCharacters.map(char => (
                     <button key={char.id} onClick={() => handleSelectChar(char)} className="bg-white p-3 md:p-4 rounded-3xl shadow-xl hover:scale-105 transition flex flex-col items-center">
                         <img src={char.imageUrl} className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-2xl mb-2 bg-slate-100" />
                         <span className="font-bold text-slate-700 text-sm md:text-base">{char.name}</span>
                     </button>
                 ))}
                 {/* Default option */}
                 <button onClick={() => handleSelectChar(defaultChar)} className="bg-white/80 p-3 md:p-4 rounded-3xl shadow-xl hover:scale-105 transition flex flex-col items-center border-4 border-dashed border-slate-300">
                     <img src={defaultChar.imageUrl} className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-2xl mb-2" />
                     <span className="font-bold text-slate-700 text-sm md:text-base">Robot</span>
                 </button>
            </div>
        </div>
      )}

      {/* STEP 2: PROMPT */}
      {step === 'prompt' && selectedChar && (
        <div className="flex flex-col items-center gap-6 md:gap-8 mt-12 animate-in zoom-in w-full">
             <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-2xl overflow-hidden bg-white">
                 <img src={selectedChar.imageUrl} className="w-full h-full object-cover" />
             </div>
             <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-3xl text-center border-2 border-white/20 max-w-md w-full">
                 <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{selectedChar.name} ne yapsın?</h2>
                 <VoiceInput onResult={handleVoiceResult} />
             </div>
        </div>
      )}

      {/* STEP 3: LOADING */}
      {step === 'generating' && (
        <div className="flex flex-col items-center justify-center mt-32 text-center">
            <Loader2 className="w-16 h-16 md:w-24 md:h-24 text-white animate-spin mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-white animate-pulse">Kareler Çiziliyor...</h2>
            <p className="text-white/80 mt-2">Bu işlem yaklaşık 10-15 saniye sürebilir.</p>
        </div>
      )}

      {/* STEP 4: PLAYER */}
      {step === 'playing' && frames.length > 0 && (
          <div className="flex flex-col items-center gap-6 mt-8 w-full max-w-2xl animate-in zoom-in duration-700">
              <div className="relative w-full aspect-square bg-black rounded-3xl shadow-2xl border-4 md:border-8 border-white overflow-hidden group max-w-[400px]">
                  {/* MAIN DISPLAY */}
                  <img src={frames[currentFrame]} className="w-full h-full object-cover" />
                  
                  {/* Controls Overlay */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4 bg-black/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setIsPlaying(!isPlaying)} className="text-white hover:text-yellow-400 transition">
                          {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current" />}
                      </button>
                  </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                  <button onClick={() => setStep('prompt')} className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full font-bold shadow-lg transition transform active:scale-95">
                      Yeni Video Yap
                  </button>
                  <button onClick={onBack} className="bg-white text-slate-800 px-8 py-3 rounded-full font-bold shadow-lg transition transform active:scale-95">
                      Çıkış
                  </button>
              </div>

              {/* Film Strip Preview */}
              <div className="flex gap-2 overflow-x-auto p-2 bg-white/10 rounded-xl max-w-full w-full">
                  {frames.map((frame, i) => (
                      <div key={i} className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-4 shrink-0 ${i === currentFrame ? 'border-yellow-400 scale-110' : 'border-transparent opacity-50'} transition-all`}>
                          <img src={frame} className="w-full h-full object-cover" />
                      </div>
                  ))}
              </div>
          </div>
      )}

      <RobotGuide message={robotMessage} isSpeaking={true} />
    </div>
  );
};

export default VideoCreateScreen;
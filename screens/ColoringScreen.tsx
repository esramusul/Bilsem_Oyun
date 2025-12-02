import React, { useState } from 'react';
import RobotGuide from '../components/RobotGuide';
import VoiceInput from '../components/VoiceInput';
import { generateColoringOutline } from '../services/geminiService';
import { Character } from '../types';
import { ArrowLeft, Star, Lock } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSave: (char: Character) => void;
  myCharacters: Character[];
}

const COLORS = ['#ef4444', '#3b82f6', '#eab308', '#22c55e', '#a855f7', '#f97316', '#ec4899', '#334155'];

const ColoringScreen: React.FC<Props> = ({ onBack, onSave, myCharacters }) => {
  const [stage, setStage] = useState<'gate' | 'prompt' | 'coloring'>('gate');
  const [robotMessage, setRobotMessage] = useState("Boyama yapmak için önce şifreyi çöz! Ekranda kaç tane sarı yıldız var?");
  const [outlineUrl, setOutlineUrl] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(COLORS[1]);
  const [decorations, setDecorations] = useState<{x:number, y:number, color:string}[]>([]);

  // Gatekeeper Data (Hardcoded for demo reliability)
  const starCount = 3;

  const handleGateAnswer = (text: string) => {
    // Simple parser
    if (text.includes('üç') || text.includes('3')) {
        setRobotMessage("Doğru! Şifre açıldı. Şimdi ne boyamak istersin? Sesle anlat.");
        setStage('prompt');
    } else {
        setRobotMessage("Yanlış cevap. Tekrar sayalım mı?");
    }
  };

  const handlePromptAnswer = async (text: string) => {
      setRobotMessage(`${text} çiziliyor...`);
      const url = await generateColoringOutline(text);
      if (url) {
          setOutlineUrl(url);
          setStage('coloring');
          setRobotMessage("Renkleri seç ve resme dokun!");
      } else {
          setRobotMessage("Çizemedim. Tekrar dene.");
      }
  };

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setDecorations([...decorations, { x, y, color: selectedColor }]);
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
       <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 p-3 rounded-full text-white z-50">
        <ArrowLeft />
       </button>

       {stage === 'gate' && (
           <div className="bg-white/90 p-8 rounded-3xl flex flex-col items-center gap-6 mt-10 shadow-2xl animate-in zoom-in">
               <div className="flex gap-4 p-4 bg-slate-800 rounded-2xl">
                   {Array.from({length: starCount}).map((_, i) => <Star key={i} className="text-yellow-400 w-12 h-12 fill-yellow-400" />)}
                   <Star className="text-slate-600 w-12 h-12" />
               </div>
               <p className="text-xl font-bold">Kaç tane SARI yıldız var?</p>
               <VoiceInput onResult={handleGateAnswer} />
           </div>
       )}

       {stage === 'prompt' && (
           <div className="flex flex-col items-center justify-center h-full mt-20 gap-4">
               <div className="text-white text-2xl font-bold">Ne çizelim? (Örn: "Roket", "Kedi")</div>
               <VoiceInput onResult={handlePromptAnswer} />
           </div>
       )}

       {stage === 'coloring' && outlineUrl && (
           <div className="flex flex-col items-center gap-4 w-full max-w-4xl mt-4">
               <div className="relative bg-white p-2 rounded-xl shadow-2xl cursor-crosshair overflow-hidden w-[350px] h-[350px]" onClick={handleImageClick}>
                   <img src={outlineUrl} className="w-full h-full object-contain pointer-events-none" alt="Coloring" />
                   {decorations.map((d, i) => (
                       <div key={i} className="absolute w-6 h-6 rounded-full opacity-70 mix-blend-multiply transform -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ left: d.x, top: d.y, backgroundColor: d.color }}></div>
                   ))}
               </div>
               <div className="flex gap-2 overflow-x-auto max-w-full p-2 bg-white/30 rounded-full">
                   {COLORS.map(c => (
                       <button key={c} onClick={() => setSelectedColor(c)} className={`w-10 h-10 rounded-full border-2 ${selectedColor === c ? 'scale-110 border-white' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                   ))}
               </div>
               <button onClick={() => { onSave({ id: Date.now().toString(), name: 'Boyama', description: '', imageUrl: outlineUrl, type: 'alien' }); onBack(); }} className="bg-green-500 text-white px-6 py-2 rounded-full font-bold">Kaydet</button>
           </div>
       )}

       <RobotGuide message={robotMessage} isSpeaking={true} />
    </div>
  );
};

export default ColoringScreen;
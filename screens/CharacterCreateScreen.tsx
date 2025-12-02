import React, { useState } from 'react';
import RobotGuide from '../components/RobotGuide';
import VoiceInput from '../components/VoiceInput';
import { Character } from '../types';
import { generateCharacterImage } from '../services/geminiService';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSave: (char: Character) => void;
}

const CharacterCreateScreen: React.FC<Props> = ({ onBack, onSave }) => {
  const [step, setStep] = useState<'prompt' | 'generating' | 'result'>('prompt');
  const [promptText, setPromptText] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [robotMessage, setRobotMessage] = useState("Bana hayalindeki karakteri anlat. Mesela 'Mor antenli robot' de.");

  const handleVoiceResult = async (text: string) => {
    setPromptText(text);
    setRobotMessage(`Harika bir fikir: "${text}". Şimdi onu çiziyorum...`);
    setStep('generating');

    const image = await generateCharacterImage(text);
    
    if (image) {
      setGeneratedImage(image);
      setStep('result');
      setRobotMessage("İşte karakterin! Beğendiysen kaydedelim.");
    } else {
      setStep('prompt');
      setRobotMessage("Üzgünüm, bir sorun oldu. Tekrar anlatır mısın?");
    }
  };

  const handleSave = () => {
    if (generatedImage) {
      const newChar: Character = {
        id: Date.now().toString(),
        name: 'Uzay Dostu',
        description: promptText,
        imageUrl: generatedImage,
        type: 'robot'
      };
      onSave(newChar);
      setRobotMessage("Kaydedildi! Harika bir iş çıkardın.");
      setTimeout(onBack, 2000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 pb-32">
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 p-3 rounded-full text-white backdrop-blur-sm z-50">
        <ArrowLeft className="w-6 h-6 md:w-8 md:h-8" />
      </button>

      {step === 'prompt' && (
        <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-500 w-full max-w-md">
           <div className="bg-white/10 backdrop-blur-md p-6 md:p-8 rounded-3xl text-center border-4 border-white/20 w-full">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Karakterini Anlat</h2>
              <p className="text-white/80 text-base md:text-lg mb-8">Mikrofona bas ve konuş!</p>
              <div className="flex justify-center">
                <VoiceInput onResult={handleVoiceResult} />
              </div>
              {promptText && <p className="mt-4 text-white font-medium bg-black/30 px-4 py-2 rounded-xl text-sm md:text-base">{promptText}</p>}
           </div>
        </div>
      )}

      {step === 'generating' && (
        <div className="flex flex-col items-center justify-center animate-pulse">
          <Loader2 className="w-16 h-16 md:w-24 md:h-24 text-white animate-spin mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">Sihir yapılıyor...</h2>
        </div>
      )}

      {step === 'result' && generatedImage && (
        <div className="flex flex-col items-center gap-6 animate-in slide-in-from-bottom duration-500 w-full max-w-md">
          <div className="bg-white p-2 md:p-4 rounded-3xl shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-300">
            <img src={generatedImage} alt="Generated Character" className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl bg-slate-100" />
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <button 
                onClick={() => setStep('prompt')} 
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 md:py-4 px-8 rounded-full text-lg md:text-xl shadow-lg transform transition active:scale-95 flex-1"
            >
                Tekrar Dene
            </button>
            <button 
                onClick={handleSave} 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 md:py-4 px-8 rounded-full text-lg md:text-xl shadow-lg flex items-center justify-center gap-2 transform transition active:scale-95 flex-1"
            >
                <Save className="w-6 h-6" /> Kaydet
            </button>
          </div>
        </div>
      )}

      <RobotGuide message={robotMessage} isSpeaking={true} />
    </div>
  );
};

export default CharacterCreateScreen;
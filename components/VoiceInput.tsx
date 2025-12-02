import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceInputProps {
  onResult: (text: string) => void;
  isListening?: boolean;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult }) => {
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.lang = 'tr-TR';
        recog.continuous = false;
        recog.interimResults = false;

        recog.onstart = () => setListening(true);
        recog.onend = () => setListening(false);
        recog.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log("Heard:", transcript);
          onResult(transcript);
        };

        setRecognition(recog);
      }
    }
  }, [onResult]);

  const toggleListen = () => {
    if (!recognition) {
        alert("Tarayıcın ses tanımayı desteklemiyor. Lütfen Chrome kullan.");
        return;
    }
    if (listening) {
      recognition.stop();
    } else {
      recognition.start();
    }
  };

  return (
    <button
      onClick={toggleListen}
      className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${
        listening ? 'bg-red-500 animate-pulse ring-4 ring-red-300' : 'bg-blue-600 ring-4 ring-blue-300'
      }`}
    >
      {listening ? <MicOff className="w-10 h-10 text-white" /> : <Mic className="w-10 h-10 text-white" />}
      <span className="absolute -bottom-8 text-white font-bold bg-black/50 px-2 py-1 rounded">
        {listening ? 'Dinliyorum...' : 'Konuş'}
      </span>
    </button>
  );
};

export default VoiceInput;
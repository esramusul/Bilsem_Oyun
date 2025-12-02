import React, { useState, useEffect } from 'react';
import RobotGuide from '../components/RobotGuide';
import VoiceInput from '../components/VoiceInput';
import { Character } from '../types';
import { ArrowLeft, Rocket, Moon, Sun, Star, Heart, Cloud, Zap } from 'lucide-react';

interface Props {
  onBack: () => void;
  unlockedCharacters: Character[];
}

const ICONS = [Rocket, Moon, Sun, Star, Heart, Cloud, Zap];

const CipherGameScreen: React.FC<Props> = ({ onBack, unlockedCharacters }) => {
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [robotMessage, setRobotMessage] = useState("Hoş geldin! Farklı olanı bul ve numarasını söyle.");
  const [options, setOptions] = useState<any[]>([]);
  const [answer, setAnswer] = useState<number>(0);
  const [gameState, setGameState] = useState<'playing' | 'success' | 'fail' | 'gameover'>('playing');

  // Generate Level Data
  useEffect(() => {
    if (gameState !== 'playing') return;

    // Logic: Pick a primary icon and a different icon
    const primaryIconIndex = Math.floor(Math.random() * ICONS.length);
    let diffIconIndex = Math.floor(Math.random() * ICONS.length);
    while (diffIconIndex === primaryIconIndex) diffIconIndex = Math.floor(Math.random() * ICONS.length);

    const PrimaryIcon = ICONS[primaryIconIndex];
    const DiffIcon = ICONS[diffIconIndex];

    const correctPos = Math.floor(Math.random() * 4) + 1; // 1 to 4
    setAnswer(correctPos);

    const newOptions = [1, 2, 3, 4].map(pos => {
      const isCorrect = pos === correctPos;
      // Simple coloring logic based on level (Levels 1-3 shape diff, 4-6 color diff)
      // For simplicity in this demo, we stick to Shape Difference mostly
      return {
        id: pos,
        icon: isCorrect ? DiffIcon : PrimaryIcon,
        color: isCorrect ? 'text-yellow-400' : 'text-blue-400', 
        isCorrect
      };
    });

    setOptions(newOptions);
    setRobotMessage(`Seviye ${level}: Farklı olan resmin numarası kaç?`);

  }, [level, gameState]);

  const handleVoiceAnswer = (text: string) => {
    // Basic number parsing from Turkish text
    const numMap: {[key: string]: number} = {
      'bir': 1, 'iki': 2, 'üç': 3, 'dört': 4,
      '1': 1, '2': 2, '3': 3, '4': 4
    };
    
    // Find the number in the text
    let userNum = 0;
    const words = text.toLowerCase().split(' ');
    for (const w of words) {
        if (numMap[w]) {
            userNum = numMap[w];
            break;
        }
    }

    if (userNum === 0) {
        setRobotMessage("Sayıyı tam duyamadım. Bir, iki, üç veya dört demelisin.");
        return;
    }

    checkAnswer(userNum);
  };

  const checkAnswer = (selected: number) => {
    if (selected === answer) {
      setGameState('success');
      setRobotMessage("Harika! Doğru bildin. Bir sonraki seviyeye geçiyoruz!");
      setTimeout(() => {
        setLevel(l => l + 1);
        setGameState('playing');
      }, 2000);
    } else {
      setHearts(h => h - 1);
      if (hearts <= 1) {
        setGameState('gameover');
        setRobotMessage("Oyun bitti ama harika denedin! Tekrar oynamak ister misin?");
      } else {
        setRobotMessage("Yanlış oldu ama pes etme! Tekrar dene.");
        // Shake animation could go here
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 p-3 rounded-full text-white z-50">
        <ArrowLeft />
      </button>

      {/* HUD */}
      <div className="flex items-center gap-8 mb-8 mt-4 bg-black/40 px-6 py-2 rounded-full backdrop-blur-md">
        <div className="flex gap-1">
          {[1, 2, 3].map(h => (
            <Heart key={h} className={`w-8 h-8 ${h <= hearts ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />
          ))}
        </div>
        <div className="text-2xl font-bold text-white">Seviye {level}</div>
      </div>

      {gameState === 'gameover' ? (
        <div className="text-center bg-white p-8 rounded-3xl animate-bounce-in">
           <h2 className="text-4xl font-bold text-slate-800 mb-4">Oyun Bitti</h2>
           <button onClick={onBack} className="bg-blue-500 text-white px-8 py-4 rounded-full text-xl font-bold">Ana Menü</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl mb-8">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => checkAnswer(opt.id)}
                    className="aspect-square bg-white rounded-3xl flex flex-col items-center justify-center relative shadow-lg hover:scale-105 transition-transform border-b-8 border-slate-200 active:border-b-0 active:translate-y-2"
                >
                    <div className="absolute top-2 left-4 text-4xl font-black text-slate-300">{opt.id}</div>
                    <opt.icon className={`w-24 h-24 ${opt.color}`} strokeWidth={1.5} />
                </button>
            ))}
        </div>
      )}

      {/* Voice Control Area */}
      {gameState === 'playing' && (
        <div className="flex flex-col items-center">
            <VoiceInput onResult={handleVoiceAnswer} />
        </div>
      )}

      <RobotGuide message={robotMessage} isSpeaking={true} />
    </div>
  );
};

export default CipherGameScreen;
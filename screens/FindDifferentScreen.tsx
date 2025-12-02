import React, { useState, useEffect } from 'react';
import RobotGuide from '../components/RobotGuide';
import { ArrowLeft, Rocket, Moon, Sun, Star, Heart, Cloud, Zap, Disc } from 'lucide-react';
import { Character } from '../types';

interface Props {
  onBack: () => void;
  myCharacters: Character[];
}

const DEFAULT_ICONS = [
    { icon: Rocket, id: 'r' }, { icon: Moon, id: 'm' }, 
    { icon: Sun, id: 's' }, { icon: Star, id: 'st' }, 
    { icon: Heart, id: 'h' }, { icon: Cloud, id: 'c' }, 
    { icon: Zap, id: 'z' }, { icon: Disc, id: 'd' }
];

const FindDifferentScreen: React.FC<Props> = ({ onBack, myCharacters }) => {
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [robotMessage, setRobotMessage] = useState("Hoş geldin! Farklı olan resmi bulup dokun.");
  const [options, setOptions] = useState<any[]>([]);
  const [answerId, setAnswerId] = useState<number>(0);
  const [gameState, setGameState] = useState<'playing' | 'success' | 'fail' | 'gameover'>('playing');

  const getPool = () => {
    const userPool = myCharacters.map(c => ({
        id: c.id,
        imageUrl: c.imageUrl,
        isUser: true
    }));
    return [...userPool, ...DEFAULT_ICONS];
  };

  useEffect(() => {
    if (gameState !== 'playing') return;

    const pool = getPool();
    const primaryIndex = Math.floor(Math.random() * pool.length);
    let diffIndex = Math.floor(Math.random() * pool.length);
    while (diffIndex === primaryIndex && pool.length > 1) diffIndex = Math.floor(Math.random() * pool.length);

    const PrimaryItem = pool[primaryIndex];
    const DiffItem = pool[diffIndex];

    const correctPos = Math.floor(Math.random() * 4); 
    
    const newOptions = [0, 1, 2, 3].map(pos => {
      const isCorrect = pos === correctPos;
      return {
        id: pos,
        item: isCorrect ? DiffItem : PrimaryItem,
        isCorrect
      };
    });

    setAnswerId(correctPos);
    setOptions(newOptions);
    setRobotMessage(`Seviye ${level}: Hangisi diğerlerinden farklı?`);

  }, [level, gameState]);

  const checkAnswer = (selectedId: number) => {
    if (selectedId === answerId) {
      setGameState('success');
      setRobotMessage("Harika! Doğru bildin. Devam edelim!");
      setTimeout(() => {
        setLevel(l => l + 1);
        setGameState('playing');
      }, 1500);
    } else {
      setHearts(h => h - 1);
      if (hearts <= 1) {
        setGameState('gameover');
        setRobotMessage("Oyun bitti. Tekrar denemek ister misin?");
      } else {
        setRobotMessage("Yanlış oldu. Devam edebilirsin!");
      }
    }
  };

  const renderItem = (opt: any) => {
      const item = opt.item;
      if (item.imageUrl) {
          return <img src={item.imageUrl} className="w-16 h-16 md:w-24 md:h-24 object-contain" alt="item" />;
      }
      const Icon = item.icon || Star;
      return <Icon className={`w-16 h-16 md:w-24 md:h-24 ${opt.isCorrect ? 'text-orange-500' : 'text-blue-500'}`} />;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-32">
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
        <div className="text-center bg-white p-8 rounded-3xl animate-bounce-in z-20">
           <h2 className="text-4xl font-bold text-slate-800 mb-4">Oyun Bitti</h2>
           <button onClick={onBack} className="bg-blue-500 text-white px-8 py-4 rounded-full text-xl font-bold">Ana Menü</button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-lg mb-8 z-10">
            {options.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => checkAnswer(opt.id)}
                    className="aspect-square bg-white rounded-3xl flex flex-col items-center justify-center relative shadow-lg hover:scale-105 transition-transform border-b-8 border-slate-200 active:border-b-0 active:translate-y-2 overflow-hidden"
                >
                    {renderItem(opt)}
                </button>
            ))}
        </div>
      )}

      <RobotGuide message={robotMessage} isSpeaking={true} />
    </div>
  );
};

export default FindDifferentScreen;
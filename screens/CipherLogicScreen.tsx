import React, { useState, useEffect } from 'react';
import RobotGuide from '../components/RobotGuide';
import { ArrowLeft, Star, Rocket, Moon, Heart, Sun, Cloud, Zap } from 'lucide-react';
import { Character } from '../types';

interface Props {
  onBack: () => void;
  myCharacters: Character[];
}

const DEFAULT_SYMBOLS = [
  { icon: Star, id: 'star' },
  { icon: Rocket, id: 'rocket' },
  { icon: Moon, id: 'moon' },
  { icon: Sun, id: 'sun' },
  { icon: Cloud, id: 'cloud' },
  { icon: Zap, id: 'zap' }
];

const CipherLogicScreen: React.FC<Props> = ({ onBack, myCharacters }) => {
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(3);
  
  const [symbolMap, setSymbolMap] = useState<{symbol: any, val: number}[]>([]);
  const [examples, setExamples] = useState<{symbols: any[], result: string}[]>([]);
  const [question, setQuestion] = useState<any[]>([]);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [robotMessage, setRobotMessage] = useState('');

  const getPool = () => {
      const userPool = myCharacters.map(c => ({
          id: c.id,
          imageUrl: c.imageUrl,
          isUser: true
      }));
      return [...userPool, ...DEFAULT_SYMBOLS];
  };

  useEffect(() => {
    generateLevel();
  }, [level]);

  const generateLevel = () => {
    const symbolCount = level < 4 ? 3 : 4;
    const pool = getPool();
    const currentSymbols = pool.slice(0, symbolCount); 
    const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => 0.5 - Math.random());
    const newMap = currentSymbols.map((s, i) => ({
      symbol: s,
      val: availableNumbers[i]
    }));
    setSymbolMap(newMap);

    const exRows = [];
    for(let i=0; i<2; i++) {
        const shuffled = [...newMap].sort(() => 0.5 - Math.random());
        const resultStr = shuffled.map(x => x.val).join(' ');
        exRows.push({ symbols: shuffled, result: resultStr });
    }
    setExamples(exRows);

    const questionRow = [...newMap].sort(() => 0.5 - Math.random());
    setQuestion(questionRow);
    setUserAnswer('');
    setRobotMessage(`Seviye ${level}: Karakterlerin yerini takip et! Sayıları bul.`);
  };

  const handleNumClick = (num: number) => {
    if (userAnswer.replace(/ /g, '').length < question.length) {
      const currentRaw = userAnswer.replace(/ /g, '');
      const newVal = currentRaw + num.toString();
      setUserAnswer(newVal.split('').join(' '));
    }
  };

  const handleDelete = () => {
      setUserAnswer('');
  };

  const checkAnswer = () => {
    const correctAnswer = question.map(x => x.val).join(' ');
    
    if (userAnswer === correctAnswer) {
      setRobotMessage("Müthişsin! Doğru cevap.");
      setTimeout(() => {
          setLevel(l => l + 1);
      }, 2000);
    } else {
      setHearts(h => h - 1);
      if (hearts <= 1) {
          setRobotMessage("Oyun bitti. Tekrar deneyelim mi?");
          setTimeout(onBack, 3000);
      } else {
          setRobotMessage("Dikkatli bak! Hangi karakter hangi sayıydı?");
          setUserAnswer('');
      }
    }
  };

  const renderItem = (item: any, sizeClass: string = "w-10 h-10") => {
      if (item.imageUrl) {
          return <img src={item.imageUrl} className={`${sizeClass} rounded-full object-cover border-2 border-white`} alt="char" />;
      }
      const Icon = item.icon || Star;
      return <Icon className={`${sizeClass} text-yellow-400`} />;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-32">
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 p-3 rounded-full text-white z-50">
        <ArrowLeft />
      </button>

      <div className="flex gap-1 mt-4 mb-4 bg-black/40 px-4 py-2 rounded-full">
         {[1,2,3].map(h => <Heart key={h} className={`w-6 h-6 ${h <= hearts ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />)}
      </div>

      <div className="w-full max-w-lg flex flex-col gap-4">
        
        {/* EXAMPLES */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-4 border-2 border-white/20 flex flex-col gap-4">
            <h3 className="text-white/70 text-center text-sm font-bold">İPUÇLARI</h3>
            {examples.map((ex, i) => (
                <div key={i} className="flex items-center justify-between bg-black/20 p-2 md:p-3 rounded-xl overflow-x-auto">
                    <div className="flex gap-1 md:gap-2">
                        {ex.symbols.map((item, idx) => (
                            <div key={idx}>{renderItem(item.symbol, "w-8 h-8 md:w-10 md:h-10")}</div>
                        ))}
                    </div>
                    <div className="text-2xl md:text-3xl font-bold text-white tracking-widest whitespace-nowrap">
                        = {ex.result}
                    </div>
                </div>
            ))}
        </div>

        {/* QUESTION */}
        <div className="bg-white p-4 md:p-6 rounded-3xl shadow-2xl animate-pulse-slow">
             <h3 className="text-slate-400 text-center text-sm font-bold mb-2">BUNU ÇÖZ</h3>
             <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex gap-2">
                    {question.map((item, idx) => (
                         <div key={idx}>{renderItem(item.symbol, "w-10 h-10 md:w-12 md:h-12")}</div>
                    ))}
                </div>
                <div className="text-3xl md:text-4xl font-black text-slate-800 tracking-widest min-w-[100px] text-center bg-slate-100 px-4 py-2 rounded-lg">
                    {userAnswer || '?'}
                </div>
             </div>
        </div>

        {/* NUMPAD */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-xs mx-auto w-full mt-2">
            {[1,2,3,4,5,6,7,8,9].map(num => (
                <button 
                    key={num}
                    onClick={() => handleNumClick(num)}
                    className="bg-white hover:bg-yellow-100 text-slate-800 text-xl md:text-2xl font-bold p-3 md:p-4 rounded-xl shadow-lg active:scale-95 transition"
                >
                    {num}
                </button>
            ))}
            <button onClick={handleDelete} className="bg-red-200 text-red-800 font-bold p-3 md:p-4 rounded-xl shadow active:scale-95">Sil</button>
            <button onClick={() => handleNumClick(0)} className="bg-white text-slate-800 font-bold p-3 md:p-4 rounded-xl shadow active:scale-95">0</button>
            <button onClick={checkAnswer} className="bg-green-500 text-white font-bold p-3 md:p-4 rounded-xl shadow-lg active:scale-95">OK</button>
        </div>

      </div>

      <RobotGuide message={robotMessage} isSpeaking={true} />
    </div>
  );
};

export default CipherLogicScreen;
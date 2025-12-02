import React, { useState, useEffect } from 'react';
import RobotGuide from '../components/RobotGuide';
import { ArrowLeft, Rocket, Moon, Sun, Star, Heart, Cloud, Zap, Cpu, Orbit, Globe } from 'lucide-react';
import { Character } from '../types';

interface Props {
  onBack: () => void;
  myCharacters: Character[];
}

const DEFAULT_ICONS = [
    {icon: Rocket, id:'r'}, {icon: Moon, id:'m'}, {icon: Sun, id:'s'}, 
    {icon: Star, id:'st'}, {icon: Heart, id:'h'}, {icon: Cloud, id:'c'}, 
    {icon: Zap, id:'z'}, {icon: Cpu, id:'cp'}, {icon: Orbit, id:'o'}, {icon: Globe, id:'g'}
];

const GalaxyMemoryScreen: React.FC<Props> = ({ onBack, myCharacters }) => {
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [phase, setPhase] = useState<'memorize' | 'hiding' | 'guess'>('memorize');
  const [items, setItems] = useState<any[]>([]);
  const [missingItem, setMissingItem] = useState<any>(null);
  const [robotMessage, setRobotMessage] = useState("");

  const getPool = () => {
    const userPool = myCharacters.map(c => ({
        id: c.id,
        imageUrl: c.imageUrl,
        isUser: true
    }));
    return [...userPool, ...DEFAULT_ICONS];
  };

  useEffect(() => {
    startLevel();
  }, [level]);

  const startLevel = () => {
    const count = Math.min(3 + Math.floor((level - 1) / 2), 6);
    const pool = getPool();
    const shuffled = [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
    setItems(shuffled);
    setPhase('memorize');
    setRobotMessage(`Bu ${count} cismi aklında tut!`);

    setTimeout(() => {
       setPhase('hiding');
       const missing = shuffled[Math.floor(Math.random() * count)];
       setMissingItem(missing);
       
       setTimeout(() => {
         setPhase('guess');
         setRobotMessage("Hangisi kayboldu?");
       }, 1000); 
    }, 4000); 
  };

  const handleGuess = (item: any) => {
    if (item.id === missingItem.id) {
        setRobotMessage("Harika hafıza! Bildin.");
        setTimeout(() => setLevel(l => l + 1), 2000);
    } else {
        setHearts(h => h - 1);
        if (hearts <= 1) {
            setRobotMessage("Canın kalmadı. Ana menüye dönelim.");
            setTimeout(onBack, 2000);
        } else {
            setRobotMessage("Yanlış cevap. Tekrar dene!");
        }
    }
  };

  const renderItem = (item: any, sizeClass="w-12 h-12 md:w-16 md:h-16") => {
      if (item.imageUrl) {
          return <img src={item.imageUrl} className={`${sizeClass} object-cover rounded-xl`} alt="mem" />;
      }
      const Icon = item.icon || Star;
      return <Icon className={`${sizeClass} text-blue-600`} />;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-32">
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 p-3 rounded-full text-white z-50">
        <ArrowLeft />
      </button>

      <div className="flex gap-1 mt-4 mb-4 bg-black/40 px-4 py-2 rounded-full z-20">
         {[1,2,3].map(h => <Heart key={h} className={`w-6 h-6 ${h <= hearts ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />)}
      </div>

      <div className="flex-1 flex flex-col justify-center items-center w-full max-w-4xl z-10">
        
        <div className="bg-white/20 backdrop-blur-md p-4 md:p-8 rounded-3xl border-4 border-white/30 min-h-[300px] flex items-center justify-center w-full">
            
            {phase === 'memorize' && (
                <div className="flex flex-wrap justify-center gap-4 md:gap-8 animate-in zoom-in">
                    {items.map((item, i) => (
                        <div key={i} className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-2xl flex items-center justify-center shadow-xl p-2">
                            {renderItem(item)}
                        </div>
                    ))}
                </div>
            )}

            {phase === 'hiding' && (
                <div className="text-white text-2xl font-bold animate-pulse">Saklanıyorlar...</div>
            )}

            {phase === 'guess' && (
                <div className="flex flex-col items-center gap-8 w-full">
                    <div className="flex flex-wrap justify-center gap-4 opacity-50 grayscale">
                         {items.filter(i => i.id !== missingItem.id).map((item, i) => (
                             <div key={i} className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-xl flex items-center justify-center p-2">
                                {renderItem(item, "w-8 h-8 md:w-10 md:h-10")}
                             </div>
                         ))}
                         <div className="w-12 h-12 md:w-16 md:h-16 bg-yellow-400 rounded-xl flex items-center justify-center font-bold text-2xl md:text-3xl text-yellow-800">?</div>
                    </div>

                    <div className="w-full h-1 bg-white/30 rounded-full"></div>

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                        {items.map((item, i) => (
                            <button 
                                key={i} 
                                onClick={() => handleGuess(item)}
                                className="w-20 h-20 md:w-24 md:h-24 bg-white hover:bg-green-100 rounded-2xl flex items-center justify-center shadow-xl transition-transform hover:scale-110 p-2"
                            >
                                {renderItem(item)}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </div>

      <RobotGuide message={robotMessage} isSpeaking={true} />
    </div>
  );
};

export default GalaxyMemoryScreen;
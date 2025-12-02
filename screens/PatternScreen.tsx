import React, { useState, useEffect } from 'react';
import RobotGuide from '../components/RobotGuide';
import { ArrowLeft, Rocket, Moon, Star, Heart, Sun } from 'lucide-react';
import { Character } from '../types';

interface Props {
  onBack: () => void;
  myCharacters: Character[];
}

const DEFAULT_ICONS = [
    {icon: Rocket, id:'r'}, 
    {icon: Moon, id:'m'}, 
    {icon: Star, id:'s'}, 
    {icon: Heart, id:'h'}, 
    {icon: Sun, id:'su'}
];

const PatternScreen: React.FC<Props> = ({ onBack, myCharacters }) => {
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [pattern, setPattern] = useState<any[]>([]);
  const [options, setOptions] = useState<any[]>([]);
  const [correctOption, setCorrectOption] = useState<any>(null);
  const [robotMessage, setRobotMessage] = useState("Sıradaki şekil hangisi?");

  const getPool = () => {
      const userPool = myCharacters.map(c => ({
          id: c.id,
          imageUrl: c.imageUrl,
          isUser: true
      }));
      return [...userPool, ...DEFAULT_ICONS];
  };

  useEffect(() => {
    const pool = getPool();
    const itemA = pool[Math.floor(Math.random() * pool.length)];
    let itemB = pool[Math.floor(Math.random() * pool.length)];
    while(itemB.id === itemA.id && pool.length > 1) itemB = pool[Math.floor(Math.random() * pool.length)];

    setPattern([itemA, itemB, itemA, itemB]);
    setCorrectOption(itemA);

    let dist1 = pool[Math.floor(Math.random() * pool.length)];
    let dist2 = pool[Math.floor(Math.random() * pool.length)];
    
    const opts = [itemA, dist1, dist2].sort(() => 0.5 - Math.random());
    setOptions(opts);
    
    setRobotMessage(`Seviye ${level}: Soru işareti yerine ne gelmeli?`);
  }, [level]);

  const handleSelect = (opt: any) => {
      if (opt.id === correctOption.id) {
          setRobotMessage("Aferin! Doğru.");
          setTimeout(() => setLevel(l => l+1), 1500);
      } else {
          setHearts(h => h-1);
          setRobotMessage("Yanlış oldu.");
          if (hearts <= 1) setTimeout(onBack, 2000);
      }
  };

  const renderItem = (item: any, sizeClass = "w-12 h-12 md:w-16 md:h-16") => {
      if (item.imageUrl) {
          return <img src={item.imageUrl} className={`${sizeClass} object-cover rounded-full border border-slate-300`} alt="pattern item" />;
      }
      const Icon = item.icon || Star;
      return <Icon className={`${sizeClass} text-blue-500`} />;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-32">
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 p-3 rounded-full text-white z-50">
        <ArrowLeft />
      </button>

      <div className="flex gap-1 mt-4 mb-4 bg-black/40 px-4 py-2 rounded-full z-20">
         {[1,2,3].map(h => <Heart key={h} className={`w-6 h-6 ${h <= hearts ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />)}
      </div>

      <div className="bg-white p-4 md:p-8 rounded-3xl flex gap-2 md:gap-4 mb-8 md:mb-12 shadow-2xl items-center mt-10 overflow-x-auto max-w-full w-full justify-center">
          {pattern.map((item, i) => (
              <div key={i} className="shrink-0">{renderItem(item)}</div>
          ))}
          <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-200 rounded-xl flex items-center justify-center text-3xl md:text-4xl font-bold text-slate-500 shrink-0">?</div>
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-6">
          {options.map((item, i) => (
              <button key={i} onClick={() => handleSelect(item)} className="bg-white p-4 md:p-6 rounded-2xl shadow-xl hover:scale-110 transition flex items-center justify-center">
                  {renderItem(item)}
              </button>
          ))}
      </div>

      <RobotGuide message={robotMessage} isSpeaking={true} />
    </div>
  );
};

export default PatternScreen;
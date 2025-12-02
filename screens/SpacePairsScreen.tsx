import React, { useState, useEffect } from 'react';
import RobotGuide from '../components/RobotGuide';
import { ArrowLeft, Rocket, Moon, Sun, Star, Heart, Cloud, Zap, Cpu } from 'lucide-react';
import { Character } from '../types';

interface Props {
  onBack: () => void;
  myCharacters: Character[];
}

const DEFAULT_CARDS = [
    { icon: Rocket, id: 'd1' }, 
    { icon: Moon, id: 'd2' }, 
    { icon: Sun, id: 'd3' }, 
    { icon: Star, id: 'd4' }, 
    { icon: Heart, id: 'd5' }, 
    { icon: Cloud, id: 'd6' }, 
    { icon: Zap, id: 'd7' }, 
    { icon: Cpu, id: 'd8' }
];

const SpacePairsScreen: React.FC<Props> = ({ onBack, myCharacters }) => {
  const [level, setLevel] = useState(1);
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [robotMessage, setRobotMessage] = useState("Kartlara dokun ve eşlerini bul!");

  useEffect(() => {
    setupLevel();
  }, [level]);

  const setupLevel = () => {
    // Generate Pool: User Characters First
    const userPool = myCharacters.map(c => ({
        id: c.id,
        imageUrl: c.imageUrl,
        isUser: true
    }));
    const fullPool = [...userPool, ...DEFAULT_CARDS];

    // Level Logic: Strict Even Pairs
    let pairCount = 3;
    if (level === 2) pairCount = 6;
    if (level >= 3) pairCount = 8;

    const selectedItems = [];
    for(let i=0; i<pairCount; i++) {
        selectedItems.push(fullPool[i % fullPool.length]);
    }
    
    // Duplicate to make pairs
    const deck = [...selectedItems, ...selectedItems]
      .sort(() => 0.5 - Math.random())
      .map((item, index) => ({ 
          uniqueId: index, 
          itemId: item.id,
          imageUrl: item.imageUrl,
          icon: (item as any).icon
      }));
    
    setCards(deck);
    setFlipped([]);
    setMatched([]);
    setRobotMessage(`Seviye ${level}: Toplam ${pairCount} çift var. Hepsini bul!`);
  };

  const handleCardClick = (index: number) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      const c1 = cards[newFlipped[0]];
      const c2 = cards[newFlipped[1]];
      
      // match logic
      if (c1.itemId === c2.itemId) {
        setMatched(prev => {
            const newMatched = [...prev, newFlipped[0], newFlipped[1]];
            if (newMatched.length === cards.length) {
                setRobotMessage("Harika! Bu bölüm bitti.");
                setTimeout(() => {
                    if (level < 3) {
                        setLevel(l => l + 1);
                    } else {
                        setRobotMessage("Tebrikler! Tüm hafıza oyununu bitirdin!");
                        setTimeout(onBack, 3000);
                    }
                }, 1500);
            } else {
                setRobotMessage("Süper! Eşleşti.");
            }
            return newMatched;
        });
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 1000);
        setRobotMessage("Olmadı, tekrar dene.");
      }
    }
  };

  const renderCardContent = (card: any) => {
      if (card.imageUrl) {
          return <img src={card.imageUrl} className="w-full h-full object-cover rounded-lg" alt="memory" />;
      }
      const Icon = card.icon || Star;
      return <Icon className="w-8 h-8 md:w-14 md:h-14 text-slate-800" />;
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-32">
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 p-3 rounded-full text-white z-50">
        <ArrowLeft />
      </button>

      <div className="mt-4 bg-black/40 px-4 py-2 rounded-full text-white font-bold backdrop-blur-md">
          Seviye {level}
      </div>

      <div className={`grid gap-2 md:gap-3 mt-4 w-full max-w-2xl transition-all duration-500 place-items-center
          ${level === 1 ? 'grid-cols-2 md:grid-cols-3' : ''}
          ${level === 2 ? 'grid-cols-3 md:grid-cols-4' : ''}
          ${level >= 3 ? 'grid-cols-4' : ''}
      `}>
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.includes(i);
          return (
            <button
              key={i}
              onClick={() => handleCardClick(i)}
              className={`w-full aspect-[3/4] max-w-[100px] md:max-w-none rounded-xl flex items-center justify-center transition-all duration-500 transform shadow-xl overflow-hidden border-4
                ${isFlipped ? 'rotate-y-180 bg-white border-white' : 'bg-gradient-to-br from-blue-600 to-blue-800 border-blue-400'}
              `}
            >
              {isFlipped ? renderCardContent(card) : <Star className="text-white/30 w-6 h-6 md:w-8 md:h-8" />}
            </button>
          );
        })}
      </div>

      <RobotGuide message={robotMessage} isSpeaking={true} />
    </div>
  );
};

export default SpacePairsScreen;
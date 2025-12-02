import React, { useState, useEffect } from 'react';
import RobotGuide from '../components/RobotGuide';
import { ArrowLeft, ArrowUp, ArrowDown, ArrowLeft as ArrowL, ArrowRight, Heart, Bot, MapPin } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const GRID_SIZE = 3;

const RobotCommandScreen: React.FC<Props> = ({ onBack }) => {
  const [level, setLevel] = useState(1);
  const [hearts, setHearts] = useState(3);
  const [robotPos, setRobotPos] = useState({x: 0, y: 0});
  const [targetPos, setTargetPos] = useState({x: 2, y: 2});
  const [robotMessage, setRobotMessage] = useState("");
  const [command, setCommand] = useState<'up'|'down'|'left'|'right'|''>('');

  useEffect(() => {
    startTurn();
  }, [level]);

  const startTurn = () => {
    // Reset positions
    setRobotPos({x: 0, y: 0});
    // Random target not at 0,0
    let tx = Math.floor(Math.random() * GRID_SIZE);
    let ty = Math.floor(Math.random() * GRID_SIZE);
    while(tx === 0 && ty === 0) {
        tx = Math.floor(Math.random() * GRID_SIZE);
        ty = Math.floor(Math.random() * GRID_SIZE);
    }
    setTargetPos({x: tx, y: ty});
    
    // Simple logic: Just give one direction needed
    // In a complex version, we would queue commands. 
    // Here: "Move the robot Right" if target is to the right.
    generateCommand(0, 0, tx, ty);
  };

  const generateCommand = (rx: number, ry: number, tx: number, ty: number) => {
      // Determine next best move
      let nextCmd: 'up'|'down'|'left'|'right' = 'right';
      let text = "";

      if (rx < tx) { nextCmd = 'right'; text = "Robotu SAĞA götür."; }
      else if (rx > tx) { nextCmd = 'left'; text = "Robotu SOLA götür."; }
      else if (ry < ty) { nextCmd = 'down'; text = "Robotu AŞAĞI götür."; }
      else if (ry > ty) { nextCmd = 'up'; text = "Robotu YUKARI götür."; }
      else {
          // Arrived
          setRobotMessage("Tebrikler! Hedefe ulaştın.");
          setTimeout(() => setLevel(l => l+1), 2000);
          return;
      }

      setCommand(nextCmd);
      setRobotMessage(text);
  };

  const move = (dir: 'up'|'down'|'left'|'right') => {
      if (dir === command) {
          // Correct move
          let nx = robotPos.x;
          let ny = robotPos.y;
          if (dir === 'right') nx++;
          if (dir === 'left') nx--;
          if (dir === 'down') ny++;
          if (dir === 'up') ny--;

          setRobotPos({x: nx, y: ny});
          
          if (nx === targetPos.x && ny === targetPos.y) {
              setRobotMessage("Aferin! Ulaştın.");
              setTimeout(() => setLevel(l => l+1), 2000);
          } else {
              // Generate next command from new position
              setTimeout(() => generateCommand(nx, ny, targetPos.x, targetPos.y), 500);
          }
      } else {
          setHearts(h => h - 1);
          setRobotMessage("Yanlış yön! Tekrar dinle.");
          if (hearts <= 1) {
             setTimeout(onBack, 2000);
          }
      }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4 pb-32">
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 p-3 rounded-full text-white z-50">
        <ArrowLeft />
      </button>

      <div className="flex gap-1 mt-4 mb-4 bg-black/40 px-4 py-2 rounded-full z-20">
         {[1,2,3].map(h => <Heart key={h} className={`w-6 h-6 ${h <= hearts ? 'fill-red-500 text-red-500' : 'text-slate-500'}`} />)}
      </div>

      {/* Grid */}
      <div className="bg-white/90 p-2 md:p-4 rounded-xl shadow-2xl mb-8">
          {Array.from({ length: GRID_SIZE }).map((_, y) => (
              <div key={y} className="flex">
                  {Array.from({ length: GRID_SIZE }).map((_, x) => {
                      const isRobot = robotPos.x === x && robotPos.y === y;
                      const isTarget = targetPos.x === x && targetPos.y === y;
                      return (
                          <div key={x} className="w-16 h-16 md:w-24 md:h-24 border-2 border-slate-300 flex items-center justify-center relative">
                              {isTarget && <MapPin className="w-8 h-8 md:w-12 md:h-12 text-red-500 animate-bounce" />}
                              {isRobot && <Bot className="w-10 h-10 md:w-16 md:h-16 text-blue-600 absolute transition-all duration-300" />}
                          </div>
                      );
                  })}
              </div>
          ))}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-3 gap-3 md:gap-4">
          <div></div>
          <button onClick={() => move('up')} className="bg-blue-500 p-4 md:p-6 rounded-2xl shadow-lg active:scale-95 flex items-center justify-center"><ArrowUp className="text-white w-6 h-6 md:w-8 md:h-8" /></button>
          <div></div>
          <button onClick={() => move('left')} className="bg-blue-500 p-4 md:p-6 rounded-2xl shadow-lg active:scale-95 flex items-center justify-center"><ArrowL className="text-white w-6 h-6 md:w-8 md:h-8" /></button>
          <button onClick={() => move('down')} className="bg-blue-500 p-4 md:p-6 rounded-2xl shadow-lg active:scale-95 flex items-center justify-center"><ArrowDown className="text-white w-6 h-6 md:w-8 md:h-8" /></button>
          <button onClick={() => move('right')} className="bg-blue-500 p-4 md:p-6 rounded-2xl shadow-lg active:scale-95 flex items-center justify-center"><ArrowRight className="text-white w-6 h-6 md:w-8 md:h-8" /></button>
      </div>

      <RobotGuide message={robotMessage} isSpeaking={true} />
    </div>
  );
};

export default RobotCommandScreen;
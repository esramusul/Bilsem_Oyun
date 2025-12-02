import React, { useState, useEffect } from 'react';
import { Character, ScreenName } from './types';
import MainMenuScreen from './screens/MainMenuScreen';
import CharacterCreateScreen from './screens/CharacterCreateScreen';
import ColoringScreen from './screens/ColoringScreen';
import CipherLogicScreen from './screens/CipherLogicScreen';
import FindDifferentScreen from './screens/FindDifferentScreen';
import PatternScreen from './screens/PatternScreen';
import GalaxyMemoryScreen from './screens/GalaxyMemoryScreen';
import RobotCommandScreen from './screens/RobotCommandScreen';
import SpacePairsScreen from './screens/SpacePairsScreen';
import SpaceStoryScreen from './screens/SpaceStoryScreen';
import BilsemPracticeScreen from './screens/BilsemPracticeScreen';
import VideoCreateScreen from './screens/VideoCreateScreen';
import { Star } from 'lucide-react';

const App: React.FC = () => {
  const [screen, setScreen] = useState<ScreenName>('menu');
  const [characters, setCharacters] = useState<Character[]>([]);
  
  // Background Stars Generation
  useEffect(() => {
    const container = document.createElement('div');
    container.className = 'stars';
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      star.style.width = `${Math.random() * 4 + 2}px`;
      star.style.height = star.style.width;
      star.style.animationDelay = `${Math.random() * 3}s`;
      container.appendChild(star);
    }
    document.body.appendChild(container);
    return () => {
        if(document.body.contains(container)) document.body.removeChild(container);
    }
  }, []);

  const addCharacter = (char: Character) => {
    setCharacters(prev => [...prev, char]);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'menu':
        return <MainMenuScreen onNavigate={setScreen} />;
      case 'create':
        return <CharacterCreateScreen onBack={() => setScreen('menu')} onSave={addCharacter} />;
      case 'coloring':
        return <ColoringScreen onBack={() => setScreen('menu')} onSave={addCharacter} myCharacters={characters} />;
      case 'cipher_logic':
        return <CipherLogicScreen onBack={() => setScreen('menu')} myCharacters={characters} />;
      case 'find_different':
        return <FindDifferentScreen onBack={() => setScreen('menu')} myCharacters={characters} />;
      case 'pattern':
        return <PatternScreen onBack={() => setScreen('menu')} myCharacters={characters} />;
      case 'memory':
        return <GalaxyMemoryScreen onBack={() => setScreen('menu')} myCharacters={characters} />;
      case 'command':
        return <RobotCommandScreen onBack={() => setScreen('menu')} />;
      case 'pairs':
        return <SpacePairsScreen onBack={() => setScreen('menu')} myCharacters={characters} />;
      case 'story':
        return <SpaceStoryScreen onBack={() => setScreen('menu')} />;
      case 'practice':
        return <BilsemPracticeScreen onBack={() => setScreen('menu')} myCharacters={characters} />;
      case 'video_create':
        return <VideoCreateScreen onBack={() => setScreen('menu')} myCharacters={characters} />;
      default:
        return <MainMenuScreen onNavigate={setScreen} />;
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* Top Bar for Global Status */}
      <div className="absolute top-4 right-4 flex gap-2 z-50 pointer-events-none">
        <div className="bg-yellow-400/90 p-2 rounded-full shadow-lg flex items-center gap-1 border-2 border-white">
             <Star className="text-white w-6 h-6 fill-white" />
             <span className="font-bold text-yellow-900 pr-2">{characters.length} Karakter</span>
        </div>
      </div>

      {renderScreen()}
    </div>
  );
};

export default App;
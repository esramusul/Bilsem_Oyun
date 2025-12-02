import React, { useState, useEffect } from 'react';
import { ScreenName } from '../types';
import RobotGuide from '../components/RobotGuide';
import { Rocket, Palette, Brain, BookOpen, Search, Grid, Bot, Copy, Sparkles, Book, Video } from 'lucide-react';

interface Props {
  onNavigate: (screen: ScreenName) => void;
}

const MainMenuScreen: React.FC<Props> = ({ onNavigate }) => {
  const [robotMessage, setRobotMessage] = useState<string>("Merhaba küçük astronot! UZAY MACERASI’na hoş geldin. Oynamak istediğin bölüme dokun!");

  // Ensure TTS triggers on mount even if browser blocked autoplay initially
  useEffect(() => {
     const timer = setTimeout(() => {
         setRobotMessage((prev) => prev + " "); 
     }, 500);
     return () => clearTimeout(timer);
  }, []);

  const menuItems = [
    { id: 'create', label: 'Karakter Yap', icon: Rocket, color: 'bg-purple-500', msg: 'Kendi uzaylını tasarla!' },
    { id: 'video_create', label: 'Uzay Videosu', icon: Video, color: 'bg-indigo-500', msg: 'Karakterini canlandır, çizgi film yap!' },
    { id: 'coloring', label: 'Boya', icon: Palette, color: 'bg-pink-500', msg: 'Şifreyi çöz, boyama yap!' },
    { id: 'cipher_logic', label: 'Şifre Oyunu', icon: Grid, color: 'bg-indigo-600', msg: 'Sembollerin sayılarını bul!' },
    { id: 'find_different', label: 'Farklıyı Bul', icon: Search, color: 'bg-blue-500', msg: 'Hangisi diğerlerinden farklı?' },
    { id: 'pattern', label: 'Sıradaki Ne?', icon: Sparkles, color: 'bg-teal-500', msg: 'Örüntüyü tamamla.' },
    { id: 'memory', label: 'Hafıza', icon: Brain, color: 'bg-orange-500', msg: 'Kaybolan cismi hatırla!' },
    { id: 'command', label: 'Robot Komut', icon: Bot, color: 'bg-cyan-600', msg: 'Robotu hedefe götür.' },
    { id: 'pairs', label: 'Eşleştirme', icon: Copy, color: 'bg-green-500', msg: 'Aynı kartları bul.' },
    { id: 'story', label: 'Uzay Masalı', icon: Book, color: 'bg-yellow-500', msg: 'Masalı dinle, soruları cevapla.' },
    { id: 'practice', label: 'BİLSEM Prova', icon: BookOpen, color: 'bg-red-500', msg: 'Büyük sınav provası!' },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 pb-32">
      <h1 className="text-3xl md:text-5xl font-black text-white mb-6 md:mb-8 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] text-center tracking-wider mt-8">
        UZAY MACERASI
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 w-full max-w-7xl z-10 px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as ScreenName)}
            onMouseEnter={() => setRobotMessage(item.msg)}
            className={`${item.color} hover:brightness-110 border-b-4 border-black/20 text-white rounded-2xl p-2 flex flex-col items-center justify-center gap-1 md:gap-2 transition-transform hover:scale-105 active:scale-95 shadow-xl min-h-[100px] md:h-32`}
          >
            <div className="bg-white/20 p-2 rounded-full">
                <item.icon className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <span className="text-xs md:text-base font-bold leading-tight text-center">{item.label}</span>
          </button>
        ))}
      </div>

      <RobotGuide message={robotMessage} isSpeaking={true} />
    </div>
  );
};

export default MainMenuScreen;
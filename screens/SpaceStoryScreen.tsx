import React, { useState } from 'react';
import RobotGuide from '../components/RobotGuide';
import VoiceInput from '../components/VoiceInput';
import { ArrowLeft, BookOpen, Star } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const STORIES = [
    {
        id: 1,
        text: "Küçük roket Mavi Gezegene indi. Orada sarı bir robotla tanıştı. Birlikte elma yediler.",
        question: "Roket hangi renk gezegene indi?",
        keywords: ['mavi'],
        successMsg: "Doğru! Mavi gezegene indi."
    },
    {
        id: 2,
        text: "Uzaylı Zuzu, sabah uyanınca 3 tane yıldız topladı. Sonra onları cebine koydu.",
        question: "Zuzu kaç tane yıldız topladı?",
        keywords: ['üç', '3'],
        successMsg: "Harika! Tam 3 tane."
    },
    {
        id: 3,
        text: "Kırmızı roket çok hızlı uçuyordu. Aniden karşısına mor bir uydu çıktı. Roket fren yaptı.",
        question: "Roketin karşısına ne çıktı?",
        keywords: ['uydu', 'mor'],
        successMsg: "Süper! Mor bir uydu çıktı."
    }
];

const SpaceStoryScreen: React.FC<Props> = ({ onBack }) => {
  const [levelIndex, setLevelIndex] = useState(0);
  const [stage, setStage] = useState<'story' | 'question'>('story');
  const [robotMessage, setRobotMessage] = useState(STORIES[0].text + " Dinledin mi?");

  const currentStory = STORIES[levelIndex];

  const handleStartQuestion = () => {
      setStage('question');
      setRobotMessage(`Sorum şu: ${currentStory.question}`);
  };

  const handleAnswer = (text: string) => {
      const lower = text.toLowerCase();
      const isCorrect = currentStory.keywords.some(k => lower.includes(k));

      if (isCorrect) {
          setRobotMessage(currentStory.successMsg);
          
          setTimeout(() => {
              if (levelIndex < STORIES.length - 1) {
                  const nextIdx = levelIndex + 1;
                  setLevelIndex(nextIdx);
                  setStage('story');
                  setRobotMessage(`Sıradaki hikaye: ${STORIES[nextIdx].text}`);
              } else {
                  setRobotMessage("Tebrikler! Tüm hikayeleri bitirdin!");
                  setTimeout(onBack, 3000);
              }
          }, 3000);
      } else {
          setRobotMessage("Tam olmadı. Biraz düşün, tekrar söyle.");
      }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-4">
      <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 p-3 rounded-full text-white z-50">
        <ArrowLeft />
      </button>

      {/* Level Indicator */}
      <div className="mt-4 bg-black/40 px-4 py-2 rounded-full text-white font-bold backdrop-blur-md">
          Hikaye {levelIndex + 1} / {STORIES.length}
      </div>

      <div className="bg-white/90 p-8 rounded-3xl mt-10 max-w-lg text-center flex flex-col items-center gap-6 shadow-2xl">
          <BookOpen className="w-24 h-24 text-blue-500 animate-bounce-slow" />
          
          <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-100">
            {stage === 'story' ? (
                <p className="text-lg text-slate-700">Hikayeyi dikkatlice dinle...</p>
            ) : (
                <p className="text-xl font-bold text-slate-800">{currentStory.question}</p>
            )}
          </div>
          
          {stage === 'story' ? (
              <button onClick={handleStartQuestion} className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-xl font-bold animate-pulse transition">
                  Soruyu Sor
              </button>
          ) : (
              <div className="flex flex-col items-center gap-2">
                  <VoiceInput onResult={handleAnswer} />
                  <p className="text-sm text-slate-400">Cevabı sesli söyle</p>
              </div>
          )}
      </div>

      <RobotGuide message={robotMessage} isSpeaking={true} />
    </div>
  );
};

export default SpaceStoryScreen;
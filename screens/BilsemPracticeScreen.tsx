import React, { useState, useEffect } from 'react';
import RobotGuide from '../components/RobotGuide';
import { ArrowLeft, Square, Circle, Triangle, Star, Rocket, Moon, Sun, Heart, Cloud } from 'lucide-react';
import { Character } from '../types';

interface Props {
  onBack: () => void;
  myCharacters: Character[];
}

function KareIcon({className}: {className?: string}) { return <div className={`border-4 border-current w-12 h-12 ${className}`}></div> }
function UcgenIcon({className}: {className?: string}) { return <div className={`w-0 h-0 border-l-[25px] border-l-transparent border-r-[25px] border-r-transparent border-b-[50px] border-b-current ${className}`}></div> }

interface QuestionOption {
    id: number;
    icon?: any;
    imageUrl?: string;
    label?: string;
    size?: string;
    count?: number;
}

interface PracticeQuestion {
    id: number;
    text: string;
    options: QuestionOption[];
    answer: number;
    customRender?: boolean;
    count?: number;
    icon?: any;
}

const BilsemPracticeScreen: React.FC<Props> = ({ onBack, myCharacters }) => {
    const [qIndex, setQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
    const [robotMessage, setRobotMessage] = useState("BİLSEM Provasına hoş geldin!");

    // Generate random questions on mount
    useEffect(() => {
        const generated = [];
        
        // Helper to get a random user char or fallback
        const getUserChar = () => {
            if (myCharacters.length > 0) return myCharacters[Math.floor(Math.random() * myCharacters.length)];
            return null;
        };

        // 1. Different One (With User Chars if avail)
        const char = getUserChar();
        if (char) {
             generated.push({
                 id: 1, 
                 text: "Hangisi senin yaptığın karakter?", 
                 options: [{id:1, icon:Square}, {id:2, icon:Circle}, {id:3, imageUrl: char.imageUrl}].sort(() => 0.5 - Math.random()), 
                 answer: 3
             });
        } else {
             generated.push({ id: 1, text: "Hangisi diğerlerinden farklı?", options: [{id:1, icon:Square}, {id:2, icon:Square}, {id:3, icon:Circle}], answer: 3 });
        }

        // 2. Counting
        generated.push({ id: 3, text: "Burada kaç tane yıldız var?", options: [{id:1, label:"2"}, {id:2, label:"3"}, {id:3, label:"4"}], customRender: true, count: 3, icon: Star, answer: 2 });
        
        // 3. Shadow/Logic
        generated.push({ id: 4, text: "Roketin gölgesi hangisi olabilir?", options: [{id:1, icon:Square}, {id:2, icon:Rocket}], answer: 2 });
        
        // 4. Pattern
        generated.push({ id: 6, text: "Kare, Üçgen, Kare, Üçgen... Sırada ne var?", options: [{id:1, icon:KareIcon}, {id:2, icon:UcgenIcon}], answer: 1 });
        
        // Fill rest with randoms
        const fillers = [
             { id: 5, text: "Hangisi gökyüzünde olmaz?", options: [{id:1, icon:Sun}, {id:2, icon:Square}, {id:3, icon:Cloud}], answer: 2 },
             { id: 7, text: "En büyük şekil hangisi?", options: [{id:1, icon:Circle, size:'small'}, {id:2, icon:Circle, size:'large'}], answer: 2 },
             { id: 8, text: "Hangisi bir ulaşım aracıdır?", options: [{id:1, icon:Moon}, {id:2, icon:Rocket}, {id:3, icon:Star}], answer: 2 },
             { id: 9, text: "Şekli tamamla: Yarım daire + Yarım daire = ?", options: [{id:1, icon:Circle}, {id:2, icon:Square}], answer: 1 },
             { id: 10, text: "Hangi grupta daha çok kalp var?", options: [{id:1, count:2, icon:Heart}, {id:2, count:4, icon:Heart}], answer: 2 },
        ];
        
        generated.push(...fillers);
        
        // Shuffle and Pick 10
        setQuestions(generated.sort(() => 0.5 - Math.random()).slice(0, 10));
        setRobotMessage("Sorular hazır. Başlayalım!");

    }, [myCharacters]);

    const handleAnswer = (id: number) => {
        const currentQ = questions[qIndex];
        const isCorrect = id === currentQ.answer;
        
        if (isCorrect) {
            setScore(s => s+1);
            setRobotMessage("Harika! Doğru cevap.");
        } else {
            setRobotMessage("Yanlış oldu, ama sorun değil.");
        }
        
        setTimeout(() => {
            if (qIndex < questions.length - 1) {
                setQIndex(prev => prev + 1);
                setRobotMessage(questions[qIndex+1].text);
            } else {
                setRobotMessage(`Sınav bitti! ${score + (isCorrect?1:0)} doğru yaptın.`);
                setTimeout(onBack, 4000);
            }
        }, 1500);
    };

    if (questions.length === 0) return <div>Yükleniyor...</div>;

    const currentQ = questions[qIndex];

    const renderOptIcon = (opt: any) => {
        if (opt.imageUrl) return <img src={opt.imageUrl} className="w-24 h-24 object-cover rounded-xl" alt="opt" />;
        if (opt.icon) {
            const Icon = opt.icon;
            return <Icon className={`text-slate-800 ${opt.size === 'large' ? 'w-24 h-24' : 'w-12 h-12'}`} />;
        }
        return null;
    };

    return (
        <div className="flex flex-col items-center min-h-screen p-4 pb-32">
            <button onClick={onBack} className="absolute top-4 left-4 bg-white/20 p-3 rounded-full text-white z-50">
                <ArrowLeft />
            </button>
            
            <div className="mt-10 mb-4 bg-yellow-400 text-yellow-900 font-bold px-4 py-1 rounded-full shadow-lg">
                Soru {qIndex + 1} / 10
            </div>

            <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center min-h-[400px] justify-center relative">
                <h2 className="text-2xl font-bold mb-8 text-center text-slate-800">{currentQ.text}</h2>
                
                {currentQ.count && !currentQ.options[0].count && (
                     <div className="flex gap-4 mb-8">
                         {Array.from({length: currentQ.count}).map((_, i) => {
                             const Ico = currentQ.icon || Star;
                             return <Ico key={i} className="w-16 h-16 text-orange-500" />;
                         })}
                     </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full">
                    {currentQ.options.map((opt, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => handleAnswer(opt.id)} 
                            className="bg-slate-100 p-6 rounded-2xl flex flex-col items-center justify-center hover:bg-blue-100 border-b-4 border-slate-200 active:border-b-0 active:translate-y-1 transition-all"
                        >
                            {opt.label && <span className="text-4xl font-bold text-slate-700 mb-2">{opt.label}</span>}
                            {renderOptIcon(opt)}
                            
                            {opt.count && opt.icon && (
                                <div className="flex flex-wrap gap-1 justify-center">
                                    {Array.from({length: opt.count}).map((_, k) => (
                                        <opt.icon key={k} className="w-8 h-8 text-red-500" />
                                    ))}
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <RobotGuide message={robotMessage} isSpeaking={true} />
        </div>
    );
};

export default BilsemPracticeScreen;
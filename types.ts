export interface Character {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: 'robot' | 'alien' | 'astronaut' | 'rocket';
}

export type ScreenName = 
  | 'menu' 
  | 'create' 
  | 'coloring' 
  | 'cipher_logic' 
  | 'find_different' 
  | 'pattern' 
  | 'memory' 
  | 'command' 
  | 'pairs' 
  | 'story' 
  | 'practice'
  | 'video_create';

export interface GameState {
  hearts: number;
  level: number;
  score: number;
}

export interface Question {
  id: number;
  type: 'different' | 'count' | 'pattern' | 'memory' | 'cipher';
  questionText: string;
  options: any[]; 
  correctIndex: number; 
}
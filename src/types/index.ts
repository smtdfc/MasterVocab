export interface LearnData {
  date: string;
  totalWordAttempts: number;
  totalPractice: number;
  uniqueWords: number;
  correctAnswers: number;
  incorrectAnswers: number;
  mostFailedWords: string[];
  avgAttemptsPerWord: number;
  sessionCount: number;
  avgSessionLength: number;
  dailyStreak: number;
  avgRecallTime: number;
  completionRate: number;
  masteryScore: number;
}

export interface Vocab {
  word: string;
  meaning: string;
}

export interface UserData {
  history: LearnData[];
  vocabularies:Vocab[];
  lastActive:string; //timestamp
}

export interface Question {
  content: string;
  correct: number;
  answers: Record < number,string > ;
}
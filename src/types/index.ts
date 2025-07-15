export interface LearnData {
  date: string;
  totalWordAttempts: number;
  totalPractice: number;
}

export interface Vocab {
  word: string;
  meaning: string;
}

export interface UserData {
  history: LearnData[];
  vocabularies:Vocab[];
}

export interface Question {
  content: string;
  correct: number;
  answers: Record < number,string > ;
}
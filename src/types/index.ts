export interface LearnData {
  date: string;
  totalVocab: number;
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
import { UserData, LearnData, Vocab ,Question} from '@/types';


export function fakeData(): void {
  if (typeof window !== 'undefined') {
    const vocabularies = [
      { word: 'Eloquent', meaning: 'Able to express ideas clearly' },
      { word: 'Meticulous', meaning: 'Very careful and precise' },
      { word: 'Resilient', meaning: 'Able to recover from difficulty' },
      { word: 'Innovative', meaning: 'Introducing new ideas' },
      { word: 'Courageous', meaning: 'Brave in the face of fear' },
      { word: 'Persistent', meaning: 'Continuing firmly despite problems' },
      { word: 'Efficient', meaning: 'Doing things well without waste' },
      { word: 'Adaptable', meaning: 'Able to adjust to new conditions' },
      { word: 'Diligent', meaning: 'Showing care in work' },
      { word: 'Charismatic', meaning: 'Having a charming personality' },
      { word: 'Strategic', meaning: 'Planning with long-term goals' },
    ];
    
    localStorage.setItem("MasterVocab_Data", JSON.stringify({
        history: [
          { date: "11/7/2035", totalVocab: 2000, totalPractice: 300000 },
          { date: "12/7/2035", totalVocab: 4000, totalPractice: 300000 },
          { date: "13/7/2035", totalVocab: 5000, totalPractice: 300000 },
          { date: "14/7/2035", totalVocab: 2000, totalPractice: 300000 },
          { date: "15/7/2035", totalVocab: 2000, totalPractice: 300000 },
          { date: "16/7/2035", totalVocab: 6000, totalPractice: 300000 },
        ],
        vocabularies,
      } as UserData));
  }
}

export function readStorage(): UserData {
  if (typeof window !== 'undefined') {
    
    if(!localStorage.getItem("MasterVocab_Data")) writeStorage({
      history: [],
      vocabularies: [],
    });
    
    return JSON.parse(localStorage.getItem("MasterVocab_Data") || '{}') as UserData;
  }
  
  return {
    history: [],
    vocabularies: [],
  };
}

export function writeStorage(data: UserData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem("MasterVocab_Data", JSON.stringify(data));
  }
}


export class UserManage {
  static getRecentLearningData(): LearnData[] {
    const data = readStorage();
    return data.history.slice(-6);
  }
  
  static removeWord(word:string){
    const data = readStorage();
    data.vocabularies = data.vocabularies.filter(v => v.word !== word);
    writeStorage(data);
  }
  
  static addWord(word: string, meaning: string) {
    const data = readStorage();
    data.vocabularies.push({
      word,
      meaning
    });
    writeStorage(data);
  }
  
  static search(query: string, limit = 10, offset = 0): Vocab[] {
    const data = readStorage();
    const allVocab = data.vocabularies || [];
    
    const q = query.trim().toLowerCase();
    
    const matched = q ?
      allVocab.filter(v => v.word.toLowerCase().includes(q)) :
      allVocab;
    
    return matched.slice(offset, offset + limit);
  }
  
  static async searchMean(word: string): Promise<string>{
    
    const res = await fetch('/api/word/search-mean', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word }),
    });
    
    if (!res.ok) {
      throw 'Error when send request !';
    }
    
    let data =  await res.json();
    return data.result.meaning as string;
  }
  
  static generateQuestions():Question[]{
    return generateQuestions(readStorage().vocabularies);
  }
  
  
}



function generateQuestions(words: Vocab[]): Question[] {
  if (words.length < 4) {
    throw new Error("At least 4 words are required to generate multiple-choice questions (1 correct + 3 incorrect).");
  }
  
  const shuffledWords = [...words].sort(() => Math.random() - 0.5).slice(0, 10);
  
  return shuffledWords.map((vocab) => {
    const wrongChoices = words
      .filter(w => w.word !== vocab.word)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(w => w.meaning);
    
    if (wrongChoices.length < 3) {
      throw new Error(`Not enough incorrect options to generate a question for the word '${vocab.word}'.`);
    }
    
    const allChoices = [...wrongChoices];
    const correctIndex = Math.floor(Math.random() * 4);
    allChoices.splice(correctIndex, 0, vocab.meaning);
    
    const answers: Record < number, string > = {};
    allChoices.forEach((choice, index) => {
      answers[index] = choice;
    });
    
    return {
      content: `What is the meaning of "${vocab.word}"?`,
      correct: correctIndex,
      answers,
    };
  });
}
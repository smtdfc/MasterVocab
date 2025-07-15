import { UserData, LearnData, Vocab } from '@/types';


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
}
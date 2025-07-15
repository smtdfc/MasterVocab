import { UserData, LearnData, Vocab, Question } from '@/types';

function createEmptyLearnData(date: string): LearnData {
  return {
    date,
    totalWordAttempts: 0,
    totalPractice: 0,
    uniqueWords: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    mostFailedWords: [],
    avgAttemptsPerWord: 0,
    sessionCount: 0,
    avgSessionLength: 0,
    dailyStreak: 0,
    avgRecallTime: 0,
    completionRate: 0,
    masteryScore: 0,
  };
}

function getCurrentDateFormatted(): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  return `${day}/${month}/${year}`;
}

let cache: UserData | null = null;

export function readStorage(): UserData {
  if (cache) return cache;
  
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem("MasterVocab_Data");
    if (!raw) {
      cache = {
        history: [],
        vocabularies: [],
        lastActive: getCurrentDateFormatted()
      };
      writeStorage(cache);
    } else {
      cache = JSON.parse(raw);
    }
    return cache!;
  }
  
  cache = {
    history: [],
    vocabularies: [],
    lastActive: getCurrentDateFormatted()
  };
  return cache;
}

export function writeStorage(data: UserData) {
  cache = data;
  if (typeof window !== 'undefined') {
    localStorage.setItem("MasterVocab_Data", JSON.stringify(data));
  }
}

export class UserManage {
  static getRecentLearningData(): LearnData[] {
    return readStorage().history.slice(-6);
  }
  
  static removeWord(word: string) {
    const data = readStorage();
    data.vocabularies = data.vocabularies.filter(v => v.word !== word);
    writeStorage(data);
  }
  
  static incrementCurrentLearnDataBatch(update: Partial < Record < keyof LearnData, number >> ): void {
    const data = readStorage();
    const currentDate = getCurrentDateFormatted();
    const index = data.history.findIndex(h => h.date === currentDate);
    
    if (index !== -1) {
      const current = data.history[index];
      for (const key in update) {
        const k = key as keyof LearnData;
        const curValue = current[k];
        const addValue = update[k];
        if (current[k] && typeof curValue === 'number' && typeof addValue === 'number') {
          (current[k] as number) = curValue + addValue;
        }
      }
    } else {
      const newEntry = createEmptyLearnData(currentDate);
      for (const key in update) {
        const k = key as keyof LearnData;
        const addValue = update[k];
        if (newEntry[k] && typeof newEntry[k] === 'number' && typeof addValue === 'number') {
          (newEntry[k] as number) = addValue;
        }
      }
      data.history.push(newEntry);
    }
    
    writeStorage(data);
  }
  
  static addWord(word: string, meaning: string) {
    const data = readStorage();
    const exists = data.vocabularies.some(v => v.word === word);
    if (!exists) {
      let normalize = meaning.split(',').map(v => v.trim());
      data.vocabularies.push({ word, meaning: normalize });
      this.incrementCurrentLearnDataBatch({ uniqueWords: 1 });
      this.recalculateMetrics();
      writeStorage(data);
    }
  }
  
  static search(query: string, limit = 10, offset = 0): Vocab[] {
    const data = readStorage();
    const allVocab = data.vocabularies || [];
    const q = query.trim().toLowerCase();
    const matched = q ? allVocab.filter(v => v.word.toLowerCase().includes(q)) : allVocab;
    return matched.slice(offset, offset + limit);
  }
  
  static async searchMean(word: string): Promise < string > {
    const res = await fetch('/api/word/search-mean', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word }),
    });
    
    if (!res.ok) {
      throw 'Error when send request !';
    }
    
    const data = await res.json();
    return data.result.meaning as string;
  }
  
  static updateCurrentLearnDataBatch(update: Partial < LearnData > ): void {
    const data = readStorage();
    const currentDate = getCurrentDateFormatted();
    const index = data.history.findIndex(h => h.date === currentDate);
    
    if (index !== -1) {
      data.history[index] = { ...data.history[index], ...update };
    } else {
      const newEntry = { ...createEmptyLearnData(currentDate), ...update };
      data.history.push(newEntry);
    }
    
    writeStorage(data);
  }
  
  static generateQuestions(): Question[] {
    const data = readStorage();
    const ques = generateQuestions(data.vocabularies);
    this.incrementCurrentLearnDataBatch({
      totalWordAttempts: ques.length,
      totalPractice: 1,
    });
    this.recalculateMetrics();
    return ques;
  }
  
  static recalculateMetrics(): void {
    const data = readStorage();
    const currentDate = getCurrentDateFormatted();
    const index = data.history.findIndex(h => h.date === currentDate);
    if (index === -1) return;
    
    const entry = data.history[index];
    
    entry.avgAttemptsPerWord = entry.uniqueWords > 0 ?
      parseFloat((entry.totalWordAttempts / entry.uniqueWords).toFixed(2)) :
      0;
    
    entry.completionRate = entry.totalWordAttempts > 0 ?
      parseFloat((entry.correctAnswers / entry.totalWordAttempts * 100).toFixed(2)) :
      0;
    
    entry.masteryScore = Math.max(0, entry.correctAnswers - entry.incorrectAnswers);
    
    const today = getCurrentDateFormatted();
    const lastActive = data.lastActive;
    
    if (lastActive === today) return;
    
    const yesterday = (() => {
      const d = new Date();
      d.setDate(d.getDate() - 1);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    })();
    
    const todayIndex = data.history.findIndex(h => h.date === today);
    const yesterdayEntry = data.history.find(h => h.date === yesterday);
    
    if (todayIndex === -1) {
      data.history.push(createEmptyLearnData(today));
    }
    
    const todayEntry = data.history.find(h => h.date === today) !;
    
    if (yesterdayEntry && lastActive === yesterday) {
      todayEntry.dailyStreak = (yesterdayEntry.dailyStreak || 0) + 1;
    } else {
      todayEntry.dailyStreak = 1;
    }
    
    data.lastActive = today;
    writeStorage(data);
  }
  
  static importDict(words: Vocab[]) {
    const data = readStorage();
    let newWordCount = 0;
    
    for (const v of words) {
      const existing = data.vocabularies.find(w => w.word === v.word);
      
      if (!existing) {
        data.vocabularies.push({
          word: v.word,
          meaning: [...v.meaning]
        });
        newWordCount++;
      } else {
        const newMeanings = v.meaning.filter(m => !existing.meaning.includes(m));
        if (newMeanings.length > 0) {
          existing.meaning.push(...newMeanings);
        }
      }
    }
    
    if (newWordCount > 0) {
      this.incrementCurrentLearnDataBatch({ uniqueWords: newWordCount });
    }
    
    this.recalculateMetrics();
    writeStorage(data);
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
      let maxChoice = choice.length;
      answers[index] = choice[Math.floor(Math.random() * maxChoice)];
    });
    
    return {
      content: `What is the meaning of "${vocab.word}"?`,
      correct: correctIndex,
      answers,
    };
  });
}
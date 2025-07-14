'use client';

import '@/styles/vocabcard.css';


interface VocabCardProps {
  word: string;
  meaning: string;
  onExplain ? : (word: string) => void; 
}

export default function VocabCard({ word, meaning, onExplain }: VocabCardProps) {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
  };
  
  return (
    <div className="vocab-card">
      <div className="vocab-header">
        <h3 className="vocab-word">{word}</h3>
        <div className="vocab-actions">
          <button className="vocab-btn material-icons" onClick={speak}>volume_up</button>
          <button className="vocab-btn material-icons" onClick={() => onExplain?.(word)}>info</button>
        </div>
      </div>
      <p className="vocab-meaning">{meaning}</p>
    </div>
  );
}
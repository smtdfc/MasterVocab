'use client';

import SearchBox from '@/components/SearchBox';
import VocabCard from '@/components/VocabCard';
import { useState, useEffect } from 'react';
import { UserManage } from '@/services/client/user';
import { Vocab } from '@/types';

export default function Page() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState < Vocab[] > ([]);
  const [offset, setOffset] = useState(0);
  const limit = 10;
  
  useEffect(() => {
    const res = UserManage.search(search, limit, offset);
    setResults(res);
  }, [search, offset]);
  
  const handleNext = () => setOffset(offset + limit);
  const handlePrevious = () => setOffset(Math.max(0, offset - limit));
  
  return (
    <main>
      <h1>📘 Vocabulary</h1>

      <SearchBox
        onInput={(v) => {
          setSearch(v);
          setOffset(0);
        }}
      />

      <br />

      <div>
        {results.length === 0 ? (
          <p>🕵️ No results found.</p>
        ) : (
          results.map((item, i) => (
            <VocabCard key={i} word={item.word} meaning={item.meaning} />
          ))
        )}
      </div>

      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <button onClick={handlePrevious} disabled={offset === 0}>
          Previous
        </button>
        <button onClick={handleNext} disabled={results.length < limit}>
          Next
        </button>
      </div>
    </main>
  );
}
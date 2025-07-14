'use client';

import '@/styles/searchbox.css';

type SearchBoxProps ={
  onInput:(data: string)=> unknown;
}

export default function SearchBox({onInput}:SearchBoxProps){
  return (
    <div className="search-box">
      <input type="text" onInput={({target})=> onInput(target.value)} />
      <button className="material-icons">search</button>
    </div>
  );
}
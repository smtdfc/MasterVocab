"use client";

import { useState, ChangeEvent } from 'react';
import {UserManage} from '@/services/client/user';
import '@/styles/form.css';
import '@/styles/button.css';

export default function Page() {
  const [word, setWord] = useState < string > ("");
  const [mean, setMean] = useState < string > ("");
  const [isLoading,setLoading] = useState<boolean>(false);
  function handleBtnClick(){
    UserManage.addWord(word,mean);
    alert("Word added into dictionary 🥳🥳🥳");
  }
  
  async function handleSearchMeanBtnClick(){
    setLoading(true);
    let m = await UserManage.searchMean(word);
    setLoading(false);
    setMean(m);
  }
  
  return (
    <>
      <h1>Add Word</h1>
      <div className="form-group">
        <label className="form-label">Word: </label>
        <input onInput={(e:ChangeEvent<HTMLInputElement>)=> setWord(e.target.value)} type="text" placeholder="Type some word ...." className="form-control"/>
      </div>
      <br/>
      <div className="form-group">
        <label className="form-label">Meaning: </label>
        <textarea value={mean} onChange={(e:ChangeEvent<HTMLTextAreaElement>)=> setMean(e.target.value)} placeholder="Meaning...." className="form-control"/>
      </div>
      <br/>
      <button onClick={handleBtnClick} disabled={isLoading} className="btn">Add Word</button>
      <button onClick={handleSearchMeanBtnClick} disabled={isLoading} className="btn">Seach meaning</button>
    </>
  );
}
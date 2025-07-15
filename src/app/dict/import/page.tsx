'use client';

import { useState } from "react";
import { UserManage } from "@/services/client/user";
import type { Vocab } from "@/types";

export default function Page() {
  const [message, setMessage] = useState("");
  
  const handleImport = async (e: React.ChangeEvent < HTMLInputElement > ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      alert(text);
      if (!Array.isArray(json.words) || !json.words.every(isValidVocab)) {
        throw new Error("Invalid schema. Expected { words: Vocab[] }");
      }
      
      UserManage.importDict(json.words as Vocab[]);
      setMessage(`Imported ${json.words.length} words successfully! 🎉`);
    } catch (err: any) {
      console.error(err);
      setMessage("❌ Failed to import dictionary: " + err.message);
    }
  };
  
  const isValidVocab = (v: any): v is Vocab => {
    return typeof v.word === "string" && v.meaning instanceof Array;
  };
  
  return (
    <div style={{ marginTop: "2rem" }}>
      <h3>📥 Import Dictionary</h3>
      <input type="file" accept=".json" onChange={handleImport} />
      <p>{message}</p>
    </div>
  );
}
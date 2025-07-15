import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const systemInstruction = `
You are an English-Vietnamese dictionary. When given an English word, respond with its most common Vietnamese meaning(s), in 2–3 words maximum.  
Always respond in Vietnamese. Use commas to separate multiple meanings.  
Do not explain, do not use full sentences, do not give examples, and do not provide any additional context.  
Only output the direct translation(s).  
Examples:
- Hello -> Xin chào  
- Bag -> Cái túi, cái cặp  
- Run -> Chạy
`;

export async function POST(req: NextRequest) {
  const { word } = await req.json();
  
  
  if (!word) {
    return NextResponse.json({ error: 'Invaild Data !' }, { status: 400 });
  }
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    config: {
      systemInstruction
    },
    contents: `What does the word '${word}' mean ?`,
  });
  
  return NextResponse.json({
    result: {
      meaning: response.text
    }
  });
}
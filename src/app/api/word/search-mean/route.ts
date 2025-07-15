import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


export async function POST(req: NextRequest) {
  const { word } = await req.json();
  
  
  if (!word) {
    return NextResponse.json({ error: 'Invaild Data !' }, { status: 400 });
  }
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `What does the word '${word}' mean ?`,
  });
  
  return NextResponse.json({ 
    result:{
      meaning:response.text
    }
  });
}
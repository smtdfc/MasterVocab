"use client";

import { useState, useEffect } from "react";
import { UserManage } from "@/services/client/user";
import type { Question } from "@/types";
import "@/styles/pages/quiz.css";

export default function QuizPage() {
  const [questions, setQuestions] = useState < Question[] > ([]);
  const [selected, setSelected] = useState < Record < number, number >> ({});
  
  useEffect(() => {
    async function load() {
      try {
        const q = UserManage.generateQuestions();
        setQuestions(q);
      } catch (err: any) {
        console.error("Failed to generate questions:", err.message);
      }
    }
    load();
  }, []);
  
  useEffect(() => {
    const allAnswered = questions.length > 0 && Object.keys(selected).length === questions.length;
    if (!allAnswered) return;
    
    const totalCorrect = questions.reduce((acc, q, i) => {
      return selected[i] === q.correct ? acc + 1 : acc;
    }, 0);
    const incorrect = questions.length - totalCorrect;
    
    UserManage.incrementCurrentLearnDataBatch({
      correctAnswers: totalCorrect,
      incorrectAnswers: incorrect,
    });
    UserManage.recalculateMetrics();
  }, [questions.length === Object.keys(selected).length]);
  
  
  const handleSelect = (qIndex: number, aIndex: number) => {
    if (selected[qIndex] !== undefined) return;
    setSelected((prev) => ({ ...prev, [qIndex]: aIndex }));
  };
  
  const totalCorrect = questions.reduce((acc, q, i) => {
    return selected[i] === q.correct ? acc + 1 : acc;
  }, 0);
  
  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Vocabulary Quiz</h1>
      {questions.map((q, qIndex) => (
        <div key={qIndex} className="quiz-question">
          <p className="question-content">
            {qIndex + 1}. {q.content}
          </p>
          <div className="question-answers">
            {Object.entries(q.answers).map(([aIndexStr, answer]) => {
              const aIndex = Number(aIndexStr);
              const isSelected = selected[qIndex] === aIndex;
              const isCorrect = q.correct === aIndex;
              const isAnswered = selected[qIndex] !== undefined;

              let className = "answer-button";
              if (isAnswered) {
                if (isCorrect) className += " correct";
                else if (isSelected) className += " wrong";
                else className += " disabled";
              }

              return (
                <button
                  key={aIndex}
                  className={className}
                  onClick={() => handleSelect(qIndex, aIndex)}
                >
                  {String.fromCharCode(65 + aIndex)}. {answer}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {Object.keys(selected).length === questions.length && (
        <div className="quiz-finish">
          <p>You completed the quiz! 🎉</p>
          <p className="quiz-score">
            Score: {totalCorrect} / {questions.length}
          </p>
          {totalCorrect < 4 ? (
            <p className="quiz-insult">
              Bro... you got {totalCorrect} right? What are you doing with your life? 😭  
              Go touch some flashcards and come back. Seriously.
            </p>
          ) : totalCorrect < 8 ? (
            <p className="quiz-insult">
              Not bad, but not great either. Keep grinding, rookie 🧐
            </p>
          ) : (
            <p className="quiz-insult">
              Okay okay, Mr. Dictionary 📚🔥 Calm down, Oxford might call you soon!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
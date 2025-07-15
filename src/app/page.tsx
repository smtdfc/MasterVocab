'use client';

import "@/styles/pages/home.css";
import { UserManage, fakeData } from '@/services/client/user';
import { LearnData } from '@/types';
import { useEffect, useState } from 'react';
import * as Chartist from 'chartist';

const allStats = [
  { label: "Total Word Attempts", key: "totalWordAttempts" },
  { label: "Total Practice Sessions", key: "totalPractice" },
  { label: "Unique Words", key: "uniqueWords" },
  { label: "Correct Answers", key: "correctAnswers" },
  { label: "Incorrect Answers", key: "incorrectAnswers" },
  { label: "Average Attempts per Word", key: "avgAttemptsPerWord" },
  { label: "Session Count", key: "sessionCount" },
  { label: "Average Session Length", key: "avgSessionLength" },
  { label: "Daily Streak", key: "dailyStreak" },
  { label: "Average Recall Time", key: "avgRecallTime" },
  { label: "Completion Rate", key: "completionRate", suffix: "%" },
  { label: "Mastery Score", key: "masteryScore" },
];

export default function Home() {
  const [latestData, setLatestData] = useState < LearnData | null > (null);
  
  useEffect(() => {
    const recentData = UserManage.getRecentLearningData();
    const chartData = {
      labels: recentData.map(d => d.date),
      series: [
        recentData.map(d => d.totalWordAttempts),
        recentData.map(d => d.totalPractice)
      ],
    };
    
    new Chartist.BarChart('.ct-chart', chartData, {
      seriesBarDistance: 15,
      axisY: { onlyInteger: true, offset: 40 },
    });
    setLatestData(recentData.at(-1) ?? null);
  }, []);
  
  const MAX_VOCAB = 150;
  const MAX_PRACTICE = 50;
  const clamp01 = (value: number) => Math.min(1, value);
  const learningSpeed = latestData && latestData.totalPractice > 0 ?
    latestData.totalWordAttempts / latestData.totalPractice :
    0;
  
  const performance = latestData ?
    (
      clamp01(latestData.totalWordAttempts / MAX_VOCAB) * 0.6 +
      clamp01(latestData.totalPractice / MAX_PRACTICE) * 0.4
    ) * 100 :
    0;
  
  return (
    <>
      <h3>Learning effectiveness</h3>
      <div className="ct-chart ct-perfect-fourth"></div>

      <h3>Learning Statistics</h3>
      <table>
        <tbody>
          {allStats.map(({ label, key, suffix }) => (
            <StatRow
              key={key}
              label={label}
              value={
                latestData
                  ? `${(latestData[key as keyof LearnData] ?? 0)}${suffix ?? ""}`
                  : "-"
              }
            />
          ))}
          <StatRow label="Learning Speed" value={learningSpeed.toFixed(2)} />
          <StatRow
            label="Learning Performance"
            value={`${performance.toFixed(2)}%`}
            highlight={performance}
          />
        </tbody>
      </table>
    </>
  );
}

type StatRowProps = {
  label: string;
  value: string | number;
  highlight ? : number;
};

function StatRow({ label, value, highlight }: StatRowProps) {
  let color = "inherit";
  if (typeof highlight === "number") {
    if (highlight >= 90) color = "green";
    else if (highlight >= 50) color = "orange";
    else color = "red";
  }
  
  return (
    <tr>
      <th>{label}</th>
      <td style={{ color, fontWeight: highlight !== undefined ? "bold" : "normal" }}>
        {value}
      </td>
    </tr>
  );
}
"use client";

import "@/styles/pages/home.css";
import { UserManage } from '@/services/client/user';
import { LearnData } from '@/types';
import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

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

const MAX_VOCAB = 150;
const MAX_PRACTICE = 50;
const clamp01 = (value: number) => Math.min(1, value);

export default function Home() {
  const [latestData, setLatestData] = useState<LearnData | null>(null);
  const [recentData, setRecentData] = useState<LearnData[]>([]);

  useEffect(() => {
    const history = UserManage.getRecentLearningData();
    setRecentData(history);
    setLatestData(history.at(-1) ?? null);
  }, []);

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

      <div style={{ maxWidth: 800 }}>
        <Line
          data={{
            labels: recentData.map(d => d.date),
            datasets: [
              {
                label: 'Completion Rate (%)',
                data: recentData.map(d => d.completionRate),
                borderColor: '#4BC0C0',
                fill: false,
              },
            ],
          }}
        />

        <Bar
          data={{
            labels: recentData.map(d => d.date),
            datasets: [
              {
                label: 'Correct',
                data: recentData.map(d => d.correctAnswers),
                backgroundColor: '#36A2EB',
              },
              {
                label: 'Incorrect',
                data: recentData.map(d => d.incorrectAnswers),
                backgroundColor: '#FF6384',
              },
            ],
          }}
        />

        {latestData && (
          <Doughnut
            data={{
              labels: ['Correct', 'Incorrect'],
              datasets: [
                {
                  data: [latestData.correctAnswers, latestData.incorrectAnswers],
                  backgroundColor: ['#36A2EB', '#FF6384'],
                },
              ],
            }}
          />
        )}

        {latestData && (
          <Bar
            data={{
              labels: ['Total Word Attempts', 'Total Practice'],
              datasets: [
                {
                  label: 'Normalized Score',
                  data: [
                    clamp01(latestData.totalWordAttempts / MAX_VOCAB),
                    clamp01(latestData.totalPractice / MAX_PRACTICE),
                  ],
                  backgroundColor: ['#42A5F5', '#66BB6A'],
                },
              ],
            }}
            options={{
              indexAxis: 'y',
              scales: {
                x: { min: 0, max: 1 },
              },
            }}
          />
        )}
      </div>

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
  highlight?: number;
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

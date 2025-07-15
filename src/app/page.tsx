'use client';

import "@/styles/pages/home.css";
import { UserManage, fakeData } from '@/services/client/user';
import { LearnData } from '@/types';
import { useEffect, useState } from 'react';
import * as Chartist from 'chartist';

export default function Home() {
  const [latestData, setLatestData] = useState < LearnData | null > (null);
  
  useEffect(() => {
    const recentData = UserManage.getRecentLearningData();
    const chartData = {
      labels: recentData.map(d => d.date),
      series: [
        recentData.map(d => d.totalVocab),
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
    latestData.totalVocab / latestData.totalPractice :
    0;
  
  const performance = latestData ?
    (
      clamp01(latestData.totalVocab / MAX_VOCAB) * 0.6 +
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
          <StatRow label="Total Vocabulary" value={latestData?.totalVocab ?? 0} />
          <StatRow label="Total Practice" value={latestData?.totalPractice ?? 0} />
          <StatRow label="Learning speed" value={learningSpeed.toFixed(2)} />
          <StatRow
            label="Learning performance"
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
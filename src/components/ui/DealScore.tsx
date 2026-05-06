'use client';

import { useEffect, useState } from 'react';

interface DealScoreProps {
  score: number;
  size?: number;
}

export default function DealScore({ score, size = 80 }: DealScoreProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 50);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const color =
    score >= 65 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444';

  const trackColor = score >= 65 ? '#d1fae5' : score >= 40 ? '#fef3c7' : '#fee2e2';

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        fill="none"
        className="rotate-[-90deg]"
      >
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke={trackColor}
          strokeWidth="7"
          fill="none"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          stroke={color}
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="score-ring-fill"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="text-xl font-bold tabular-nums leading-none"
          style={{ color }}
        >
          {score}
        </span>
        <span className="text-[9px] text-zinc-400 font-medium mt-0.5">SCORE</span>
      </div>
    </div>
  );
}

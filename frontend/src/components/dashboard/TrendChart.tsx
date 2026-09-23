import React from 'react';
import type { BehaviorSignal } from '../../types/wellbeing';

interface TrendChartProps {
  signals: BehaviorSignal[];
  accentColor: string;
}

export const TrendChart: React.FC<TrendChartProps> = ({ signals, accentColor }) => {
  const points = signals.length
    ? signals
        .map((s, i) => {
          const x = (i / Math.max(signals.length - 1, 1)) * 100;
          const variance = s.routine_variance ?? s.val ?? 1.0;
          const y = 82 - Math.min(62, (variance - 0.7) * 23);
          return `${x},${y}`;
        })
        .join(' ')
    : '0,80 50,55 100,30';

  return (
    <div className="relative mt-8 h-48 overflow-hidden rounded-xl bg-[#f7faf8] p-4">
      <div className="absolute inset-x-4 top-5 flex flex-col gap-8">
        <span className="border-t border-dashed border-[#e1ebe6]" />
        <span className="border-t border-dashed border-[#e1ebe6]" />
        <span className="border-t border-dashed border-[#e1ebe6]" />
      </div>

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="relative h-full w-full"
        role="img"
        aria-label="Routine trend over time visualization"
      >
        <defs>
          <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={accentColor} stopOpacity=".22" />
            <stop offset="1" stopColor={accentColor} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline points={`0,88 ${points} 100,88`} fill="url(#trend-fill)" stroke="none" />
        <polyline
          points={points}
          fill="none"
          stroke={accentColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="absolute bottom-3 left-4 right-4 flex justify-between text-[10px] text-[#a0b2ac]">
        <span>21 days ago</span>
        <span>Today</span>
      </div>
    </div>
  );
};

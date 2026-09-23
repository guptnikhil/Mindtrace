import React from 'react';
import { Clock3, BookOpen, UsersRound, Activity } from 'lucide-react';
import type { Factor, View } from '../../types/wellbeing';

interface MetricBreakdownProps {
  factors: Factor[];
  navigate: (view: View) => void;
}

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Clock3,
  BookOpen,
  UsersRound,
  Activity,
};

export const MetricBreakdown: React.FC<MetricBreakdownProps> = ({ factors, navigate }) => {
  return (
    <div className="rounded-2xl border border-[#e4ebe8] bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#35584f]">What’s changing?</h2>
        <button onClick={() => navigate('history')} className="text-xs font-medium text-[#76918a] hover:text-[#2f6f64]">
          Details
        </button>
      </div>
      <div className="mt-4 grid gap-3">
        {factors.map((factor) => {
          const Icon = iconMap[factor.icon] || Activity;
          return (
            <div key={factor.name} className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-lg bg-[#f1f6f3] text-[#5c8d80]">
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-[#48675f]">{factor.name}</div>
                <div className="text-[11px] text-[#96a8a3]">{factor.detail}</div>
              </div>
              <span className="text-[10px] font-medium text-[#b17c51]">{factor.status}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

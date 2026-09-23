import React from 'react';
import { ArrowLeft, ArrowRight, Info, Clock3, BookOpen, UsersRound, Activity } from 'lucide-react';
import type { Factor, View } from '../types/wellbeing';

interface TrendDetailPageProps {
  navigate: (view: View) => void;
}

const iconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Clock3,
  BookOpen,
  UsersRound,
  Activity,
};

export const TrendDetailPage: React.FC<TrendDetailPageProps> = ({ navigate }) => {
  const score = 1.18;
  const percentage = 18;
  const stateLabel = 'Changing';
  const sampleFactors: Factor[] = [
    { name: 'Late Study Hours', detail: 'Increased late-night activity', status: 'Noticeable Shift', icon: 'Clock3' },
    { name: 'Academic Load', detail: 'High assignment deadline density', status: 'Elevated Pressure', icon: 'BookOpen' },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex-1">
          <button
            onClick={() => navigate('dashboard')}
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-[#78908a] hover:text-[#2f6f64]"
          >
            <ArrowLeft size={14} /> Back to dashboard
          </button>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a47b54]">
            Your Pattern Analysis
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#1e3c35] sm:text-4xl">
            Why am I seeing this?
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#718983] sm:text-base">
            This view explains the changes we’re noticing in plain language. It compares your recent check-in routine with your own prior baseline.
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-2xl border border-[#dce9e4] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-[#35584f]">Routine Change Indicator</h2>
            <span className="rounded-full bg-[#fff4df] px-3 py-1.5 text-xs font-semibold text-[#9a6b3c]">
              {stateLabel}
            </span>
          </div>

          <div className="mt-7 flex items-end gap-3">
            <span className="text-5xl font-semibold tracking-[-0.05em] text-[#2f6f64]">
              {percentage}%
            </span>
            <span className="mb-2 text-sm text-[#8da29c]">shift from your baseline</span>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#edf3f0]">
            <div
              className="h-full rounded-full bg-[#77a995] transition-all"
              style={{ width: `${Math.min(100, Math.max(12, (score - 1.0) * 150))}%` }}
            />
          </div>

          <p className="mt-4 text-sm leading-6 text-[#718983]">
            This is a simple explainable routine indicator calculated by FastAPI — not a medically validated score or a burnout diagnosis.
          </p>

          <button
            onClick={() => navigate('settings')}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#2f6f64]"
          >
            How the trend is calculated <ArrowRight size={15} />
          </button>
        </div>

        <div className="rounded-2xl border border-[#e4ebe8] bg-white p-5 sm:p-7">
          <h2 className="font-semibold text-[#35584f]">What’s different lately</h2>
          <div className="mt-6 flex flex-col gap-5">
            {sampleFactors.map((factor: Factor) => {
              const Icon = iconMap[factor.icon] || Activity;
              return (
                <div key={factor.name} className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-xl bg-[#f1f6f3] text-[#5c8d80]">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#48675f]">{factor.name}</p>
                    <p className="mt-0.5 text-xs text-[#a27652]">{factor.status} • {factor.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-[#eee4d8] bg-[#fffbf5] p-5 sm:p-6">
        <div className="flex gap-3">
          <Info size={18} className="mt-0.5 shrink-0 text-[#b07e4d]" />
          <div>
            <p className="text-sm font-semibold text-[#5f4834]">How baseline comparison works</p>
            <p className="mt-1.5 text-sm leading-6 text-[#846b54]">
              We compute your personal baseline from earlier routine signals in local engine database, then compare the last seven days against it. We never compare you with other students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

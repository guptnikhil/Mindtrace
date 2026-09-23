import React, { useState } from 'react';
import { Leaf, ArrowRight, HeartHandshake } from 'lucide-react';
import type { Nudge, View } from '../../types/wellbeing';

interface NudgeCardProps {
  nudge: Nudge | null;
  navigate: (view: View) => void;
}

export const NudgeCard: React.FC<NudgeCardProps> = ({ nudge, navigate }) => {
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(nudge?.helpful ?? null);

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(helpful);
  };

  const title = nudge?.title || 'A gentle nudge';
  const message = nudge?.message || nudge?.body || 'Your routine shifts over time. Give yourself room for small rest moments.';

  return (
    <div className="rounded-2xl bg-[#2f6f64] p-5 text-white shadow-[0_12px_30px_rgba(47,111,100,0.16)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-white/15">
          <Leaf size={19} />
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-medium text-[#cfe6de]">
          Support Nudge
        </span>
      </div>

      <h2 className="mt-5 text-lg font-semibold leading-6">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-[#cfe1dc]">{message}</p>

      <button
        onClick={() => navigate('reset')}
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#2f6f64] transition-colors hover:bg-[#f0f8f5] cursor-pointer"
      >
        Take a 2-minute reset <ArrowRight size={15} />
      </button>

      <button
        onClick={() => navigate('support')}
        className="mt-3 flex w-full items-center justify-center gap-2 text-xs font-semibold text-[#d5e9e3] hover:text-white cursor-pointer"
      >
        Talk to someone <HeartHandshake size={14} />
      </button>

      <div className="mt-5 border-t border-white/15 pt-4">
        <p className="text-[11px] text-[#b9d4cc]">Was this helpful?</p>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => handleFeedback(true)}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
              feedbackGiven === true
                ? 'bg-white text-[#2f6f64]'
                : 'bg-white/10 text-[#d5e9e3] hover:bg-white/20'
            }`}
          >
            Helpful
          </button>
          <button
            onClick={() => handleFeedback(false)}
            className={`rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors ${
              feedbackGiven === false
                ? 'bg-white text-[#2f6f64]'
                : 'bg-white/10 text-[#d5e9e3] hover:bg-white/20'
            }`}
          >
            Not for me
          </button>
        </div>
      </div>
    </div>
  );
};

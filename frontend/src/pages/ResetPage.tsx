import React, { useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import type { View } from '../types/wellbeing';

interface ResetPageProps {
  navigate: (view: View) => void;
}

export const ResetPage: React.FC<ResetPageProps> = ({ navigate }) => {
  const [seconds, setSeconds] = useState(120);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || seconds <= 0) return;
    const timer = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(timer);
  }, [paused, seconds]);

  const elapsed = 120 - seconds;
  const phase = elapsed % 12 < 4 ? 'Inhale' : elapsed % 12 < 6 ? 'Hold' : 'Exhale';

  return (
    <div className="mx-auto flex min-h-[calc(100vh-73px)] max-w-xl flex-col px-5 py-8 sm:px-8 lg:justify-center lg:py-14">
      <button
        onClick={() => navigate('dashboard')}
        className="mb-10 inline-flex items-center gap-2 self-start text-sm font-medium text-[#78908a] hover:text-[#2f6f64]"
      >
        <ArrowLeft size={15} /> Back to dashboard
      </button>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#a47b54]">
          A small reset
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-[#1e3c35]">
          Pause for a moment.
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#718983]">
          Follow the circle gently. There’s nothing to get right.
        </p>

        <div className="relative mx-auto mt-12 grid size-64 place-items-center">
          <div className="absolute inset-0 rounded-full border border-[#c9e0d7] bg-[#eff8f4]" />
          <div
            className={`relative grid size-44 place-items-center rounded-full bg-[#b8d9cd] shadow-[0_0_0_18px_rgba(184,217,205,0.25)] ${
              !paused && seconds > 0 ? 'breathing-cycle' : ''
            }`}
          >
            <div>
              <p className="text-center text-2xl font-semibold text-[#2f6f64]">
                {seconds === 0 ? 'Done' : phase}
              </p>
              <p className="mt-1 text-center text-sm text-[#508376]">
                {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-3">
          <button
            onClick={() => setPaused(!paused)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2f6f64] px-5 py-3 text-sm font-semibold text-white hover:bg-[#245e54]"
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
            {paused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={() => setSeconds(120)}
            className="inline-flex items-center gap-2 rounded-xl border border-[#dce9e4] bg-white px-5 py-3 text-sm font-semibold text-[#52736a] hover:bg-[#f1f6f3]"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        {seconds === 0 && (
          <div className="mt-10">
            <p className="font-semibold text-[#35584f]">Nice. You took a moment for yourself.</p>
            <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate('dashboard')}
                className="rounded-xl bg-[#2f6f64] px-5 py-3 text-sm font-semibold text-white"
              >
                Back to dashboard
              </button>
              <button
                onClick={() => navigate('support')}
                className="rounded-xl border border-[#dce9e4] bg-white px-5 py-3 text-sm font-semibold text-[#52736a]"
              >
                Talk to someone
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

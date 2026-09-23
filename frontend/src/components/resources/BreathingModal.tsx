import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Wind } from 'lucide-react';
import type { ResourceItem } from '../../types/wellbeing';

interface BreathingModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

export const BreathingModal: React.FC<BreathingModalProps> = ({ resource, onClose }) => {
  const isBreathing = Boolean(resource && resource.type === 'breathing');

  const pattern = resource?.breathingPattern || {
    phases: [
      { name: 'INHALE', durationSeconds: 4 },
      { name: 'HOLD', durationSeconds: 7 },
      { name: 'EXHALE', durationSeconds: 8 },
    ],
    cycles: 5,
  };

  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(pattern.phases[0]?.durationSeconds || 4);
  const [isPlaying, setIsPlaying] = useState(true);
  const [completedCycles, setCompletedCycles] = useState(0);

  // Sync state when resource changes
  useEffect(() => {
    if (resource?.breathingPattern?.phases?.[0]) {
      setPhaseIndex(0);
      setSecondsLeft(resource.breathingPattern.phases[0].durationSeconds);
      setCompletedCycles(0);
      setIsPlaying(true);
    }
  }, [resource]);

  useEffect(() => {
    let timer: any = null;
    if (isBreathing && isPlaying) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            const nextIndex = (phaseIndex + 1) % pattern.phases.length;
            setPhaseIndex(nextIndex);
            if (nextIndex === 0) {
              setCompletedCycles((c) => c + 1);
            }
            return pattern.phases[nextIndex].durationSeconds;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isBreathing, isPlaying, phaseIndex, pattern.phases]);

  if (!isBreathing || !resource) return null;

  const currentPhase = pattern.phases[phaseIndex] || pattern.phases[0];

  const handleRestart = () => {
    setPhaseIndex(0);
    setSecondsLeft(pattern.phases[0].durationSeconds);
    setCompletedCycles(0);
    setIsPlaying(true);
  };

  // Determine animation scale
  const isExpanding = currentPhase.name === 'INHALE';
  const isHolding = currentPhase.name === 'HOLD';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#152420] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 dark:border-[#243d36] text-center relative overflow-hidden space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-[#6ec4b2] text-xs font-semibold uppercase tracking-wider">
            <Wind className="w-4 h-4 animate-pulse" />
            <span>Interactive Breathing Reset</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {resource.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {resource.description}
          </p>
        </div>

        {/* Breathing Circle Animation */}
        <div className="relative my-8 flex items-center justify-center h-48">
          <div
            className={`w-36 h-36 rounded-full bg-linear-to-br from-emerald-400/30 to-teal-600/30 dark:from-emerald-500/20 dark:to-teal-400/20 border-2 border-emerald-500 flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${
              isExpanding
                ? 'scale-125 shadow-lg shadow-emerald-500/20'
                : isHolding
                ? 'scale-120 opacity-90'
                : 'scale-90 opacity-75'
            }`}
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-200">
              {currentPhase.name}
            </span>
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
              {secondsLeft}s
            </span>
          </div>

          {/* Screen reader announcement */}
          <div className="sr-only" aria-live="polite">
            Current phase: {currentPhase.name}, {secondsLeft} seconds remaining.
          </div>
        </div>

        {/* Cycle Counter */}
        <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
          Completed Cycles: <span className="font-bold text-slate-800 dark:text-slate-200">{completedCycles}</span> / {pattern.cycles}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleRestart}
            className="p-3 rounded-full bg-slate-100 dark:bg-[#1d302a] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#253d36] transition-colors"
            title="Restart exercise"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
        </div>

        <p className="text-[11px] text-slate-400 dark:text-slate-500">
          Take deep, natural breaths. Stop at any time if you feel lightheaded.
        </p>
      </div>
    </div>
  );
};

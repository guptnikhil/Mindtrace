import React, { useState } from 'react';
import { X, Check, RefreshCw } from 'lucide-react';
import type { DemoState } from '../../types/wellbeing';

interface DemoControlsModalProps {
  currentDemoState: DemoState;
  onSelectState: (state: DemoState) => Promise<void>;
  onClose: () => void;
}

const states: { value: DemoState; label: string; desc: string }[] = [
  { value: 'stable', label: '1. Normal Baseline', desc: 'Routine activity matches baseline consistently (Stable).' },
  { value: 'changing', label: '2. Early Drift', desc: 'Moderate shift in late study hours and task delays (Changing).' },
  { value: 'needs_attention', label: '3. Current Trend', desc: 'Significant shift in routine pattern across 7 days (Needs Attention).' },
];

export const DemoControlsModal: React.FC<DemoControlsModalProps> = ({
  currentDemoState,
  onSelectState,
  onClose,
}) => {
  const [loadingState, setLoadingState] = useState<DemoState | null>(null);

  const handleSelect = async (state: DemoState) => {
    setLoadingState(state);
    try {
      await onSelectState(state);
    } finally {
      setLoadingState(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#18342e]/30 p-4 sm:items-center backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-[#dce9e4] dark:border-[#203630] bg-white dark:bg-[#152420] p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#a47b54] dark:text-[#d4a373]">Demo Control Panel</p>
            <h2 className="mt-1 text-lg font-semibold text-[#35584f] dark:text-[#e2ece8]">Simulated Student Scenario: Riya</h2>
          </div>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-[#78908a] dark:text-[#9db8b0] hover:bg-[#f1f6f3] dark:hover:bg-[#1d302a]"
            aria-label="Close demo controls"
          >
            <X size={18} />
          </button>
        </div>

        <p className="mt-3 text-sm leading-6 text-[#78908a] dark:text-[#9db8b0]">
          Seeds deterministic 21-day behavioral signals into the calculation engine. Select a scenario or reset demo state instantly.
        </p>

        <div className="mt-5 grid gap-2.5">
          {states.map(({ value, label, desc }) => {
            const isSelected = currentDemoState === value;
            const isLoading = loadingState === value;
            return (
              <button
                key={value}
                onClick={() => handleSelect(value)}
                disabled={isLoading}
                className={`flex items-start justify-between rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#84b4a5] bg-[#eef7f3] dark:bg-[#1e3831] text-[#2f6f64] dark:text-[#6ec4b2]'
                    : 'border-[#e0eae6] dark:border-[#223932] text-[#52736a] dark:text-[#9db8b0] hover:bg-[#f5faf7] dark:hover:bg-[#1a2c27]'
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="mt-0.5 text-xs text-[#78908a] dark:text-[#8ea8a0]">{desc}</div>
                </div>
                {isLoading ? (
                  <RefreshCw size={16} className="animate-spin text-[#2f6f64] dark:text-[#6ec4b2] shrink-0 mt-1" />
                ) : (
                  isSelected && <Check size={16} className="text-[#2f6f64] dark:text-[#6ec4b2] shrink-0 mt-1" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-5 border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between">
          <span className="text-xs text-slate-500 dark:text-slate-400">Restore default demo dataset</span>
          <button
            onClick={() => handleSelect('changing')}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-semibold shadow-xs cursor-pointer transition-colors"
          >
            <RefreshCw size={13} /> Reset Demo State
          </button>
        </div>
      </div>
    </div>
  );
};

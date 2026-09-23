import React, { useState } from 'react';
import { X, Play, Pause, Headphones, Volume2 } from 'lucide-react';
import type { ResourceItem } from '../../types/wellbeing';

interface AudioPlayerModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({ resource, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);

  if (!resource || resource.type !== 'audio') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#152420] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 dark:border-[#243d36] text-center space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-[#6ec4b2] text-xs font-semibold uppercase tracking-wider">
            <Headphones className="w-4 h-4" />
            <span>Ambient Sound & Audio</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div>
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3">
            <Volume2 className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {resource.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {resource.description} ({resource.duration})
          </p>
        </div>

        {/* Audio Waveform Simulation */}
        <div className="py-6 flex items-center justify-center gap-1.5 h-16">
          {[40, 70, 30, 90, 60, 100, 45, 80, 50, 75, 35, 85].map((h, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full bg-emerald-500 transition-all duration-300 ${
                isPlaying ? 'animate-pulse' : 'opacity-40'
              }`}
              style={{ height: isPlaying ? `${h}%` : '20%' }}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-[11px] text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
          Audio preview active. Use this ambient space for a short mental break or study focus.
        </div>
      </div>
    </div>
  );
};

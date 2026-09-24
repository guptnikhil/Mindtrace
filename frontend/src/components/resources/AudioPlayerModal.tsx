import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Headphones, Volume2, VolumeX, Sparkles } from 'lucide-react';
import type { ResourceItem } from '../../types/wellbeing';
import { ambientAudio } from '../../utils/ambientAudio';

interface AudioPlayerModalProps {
  resource: ResourceItem | null;
  onClose: () => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({ resource, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Determine soundscape style for descriptive feedback
  const getSoundscapeType = (id: string) => {
    const lower = id.toLowerCase();
    if (lower.includes('rain') || lower.includes('calming') || lower.includes('calm_sounds')) {
      return {
        badge: 'Gentle Rain & Nature',
        desc: 'Procedural soothing rainfall with natural acoustic swells',
      };
    }
    if (lower.includes('focus')) {
      return {
        badge: '10Hz Alpha Focus Drone',
        desc: 'Binaural flow-state frequencies for deep study concentration',
      };
    }
    return {
      badge: '432Hz Zen Meditation',
      desc: 'Solfeggio harmonic chord with periodic singing bowl chimes',
    };
  };

  // Start sound on mount / resource change
  useEffect(() => {
    if (!resource || resource.type !== 'audio') return;

    setElapsedSeconds(0);
    setIsPlaying(true);
    ambientAudio.play(resource.id, isMuted ? 0.0001 : volume);

    return () => {
      ambientAudio.stop();
    };
  }, [resource]);

  // Elapsed timer when playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  if (!resource || resource.type !== 'audio') return null;

  const soundscape = getSoundscapeType(resource.id);

  const handleTogglePlay = () => {
    if (isPlaying) {
      ambientAudio.pause();
      setIsPlaying(false);
    } else {
      ambientAudio.play(resource.id, isMuted ? 0.0001 : volume);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isMuted) setIsMuted(false);
    ambientAudio.setVolume(newVol);
  };

  const handleToggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      ambientAudio.setVolume(volume);
    } else {
      setIsMuted(true);
      ambientAudio.setVolume(0.0001);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#152420] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-emerald-100 dark:border-[#243d36] text-center space-y-6 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-12 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between relative">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-[#6ec4b2] text-xs font-semibold uppercase tracking-wider">
            <Headphones className="w-4 h-4" />
            <span>Interactive Ambient Sound</span>
          </div>
          <button
            onClick={() => {
              ambientAudio.stop();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Badge */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
            <Sparkles className="w-3 h-3 text-emerald-500" />
            <span>{soundscape.badge}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            {resource.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            {resource.description}
          </p>
        </div>

        {/* Audio Waveform Visualization */}
        <div className="py-4 px-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-center gap-1.5 h-16">
            {[45, 80, 30, 95, 60, 100, 45, 85, 55, 75, 40, 90, 50, 70].map((h, i) => (
              <div
                key={i}
                className={`w-1.5 rounded-full transition-all duration-300 ${
                  isPlaying
                    ? 'bg-linear-to-t from-emerald-600 to-teal-400 animate-pulse'
                    : 'bg-slate-300 dark:bg-slate-700 opacity-40'
                }`}
                style={{
                  height: isPlaying ? `${Math.max(20, (h * (volume || 0.5)))}%` : '15%',
                  animationDelay: `${i * 70}ms`,
                }}
              />
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
            <span>{formatTime(elapsedSeconds)}</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-sans font-medium">
              {isPlaying ? '🔊 Soundscape Playing' : '⏸️ Audio Paused'}
            </span>
            <span>{resource.duration || 'Demo'}</span>
          </div>
        </div>

        {/* Play/Pause Controls */}
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={handleTogglePlay}
            className="w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            aria-label={isPlaying ? 'Pause sound' : 'Play sound'}
          >
            {isPlaying ? (
              <Pause className="w-7 h-7" />
            ) : (
              <Play className="w-7 h-7 ml-1 fill-current" />
            )}
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center justify-center gap-3 px-4">
          <button
            onClick={handleToggleMute}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-amber-500" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
            className="w-36 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-600"
          />
          <span className="text-[11px] text-slate-400 w-8 text-right font-mono">
            {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
          </span>
        </div>

        {/* Helpful Explanation Footer */}
        <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/50 text-[11px] text-emerald-800 dark:text-emerald-300">
          {soundscape.desc}. Adjust volume or pause anytime.
        </div>
      </div>
    </div>
  );
};

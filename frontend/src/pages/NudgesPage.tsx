import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, RefreshCw, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import type { View, Nudge } from '../types/wellbeing';
import { NudgeService } from '../services/api';

interface NudgesPageProps {
  studentId: string;
  navigate: (view: View) => void;
}

export const NudgesPage: React.FC<NudgesPageProps> = ({ studentId, navigate }) => {
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNudges = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await NudgeService.getNudges(studentId);
      setNudges(data);
    } catch (err) {
      console.error('Failed to fetch nudges:', err);
      setError('Could not retrieve recommendations at this time.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await NudgeService.generateNudge(studentId);
      await fetchNudges();
    } catch (err) {
      console.error('Failed to generate nudge:', err);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchNudges();
    } else {
      setLoading(false);
    }
  }, [studentId]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <button
        onClick={() => navigate('dashboard')}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-[#78908a] dark:text-[#9bb3ab] hover:text-[#2f6f64] dark:hover:text-[#6ec4b2] cursor-pointer"
      >
        <ArrowLeft size={14} /> Back to dashboard
      </button>

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a47b54] dark:text-[#d4a373]">
            Supportive Recommendations
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#1e3c35] dark:text-[#e2ece8] sm:text-4xl">
            Wellbeing Nudges
          </h1>
          <p className="mt-2 text-sm text-[#718983] dark:text-[#a0b6af]">
            Contextual advice matched to your recent check-in patterns.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating || !studentId}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#245e54] dark:hover:bg-[#2f6f64] disabled:opacity-50 cursor-pointer"
        >
          {generating ? <RefreshCw size={16} className="animate-spin" /> : <Sparkles size={16} />}
          {generating ? 'Generating...' : 'Refresh Recommendation'}
        </button>
      </div>

      {loading && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-[#78908a] dark:text-[#a0b6af]">
          <RefreshCw size={28} className="animate-spin text-[#2f6f64] dark:text-[#6ec4b2] mb-3" />
          <p className="text-sm font-medium">Fetching contextual nudges...</p>
        </div>
      )}

      {error && (
        <div className="my-6 flex items-start gap-3 rounded-xl border border-[#f5c6cb] bg-[#f8d7da] dark:border-[#5e272b] dark:bg-[#381619] p-4 text-sm text-[#721c24] dark:text-[#f3b0b5]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {!loading && !error && nudges.length === 0 && (
        <div className="my-10 rounded-2xl border border-dashed border-[#dce9e4] bg-white dark:border-[#28453e] dark:bg-[#182824] p-10 text-center">
          <Bell size={36} className="mx-auto text-[#a0b2ac] dark:text-[#607a73] mb-3" />
          <h3 className="text-lg font-semibold text-[#1e3c35] dark:text-[#e2ece8]">No active nudges yet</h3>
          <p className="mt-1 text-sm text-[#78908a] dark:text-[#9eb4ad] max-w-sm mx-auto">
            Submit a daily check-in to unlock personalized wellbeing recommendations.
          </p>
          <button
            onClick={() => navigate('checkin')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-5 py-3 text-sm font-semibold text-white cursor-pointer"
          >
            Go to Check-in
          </button>
        </div>
      )}

      {!loading && !error && nudges.length > 0 && (
        <div className="flex flex-col gap-4">
          {nudges.map((nudge) => (
            <div
              key={nudge.id}
              className="rounded-2xl border border-[#e4ebe8] bg-white p-6 shadow-xs dark:border-[#253d37] dark:bg-[#182824] transition-all hover:border-[#b9d4ca] dark:hover:border-[#386156]"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="rounded-full bg-[#edf6f2] dark:bg-[#1f3831] px-3 py-1 text-xs font-semibold text-[#2f6f64] dark:text-[#6ec4b2] capitalize">
                  {nudge.category} • Priority: {nudge.priority}
                </span>
                <span className="text-xs text-[#90a29c] dark:text-[#78938b]">
                  {new Date(nudge.created_at).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-lg font-semibold text-[#1e3c35] dark:text-[#e2ece8]">{nudge.title}</h2>
              <p className="mt-2 text-sm leading-6 text-[#607a73] dark:text-[#9db8b0]">{nudge.message}</p>

              <div className="mt-5 flex justify-end">
                <button
                  onClick={() => navigate('reset')}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#2f6f64] dark:text-[#6ec4b2] hover:text-[#245e54] cursor-pointer"
                >
                  Take action <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

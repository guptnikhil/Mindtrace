import React, { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle, Calendar, Moon, Zap, BookOpen, Activity } from 'lucide-react';
import type { View, Checkin } from '../types/wellbeing';
import { CheckinService } from '../services/api';

interface HistoryPageProps {
  studentId: string;
  navigate: (view: View) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ studentId, navigate }) => {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await CheckinService.getCheckins(studentId);
      setCheckins(data);
    } catch (err: any) {
      console.error('Failed to load check-in history:', err);
      setError('We couldn’t retrieve your check-in history right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchHistory();
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
            Progress & Logs
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#1e3c35] dark:text-[#e2ece8] sm:text-4xl">
            Check-in History
          </h1>
        </div>
        <button
          onClick={() => navigate('checkin')}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#245e54] dark:hover:bg-[#2f6f64] cursor-pointer"
        >
          New Check-in
        </button>
      </div>

      {loading && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-[#78908a] dark:text-[#a0b6af]">
          <RefreshCw size={28} className="animate-spin text-[#2f6f64] dark:text-[#6ec4b2] mb-3" />
          <p className="text-sm font-medium">Loading your check-in records from database...</p>
        </div>
      )}

      {error && (
        <div className="my-6 flex items-start gap-3 rounded-xl border border-[#f5c6cb] bg-[#f8d7da] dark:border-[#5e272b] dark:bg-[#381619] p-4 text-sm text-[#721c24] dark:text-[#f3b0b5]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {!loading && !error && checkins.length === 0 && (
        <div className="my-10 rounded-2xl border border-dashed border-[#dce9e4] bg-white dark:border-[#28453e] dark:bg-[#182824] p-10 text-center">
          <Calendar size={36} className="mx-auto text-[#a0b2ac] dark:text-[#607a73] mb-3" />
          <h3 className="text-lg font-semibold text-[#1e3c35] dark:text-[#e2ece8]">No previous check-ins yet</h3>
          <p className="mt-1 text-sm text-[#78908a] dark:text-[#9eb4ad] max-w-sm mx-auto">
            Take your first 1-minute daily check-in to start building your personal baseline.
          </p>
          <button
            onClick={() => navigate('checkin')}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-5 py-3 text-sm font-semibold text-white cursor-pointer"
          >
            Start Check-in
          </button>
        </div>
      )}

      {!loading && !error && checkins.length > 0 && (
        <div className="flex flex-col gap-4">
          {checkins.map((item) => {
            const formattedDate = new Date(item.created_at).toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[#e4ebe8] bg-white p-5 shadow-xs dark:border-[#253d37] dark:bg-[#182824] transition-all hover:border-[#b9d4ca] dark:hover:border-[#386156]"
              >
                <div className="flex items-center justify-between border-b border-[#edf2ef] dark:border-[#243d36] pb-3 mb-4">
                  <span className="text-xs font-semibold text-[#48675f] dark:text-[#88ada3] flex items-center gap-1.5">
                    <Calendar size={14} /> {formattedDate}
                  </span>
                  <span className="rounded-full bg-[#f1f6f3] dark:bg-[#1f3831] px-2.5 py-1 text-[11px] font-semibold text-[#2f6f64] dark:text-[#6ec4b2]">
                    Recorded
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-[#2f6f64] dark:text-[#6ec4b2]" />
                    <div>
                      <div className="text-[10px] text-[#869b95] dark:text-[#78938b]">MOOD</div>
                      <div className="text-sm font-bold text-[#1e3c35] dark:text-[#e2ece8]">{item.mood} / 5</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[#2f6f64] dark:text-[#6ec4b2]" />
                    <div>
                      <div className="text-[10px] text-[#869b95] dark:text-[#78938b]">ENERGY</div>
                      <div className="text-sm font-bold text-[#1e3c35] dark:text-[#e2ece8]">{item.energy_level} / 5</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-[#b8834e] dark:text-[#dca776]" />
                    <div>
                      <div className="text-[10px] text-[#869b95] dark:text-[#78938b]">STRESS</div>
                      <div className="text-sm font-bold text-[#b8834e] dark:text-[#dca776]">{item.stress_level} / 5</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Moon size={16} className="text-[#559386] dark:text-[#78b3a7]" />
                    <div>
                      <div className="text-[10px] text-[#869b95] dark:text-[#78938b]">SLEEP</div>
                      <div className="text-sm font-bold text-[#1e3c35] dark:text-[#e2ece8]">{item.sleep_hours} hrs</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-[#48675f] dark:text-[#88ada3]" />
                    <div>
                      <div className="text-[10px] text-[#869b95] dark:text-[#78938b]">ACADEMIC</div>
                      <div className="text-sm font-bold text-[#1e3c35] dark:text-[#e2ece8]">{item.academic_pressure} / 5</div>
                    </div>
                  </div>
                </div>

                {item.optional_note && (
                  <p className="mt-4 rounded-xl bg-[#fafaf8] dark:bg-[#121e1b] p-3 text-xs leading-5 text-[#607a73] dark:text-[#9db8b0] italic">
                    "{item.optional_note}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

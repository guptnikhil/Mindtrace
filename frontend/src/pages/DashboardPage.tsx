import React, { useEffect, useState } from 'react';
import { ArrowRight, Info, RefreshCw, Calendar, Sparkles, AlertCircle, Activity, Moon, Zap, BookOpen } from 'lucide-react';
import type { View, Student, Checkin, Nudge, Appointment, DemoState } from '../types/wellbeing';
import { StudentService, CheckinService, NudgeService, CounsellingService, apiClient } from '../services/api';
import { AppointmentCard } from '../components/counselling/AppointmentCard';
import { CalmCompanionChat } from '../components/chat/CalmCompanionChat';
import { PatternTimeline } from '../components/dashboard/PatternTimeline';
import { CounterfactualExplorer } from '../components/dashboard/CounterfactualExplorer';

interface DashboardPageProps {
  studentId: string;
  navigate: (view: View) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ studentId, navigate }) => {
  const [student, setStudent] = useState<Student | null>(null);
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [companionOpen, setCompanionOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [demoState, setDemoState] = useState<DemoState>('changing');
  const [seedingLoading, setSeedingLoading] = useState<boolean>(false);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [stu, chks, ndgs, appts] = await Promise.all([
        studentId ? StudentService.getStudent(studentId).catch(() => null) : null,
        studentId ? CheckinService.getCheckins(studentId).catch(() => []) : [],
        studentId ? NudgeService.getNudges(studentId).catch(() => []) : [],
        studentId ? CounsellingService.getStudentAppointments(studentId).catch(() => []) : [],
      ]);
      setStudent(stu);
      setCheckins(chks);
      setNudges(ndgs);
      setAppointments(appts);
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError('Could not load student dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [studentId]);

  const handleSelectDemoState = async (newState: DemoState) => {
    setSeedingLoading(true);
    setDemoState(newState);
    try {
      await apiClient.post(`/demo/seed?state=${newState}`);
      await loadDashboardData();
    } catch (e) {
      console.warn('Backend seed offline, continuing with client static scenario data');
    } finally {
      setSeedingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-[#78908a] dark:text-[#a0b6af]">
        <RefreshCw size={28} className="animate-spin text-[#2f6f64] dark:text-[#6ec4b2] mb-3" />
        <p className="text-sm font-medium">Analyzing your wellbeing check-ins...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="flex items-start gap-3 rounded-xl border border-[#f5c6cb] bg-[#f8d7da] dark:border-[#5e272b] dark:bg-[#381619] p-5 text-sm text-[#721c24] dark:text-[#f3b0b5]">
          <AlertCircle size={20} className="mt-0.5 shrink-0" />
          <div>
            <h3 className="font-semibold">Failed to load dashboard</h3>
            <p className="mt-1">{error}</p>
            <button
              onClick={loadDashboardData}
              className="mt-3 rounded-lg bg-[#721c24] px-4 py-2 text-xs font-semibold text-white cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasEnoughData = checkins.length >= 3;

  // Calculate trends from real data if available
  const avgMood = checkins.length > 0 ? (checkins.reduce((acc, c) => acc + c.mood, 0) / checkins.length).toFixed(1) : '-';
  const avgStress = checkins.length > 0 ? (checkins.reduce((acc, c) => acc + c.stress_level, 0) / checkins.length).toFixed(1) : '-';
  const avgSleep = checkins.length > 0 ? (checkins.reduce((acc, c) => acc + c.sleep_hours, 0) / checkins.length).toFixed(1) : '-';
  const avgAcademic = checkins.length > 0 ? (checkins.reduce((acc, c) => acc + c.academic_pressure, 0) / checkins.length).toFixed(1) : '-';

  const latestNudge = nudges.length > 0 ? nudges[0] : null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12 space-y-8">
      {/* Demo Scenario Control Bar */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-[#1f1a14] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="flex size-2 rounded-full bg-amber-500 animate-pulse" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <span>Deterministic Demo Scenario</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Riya (3rd Year CSE)
              </span>
            </div>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
              Simulated 21-day routine drift feeding the exact indicator calculation pipeline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 self-end sm:self-center">
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1 hidden sm:inline">Scenario:</span>
          {(['stable', 'changing', 'needs_attention'] as DemoState[]).map((st) => {
            const isSelected = demoState === st;
            const labelMap: Record<DemoState, string> = {
              stable: 'Baseline',
              changing: 'Early Drift',
              needs_attention: 'Current Shift',
            };
            return (
              <button
                key={st}
                onClick={() => handleSelectDemoState(st)}
                disabled={seedingLoading}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-white dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 border border-amber-200 dark:border-amber-900/40'
                }`}
              >
                {seedingLoading && isSelected ? 'Loading...' : labelMap[st]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-[#78908a] dark:text-[#9bb3ab]">
            Good day, {student?.name || 'Riya'}.
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-[-0.035em] text-[#1e3c35] dark:text-[#e2ece8] sm:text-4xl">
            Student Wellbeing Overview
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('checkin')}
            className="inline-flex items-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#245e54] dark:hover:bg-[#2f6f64] cursor-pointer"
          >
            <Calendar size={16} /> Daily Check-in
          </button>
        </div>
      </div>

      {/* Active Support Sessions Section */}
      {appointments.length > 0 && (
        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              My Support Sessions
            </h2>
            <button
              onClick={() => navigate('counsellor')}
              className="text-xs font-semibold text-[#2f6f64] dark:text-[#6ec4b2] hover:underline"
            >
              + Book Another Session
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {appointments.map(appt => (
              <AppointmentCard key={appt.id} appointment={appt} onUpdate={loadDashboardData} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 grid gap-5 lg:grid-cols-[1.45fr_0.8fr]">
        {/* Wellbeing Trend Section */}
        <section className="rounded-2xl border border-[#dce9e4] bg-white p-5 shadow-xs dark:border-[#253d37] dark:bg-[#182824] sm:p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8da29c] dark:text-[#90a8a0]">WELLBEING TRENDS</p>
              <h2 className="mt-2 text-xl font-semibold text-[#2b5046] dark:text-[#d3e3de]">Routine Pattern Index</h2>
            </div>
            <div className="rounded-full bg-[#eaf4ef] px-3 py-1.5 text-xs font-semibold text-[#3e816e] dark:bg-[#1f3831] dark:text-[#6ec4b2]">
              {checkins.length} check-ins logged
            </div>
          </div>

          {!hasEnoughData ? (
            <div className="my-8 rounded-2xl border border-dashed border-[#dce9e4] bg-[#fafcfb] p-8 text-center dark:border-[#2b4740] dark:bg-[#13221e]">
              <Calendar size={36} className="mx-auto text-[#a0b2ac] dark:text-[#607a73] mb-3" />
              <h3 className="text-lg font-semibold text-[#1e3c35] dark:text-[#e2ece8]">Not enough data yet.</h3>
              <p className="mt-1 text-sm text-[#78908a] dark:text-[#9eb4ad] max-w-sm mx-auto">
                Log at least 3 daily check-ins to unlock continuous routine trend analysis and personalized baseline tracking.
              </p>
              <button
                onClick={() => navigate('checkin')}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#245e54] dark:hover:bg-[#2f6f64] cursor-pointer"
              >
                Log Check-in Now
              </button>
            </div>
          ) : (
            <div className="mt-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-[#e4ebe8] bg-[#f8fbf9] dark:border-[#26423a] dark:bg-[#12201c] p-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#6e8780] dark:text-[#8ea8a0] font-semibold">
                    <Activity size={14} className="text-[#2f6f64] dark:text-[#6ec4b2]" /> Avg Mood
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#1e3c35] dark:text-[#e2ece8]">{avgMood} <span className="text-xs text-[#8aa099] dark:text-[#78938b]">/ 5</span></div>
                </div>

                <div className="rounded-xl border border-[#e4ebe8] bg-[#fdfaf5] dark:border-[#382f25] dark:bg-[#211a14] p-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#7d5f3d] dark:text-[#dca776] font-semibold">
                    <Zap size={14} className="text-[#b8834e] dark:text-[#dca776]" /> Avg Stress
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#b8834e] dark:text-[#dca776]">{avgStress} <span className="text-xs text-[#8aa099] dark:text-[#78938b]">/ 5</span></div>
                </div>

                <div className="rounded-xl border border-[#e4ebe8] bg-[#f5faf8] dark:border-[#26423a] dark:bg-[#12201c] p-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#3e816e] dark:text-[#6ec4b2] font-semibold">
                    <Moon size={14} className="text-[#3e816e] dark:text-[#6ec4b2]" /> Avg Sleep
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#1e3c35] dark:text-[#e2ece8]">{avgSleep} <span className="text-xs text-[#8aa099] dark:text-[#78938b]">hrs</span></div>
                </div>

                <div className="rounded-xl border border-[#e4ebe8] bg-[#f8fbf9] dark:border-[#26423a] dark:bg-[#12201c] p-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#6e8780] dark:text-[#8ea8a0] font-semibold">
                    <BookOpen size={14} className="text-[#48675f] dark:text-[#88ada3]" /> Academic
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#1e3c35] dark:text-[#e2ece8]">{avgAcademic} <span className="text-xs text-[#8aa099] dark:text-[#78938b]">/ 5</span></div>
                </div>
              </div>

              {/* Simple visual timeline of check-ins */}
              <div className="mt-6 border-t border-[#edf2ef] dark:border-[#243d36] pt-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8aa099] dark:text-[#829c94] mb-3">Recent Check-in Logs</h4>
                <div className="flex flex-col gap-2">
                  {checkins.slice(0, 5).map((chk) => (
                    <div key={chk.id} className="flex items-center justify-between rounded-lg bg-[#f9faf9] dark:bg-[#13221e] px-4 py-2 text-xs">
                      <span className="text-[#48675f] dark:text-[#9db8b0] font-medium">{new Date(chk.created_at).toLocaleDateString()}</span>
                      <div className="flex gap-4 text-[#6e8780] dark:text-[#8ea8a0]">
                        <span>Mood: <strong className="text-[#1e3c35] dark:text-[#e2ece8]">{chk.mood}</strong></span>
                        <span>Stress: <strong className="text-[#b8834e] dark:text-[#dca776]">{chk.stress_level}</strong></span>
                        <span>Sleep: <strong className="text-[#1e3c35] dark:text-[#e2ece8]">{chk.sleep_hours}h</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-[#edf2ef] dark:border-[#243d36] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-md text-xs leading-5 text-[#6e8780] dark:text-[#9bb3ab]">
              Routine patterns are evaluated against your personal baseline to highlight early wellbeing changes.
            </p>
            <button
              onClick={() => navigate('history')}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-[#2f6f64] dark:text-[#6ec4b2] hover:text-[#245e54] cursor-pointer"
            >
              View Full History <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* Right Sidebar: Recent Nudges & Actions */}
        <div className="flex flex-col gap-5">
          {/* Counsellor Connect CTA Card */}
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/30 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">Want to talk to someone?</h3>
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
              Connect with a college counsellor at a time that works for you.
            </p>
            <button
              onClick={() => navigate('counsellor')}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 text-xs font-semibold text-white shadow-xs cursor-pointer transition-colors"
            >
              Talk to a Counsellor <ArrowRight size={14} />
            </button>
          </div>

          {/* Calm Mind Companion CTA Card (Positioned directly below College Counsellor) */}
          <div className="rounded-2xl border border-teal-200 dark:border-teal-800/60 bg-teal-50/60 dark:bg-teal-950/30 p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                <Sparkles size={15} /> Calm Mind
              </div>
              <span className="rounded-full bg-teal-100 dark:bg-teal-900/60 px-2 py-0.5 text-[10px] font-bold text-teal-800 dark:text-teal-200">
                Quick &bull; Zero Judgment
              </span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-slate-900 dark:text-slate-100">Need a quick, judgment-free space?</h3>
            <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
              Chat quietly with your companion anytime to get relaxed. No advice, no clinical labels—just safe space to process your thoughts.
            </p>
            <button
              onClick={() => setCompanionOpen(true)}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 hover:bg-teal-800 px-4 py-2.5 text-xs font-semibold text-white shadow-xs cursor-pointer transition-colors"
            >
              Talk to Calm Companion <ArrowRight size={14} />
            </button>
          </div>

          <div className="rounded-2xl border border-[#dce9e4] bg-white p-6 shadow-xs dark:border-[#253d37] dark:bg-[#182824]">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#a47b54] dark:text-[#d4a373]">
                <Sparkles size={16} /> Latest Recommendation
              </span>
              <button
                onClick={() => navigate('nudges')}
                className="text-xs font-semibold text-[#2f6f64] dark:text-[#6ec4b2] hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            {latestNudge ? (
              <div className="rounded-xl border border-[#e4ebe8] bg-[#fafcfb] dark:border-[#26423a] dark:bg-[#12201c] p-4">
                <span className="rounded-full bg-[#edf6f2] dark:bg-[#1f3831] px-2.5 py-0.5 text-[10px] font-semibold text-[#2f6f64] dark:text-[#6ec4b2] capitalize">
                  {latestNudge.category}
                </span>
                <h4 className="mt-2 text-sm font-semibold text-[#1e3c35] dark:text-[#e2ece8]">{latestNudge.title}</h4>
                <p className="mt-1 text-xs leading-5 text-[#607a73] dark:text-[#9db8b0]">{latestNudge.message}</p>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#e4ebe8] bg-[#fafcfb] dark:border-[#28453e] dark:bg-[#12201c] p-4 text-center text-xs text-[#78908a] dark:text-[#8ea8a0]">
                No active nudges yet. Complete a check-in to generate tailored tips.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-[#e4ebe8] bg-[#f5faf7] dark:border-[#253d37] dark:bg-[#152420] p-6">
            <h3 className="text-sm font-semibold text-[#1e3c35] dark:text-[#e2ece8]">Need Support & Guidance?</h3>
            <p className="mt-1 text-xs leading-5 text-[#66807a] dark:text-[#9bb3ab]">
              Access campus counseling details, academic pressure tools, and peer support contacts anytime.
            </p>
            <button
              onClick={() => navigate('support')}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#245e54] dark:hover:bg-[#2f6f64] cursor-pointer"
            >
              Access Support Resources <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Derived Pattern Timeline & Counterfactual Explorer */}
      <div className="space-y-8 pt-4 border-t border-[#edf2ef] dark:border-[#243d36]">
        <PatternTimeline demoState={demoState} />
        <CounterfactualExplorer demoState={demoState} />
      </div>

      <div className="mt-6 flex items-center gap-2 text-xs text-[#93a5a0] dark:text-[#78938b]">
        <Info size={14} /> Early-warning wellbeing indicator connected to FastAPI backend. This is not a clinical medical diagnosis.
      </div>

      {/* Calm Companion Chat Modal */}
      <CalmCompanionChat
        isOpen={companionOpen}
        onClose={() => setCompanionOpen(false)}
        onOpenCounsellor={() => navigate('counsellor')}
      />
    </div>
  );
};

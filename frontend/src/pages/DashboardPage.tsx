import React, { useEffect, useState } from 'react';
import { ArrowRight, Info, Calendar, Sparkles, Activity, Moon, Zap, BookOpen } from 'lucide-react';
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

const DEFAULT_DEMO_STUDENT: Student = {
  id: 'demo_riya',
  student_identifier: 'RIYA-CSE-03',
  name: 'Riya Sharma',
  branch: 'Computer Science',
  year: 3,
  tone: 'balanced',
  consent_given: true,
  onboarding_complete: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const DEMO_CHECKINS: Record<DemoState, Checkin[]> = {
  stable: [
    { id: 'chk_demo_s1', student_id: 'demo_riya', mood: 4, energy_level: 4, stress_level: 2, sleep_hours: 8.0, academic_pressure: 2, optional_note: 'Feeling well rested after solid study session', created_at: new Date(Date.now()).toISOString() },
    { id: 'chk_demo_s2', student_id: 'demo_riya', mood: 4, energy_level: 4, stress_level: 2, sleep_hours: 7.5, academic_pressure: 2, optional_note: 'Routine feels consistent and smooth', created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: 'chk_demo_s3', student_id: 'demo_riya', mood: 5, energy_level: 5, stress_level: 1, sleep_hours: 8.0, academic_pressure: 1, optional_note: 'Great team lab progress today', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'chk_demo_s4', student_id: 'demo_riya', mood: 4, energy_level: 4, stress_level: 2, sleep_hours: 7.5, academic_pressure: 2, optional_note: 'Library study session completed on time', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 'chk_demo_s5', student_id: 'demo_riya', mood: 4, energy_level: 4, stress_level: 2, sleep_hours: 8.0, academic_pressure: 2, optional_note: 'Weekend routine was restful', created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  ],
  changing: [
    { id: 'chk_demo_c1', student_id: 'demo_riya', mood: 3, energy_level: 3, stress_level: 4, sleep_hours: 5.5, academic_pressure: 4, optional_note: 'Late night coding lab for algorithm submission', created_at: new Date(Date.now()).toISOString() },
    { id: 'chk_demo_c2', student_id: 'demo_riya', mood: 3, energy_level: 2, stress_level: 4, sleep_hours: 6.0, academic_pressure: 4, optional_note: 'Sleep schedule shifted later than usual', created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: 'chk_demo_c3', student_id: 'demo_riya', mood: 4, energy_level: 3, stress_level: 3, sleep_hours: 6.5, academic_pressure: 3, optional_note: 'Managing workload but feeling slight pressure', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'chk_demo_c4', student_id: 'demo_riya', mood: 4, energy_level: 4, stress_level: 2, sleep_hours: 7.0, academic_pressure: 3, optional_note: 'Routine mostly normal earlier in the week', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 'chk_demo_c5', student_id: 'demo_riya', mood: 4, energy_level: 4, stress_level: 2, sleep_hours: 7.5, academic_pressure: 2, optional_note: 'Good baseline routine', created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  ],
  needs_attention: [
    { id: 'chk_demo_n1', student_id: 'demo_riya', mood: 2, energy_level: 2, stress_level: 5, sleep_hours: 4.5, academic_pressure: 5, optional_note: 'Consecutive late nights, feeling exhausted', created_at: new Date(Date.now()).toISOString() },
    { id: 'chk_demo_n2', student_id: 'demo_riya', mood: 2, energy_level: 1, stress_level: 5, sleep_hours: 5.0, academic_pressure: 5, optional_note: 'Missed morning lecture due to disrupted sleep', created_at: new Date(Date.now() - 1 * 86400000).toISOString() },
    { id: 'chk_demo_n3', student_id: 'demo_riya', mood: 3, energy_level: 2, stress_level: 4, sleep_hours: 5.5, academic_pressure: 4, optional_note: 'Struggling to keep up with assignments', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
    { id: 'chk_demo_n4', student_id: 'demo_riya', mood: 3, energy_level: 3, stress_level: 4, sleep_hours: 6.0, academic_pressure: 4, optional_note: 'Feeling continuous academic strain', created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
    { id: 'chk_demo_n5', student_id: 'demo_riya', mood: 3, energy_level: 3, stress_level: 4, sleep_hours: 5.5, academic_pressure: 4, optional_note: 'Routine drift accumulating', created_at: new Date(Date.now() - 4 * 86400000).toISOString() },
  ]
};

const DEMO_NUDGES: Record<DemoState, Nudge[]> = {
  stable: [
    { id: 'ndg_s1', student_id: 'demo_riya', category: 'sleep', title: 'Routine Stability Maintained', message: 'Your sleep and study hours align smoothly with your 14-day baseline.', priority: 'low', created_at: new Date().toISOString() }
  ],
  changing: [
    { id: 'ndg_c1', student_id: 'demo_riya', category: 'sleep', title: 'Sleep Window Shifted Later', message: 'Your schedule has shifted ~1.5 hours later over the past 3 days. Try a 15-minute screen-free wind-down tonight.', priority: 'medium', created_at: new Date().toISOString() }
  ],
  needs_attention: [
    { id: 'ndg_n1', student_id: 'demo_riya', category: 'academic', title: 'High Workload Concentration', message: 'Multiple consecutive late-night study blocks detected. Breaking tasks into 20-minute intervals can help restore balance.', priority: 'high', created_at: new Date().toISOString() }
  ]
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ studentId, navigate }) => {
  const [demoState, setDemoState] = useState<DemoState>('changing');

  // Synchronous cached hydration for instant (0ms) render on reload
  const [student, setStudent] = useState<Student | null>(() => {
    try {
      const cached = localStorage.getItem(`mindtrace_dash_student_${studentId || 'default'}`);
      if (cached) return JSON.parse(cached);
    } catch {}
    return DEFAULT_DEMO_STUDENT;
  });

  const [checkins, setCheckins] = useState<Checkin[]>(() => {
    try {
      const cached = localStorage.getItem(`mindtrace_dash_checkins_${studentId || 'default'}`);
      if (cached) return JSON.parse(cached);
    } catch {}
    return DEMO_CHECKINS['changing'];
  });

  const [nudges, setNudges] = useState<Nudge[]>(() => {
    try {
      const cached = localStorage.getItem(`mindtrace_dash_nudges_${studentId || 'default'}`);
      if (cached) return JSON.parse(cached);
    } catch {}
    return DEMO_NUDGES['changing'];
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const cached = localStorage.getItem(`mindtrace_dash_appts_${studentId || 'default'}`);
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  });

  const [companionOpen, setCompanionOpen] = useState<boolean>(false);
  const [seedingLoading, setSeedingLoading] = useState<boolean>(false);

  // Background Stale-While-Revalidate without blocking UI
  const loadDashboardData = async () => {
    try {
      const [stu, chks, ndgs, appts] = await Promise.all([
        studentId ? StudentService.getStudent(studentId).catch(() => null) : null,
        studentId ? CheckinService.getCheckins(studentId).catch(() => []) : [],
        studentId ? NudgeService.getNudges(studentId).catch(() => []) : [],
        studentId ? CounsellingService.getStudentAppointments(studentId).catch(() => []) : [],
      ]);

      if (stu) {
        setStudent(stu);
        try { localStorage.setItem(`mindtrace_dash_student_${studentId || 'default'}`, JSON.stringify(stu)); } catch {}
      }
      if (chks && chks.length > 0) {
        setCheckins(chks);
        try { localStorage.setItem(`mindtrace_dash_checkins_${studentId || 'default'}`, JSON.stringify(chks)); } catch {}
      }
      if (ndgs && ndgs.length > 0) {
        setNudges(ndgs);
        try { localStorage.setItem(`mindtrace_dash_nudges_${studentId || 'default'}`, JSON.stringify(ndgs)); } catch {}
      }
      if (appts) {
        setAppointments(appts);
        try { localStorage.setItem(`mindtrace_dash_appts_${studentId || 'default'}`, JSON.stringify(appts)); } catch {}
      }
    } catch (err: unknown) {
      console.warn('Background dashboard sync completed with local cached state:', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [studentId]);

  const handleSelectDemoState = async (newState: DemoState) => {
    setDemoState(newState);
    // Instant local UI switch (< 5ms response!)
    const scenarioChks = DEMO_CHECKINS[newState];
    const scenarioNdgs = DEMO_NUDGES[newState];
    setCheckins(scenarioChks);
    setNudges(scenarioNdgs);
    try {
      localStorage.setItem(`mindtrace_dash_checkins_${studentId || 'default'}`, JSON.stringify(scenarioChks));
      localStorage.setItem(`mindtrace_dash_nudges_${studentId || 'default'}`, JSON.stringify(scenarioNdgs));
    } catch {}

    setSeedingLoading(true);
    try {
      await apiClient.post(`/demo/seed?state=${newState}`);
      // Refresh background checkins if server returns updated signals
      const freshCheckins = await CheckinService.getCheckins(studentId).catch(() => []);
      if (freshCheckins && freshCheckins.length > 0) {
        setCheckins(freshCheckins);
      }
    } catch (e: unknown) {
      console.warn('Backend seed offline, continuing with local scenario data:', e);
    } finally {
      setSeedingLoading(false);
    }
  };

  // Coherent display checkins ensuring demo scenario is always fully visualized
  const displayCheckins = checkins.length >= 3 ? checkins : DEMO_CHECKINS[demoState];
  const hasEnoughData = displayCheckins.length >= 3;

  const avgMood = displayCheckins.length > 0 
    ? (displayCheckins.reduce((acc, c) => acc + c.mood, 0) / displayCheckins.length).toFixed(1) 
    : '3.4';
  const avgStress = displayCheckins.length > 0 
    ? (displayCheckins.reduce((acc, c) => acc + c.stress_level, 0) / displayCheckins.length).toFixed(1) 
    : '3.6';
  const avgSleep = displayCheckins.length > 0 
    ? (displayCheckins.reduce((acc, c) => acc + c.sleep_hours, 0) / displayCheckins.length).toFixed(1) 
    : '6.2';
  const avgAcademic = displayCheckins.length > 0 
    ? (displayCheckins.reduce((acc, c) => acc + c.academic_pressure, 0) / displayCheckins.length).toFixed(1) 
    : '3.4';

  const displayNudges = nudges.length > 0 ? nudges : DEMO_NUDGES[demoState];
  const latestNudge = displayNudges.length > 0 ? displayNudges[0] : null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12 space-y-8 animate-in fade-in duration-200">
      {/* Demo Scenario Control Bar */}
      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-[#1f1a14] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <span className="flex size-2 rounded-full bg-amber-500 animate-pulse" />
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
              <span>Deterministic Demo Scenario</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                {student?.name || 'Riya'} (3rd Year CSE)
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
                {seedingLoading && isSelected ? 'Updating...' : labelMap[st]}
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
              className="text-xs font-semibold text-[#2f6f64] dark:text-[#6ec4b2] hover:underline cursor-pointer"
            >
              + Book Another Session
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {appointments.map((appt) => (
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
              {displayCheckins.length} check-ins logged
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
                  <div className="mt-2 text-2xl font-bold text-[#1e3c35] dark:text-[#e2ece8]">
                    {avgMood} <span className="text-xs text-[#8aa099] dark:text-[#78938b]">/ 5</span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e4ebe8] bg-[#fdfaf5] dark:border-[#382f25] dark:bg-[#211a14] p-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#7d5f3d] dark:text-[#dca776] font-semibold">
                    <Zap size={14} className="text-[#b8834e] dark:text-[#dca776]" /> Avg Stress
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#b8834e] dark:text-[#dca776]">
                    {avgStress} <span className="text-xs text-[#8aa099] dark:text-[#78938b]">/ 5</span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e4ebe8] bg-[#f5faf8] dark:border-[#26423a] dark:bg-[#12201c] p-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#3e816e] dark:text-[#6ec4b2] font-semibold">
                    <Moon size={14} className="text-[#3e816e] dark:text-[#6ec4b2]" /> Avg Sleep
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#1e3c35] dark:text-[#e2ece8]">
                    {avgSleep} <span className="text-xs text-[#8aa099] dark:text-[#78938b]">hrs</span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#e4ebe8] bg-[#f8fbf9] dark:border-[#26423a] dark:bg-[#12201c] p-4">
                  <div className="flex items-center gap-1.5 text-xs text-[#6e8780] dark:text-[#8ea8a0] font-semibold">
                    <BookOpen size={14} className="text-[#48675f] dark:text-[#88ada3]" /> Academic
                  </div>
                  <div className="mt-2 text-2xl font-bold text-[#1e3c35] dark:text-[#e2ece8]">
                    {avgAcademic} <span className="text-xs text-[#8aa099] dark:text-[#78938b]">/ 5</span>
                  </div>
                </div>
              </div>

              {/* Simple visual timeline of check-ins */}
              <div className="mt-6 border-t border-[#edf2ef] dark:border-[#243d36] pt-5">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8aa099] dark:text-[#829c94] mb-3">Recent Check-in Logs</h4>
                <div className="flex flex-col gap-2">
                  {displayCheckins.slice(0, 5).map((chk) => (
                    <div key={chk.id} className="flex items-center justify-between rounded-lg bg-[#f9faf9] dark:bg-[#13221e] px-4 py-2.5 text-xs border border-slate-100 dark:border-slate-800">
                      <div>
                        <span className="text-[#48675f] dark:text-[#9db8b0] font-medium">
                          {new Date(chk.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </span>
                        {chk.optional_note && (
                          <span className="ml-2 text-slate-400 text-[11px] hidden sm:inline italic">
                            — "{chk.optional_note}"
                          </span>
                        )}
                      </div>
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

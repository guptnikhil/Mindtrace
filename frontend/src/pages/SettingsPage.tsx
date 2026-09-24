import React, { useState } from 'react';
import { ArrowLeft, Check, Info, LockKeyhole, ShieldCheck, Bell, MessageSquare, Trash2, Sliders, ExternalLink } from 'lucide-react';
import type { View } from '../types/wellbeing';

interface SettingsPageProps {
  navigate: (view: View) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ navigate }) => {
  const [tone, setTone] = useState<string>(() => localStorage.getItem('wellbeing_tone') || 'balanced');
  const [nudgeFrequency, setNudgeFrequency] = useState<string>(() => localStorage.getItem('wellbeing_nudge_freq') || 'routine_shift');
  const [reminderTime, setReminderTime] = useState<string>(() => localStorage.getItem('wellbeing_reminder') || 'evening');
  const [savedBanner, setSavedBanner] = useState<boolean>(false);

  const handleToneChange = (newTone: string) => {
    setTone(newTone);
    localStorage.setItem('wellbeing_tone', newTone);
    showSavedNotification();
  };

  const handleNudgeChange = (newFreq: string) => {
    setNudgeFrequency(newFreq);
    localStorage.setItem('wellbeing_nudge_freq', newFreq);
    showSavedNotification();
  };

  const handleReminderChange = (newReminder: string) => {
    setReminderTime(newReminder);
    localStorage.setItem('wellbeing_reminder', newReminder);
    showSavedNotification();
  };

  const showSavedNotification = () => {
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 2500);
  };

  const handleClearSession = () => {
    if (window.confirm('Reset local session? This will clear your on-device student profile and return to the welcome page.')) {
      localStorage.removeItem('wellbeing_student_id');
      localStorage.removeItem('wellbeing_consent');
      localStorage.removeItem('mindtrace_onboarding_completed');
      localStorage.removeItem('mindtrace_student_profile');
      localStorage.removeItem('mindtrace_current_view');
      localStorage.removeItem('wellbeing_quest_data');
      navigate('welcome');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex-1">
          <button
            onClick={() => navigate('dashboard')}
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-[#78908a] dark:text-[#8ba29a] hover:text-[#2f6f64] dark:hover:text-[#6ec4b2] cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to dashboard
          </button>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a47b54] dark:text-[#d4a373]">
            Student Preferences & Privacy
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#1e3c35] dark:text-[#e2ece8] sm:text-4xl">
            Settings & Privacy
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#718983] dark:text-[#9bb3ab] sm:text-base">
            Manage your personal privacy boundaries, companion preferences, and student data controls.
          </p>
        </div>
      </div>

      {savedBanner && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
          <Check size={16} /> Preferences updated successfully.
        </div>
      )}

      <div className="flex flex-col gap-6">
        {/* Meaningful Student Privacy Guarantees */}
        <section className="rounded-2xl border border-[#e0eae6] bg-white p-6 shadow-xs dark:border-[#203a33] dark:bg-[#122420]">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-lg bg-[#edf6f2] text-[#2f6f64] dark:bg-[#1b3b33] dark:text-[#6ec4b2]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-[#35584f] dark:text-[#e2ece8]">Student Privacy Guarantees</h2>
              <p className="text-xs text-[#78908a] dark:text-[#8ea8a0]">
                Strict architectural boundaries ensuring your personal wellbeing data remains confidential.
              </p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-[#edf2ef] dark:divide-[#1d352e]">
            {[
              [
                'Zero Surveillance & Background Tracking',
                'No webcam access, keystroke tracking, screen recording, or background browser monitoring is ever performed. MindTrace only learns from signals you choose to provide.',
              ],
              [
                'Strict Institutional Anonymity (10+ Student Threshold)',
                'College faculty, HODs, and administrators only see aggregate trend metrics for student cohorts of 10 or more. Your individual check-in scores and answers are mathematically hidden.',
              ],
              [
                'Student-Controlled Support (No Automated Alerts)',
                'No automated distress emails or disciplinary flags are ever sent to parents or college staff. Connecting with a counselor is always 100% voluntary and initiated by you.',
              ],
              [
                'Confidential Reflection Notes',
                'Private journal notes and thoughts entered during daily check-ins remain on your device and are never shared with AI models or faculty members.',
              ],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-start justify-between gap-4 py-4 first:pt-2 last:pb-1">
                <div>
                  <p className="text-sm font-semibold text-[#385950] dark:text-[#d8e6e1]">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-[#6c8780] dark:text-[#9bb3ab]">{desc}</p>
                </div>
                <div className="grid size-6 shrink-0 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 mt-0.5">
                  <Check size={14} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Companion & Experience Preferences */}
        <section className="rounded-2xl border border-[#e0eae6] bg-white p-6 shadow-xs dark:border-[#203a33] dark:bg-[#122420]">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300">
              <Sliders size={18} />
            </div>
            <div>
              <h2 className="font-semibold text-[#35584f] dark:text-[#e2ece8]">Experience Preferences</h2>
              <p className="text-xs text-[#78908a] dark:text-[#8ea8a0]">
                Customize how your companion communicates and when nudges appear.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            {/* Companion Tone */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#78908a] dark:text-[#8ea8a0] flex items-center gap-1.5 mb-2">
                <MessageSquare size={14} /> Companion Conversation Tone
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'gentle', label: 'Gentle & Reflective', desc: 'Calm, patient, open listening' },
                  { id: 'balanced', label: 'Balanced', desc: 'Warm presence with steady clarity' },
                  { id: 'direct', label: 'Pragmatic & Brief', desc: 'Concise, focused on immediate grounding' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleToneChange(item.id)}
                    className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                      tone === item.id
                        ? 'border-emerald-600 bg-emerald-50/70 text-[#1e3c35] dark:border-emerald-500 dark:bg-emerald-950/40 dark:text-[#e2ece8] ring-1 ring-emerald-500'
                        : 'border-[#e0eae6] bg-[#fafcfb] hover:border-[#b9d4ca] text-[#55756c] dark:border-[#203a33] dark:bg-[#142622] dark:text-[#9bb3ab]'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.label}</div>
                    <div className="text-[11px] text-[#78908a] dark:text-[#8ea8a0] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Micro-Nudge Cadence */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#78908a] dark:text-[#8ea8a0] flex items-center gap-1.5 mb-2">
                <Bell size={14} /> Micro-Nudge Cadence
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'routine_shift', label: 'Only on Routine Shift', desc: 'Appears only when behavioral drift is observed' },
                  { id: 'daily', label: 'Daily Gentle Prompt', desc: 'One supportive reflection per day' },
                  { id: 'silent', label: 'Quiet Mode', desc: 'No active notifications; explore on demand' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleNudgeChange(item.id)}
                    className={`rounded-xl border p-3 text-left transition-all cursor-pointer ${
                      nudgeFrequency === item.id
                        ? 'border-teal-600 bg-teal-50/70 text-[#1e3c35] dark:border-teal-500 dark:bg-teal-950/40 dark:text-[#e2ece8] ring-1 ring-teal-500'
                        : 'border-[#e0eae6] bg-[#fafcfb] hover:border-[#b9d4ca] text-[#55756c] dark:border-[#203a33] dark:bg-[#142622] dark:text-[#9bb3ab]'
                    }`}
                  >
                    <div className="font-semibold text-xs">{item.label}</div>
                    <div className="text-[11px] text-[#78908a] dark:text-[#8ea8a0] mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Check-in Reminder Timing */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[#78908a] dark:text-[#8ea8a0] flex items-center gap-1.5 mb-2">
                <Info size={14} /> Preferred Check-in Timing
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'evening', label: 'Evening Wind-down (8:00 PM)' },
                  { id: 'morning', label: 'Morning Planning (9:00 AM)' },
                  { id: 'off', label: 'No Schedule (Manual)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleReminderChange(item.id)}
                    className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-all cursor-pointer ${
                      reminderTime === item.id
                        ? 'bg-[#2f6f64] text-white dark:bg-[#6ec4b2] dark:text-[#0c1a16]'
                        : 'border border-[#e0eae6] bg-[#fafcfb] text-[#55756c] hover:bg-[#edf6f2] dark:border-[#203a33] dark:bg-[#142622] dark:text-[#9bb3ab]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Data Governance & Account Actions */}
        <section className="rounded-2xl border border-[#e0eae6] bg-white p-6 shadow-xs dark:border-[#203a33] dark:bg-[#122420]">
          <h2 className="font-semibold text-[#35584f] dark:text-[#e2ece8]">Account & Data Controls</h2>
          <p className="mt-1 text-xs text-[#78908a] dark:text-[#8ea8a0]">
            Review your consent permissions, explore institutional aggregated visibility, or reset your local prototype profile.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button
              onClick={() => navigate('consent')}
              className="flex items-center justify-between rounded-xl bg-[#f3f8f5] p-3.5 text-left text-xs font-semibold text-[#476c61] hover:bg-[#e4efe9] dark:bg-[#182b26] dark:text-[#b4cbca] dark:hover:bg-[#1f3831] cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2"><LockKeyhole size={15} /> Privacy & Consent</span>
              <ExternalLink size={13} className="text-[#89a29a]" />
            </button>
            <button
              onClick={() => navigate('support')}
              className="flex items-center justify-between rounded-xl bg-[#f3f8f5] p-3.5 text-left text-xs font-semibold text-[#476c61] hover:bg-[#e4efe9] dark:bg-[#182b26] dark:text-[#b4cbca] dark:hover:bg-[#1f3831] cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2"><Info size={15} /> Support Resources</span>
              <ExternalLink size={13} className="text-[#89a29a]" />
            </button>
            <button
              onClick={() => navigate('institution_login')}
              className="flex items-center justify-between rounded-xl bg-[#f3f8f5] p-3.5 text-left text-xs font-semibold text-[#476c61] hover:bg-[#e4efe9] dark:bg-[#182b26] dark:text-[#b4cbca] dark:hover:bg-[#1f3831] cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2"><ShieldCheck size={15} /> Institutional Portal</span>
              <ExternalLink size={13} className="text-[#89a29a]" />
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-[#edf2ef] dark:border-[#1d352e] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="text-xs font-semibold text-rose-700 dark:text-rose-400">Reset Local Session</h3>
              <p className="text-[11px] text-[#78908a] dark:text-[#8ea8a0]">
                Clears on-device student authentication tokens and resets back to the onboarding screen.
              </p>
            </div>
            <button
              onClick={handleClearSession}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-900/40 cursor-pointer transition-colors"
            >
              <Trash2 size={13} /> Reset Local Profile
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

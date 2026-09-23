import React, { useState } from 'react';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Compass,
  Sparkles,
  Shield,
  Clock,
  Lock,
  Smile,
  Meh,
  Frown,
  AlertCircle,
  RefreshCw,
  Award,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Brand } from '../components/common/Brand';
import type { Student, RoutineQuestData } from '../types/wellbeing';
import { StudentService } from '../services/api';

interface OnboardingPageProps {
  onComplete: (student: Student) => void;
  onBack: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete, onBack }) => {
  // Step tracker: 0 = Intro, 1 = Mission 1, 2 = Mission 2, 3 = Mission 3, 4 = Mission 4, 5 = Mission 5, 6 = Assembly Anim, 7 = Complete
  const [step, setStep] = useState<number>(0);

  // Student profile state
  const [name, setName] = useState<string>('Riya Sharma');
  const [branch, setBranch] = useState<string>('Computer Science');
  const [year, setYear] = useState<number>(3);
  const [createdStudent, setCreatedStudent] = useState<Student | null>(null);

  // Quest data state
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['😴 My routine or sleep has changed', '⏰ I\'m struggling with deadlines']);
  const [noticeableChips, setNoticeableChips] = useState<string[]>(['Sleep', 'Deadlines']);
  const [changeSeverity, setChangeSeverity] = useState<number>(2); // 1 to 4
  const [sleepWindow, setSleepWindow] = useState<string>('🌃 11 PM – 1 AM');
  const [studyConsistency, setStudyConsistency] = useState<string>('🙂 Mostly consistent');
  const [deadlineDisruption, setDeadlineDisruption] = useState<string>('Sometimes');
  const [mission3SubStep, setMission3SubStep] = useState<number>(1); // 1: Sleep, 2: Study, 3: Deadlines
  const [academicContext, setAcademicContext] = useState<string>('💻 Project submission');
  const [consentUnderstood, setConsentUnderstood] = useState<boolean>(true);

  // Loading & submission state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Helper toggle functions
  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const toggleChip = (chip: string) => {
    setNoticeableChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const handleFinishQuest = async () => {
    setLoading(true);
    setError(null);
    try {
      const identifier = `STU_${Math.floor(1000 + Math.random() * 9000)}`;
      let newStudent: Student;
      try {
        newStudent = await StudentService.createStudent(identifier, name.trim() || 'Student', branch, year);
      } catch (apiErr) {
        console.warn('Backend API call failed or offline, using resilient local student fallback:', apiErr);
        newStudent = {
          id: identifier,
          student_identifier: identifier,
          name: name.trim() || 'Student',
          branch: branch || 'Computer Science',
          year: year || 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }
      setCreatedStudent(newStudent);

      // Save quest results to localStorage for dashboard personalization
      const questProfile: RoutineQuestData = {
        studentName: name,
        branch,
        year,
        concerns: selectedConcerns,
        noticeableChangeChips: noticeableChips,
        changeSeverityLevel: changeSeverity,
        sleepWindow,
        studyConsistency,
        deadlineDisruption,
        academicContext,
        consentUnderstood,
      };
      localStorage.setItem('wellbeing_quest_data', JSON.stringify(questProfile));

      // Trigger assembly animation step
      setStep(6);
      setTimeout(() => {
        setStep(7);
        setLoading(false);
      }, 1800);
    } catch (err: any) {
      console.error('Quest onboarding error:', err);
      setError('Could not build profile right now. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf8] dark:bg-[#121e1b] text-[#1f2d2a] dark:text-[#e2ece8] transition-colors duration-200">
      {/* Top Navigation */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-8">
        <Brand />
        <div className="flex items-center gap-3">
          {step > 0 && step < 6 && (
            <button
              onClick={() => setStep((prev) => Math.max(0, prev - 1))}
              className="flex items-center gap-1 text-xs font-medium text-[#708983] dark:text-[#9bb3ab] hover:text-[#2f6f64] dark:hover:text-[#6ec4b2] cursor-pointer"
            >
              <ArrowLeft size={14} /> Back
            </button>
          )}
          {step === 0 && (
            <button onClick={onBack} className="text-xs font-medium text-[#708983] dark:text-[#9bb3ab] hover:text-[#2f6f64] dark:hover:text-[#6ec4b2] cursor-pointer">
              Cancel
            </button>
          )}
        </div>
      </header>

      {/* Quest Progress Tracker Bar (Visible during Missions 1 to 5) */}
      {step >= 1 && step <= 5 && (
        <div className="mx-auto max-w-2xl px-5 mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-[#6e8780] dark:text-[#9eb4ad] mb-2">
            <span className="flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
              <Compass size={14} className="text-[#2f6f64] dark:text-[#6ec4b2]" /> Routine Quest
            </span>
            <span>Mission {step} of 5</span>
          </div>

          {/* Stepper Node Visual */}
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#e2ebe7] dark:bg-[#203630] -translate-y-1/2 z-0" />
            {[1, 2, 3, 4, 5].map((m) => {
              const isCompleted = m < step;
              const isCurrent = m === step;
              return (
                <div
                  key={m}
                  className={`relative z-10 flex size-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#2f6f64] text-white dark:bg-[#388578]'
                      : isCurrent
                      ? 'bg-[#2f6f64] text-white ring-4 ring-[#e1f0ec] dark:ring-[#1a3831] dark:bg-[#6ec4b2] dark:text-[#121e1b]'
                      : 'bg-[#e4ebe8] text-[#78908a] dark:bg-[#203630] dark:text-[#78938b]'
                  }`}
                >
                  {isCompleted ? <Check size={14} /> : m}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <main className="mx-auto max-w-2xl px-5 pb-16 pt-4 sm:px-8">
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#f5c6cb] bg-[#f8d7da] dark:border-[#5e272b] dark:bg-[#381619] p-4 text-sm text-[#721c24] dark:text-[#f3b0b5]">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {/* ===================================================
            SCREEN 0 — GAME INTRO
        =================================================== */}
        {step === 0 && (
          <div className="rounded-3xl border border-[#dce9e4] bg-white p-6 sm:p-8 shadow-xs dark:border-[#253d37] dark:bg-[#182824]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#eaf4ef] px-3.5 py-1.5 text-xs font-semibold text-[#2f6f64] dark:bg-[#1f3831] dark:text-[#6ec4b2]">
              <Sparkles size={14} /> Discover your normal
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#1e3c35] dark:text-[#e2ece8] sm:text-4xl">
              Welcome to your Routine Quest
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#718983] dark:text-[#a0b6af]">
              Before MindTrace can notice when things change, let's discover what normal looks like for <strong className="text-[#1e3c35] dark:text-[#e2ece8]">YOU</strong>.
            </p>

            {/* Quick Profile Setup Input */}
            <div className="mt-6 flex flex-col gap-4 border-t border-[#edf2ef] dark:border-[#243d36] pt-6">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6e8780] dark:text-[#8ea8a0] mb-2">
                  Your Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#e3ebe8] dark:border-[#2a453e] bg-[#fafaf8] dark:bg-[#121e1b] px-4 py-3 text-sm text-[#1e3c35] dark:text-[#e2ece8] focus:border-[#2f6f64] dark:focus:border-[#6ec4b2] focus:outline-none"
                  placeholder="Enter your name"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6e8780] dark:text-[#8ea8a0] mb-2">
                    Engineering Branch
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full rounded-xl border border-[#e3ebe8] dark:border-[#2a453e] bg-[#fafaf8] dark:bg-[#121e1b] px-4 py-3 text-sm text-[#1e3c35] dark:text-[#e2ece8] focus:border-[#2f6f64] dark:focus:border-[#6ec4b2] focus:outline-none"
                  >
                    <option value="Computer Science">Computer Science & Eng</option>
                    <option value="Electrical Engineering">Electrical Engineering</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Biotechnology">Biotechnology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6e8780] dark:text-[#8ea8a0] mb-2">
                    Academic Year
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#e3ebe8] dark:border-[#2a453e] bg-[#fafaf8] dark:bg-[#121e1b] px-4 py-3 text-sm text-[#1e3c35] dark:text-[#e2ece8] focus:border-[#2f6f64] dark:focus:border-[#6ec4b2] focus:outline-none"
                  >
                    <option value={1}>1st Year (Freshman)</option>
                    <option value={2}>2nd Year (Sophomore)</option>
                    <option value={3}>3rd Year (Junior)</option>
                    <option value={4}>4th Year (Senior)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Badges Info */}
            <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#edf2ef] dark:border-[#243d36] pt-5 text-center text-xs">
              <div className="rounded-xl bg-[#f5faf7] dark:bg-[#13221e] p-3 text-[#48675f] dark:text-[#88ada3]">
                <Clock size={16} className="mx-auto text-[#2f6f64] dark:text-[#6ec4b2] mb-1" />
                ⚡ ~2 minutes
              </div>
              <div className="rounded-xl bg-[#f5faf7] dark:bg-[#13221e] p-3 text-[#48675f] dark:text-[#88ada3]">
                <Layers size={16} className="mx-auto text-[#2f6f64] dark:text-[#6ec4b2] mb-1" />
                🎯 5 short missions
              </div>
              <div className="rounded-xl bg-[#f5faf7] dark:bg-[#13221e] p-3 text-[#48675f] dark:text-[#88ada3]">
                <Lock size={16} className="mx-auto text-[#2f6f64] dark:text-[#6ec4b2] mb-1" />
                🔒 You stay in control
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-5 py-4 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#245e54] dark:hover:bg-[#2f6f64] cursor-pointer"
            >
              Start Quest <ArrowRight size={17} />
            </button>
          </div>
        )}

        {/* ===================================================
            MISSION 1 — FIND YOUR WHY
        =================================================== */}
        {step === 1 && (
          <div className="rounded-3xl border border-[#dce9e4] bg-white p-6 sm:p-8 shadow-xs dark:border-[#253d37] dark:bg-[#182824]">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#a47b54] dark:text-[#d4a373]">
              Mission 1 — Find Your Why
            </div>
            <h2 className="text-2xl font-semibold text-[#1e3c35] dark:text-[#e2ece8]">
              What brought you here?
            </h2>
            <p className="mt-1 text-xs text-[#78908a] dark:text-[#9eb4ad]">
              Select all reasons that apply to your current routine.
            </p>

            <div className="mt-6 flex flex-col gap-3">
              {[
                '📚 College feels harder lately',
                '😴 My routine or sleep has changed',
                '⏰ I\'m struggling with deadlines',
                '🧠 I feel mentally overloaded',
                '📉 I\'ve become less consistent',
                '🌱 I just want to understand my routine',
                '💬 I\'d like someone to talk to',
              ].map((item) => {
                const selected = selectedConcerns.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleConcern(item)}
                    className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm font-medium transition-all cursor-pointer ${
                      selected
                        ? 'border-[#2f6f64] bg-[#eef7f3] text-[#2f6f64] dark:border-[#6ec4b2] dark:bg-[#1a332d] dark:text-[#6ec4b2]'
                        : 'border-[#e4ebe8] bg-[#fafaf8] text-[#35584f] hover:bg-[#f1f6f3] dark:border-[#26423a] dark:bg-[#121e1b] dark:text-[#a0b6af] dark:hover:bg-[#1f3630]'
                    }`}
                  >
                    <span>{item}</span>
                    {selected && <Check size={16} className="text-[#2f6f64] dark:text-[#6ec4b2]" />}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Quest Map Preview */}
            {selectedConcerns.length > 0 && (
              <div className="mt-6 rounded-2xl bg-[#f5faf7] dark:bg-[#13221e] p-4 text-xs text-[#48675f] dark:text-[#88ada3]">
                <div className="font-semibold text-[#2f6f64] dark:text-[#6ec4b2] mb-1">YOUR QUEST MAP PREVIEW</div>
                <p>Got it. We will pay specific attention to your routine areas of focus.</p>
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={selectedConcerns.length === 0}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-5 py-3.5 text-sm font-semibold text-white disabled:opacity-50 cursor-pointer"
            >
              Continue Mission <ChevronRight size={17} />
            </button>
          </div>
        )}

        {/* ===================================================
            MISSION 2 — SPOT THE CHANGE
        =================================================== */}
        {step === 2 && (
          <div className="rounded-3xl border border-[#dce9e4] bg-white p-6 sm:p-8 shadow-xs dark:border-[#253d37] dark:bg-[#182824]">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#a47b54] dark:text-[#d4a373]">
              Mission 2 — Spot the Change
            </div>
            <h2 className="text-2xl font-semibold text-[#1e3c35] dark:text-[#e2ece8]">
              What's been feeling different lately?
            </h2>
            <p className="mt-1 text-xs text-[#78908a] dark:text-[#9eb4ad]">
              Select areas where you've noticed shifts.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {[
                'Sleep',
                'Study',
                'Deadlines',
                'Attendance',
                'Motivation',
                'Time management',
                'Social life',
                'Exams',
                'Projects',
                'Placement preparation',
                'Daily routine',
                'Nothing in particular',
              ].map((chip) => {
                const active = noticeableChips.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleChip(chip)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all cursor-pointer ${
                      active
                        ? 'bg-[#2f6f64] text-white dark:bg-[#388578]'
                        : 'bg-[#f1f6f3] text-[#52736a] hover:bg-[#e4efe9] dark:bg-[#203630] dark:text-[#a0b6af] dark:hover:bg-[#28453e]'
                    }`}
                  >
                    {chip}
                  </button>
                );
              })}
            </div>

            {/* Interactive 4-stage slider */}
            <div className="mt-8 border-t border-[#edf2ef] dark:border-[#243d36] pt-6">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#6e8780] dark:text-[#8ea8a0] mb-2">
                How different does your routine feel?
              </label>

              <div className="grid grid-cols-4 gap-2 mt-4 text-center">
                {[
                  { level: 1, label: 'A little', icon: Smile },
                  { level: 2, label: 'Noticeable', icon: Meh },
                  { level: 3, label: 'Quite different', icon: Frown },
                  { level: 4, label: 'A lot', icon: AlertCircle },
                ].map(({ level, label, icon: Icon }) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setChangeSeverity(level)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 transition-all cursor-pointer ${
                      changeSeverity === level
                        ? 'border-[#2f6f64] bg-[#eef7f3] text-[#2f6f64] dark:border-[#6ec4b2] dark:bg-[#1a332d] dark:text-[#6ec4b2]'
                        : 'border-[#e4ebe8] bg-[#fafaf8] text-[#6e8780] dark:border-[#26423a] dark:bg-[#121e1b] dark:text-[#8ea8a0]'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-[11px] font-semibold">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Progression Award Badge Feedback */}
            <div className="mt-6 flex items-center justify-between rounded-xl bg-[#f5faf7] dark:bg-[#13221e] p-3 text-xs text-[#2f6f64] dark:text-[#6ec4b2] font-semibold">
              <span className="flex items-center gap-1.5">
                <Award size={16} /> Progression Unlocked: +1 Discovery
              </span>
              <span>Change spotted ✓</span>
            </div>

            <button
              onClick={() => setStep(3)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-5 py-3.5 text-sm font-semibold text-white cursor-pointer"
            >
              Continue Mission <ChevronRight size={17} />
            </button>
          </div>
        )}

        {/* ===================================================
            MISSION 3 — BUILD YOUR NORMAL
        =================================================== */}
        {step === 3 && (
          <div className="rounded-3xl border border-[#dce9e4] bg-white p-6 sm:p-8 shadow-xs dark:border-[#253d37] dark:bg-[#182824]">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#a47b54] dark:text-[#d4a373]">
              Mission 3 — Build Your Normal
            </div>
            <h2 className="text-2xl font-semibold text-[#1e3c35] dark:text-[#e2ece8]">
              What does your usual routine look like?
            </h2>
            <p className="mt-1 text-xs text-[#78908a] dark:text-[#9eb4ad]">
              We're not looking for a perfect routine. We're looking for YOUR usual one.
            </p>

            {/* Sub-step 1: Sleep Window */}
            {mission3SubStep === 1 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#35584f] dark:text-[#c4ded7] mb-3">
                  1 of 3: When do you usually sleep?
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {['🌙 Before 11 PM', '🌃 11 PM – 1 AM', '🌌 1 AM – 3 AM', '🔄 It varies'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setSleepWindow(opt);
                        setMission3SubStep(2);
                      }}
                      className={`rounded-xl border p-4 text-left text-sm font-semibold transition-all cursor-pointer ${
                        sleepWindow === opt
                          ? 'border-[#2f6f64] bg-[#eef7f3] text-[#2f6f64] dark:border-[#6ec4b2] dark:bg-[#1a332d] dark:text-[#6ec4b2]'
                          : 'border-[#e4ebe8] bg-[#fafaf8] text-[#35584f] dark:border-[#26423a] dark:bg-[#121e1b] dark:text-[#a0b6af]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-step 2: Study Consistency */}
            {mission3SubStep === 2 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#35584f] dark:text-[#c4ded7] mb-3">
                  2 of 3: How consistent is your study routine?
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {['🔥 Very consistent', '🙂 Mostly consistent', '🔄 Changes often', '🎲 Unpredictable'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        setStudyConsistency(opt);
                        setMission3SubStep(3);
                      }}
                      className={`rounded-xl border p-4 text-left text-sm font-semibold transition-all cursor-pointer ${
                        studyConsistency === opt
                          ? 'border-[#2f6f64] bg-[#eef7f3] text-[#2f6f64] dark:border-[#6ec4b2] dark:bg-[#1a332d] dark:text-[#6ec4b2]'
                          : 'border-[#e4ebe8] bg-[#fafaf8] text-[#35584f] dark:border-[#26423a] dark:bg-[#121e1b] dark:text-[#a0b6af]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-step 3: Deadline Impact */}
            {mission3SubStep === 3 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold text-[#35584f] dark:text-[#c4ded7] mb-3">
                  3 of 3: How often do deadlines disrupt your routine?
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {['Rarely', 'Sometimes', 'Often', 'Almost always'].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setDeadlineDisruption(opt)}
                      className={`rounded-xl border p-4 text-left text-sm font-semibold transition-all cursor-pointer ${
                        deadlineDisruption === opt
                          ? 'border-[#2f6f64] bg-[#eef7f3] text-[#2f6f64] dark:border-[#6ec4b2] dark:bg-[#1a332d] dark:text-[#6ec4b2]'
                          : 'border-[#e4ebe8] bg-[#fafaf8] text-[#35584f] dark:border-[#26423a] dark:bg-[#121e1b] dark:text-[#a0b6af]'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Assembled Routine Card */}
            <div className="mt-8 border-t border-[#edf2ef] dark:border-[#243d36] pt-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#8aa099] dark:text-[#829c94] mb-3">
                Your Routine Blueprint
              </h4>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="rounded-xl bg-[#f5faf7] dark:bg-[#13221e] p-3">
                  <div className="text-[#8aa099]">SLEEP</div>
                  <div className="font-semibold text-[#1e3c35] dark:text-[#e2ece8] mt-1">{sleepWindow}</div>
                </div>
                <div className="rounded-xl bg-[#f5faf7] dark:bg-[#13221e] p-3">
                  <div className="text-[#8aa099]">STUDY</div>
                  <div className="font-semibold text-[#1e3c35] dark:text-[#e2ece8] mt-1">{studyConsistency}</div>
                </div>
                <div className="rounded-xl bg-[#f5faf7] dark:bg-[#13221e] p-3">
                  <div className="text-[#8aa099]">DEADLINES</div>
                  <div className="font-semibold text-[#1e3c35] dark:text-[#e2ece8] mt-1">{deadlineDisruption}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(4)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-5 py-3.5 text-sm font-semibold text-white cursor-pointer"
            >
              Continue Mission <ChevronRight size={17} />
            </button>
          </div>
        )}

        {/* ===================================================
            MISSION 4 — CONTEXT DETECTOR
        =================================================== */}
        {step === 4 && (
          <div className="rounded-3xl border border-[#dce9e4] bg-white p-6 sm:p-8 shadow-xs dark:border-[#253d37] dark:bg-[#182824]">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#a47b54] dark:text-[#d4a373]">
              Mission 4 — What's Around You?
            </div>
            <h2 className="text-2xl font-semibold text-[#1e3c35] dark:text-[#e2ece8]">
              Current Academic Context
            </h2>
            <p className="mt-1 text-xs text-[#78908a] dark:text-[#9eb4ad]">
              Your routine can change because life changes. What's happening around you right now?
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {[
                '📝 Exam week',
                '📚 Major assignment deadline',
                '💻 Project submission',
                '🎯 Placement preparation',
                '💼 Internship applications',
                '🏫 Regular semester routine',
                '🌴 Break / holidays',
                '✨ Nothing major',
              ].map((ctx) => (
                <button
                  key={ctx}
                  type="button"
                  onClick={() => setAcademicContext(ctx)}
                  className={`rounded-xl border p-4 text-left text-sm font-semibold transition-all cursor-pointer ${
                    academicContext === ctx
                      ? 'border-[#2f6f64] bg-[#eef7f3] text-[#2f6f64] dark:border-[#6ec4b2] dark:bg-[#1a332d] dark:text-[#6ec4b2]'
                      : 'border-[#e4ebe8] bg-[#fafaf8] text-[#35584f] dark:border-[#26423a] dark:bg-[#121e1b] dark:text-[#a0b6af]'
                  }`}
                >
                  {ctx}
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-[#e0eae6] dark:border-[#26423a] bg-[#f5faf7] dark:bg-[#13221e] p-4 text-xs text-[#48675f] dark:text-[#88ada3]">
              <div className="font-semibold text-[#2f6f64] dark:text-[#6ec4b2] mb-1">WHY THIS MATTERS</div>
              <p>We use academic context so a late night before an exam isn't misinterpreted as an alarming change.</p>
            </div>

            <button
              onClick={() => setStep(5)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-5 py-3.5 text-sm font-semibold text-white cursor-pointer"
            >
              Continue Mission <ChevronRight size={17} />
            </button>
          </div>
        )}

        {/* ===================================================
            MISSION 5 — CHOOSE YOUR RULES (PRIVACY & CONSENT)
        =================================================== */}
        {step === 5 && (
          <div className="rounded-3xl border border-[#dce9e4] bg-white p-6 sm:p-8 shadow-xs dark:border-[#253d37] dark:bg-[#182824]">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#a47b54] dark:text-[#d4a373]">
              Mission 5 — Choose Your Rules
            </div>
            <h2 className="text-2xl font-semibold text-[#1e3c35] dark:text-[#e2ece8]">
              Your Privacy Rules
            </h2>
            <p className="mt-1 text-xs text-[#78908a] dark:text-[#9eb4ad]">
              MindTrace works for you. You remain in complete control of your routine data.
            </p>

            <div className="mt-6 flex flex-col gap-4">
              <div className="flex items-start gap-4 rounded-2xl border border-[#e4ebe8] dark:border-[#253d37] bg-[#fafaf8] dark:bg-[#121e1b] p-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eef7f3] text-[#2f6f64] dark:bg-[#1f3831] dark:text-[#6ec4b2]">
                  <Lock size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1e3c35] dark:text-[#e2ece8]">MY DATA</h4>
                  <p className="mt-0.5 text-xs text-[#6e8780] dark:text-[#9eb4ad]">You choose what you share. Data is stored securely in PostgreSQL.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-[#e4ebe8] dark:border-[#253d37] bg-[#fafaf8] dark:bg-[#121e1b] p-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eef7f3] text-[#2f6f64] dark:bg-[#1f3831] dark:text-[#6ec4b2]">
                  <Shield size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1e3c35] dark:text-[#e2ece8]">MY PATTERNS</h4>
                  <p className="mt-0.5 text-xs text-[#6e8780] dark:text-[#9eb4ad]">Your personal routine stays personal and is evaluated against your own baseline.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-[#e4ebe8] dark:border-[#253d37] bg-[#fafaf8] dark:bg-[#121e1b] p-4">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eef7f3] text-[#2f6f64] dark:bg-[#1f3831] dark:text-[#6ec4b2]">
                  <Compass size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#1e3c35] dark:text-[#e2ece8]">MY CHOICE</h4>
                  <p className="mt-0.5 text-xs text-[#6e8780] dark:text-[#9eb4ad]">MindTrace provides supportive suggestions. You decide how to act.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-xl bg-[#f5faf7] dark:bg-[#13221e] p-4">
              <input
                type="checkbox"
                id="consentCheck"
                checked={consentUnderstood}
                onChange={(e) => setConsentUnderstood(e.target.checked)}
                className="size-4 rounded-md accent-[#2f6f64] cursor-pointer"
              />
              <label htmlFor="consentCheck" className="text-xs text-[#48675f] dark:text-[#9db8b0] font-medium cursor-pointer">
                I understand and want to build my routine starting point.
              </label>
            </div>

            <button
              onClick={handleFinishQuest}
              disabled={loading || !consentUnderstood}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-5 py-4 text-sm font-semibold text-white shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" /> Building...
                </>
              ) : (
                <>
                  Build My Baseline <Sparkles size={16} />
                </>
              )}
            </button>
          </div>
        )}

        {/* ===================================================
            STEP 6 — ANIMATED BASELINE ASSEMBLY CLIMAX
        =================================================== */}
        {step === 6 && (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <RefreshCw size={40} className="animate-spin text-[#2f6f64] dark:text-[#6ec4b2] mb-6" />
            <h2 className="text-2xl font-semibold text-[#1e3c35] dark:text-[#e2ece8]">
              Building your starting point...
            </h2>
            <div className="mt-6 flex flex-col gap-2 text-xs text-[#6e8780] dark:text-[#9eb4ad]">
              <div>🌙 {sleepWindow}</div>
              <div>↓</div>
              <div>📚 {studyConsistency}</div>
              <div>↓</div>
              <div>⏰ Deadlines: {deadlineDisruption}</div>
              <div>↓</div>
              <div>📅 Context: {academicContext}</div>
            </div>
          </div>
        )}

        {/* ===================================================
            STEP 7 — QUEST COMPLETE & COSMETIC BADGES
        =================================================== */}
        {step === 7 && (
          <div className="rounded-3xl border border-[#dce9e4] bg-white p-6 sm:p-8 shadow-xs dark:border-[#253d37] dark:bg-[#182824]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#eaf4ef] px-3.5 py-1.5 text-xs font-semibold text-[#2f6f64] dark:bg-[#1f3831] dark:text-[#6ec4b2]">
              <Award size={14} /> QUEST COMPLETE
            </div>

            <h1 className="text-3xl font-semibold text-[#1e3c35] dark:text-[#e2ece8]">
              Your normal has a starting point!
            </h1>
            <p className="mt-2 text-sm text-[#718983] dark:text-[#a0b6af]">
              From here, MindTrace watches for meaningful changes from YOUR usual pattern.
            </p>

            {/* Cosmetic Milestone Badges */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-[#e4ebe8] dark:border-[#26423a] bg-[#fafaf8] dark:bg-[#121e1b] p-3 text-center">
                <span className="text-lg">🔍</span>
                <div className="text-[11px] font-semibold text-[#35584f] dark:text-[#c4ded7] mt-1">Change Explorer</div>
              </div>
              <div className="rounded-xl border border-[#e4ebe8] dark:border-[#26423a] bg-[#fafaf8] dark:bg-[#121e1b] p-3 text-center">
                <span className="text-lg">🌙</span>
                <div className="text-[11px] font-semibold text-[#35584f] dark:text-[#c4ded7] mt-1">Routine Builder</div>
              </div>
              <div className="rounded-xl border border-[#e4ebe8] dark:border-[#26423a] bg-[#fafaf8] dark:bg-[#121e1b] p-3 text-center">
                <span className="text-lg">📚</span>
                <div className="text-[11px] font-semibold text-[#35584f] dark:text-[#c4ded7] mt-1">Context Mapper</div>
              </div>
              <div className="rounded-xl border border-[#e4ebe8] dark:border-[#26423a] bg-[#fafaf8] dark:bg-[#121e1b] p-3 text-center">
                <span className="text-lg">🔒</span>
                <div className="text-[11px] font-semibold text-[#35584f] dark:text-[#c4ded7] mt-1">Data Guardian</div>
              </div>
            </div>

            {/* Assembled Routine Profile Summary */}
            <div className="mt-6 rounded-2xl border border-[#e4ebe8] dark:border-[#253d37] bg-[#f5faf7] dark:bg-[#13221e] p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#2f6f64] dark:text-[#6ec4b2] mb-3">
                Initial Routine Profile
              </h3>
              <div className="grid gap-3 sm:grid-cols-3 text-xs">
                <div>
                  <span className="text-[#8aa099]">Sleep Window:</span>
                  <div className="font-semibold text-[#1e3c35] dark:text-[#e2ece8] mt-0.5">{sleepWindow}</div>
                </div>
                <div>
                  <span className="text-[#8aa099]">Study Consistency:</span>
                  <div className="font-semibold text-[#1e3c35] dark:text-[#e2ece8] mt-0.5">{studyConsistency}</div>
                </div>
                <div>
                  <span className="text-[#8aa099]">Current Context:</span>
                  <div className="font-semibold text-[#1e3c35] dark:text-[#e2ece8] mt-0.5">{academicContext}</div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  // Complete onboarding and navigate to dashboard
                  const studentObj = createdStudent || {
                    id: `STU_${Date.now()}`,
                    student_identifier: `STU_${Math.floor(1000 + Math.random() * 9000)}`,
                    name,
                    branch,
                    year,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                    onboarding_complete: true,
                  };
                  onComplete(studentObj);
                }}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f6f64] dark:bg-[#388578] px-5 py-4 text-sm font-semibold text-white shadow-md hover:bg-[#245e54] dark:hover:bg-[#2f6f64] cursor-pointer"
              >
                Explore My Dashboard <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

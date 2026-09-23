import React from 'react';
import { LockKeyhole, Sparkles, ArrowRight, ShieldCheck, Activity, HeartHandshake, Moon, Sun, Leaf, LayoutDashboard } from 'lucide-react';
import { Brand } from '../components/common/Brand';
import { useTheme } from '../context/ThemeContext';

interface WelcomePageProps {
  onStart: () => void;
  onPrivacy: () => void;
  onGoToDashboard?: () => void;
  hasStudentProfile?: boolean;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({
  onStart,
  onPrivacy,
  onGoToDashboard,
  hasStudentProfile = false,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafaf8] text-[#19352f] transition-colors duration-300 dark:bg-[#0a1412] dark:text-[#e2ece8]">
      {/* Background ambient decorative blurs */}
      <div className="pointer-events-none absolute -right-32 -top-40 size-[480px] rounded-full bg-[#e5f0ec] opacity-70 blur-3xl transition-opacity dark:bg-[#133028] dark:opacity-40" />
      <div className="pointer-events-none absolute -bottom-48 -left-40 size-[420px] rounded-full bg-[#f5eadc] opacity-60 blur-3xl transition-opacity dark:bg-[#2b1f14] dark:opacity-30" />

      {/* Header */}
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Brand />

        <div className="flex items-center gap-3">
          {hasStudentProfile && onGoToDashboard && (
            <button
              onClick={onGoToDashboard}
              className="hidden items-center gap-1.5 rounded-xl border border-[#d6e3de] bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-[#2f6f64] shadow-xs backdrop-blur-xs transition-all hover:bg-white hover:text-[#23584f] dark:border-[#223932] dark:bg-[#13221e]/80 dark:text-[#6ec4b2] dark:hover:bg-[#182b26] sm:flex"
            >
              <LayoutDashboard size={14} />
              <span>Go to Dashboard</span>
            </button>
          )}

          <button
            onClick={onPrivacy}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#55716b] transition-colors hover:text-[#2f6f64] dark:text-[#8ea8a1] dark:hover:text-[#6ec4b2]"
          >
            <LockKeyhole size={14} />
            <span className="hidden sm:inline">How privacy works</span>
            <span className="sm:hidden">Privacy</span>
          </button>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="flex size-9 items-center justify-center rounded-xl border border-[#dfe9e5] bg-white text-[#648078] shadow-xs transition-all hover:bg-[#f0f6f3] dark:border-[#233c34] dark:bg-[#142320] dark:text-[#a0b6af] dark:hover:bg-[#1b2f2b] cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun size={17} className="text-[#e2b866]" />
            ) : (
              <Moon size={17} className="text-[#648078]" />
            )}
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:gap-20 lg:px-12 lg:pb-24 lg:pt-16">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dbe7e2] bg-white/70 px-3.5 py-2 text-xs font-medium text-[#55716b] shadow-xs backdrop-blur-xs dark:border-[#203831] dark:bg-[#142320]/80 dark:text-[#9bc2b8]">
            <Sparkles size={14} className="text-[#b8834e] dark:text-[#d4a46e]" />
            A gentler way to check in with yourself
          </div>

          <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#19352f] dark:text-[#e4efe9] sm:text-5xl lg:text-[4.15rem]">
            Notice the change before it becomes overwhelming.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-[#627a74] dark:text-[#94aca6] sm:text-lg">
            An early-warning wellbeing support companion that identifies shifts in student routine patterns and provides private, supportive guidance.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {hasStudentProfile && onGoToDashboard ? (
              <>
                <button
                  onClick={onGoToDashboard}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f6f64] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(47,111,100,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#245e54] dark:bg-[#3ca08d] dark:hover:bg-[#4ab4a0] dark:shadow-[0_8px_24px_rgba(60,160,141,0.25)] cursor-pointer"
                >
                  Go to Dashboard <ArrowRight size={17} />
                </button>
                <button
                  onClick={onStart}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8e2de] bg-white/70 px-5 py-3.5 text-sm font-semibold text-[#41635c] transition-all hover:border-[#a9c5bc] hover:bg-white dark:border-[#243d36] dark:bg-[#142320]/80 dark:text-[#afd1c8] dark:hover:bg-[#1a2d28] cursor-pointer"
                >
                  <Activity size={17} /> Start New Check-in
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onStart}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f6f64] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(47,111,100,0.25)] transition-all hover:-translate-y-0.5 hover:bg-[#245e54] dark:bg-[#3ca08d] dark:hover:bg-[#4ab4a0] dark:shadow-[0_8px_24px_rgba(60,160,141,0.25)] cursor-pointer"
                >
                  Get started <ArrowRight size={17} />
                </button>
                <button
                  onClick={onPrivacy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8e2de] bg-white/70 px-5 py-3.5 text-sm font-semibold text-[#41635c] transition-all hover:border-[#a9c5bc] hover:bg-white dark:border-[#243d36] dark:bg-[#142320]/80 dark:text-[#afd1c8] dark:hover:bg-[#1a2d28] cursor-pointer"
                >
                  <ShieldCheck size={17} /> See privacy design
                </button>
              </>
            )}
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-[#e3ebe8] pt-6 dark:border-[#1d322c]">
            <div className="flex flex-col gap-2 text-xs font-medium leading-4 text-[#66807a] dark:text-[#88a39d]">
              <span className="text-[#2f6f64] dark:text-[#52b5a2]"><LockKeyhole size={16} /></span>
              Private by default
            </div>
            <div className="flex flex-col gap-2 text-xs font-medium leading-4 text-[#66807a] dark:text-[#88a39d]">
              <span className="text-[#2f6f64] dark:text-[#52b5a2]"><Activity size={16} /></span>
              Your personal baseline
            </div>
            <div className="flex flex-col gap-2 text-xs font-medium leading-4 text-[#66807a] dark:text-[#88a39d]">
              <span className="text-[#2f6f64] dark:text-[#52b5a2]"><HeartHandshake size={16} /></span>
              Not a diagnosis
            </div>
          </div>
        </div>

        {/* Interactive Feature Card / Visual Preview */}
        <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <div className="absolute -inset-5 rounded-[2rem] bg-[#e5f0ec]/70 blur-2xl dark:bg-[#122822]/60" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#dce9e4] bg-white p-5 shadow-[0_24px_70px_rgba(42,80,70,0.12)] transition-all dark:border-[#20362f] dark:bg-[#121f1c] dark:shadow-[0_24px_70px_rgba(0,0,0,0.45)] sm:p-7">
            <div className="flex items-center justify-between border-b border-[#edf2ef] pb-5 dark:border-[#1b2d28]">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-[#8ba09a] dark:text-[#748c86]">Your Private Space</p>
                <p className="mt-1 text-lg font-semibold text-[#26483f] dark:text-[#e0ebe7]">A moment to notice</p>
              </div>
              <div className="grid size-10 place-items-center rounded-full bg-[#edf6f2] text-[#2f6f64] dark:bg-[#1a2d28] dark:text-[#5cb8a5]">
                <Leaf size={19} />
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#f5faf7] p-5 transition-colors dark:bg-[#162521]">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[#75918a] dark:text-[#809c95]">This Week</p>
                  <p className="mt-1 text-2xl font-semibold text-[#2f6f64] dark:text-[#65c5b2]">A little different</p>
                </div>
                <div className="rounded-full bg-[#e5f0ec] px-2.5 py-1 text-[11px] font-semibold text-[#2f6f64] dark:bg-[#1f3831] dark:text-[#7ad8c6]">
                  Early Drift
                </div>
              </div>

              <svg viewBox="0 0 340 95" className="mt-5 h-24 w-full" role="img" aria-label="Pattern change trend graph">
                <defs>
                  <linearGradient id="mini-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#559386" stopOpacity=".28" />
                    <stop offset="1" stopColor="#559386" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 77 C30 70, 42 72, 65 67 S99 65, 121 69 S151 57, 177 60 S208 48, 232 51 S265 31, 291 38 S318 21, 340 15 V95 H0Z" fill="url(#mini-fill)" />
                <path d="M0 77 C30 70, 42 72, 65 67 S99 65, 121 69 S151 57, 177 60 S208 48, 232 51 S265 31, 291 38 S318 21, 340 15" fill="none" stroke="#489d8d" strokeWidth="2.5" strokeLinecap="round" />
              </svg>

              <p className="mt-3 text-sm leading-6 text-[#6f8981] dark:text-[#8ea7a0]">
                Your recent routine looks slightly different from your 14-day baseline.
              </p>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#f1e5d5] bg-[#fffaf2] p-4 transition-colors dark:border-[#382b1d] dark:bg-[#1e1710]">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f7e8cf] text-[#ad743e] dark:bg-[#342416] dark:text-[#e0a468]">
                <Moon size={15} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#604833] dark:text-[#e8be92]">A small suggestion</p>
                <p className="mt-1 text-xs leading-5 text-[#8e7054] dark:text-[#be9f7d]">
                  Before your next study task, try taking five quiet minutes away from the screen.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-[#a0b1ac] dark:text-[#6a837c]">
              <span className="flex items-center gap-1.5"><LockKeyhole size={12} /> Only you can see this</span>
              <span>FastAPI + SQLite Active</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative mx-auto max-w-6xl px-5 pb-8 text-center sm:px-8 lg:px-12">
        <p className="text-xs leading-5 text-[#91a19d] dark:text-[#6b827c]">
          Designed for early-warning pattern recognition, not clinical diagnoses. You choose what to share.
        </p>
      </footer>
    </div>
  );
};

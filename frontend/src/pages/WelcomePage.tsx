import React from 'react';
import { LockKeyhole, Sparkles, ArrowRight, ShieldCheck, Activity, HeartHandshake, Moon, Leaf } from 'lucide-react';
import { Brand } from '../components/common/Brand';

interface WelcomePageProps {
  onStart: () => void;
  onPrivacy: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = ({ onStart, onPrivacy }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#fafaf8]">
      <div className="absolute -right-32 -top-40 size-[480px] rounded-full bg-[#e5f0ec] opacity-70 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-48 -left-40 size-[420px] rounded-full bg-[#f5eadc] opacity-60 blur-3xl pointer-events-none" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Brand />
        <button
          onClick={onPrivacy}
          className="flex items-center gap-2 text-sm font-medium text-[#55716b] transition-colors hover:text-[#2f6f64]"
        >
          <LockKeyhole size={15} />
          <span className="hidden sm:inline">How privacy works</span>
          <span className="sm:hidden">Privacy</span>
        </button>
      </header>

      <section className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-10 sm:px-8 lg:grid-cols-[1fr_0.85fr] lg:gap-20 lg:px-12 lg:pb-24 lg:pt-20">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#dbe7e2] bg-white/70 px-3.5 py-2 text-xs font-medium text-[#55716b] shadow-sm backdrop-blur-sm">
            <Sparkles size={14} className="text-[#b8834e]" />
            A gentler way to check in with yourself
          </div>

          <h1 className="max-w-xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-[#19352f] sm:text-5xl lg:text-[4.15rem]">
            Notice the change before it becomes overwhelming.
          </h1>

          <p className="mt-6 max-w-lg text-base leading-7 text-[#627a74] sm:text-lg">
            An early-warning wellbeing support system that identifies changes in student routine patterns and provides appropriate, gentle nudges.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={onStart}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f6f64] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(47,111,100,0.2)] transition-all hover:-translate-y-0.5 hover:bg-[#245e54] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2f6f64]"
            >
              Get started <ArrowRight size={17} />
            </button>
            <button
              onClick={onPrivacy}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#d8e2de] bg-white/70 px-5 py-3.5 text-sm font-semibold text-[#41635c] transition-all hover:border-[#a9c5bc] hover:bg-white"
            >
              <ShieldCheck size={17} /> See privacy design
            </button>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-[#e3ebe8] pt-6">
            <div className="flex flex-col gap-2 text-xs font-medium leading-4 text-[#66807a]">
              <span className="text-[#2f6f64]"><LockKeyhole size={16} /></span>
              Private by default
            </div>
            <div className="flex flex-col gap-2 text-xs font-medium leading-4 text-[#66807a]">
              <span className="text-[#2f6f64]"><Activity size={16} /></span>
              Your baseline
            </div>
            <div className="flex flex-col gap-2 text-xs font-medium leading-4 text-[#66807a]">
              <span className="text-[#2f6f64]"><HeartHandshake size={16} /></span>
              Not a diagnosis
            </div>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[420px] lg:max-w-none">
          <div className="absolute -inset-5 rounded-[2rem] bg-[#e5f0ec]/70 blur-2xl" />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-[#dce9e4] bg-white p-5 shadow-[0_24px_70px_rgba(42,80,70,0.12)] sm:p-7">
            <div className="flex items-center justify-between border-b border-[#edf2ef] pb-5">
              <div>
                <p className="text-xs font-medium text-[#8ba09a]">YOUR PRIVATE SPACE</p>
                <p className="mt-1 text-lg font-semibold text-[#26483f]">A moment to notice</p>
              </div>
              <div className="grid size-10 place-items-center rounded-full bg-[#edf6f2] text-[#2f6f64]">
                <Leaf size={19} />
              </div>
            </div>

            <div className="mt-6 rounded-2xl bg-[#f5faf7] p-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium text-[#75918a]">THIS WEEK</p>
                  <p className="mt-1 text-2xl font-semibold text-[#2f6f64]">A little different</p>
                </div>
                <div className="rounded-full bg-[#e5f0ec] px-2.5 py-1 text-[11px] font-semibold text-[#2f6f64]">
                  Changing
                </div>
              </div>

              <svg viewBox="0 0 340 95" className="mt-5 h-24 w-full" role="img" aria-label="Pattern change trend graph">
                <defs>
                  <linearGradient id="mini-fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0" stopColor="#7fb2a4" stopOpacity=".22" />
                    <stop offset="1" stopColor="#7fb2a4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0 77 C30 70, 42 72, 65 67 S99 65, 121 69 S151 57, 177 60 S208 48, 232 51 S265 31, 291 38 S318 21, 340 15 V95 H0Z" fill="url(#mini-fill)" />
                <path d="M0 77 C30 70, 42 72, 65 67 S99 65, 121 69 S151 57, 177 60 S208 48, 232 51 S265 31, 291 38 S318 21, 340 15" fill="none" stroke="#559386" strokeWidth="2.5" strokeLinecap="round" />
              </svg>

              <p className="mt-3 text-sm leading-6 text-[#6f8981]">
                Your recent routine looks different from your usual baseline.
              </p>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-[#f1e5d5] bg-[#fffaf2] p-4">
              <div className="grid size-8 shrink-0 place-items-center rounded-full bg-[#f7e8cf] text-[#ad743e]">
                <Moon size={15} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#604833]">A small suggestion</p>
                <p className="mt-1 text-xs leading-5 text-[#8e7054]">
                  Before your next task, try taking five quiet minutes away from the screen.
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between text-xs text-[#a0b1ac]">
              <span className="flex items-center gap-1.5"><LockKeyhole size={12} /> Only you can see this</span>
              <span>FastAPI Backend Active</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative mx-auto max-w-6xl px-5 pb-8 text-center sm:px-8 lg:px-12">
        <p className="text-xs leading-5 text-[#91a19d]">
          Designed for early-warning pattern recognition, not clinical diagnoses. You choose what to share.
        </p>
      </footer>
    </div>
  );
};

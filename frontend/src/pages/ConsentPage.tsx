import React, { useState } from 'react';
import { Check, X, UsersRound, ArrowRight } from 'lucide-react';
import { Brand } from '../components/common/Brand';

interface ConsentPageProps {
  onContinue: () => void;
  onBack: () => void;
}

export const ConsentPage: React.FC<ConsentPageProps> = ({ onContinue, onBack }) => {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-[#fafaf8]">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-6 sm:px-8">
        <Brand />
        <button onClick={onBack} className="text-sm font-medium text-[#708983] hover:text-[#2f6f64]">
          Back
        </button>
      </header>

      <main className="mx-auto max-w-3xl px-5 pb-16 pt-8 sm:px-8 lg:pt-14">
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a47b54]">
            Your choice matters
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#1e3c35] sm:text-4xl">
            You're in control of your data.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#718983] sm:text-base">
            We use limited behavioral routine signals to identify shifts from your usual baseline. You decide whether to participate.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#e4ebe8] bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-semibold text-[#35584f]">
              <span className="text-[#4f927d]"><Check size={16} /></span>
              What we use
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                'Late-night activity patterns',
                'Assignment timing metadata',
                'Library and campus check-in rates',
                'Variance from your own baseline',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#6e8780]">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#82b9a7]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-[#e4ebe8] bg-white p-5 sm:p-6">
            <h2 className="flex items-center gap-2 font-semibold text-[#35584f]">
              <span className="text-[#b28a68]"><X size={16} /></span>
              What we never touch
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {[
                'Private messages or chats',
                'Personal conversations',
                'Medical or clinical records',
                'Biometric data',
                'Assignment content',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#6e8780]">
                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#d4b28e]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5 rounded-2xl border border-[#dce9e4] bg-[#f2f8f5] p-5 sm:p-6">
          <div className="flex gap-3">
            <div className="mt-0.5 text-[#2f6f64]">
              <UsersRound size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-[#2e4f47]">Who can see this?</h2>
              <p className="mt-1.5 text-sm leading-6 text-[#607a73]">
                Your individual routine trends stay strictly private to you. Institutional views, if enabled by campus policy, use aggregated statistical counts rather than individual student profiles.
              </p>
            </div>
          </div>
        </div>

        <label className="mt-7 flex cursor-pointer items-start gap-3 rounded-xl border border-[#e2eae7] bg-white p-4 transition-colors hover:border-[#bed5cc]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 size-4 accent-[#2f6f64]"
          />
          <span className="text-sm leading-6 text-[#526c65]">
            I understand and voluntarily consent to use this early-warning wellbeing companion.
          </span>
        </label>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onBack}
            className="order-2 rounded-xl px-5 py-3 text-sm font-semibold text-[#6d8580] hover:bg-[#f1f5f3] sm:order-1"
          >
            Not now
          </button>
          <button
            onClick={onContinue}
            disabled={!agreed}
            className="order-1 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2f6f64] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#245e54] disabled:cursor-not-allowed disabled:opacity-40 sm:order-2"
          >
            Continue <ArrowRight size={16} />
          </button>
        </div>
      </main>
    </div>
  );
};

import React from 'react';
import { HeartHandshake, ArrowRight, LockKeyhole, ArrowLeft, PhoneCall } from 'lucide-react';
import type { View } from '../types/wellbeing';

interface SupportPageProps {
  navigate: (view: View) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ navigate }) => {
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
            Human support
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#1e3c35] dark:text-[#e2ece8] sm:text-4xl">
            You don’t have to handle everything alone.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#718983] dark:text-[#9bb3ab] sm:text-base">
            If talking to someone would help, you can connect directly with a college counsellor. Nothing is shared until you decide to reach out.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex flex-col gap-4 rounded-2xl border border-[#e0eae6] bg-white p-5 shadow-xs transition-all hover:border-[#b9d4ca] sm:flex-row sm:items-center sm:p-6 dark:border-[#203a33] dark:bg-[#122420]">
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#edf6f2] text-[#2f6f64] dark:bg-[#1b3b33] dark:text-[#6ec4b2]">
            <HeartHandshake size={24} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#35584f] dark:text-[#e2ece8]">Talk to a College Counselor</h2>
            <p className="mt-1 text-sm text-[#78908a] dark:text-[#9bb3ab]">
              A private space to talk through what’s on your mind. Schedule a 15-minute support session or connect directly via WhatsApp.
            </p>
          </div>
          <button
            onClick={() => navigate('counsellor')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer"
          >
            Book a Session <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* Immediate Helpline Safe-Net */}
      <div className="mt-6 rounded-2xl border border-teal-200 bg-teal-50/70 p-5 dark:border-teal-900/60 dark:bg-teal-950/20">
        <div className="flex items-start gap-3">
          <PhoneCall size={18} className="mt-0.5 shrink-0 text-teal-700 dark:text-teal-400" />
          <div className="text-xs leading-5 text-teal-950 dark:text-teal-200">
            <span className="font-bold">24/7 Crisis Helplines:</span> Tele-MANAS (<strong>14416</strong> / <strong>1800-891-4416</strong>) and AASRA (<strong>+91-9820466726</strong>) offer free, confidential, 24/7 human support.
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-[#2f6f64] dark:bg-[#1e443c] p-6 text-white shadow-xs">
        <div className="flex gap-3">
          <LockKeyhole size={19} className="mt-0.5 shrink-0 text-[#cfe6de]" />
          <p className="text-sm leading-6 text-[#d4e8e2]">
            Your trend stays private. Nothing is shared with counselors or faculty unless you explicitly choose to contact them yourself.
          </p>
        </div>
      </div>
    </div>
  );
};

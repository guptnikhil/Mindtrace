import React, { useState } from 'react';
import { HeartHandshake, UsersRound, ShieldCheck, ArrowRight, Check, LockKeyhole, ArrowLeft } from 'lucide-react';
import type { View } from '../types/wellbeing';

interface SupportPageProps {
  navigate: (view: View) => void;
}

export const SupportPage: React.FC<SupportPageProps> = ({ navigate }) => {
  const [contacted, setContacted] = useState<string | null>(null);

  const options = [
    {
      title: 'Talk to a counselor',
      description: 'A private space to talk through what’s on your mind.',
      icon: HeartHandshake,
    },
    {
      title: 'Reach a peer support group',
      description: 'Connect with students who understand academic pressure.',
      icon: UsersRound,
    },
    {
      title: 'Contact campus wellbeing support',
      description: 'Learn what support options are available on your campus.',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 lg:py-12">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex-1">
          <button
            onClick={() => navigate('dashboard')}
            className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-[#78908a] hover:text-[#2f6f64]"
          >
            <ArrowLeft size={14} /> Back to dashboard
          </button>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a47b54]">
            Human support
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#1e3c35] sm:text-4xl">
            You don’t have to handle everything alone.
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#718983] sm:text-base">
            If talking to someone would help, you can choose the kind of support that feels right. Nothing is shared until you decide to reach out.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {options.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="flex flex-col gap-4 rounded-2xl border border-[#e0eae6] bg-white p-5 shadow-sm transition-all hover:border-[#b9d4ca] sm:flex-row sm:items-center sm:p-6"
          >
            <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#edf6f2] text-[#2f6f64]">
              <Icon size={21} />
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-[#35584f]">{title}</h2>
              <p className="mt-1 text-sm text-[#78908a]">{description}</p>
            </div>
            <button
              onClick={() => {
                if (title === 'Talk to a counselor') {
                  navigate('counsellor');
                } else {
                  setContacted(title);
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#cfe0da] px-4 py-2.5 text-sm font-semibold text-[#47746a] hover:bg-[#f0f7f4] cursor-pointer"
            >
              Choose this <ArrowRight size={15} />
            </button>
          </div>
        ))}
      </div>

      {contacted && (
        <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#cfe0da] bg-[#eff8f4] p-5">
          <Check size={18} className="mt-0.5 text-[#2f6f64]" />
          <div>
            <p className="font-semibold text-[#35584f]">You selected: {contacted}</p>
            <p className="mt-1 text-sm leading-6 text-[#6d8780]">
              In a full campus deployment, verified contact numbers & calendar links will appear here. No personal information has been sent automatically.
            </p>
          </div>
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-[#2f6f64] p-6 text-white">
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

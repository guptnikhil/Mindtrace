import React from 'react';
import { ArrowLeft, Check, Info, LockKeyhole, ShieldCheck } from 'lucide-react';
import type { View } from '../types/wellbeing';

interface SettingsPageProps {
  navigate: (view: View) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ navigate }) => {
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
            Your Control Center
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#1e3c35] sm:text-4xl">
            Settings & Privacy
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#718983] sm:text-base">
            System configuration, data security rules, and institutional oversight settings.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <section className="rounded-2xl border border-[#e0eae6] bg-white p-5 sm:p-6 shadow-xs">
          <h2 className="font-semibold text-[#35584f]">Data Controls & Security Architecture</h2>
          <div className="mt-4 divide-y divide-[#edf2ef]">
            {[
              ['FastAPI Backend API', 'All student data is processed securely through FastAPI endpoints.'],
              ['Supabase PostgreSQL Database', 'Persistent storage configured with strict relational schema & foreign keys.'],
              ['Frontend Security', 'Zero API keys, service role keys, or database credentials exposed to client bundle.'],
              ['Non-diagnostic Phrasing', 'Risk results strictly use supportive non-diagnostic language.'],
            ].map(([title, desc]) => (
              <div key={title} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-[#4e6d64]">{title}</p>
                  <p className="mt-1 text-xs text-[#91a49e]">{desc}</p>
                </div>
                <Check size={16} className="shrink-0 text-[#72a895]" />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#e0eae6] bg-white p-5 sm:p-6 shadow-xs">
          <h2 className="font-semibold text-[#35584f]">Platform Navigation</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <button
              onClick={() => navigate('consent')}
              className="flex items-center gap-2 rounded-xl bg-[#f3f8f5] p-3 text-left text-xs font-semibold text-[#52736a] hover:bg-[#e4efe9]"
            >
              <LockKeyhole size={15} /> Privacy & Consent
            </button>
            <button
              onClick={() => navigate('support')}
              className="flex items-center gap-2 rounded-xl bg-[#f3f8f5] p-3 text-left text-xs font-semibold text-[#52736a] hover:bg-[#e4efe9]"
            >
              <Info size={15} /> Support Resources
            </button>
            <button
              onClick={() => navigate('analytics')}
              className="flex items-center gap-2 rounded-xl bg-[#f3f8f5] p-3 text-left text-xs font-semibold text-[#52736a] hover:bg-[#e4efe9]"
            >
              <ShieldCheck size={15} /> Institutional Oversight
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

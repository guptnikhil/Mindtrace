import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Building2, UserCheck } from 'lucide-react';
import type { View } from '../types/wellbeing';
import { InstitutionService } from '../services/api';

interface InstitutionLoginPageProps {
  navigate: (view: View) => void;
  onLoginSuccess: () => void;
}

export const InstitutionLoginPage: React.FC<InstitutionLoginPageProps> = ({
  navigate,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@rkgit.edu');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, overrideEmail?: string, overridePass?: string) => {
    if (e) e.preventDefault();
    const loginEmail = overrideEmail || email;
    const loginPass = overridePass || password;

    setLoading(true);
    setError(null);

    try {
      await InstitutionService.loginAdmin(loginEmail, loginPass);
      onLoginSuccess();
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed. Please check institutional credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-5 py-12">
      <button
        onClick={() => navigate('dashboard')}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Student Companion
      </button>

      <div className="bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Institutional Portal
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            MindTrace Program Analytics • Aggregated & Privacy Protected
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Institutional Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm shadow-sm transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In to Institutional Dashboard'}
          </button>
        </form>

        {/* Demo Quick Login Buttons */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 text-center">
            Demo Credentials Quick Launch
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={() => handleLogin(undefined, 'admin@rkgit.edu', 'admin123')}
              className="py-2 px-3 rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-medium hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5" />
              College Admin
            </button>
            <button
              onClick={() => handleLogin(undefined, 'counsellor@rkgit.edu', 'counsellor123')}
              className="py-2 px-3 rounded-lg border border-teal-200 dark:border-teal-800 bg-teal-50/50 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 text-xs font-medium hover:bg-teal-100 dark:hover:bg-teal-900/60 transition-colors flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              College Counsellor
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 flex items-start gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <span>
            Notice: Institutional accounts strictly access aggregated program statistics. No individual student records, risk scores, or private chat data are accessible.
          </span>
        </div>
      </div>
    </div>
  );
};

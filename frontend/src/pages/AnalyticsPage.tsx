import React, { useEffect, useState } from 'react';
import { ArrowLeft, RefreshCw, AlertCircle, Users, BarChart3, ShieldAlert, Info } from 'lucide-react';
import type { View, AnalyticsOverview } from '../types/wellbeing';
import { AnalyticsService } from '../services/api';

interface AnalyticsPageProps {
  navigate: (view: View) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ navigate }) => {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const overview = await AnalyticsService.getAnalytics();
      setData(overview);
    } catch (err: any) {
      console.error('Failed to load institutional analytics:', err);
      setError('Could not load institutional overview data from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const totalAssessed = data
    ? data.risk_distribution.low + data.risk_distribution.moderate + data.risk_distribution.high
    : 0;

  const lowPct = totalAssessed > 0 ? Math.round((data!.risk_distribution.low / totalAssessed) * 100) : 0;
  const modPct = totalAssessed > 0 ? Math.round((data!.risk_distribution.moderate / totalAssessed) * 100) : 0;
  const highPct = totalAssessed > 0 ? Math.round((data!.risk_distribution.high / totalAssessed) * 100) : 0;

  return (
    <div className="mx-auto max-w-5xl px-5 py-8 sm:px-8 lg:py-12">
      <button
        onClick={() => navigate('dashboard')}
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-[#78908a] hover:text-[#2f6f64]"
      >
        <ArrowLeft size={14} /> Back to dashboard
      </button>

      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#a47b54]">
            Institutional Oversight
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.035em] text-[#1e3c35] sm:text-4xl">
            Cohort Wellbeing Analytics
          </h1>
          <p className="mt-2 text-sm text-[#718983]">
            Aggregated, privacy-preserving insights on engineering student routine trends.
          </p>
        </div>

        <button
          onClick={fetchAnalytics}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#dce9e4] bg-white px-4 py-2.5 text-sm font-semibold text-[#35584f] hover:bg-[#f1f6f3] disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw size={15} className={loading ? 'animate-spin text-[#2f6f64]' : 'text-[#78908a]'} />
          Refresh Metrics
        </button>
      </div>

      {loading && (
        <div className="flex min-h-[40vh] flex-col items-center justify-center text-[#78908a]">
          <RefreshCw size={32} className="animate-spin text-[#2f6f64] mb-3" />
          <p className="text-sm font-medium">Aggregating cohort statistics from FastAPI...</p>
        </div>
      )}

      {error && (
        <div className="my-6 flex items-start gap-3 rounded-xl border border-[#f5c6cb] bg-[#f8d7da] p-4 text-sm text-[#721c24]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <div>{error}</div>
        </div>
      )}

      {!loading && !error && data && (
        <div className="flex flex-col gap-6">
          {/* Top KPI Grid */}
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#e4ebe8] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between text-[#78908a] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Enrolled</span>
                <Users size={18} className="text-[#2f6f64]" />
              </div>
              <div className="text-4xl font-bold text-[#1e3c35]">{data.total_students}</div>
              <p className="mt-2 text-xs text-[#8aa099]">Registered student profiles</p>
            </div>

            <div className="rounded-2xl border border-[#e4ebe8] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between text-[#78908a] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Check-ins Logged</span>
                <BarChart3 size={18} className="text-[#2f6f64]" />
              </div>
              <div className="text-4xl font-bold text-[#1e3c35]">{data.total_checkins}</div>
              <p className="mt-2 text-xs text-[#8aa099]">Daily check-in submissions</p>
            </div>

            <div className="rounded-2xl border border-[#e4ebe8] bg-white p-6 shadow-xs">
              <div className="flex items-center justify-between text-[#78908a] mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">High Risk Count</span>
                <ShieldAlert size={18} className="text-[#b8834e]" />
              </div>
              <div className="text-4xl font-bold text-[#b8834e]">{data.risk_distribution.high}</div>
              <p className="mt-2 text-xs text-[#8aa099]">Students flagged for elevated risk</p>
            </div>
          </div>

          {/* Risk Distribution Breakdown */}
          <div className="rounded-2xl border border-[#e4ebe8] bg-white p-6 shadow-xs">
            <h2 className="text-lg font-semibold text-[#1e3c35]">Cohort Risk Level Distribution</h2>
            <p className="mt-1 text-xs text-[#78908a]">
              Based on recent algorithmic wellbeing assessments across all students.
            </p>

            <div className="mt-6 flex h-4 w-full overflow-hidden rounded-full bg-[#f1f6f3]">
              <div style={{ width: `${lowPct}%` }} className="bg-[#2f6f64] transition-all" title={`Low: ${lowPct}%`} />
              <div style={{ width: `${modPct}%` }} className="bg-[#b8834e] transition-all" title={`Moderate: ${modPct}%`} />
              <div style={{ width: `${highPct}%` }} className="bg-[#d9534f] transition-all" title={`High: ${highPct}%`} />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-[#e4ebe8] bg-[#f8fbf9] p-4">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#2f6f64]" />
                  <span className="text-sm font-semibold text-[#35584f]">Low Risk</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-[#1e3c35]">
                  {data.risk_distribution.low} <span className="text-xs font-normal text-[#8aa099]">({lowPct}%)</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#e4ebe8] bg-[#fdfaf5] p-4">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#b8834e]" />
                  <span className="text-sm font-semibold text-[#7d5f3d]">Moderate Risk</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-[#b8834e]">
                  {data.risk_distribution.moderate} <span className="text-xs font-normal text-[#8aa099]">({modPct}%)</span>
                </div>
              </div>

              <div className="rounded-xl border border-[#e4ebe8] bg-[#fdf6f6] p-4">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#d9534f]" />
                  <span className="text-sm font-semibold text-[#a94442]">Elevated Risk</span>
                </div>
                <div className="mt-2 text-2xl font-bold text-[#d9534f]">
                  {data.risk_distribution.high} <span className="text-xs font-normal text-[#8aa099]">({highPct}%)</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-[#edf2ef] pt-4 flex items-center gap-2 text-xs text-[#90a29c]">
              <Info size={14} className="shrink-0 text-[#2f6f64]" />
              Data is updated dynamically from FastAPI backend. Individual check-ins remain anonymous to preserve student trust.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

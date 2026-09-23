import React, { useState, useEffect } from 'react';
import {
  Users,
  ShieldCheck,
  RefreshCw,
  LogOut,
  Building2,
  TrendingUp,
  FileText,
  AlertTriangle,
  Activity,
  HeartHandshake
} from 'lucide-react';
import type {
  InstitutionalOverview,
  AdoptionFunnel,
  CohortBreakdown,
  SupportAnalytics,
  EngagementMetrics,
  InstitutionalReport
} from '../types/wellbeing';
import { InstitutionService } from '../services/api';

interface InstitutionDashboardPageProps {
  onLogout: () => void;
}

export const InstitutionDashboardPage: React.FC<InstitutionDashboardPageProps> = ({
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'adoption' | 'cohorts' | 'support' | 'engagement' | 'reports'
  >('overview');

  const [yearFilter, setYearFilter] = useState<string>('All');
  const [overview, setOverview] = useState<InstitutionalOverview | null>(null);
  const [adoption, setAdoption] = useState<AdoptionFunnel | null>(null);
  const [cohorts, setCohorts] = useState<CohortBreakdown[]>([]);
  const [support, setSupport] = useState<SupportAnalytics | null>(null);
  const [engagement, setEngagement] = useState<EngagementMetrics | null>(null);
  const [report, setReport] = useState<InstitutionalReport | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const adminRole = localStorage.getItem('admin_role') || 'COLLEGE_ADMIN';

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [ov, ad, ch, sp, eg, rp] = await Promise.all([
        InstitutionService.getOverview().catch(() => null),
        InstitutionService.getAdoption().catch(() => null),
        InstitutionService.getCohorts(yearFilter).catch(() => []),
        InstitutionService.getSupport().catch(() => null),
        InstitutionService.getEngagement().catch(() => null),
        InstitutionService.getReport().catch(() => null),
      ]);
      setOverview(ov);
      setAdoption(ad);
      setCohorts(ch);
      setSupport(sp);
      setEngagement(eg);
      setReport(rp);
    } catch (err) {
      setError('Failed to load institutional analytics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [yearFilter]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-12 space-y-8">
      {/* Top Banner & User Profile */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              DEMO DATA • PRIVACY PROTECTED
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              MIN_COUNT = 10 Threshold Enforced
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">
            MindTrace — Institutional Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {overview?.institution_name || 'RKGIT — Demo Institution'} • Aggregated Program Analytics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {adminRole === 'COLLEGE_ADMIN' ? 'Dean of Student Affairs' : 'College Counsellor'}
            </div>
            <div className="text-[11px] text-slate-400">Role: {adminRole}</div>
          </div>

          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            title="Refresh analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm">
          {error}
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto gap-1 border-b border-slate-200 dark:border-slate-700 pb-1">
        {[
          { id: 'overview', label: 'Overview', icon: Building2 },
          { id: 'adoption', label: 'Adoption & Funnel', icon: TrendingUp },
          { id: 'cohorts', label: 'Cohorts (Year-Wise)', icon: Users },
          { id: 'support', label: 'Support Services', icon: HeartHandshake },
          { id: 'engagement', label: 'Engagement & Nudges', icon: Activity },
          { id: 'reports', label: 'Executive Report', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && overview && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Eligible Students</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {overview.eligible_students.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Campus population</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Opted In</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
                {overview.opted_in_students.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 block">55% Participation</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">Active Monthly</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {overview.active_students.toLocaleString()}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Regular check-ins</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Counselling Demand</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {overview.counselling_requests}
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Requests this term</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Completed Sessions</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
                {overview.completed_sessions}
              </div>
              <span className="text-[11px] text-emerald-600 mt-1 block">83.7% completion</span>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">Nudge Engagement</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                {overview.nudge_engagement_rate}%
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">Positive feedback</span>
            </div>
          </div>

          {/* Program Impact Summary */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              Program Impact & Privacy Compliance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              MindTrace helps institutions understand whether their wellbeing support infrastructure is being used and where additional capacity may be needed. All data displayed across this portal is strictly aggregated and privacy-protected.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: ADOPTION & FUNNEL */}
      {activeTab === 'adoption' && adoption && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Student Adoption Funnel
          </h2>

          <div className="space-y-3">
            {[
              { label: '1. Eligible Population', count: adoption.eligible, pct: 100, color: 'bg-slate-200 dark:bg-slate-700' },
              { label: '2. Opted In Students', count: adoption.opted_in, pct: adoption.opt_in_rate, color: 'bg-emerald-500' },
              { label: '3. Completed Onboarding Quest', count: adoption.onboarded, pct: adoption.onboarding_completion_rate, color: 'bg-teal-500' },
              { label: '4. Active Monthly Users', count: adoption.active_monthly, pct: Math.round((adoption.active_monthly / adoption.eligible) * 100), color: 'bg-sky-500' },
              { label: '5. Active Weekly Users', count: adoption.active_weekly, pct: Math.round((adoption.active_weekly / adoption.eligible) * 100), color: 'bg-indigo-500' },
            ].map((step) => (
              <div key={step.label} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>{step.label}</span>
                  <span>{step.count.toLocaleString()} ({step.pct}%)</span>
                </div>
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                  <div className={`h-full ${step.color} transition-all`} style={{ width: `${step.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: COHORTS & YEAR BREAKDOWN */}
      {activeTab === 'cohorts' && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Year-Wise Cohort Analytics</h2>
              <p className="text-xs text-slate-500">Filtered metrics with server-side MIN_COUNT=10 privacy protection.</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Filter Year:</span>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-200"
              >
                <option value="All">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Specialized M.Tech">Specialized M.Tech (&lt;10 Threshold Test)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cohorts.map((cohort) => (
              <div
                key={cohort.year}
                className={`p-5 rounded-xl border transition-all ${
                  cohort.privacy_masked
                    ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                    : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{cohort.year}</h3>
                  {cohort.privacy_masked ? (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Masked (&lt;10)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Active Cohort
                    </span>
                  )}
                </div>

                {cohort.privacy_masked ? (
                  <div className="mt-4 p-3 rounded-lg bg-amber-100/50 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-xs leading-relaxed">
                    {cohort.message}
                  </div>
                ) : (
                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Opted-In Students</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{cohort.opted_in_count}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Active Monthly</span>
                      <span className="font-bold text-slate-900 dark:text-slate-100">{cohort.active_count}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Counselling Requests</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{cohort.counselling_requests}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SUPPORT SERVICES */}
      {activeTab === 'support' && support && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Support Services & Counselling Demand</h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Requests</span>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{support.total_requests}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Confirmed Sessions</span>
              <div className="text-2xl font-bold text-emerald-600 mt-1">{support.confirmed}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600">WhatsApp Handoffs</span>
              <div className="text-2xl font-bold text-teal-600 mt-1">{support.whatsapp_handoffs}</div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Slot Utilization Rate</span>
              <div className="text-2xl font-bold text-sky-600 mt-1">{support.utilization_rate}%</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ENGAGEMENT & NUDGES */}
      {activeTab === 'engagement' && engagement && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Feature Engagement Breakdown</h2>
            <div className="space-y-3">
              {Object.entries(engagement.feature_usage).map(([feat, pct]) => (
                <div key={feat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{feat}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Aggregate Nudge Feedback</h2>
            <div className="space-y-3">
              {Object.entries(engagement.nudge_feedback).map(([key, pct]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{key}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: EXECUTIVE REPORT */}
      {activeTab === 'reports' && report && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Monthly Wellbeing Program Report
              </h2>
              <p className="text-xs text-slate-500">
                {report.institution_name} • Generated {report.report_date}
              </p>
            </div>

            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors"
            >
              Export Report Summary
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Eligible Population</span>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{report.eligible_population}</div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Opt-In Participation</span>
              <div className="text-lg font-bold text-emerald-600">{report.opt_in_rate}%</div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Active Monthly</span>
              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">{report.active_monthly}</div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Counselling Utilization</span>
              <div className="text-lg font-bold text-sky-600">{report.counselling_utilization}%</div>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm mb-3">
              Top Student-Selected Focus Areas
            </h3>
            <div className="space-y-2 text-xs">
              {report.top_student_concerns.map((item) => (
                <div key={item.concern} className="flex justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60">
                  <span className="text-slate-700 dark:text-slate-300">{item.concern}</span>
                  <span className="font-bold text-emerald-600">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs text-emerald-800 dark:text-emerald-200 leading-relaxed">
            <span className="font-bold">Privacy Declaration:</span> {report.privacy_declaration}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Calendar, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { DEMO_STUDENT_SCENARIO } from '../../data/demoData';
import type { DemoState } from '../../types/wellbeing';

interface PatternTimelineProps {
  demoState: DemoState;
}

export const PatternTimeline: React.FC<PatternTimelineProps> = ({ demoState }) => {
  const events = DEMO_STUDENT_SCENARIO.timelineEvents[demoState] || DEMO_STUDENT_SCENARIO.timelineEvents.changing;

  return (
    <div className="rounded-2xl border border-[#dce9e4] bg-white p-5 shadow-xs dark:border-[#253d37] dark:bg-[#182824] sm:p-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8da29c] dark:text-[#90a8a0]">
            BEHAVIORAL PROGRESSION
          </p>
          <h2 className="mt-1 text-xl font-semibold text-[#2b5046] dark:text-[#d3e3de]">
            Pattern Timeline
          </h2>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-[#f0f6f3] px-3 py-1 text-xs font-semibold text-[#3e816e] dark:bg-[#1a2f29] dark:text-[#6ec4b2]">
          <Calendar size={14} /> 21-Day History
        </div>
      </div>

      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Observed routine shift over the last 3 weeks relative to Riya's personal baseline.
      </p>

      {/* Timeline Steps */}
      <div className="relative mt-6 space-y-6 before:absolute before:left-3.5 before:top-3 before:h-[calc(100%-24px)] before:w-0.5 before:bg-[#e2ebe7] dark:before:bg-[#203932]">
        {events.map((evt, idx) => {
          let IconComponent = CheckCircle;
          let iconColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';

          if (evt.severity === 'noticeable') {
            IconComponent = AlertTriangle;
            iconColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
          } else if (evt.severity === 'elevated') {
            IconComponent = AlertCircle;
            iconColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
          }

          return (
            <div key={idx} className="relative flex items-start gap-4 pl-9">
              <div
                className={`absolute left-0 top-0 grid size-7 place-items-center rounded-full border ${iconColor} shadow-2xs`}
              >
                <IconComponent size={15} />
              </div>

              <div className="flex-1 rounded-xl border border-slate-100 dark:border-[#223b34] bg-[#fbfdfc] dark:bg-[#14231f] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2f6f64] dark:text-[#6ec4b2]">
                    {evt.weekLabel}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    {evt.metricsSummary}
                  </span>
                </div>
                <h4 className="mt-1 text-sm font-bold text-slate-800 dark:text-slate-100">
                  {evt.title}
                </h4>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {evt.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 pt-3 border-t border-[#edf2ef] dark:border-[#243d36]">
        <Info size={13} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
        <span>Timeline events are derived deterministically from recent check-ins and campus activity data.</span>
      </div>
    </div>
  );
};

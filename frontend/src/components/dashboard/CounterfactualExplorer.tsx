import React, { useState, useEffect } from 'react';
import { Sliders, RotateCcw, Info, ArrowRight, Activity, Clock, BookOpen, UsersRound } from 'lucide-react';
import { calculateCounterfactualScore, DEMO_STUDENT_SCENARIO } from '../../data/demoData';
import type { DemoState } from '../../types/wellbeing';

interface CounterfactualExplorerProps {
  demoState: DemoState;
}

export const CounterfactualExplorer: React.FC<CounterfactualExplorerProps> = ({ demoState }) => {
  const baseline = DEMO_STUDENT_SCENARIO.baseline;
  const currentSignals = DEMO_STUDENT_SCENARIO.states[demoState] || DEMO_STUDENT_SCENARIO.states.changing;
  
  // Calculate average of recent 7 days for starting slider values
  const recent7 = currentSignals.slice(-7);
  const defaultLateNight = Math.round(recent7.reduce((acc, s) => acc + s.lateNightMinutes, 0) / 7);
  const defaultDelay = Number((recent7.reduce((acc, s) => acc + s.assignmentDelayHours, 0) / 7).toFixed(1));
  const defaultLibrary = Number((recent7.reduce((acc, s) => acc + s.libraryCheckins, 0) / 7).toFixed(1));
  const defaultVariance = Number((recent7.reduce((acc, s) => acc + s.routineVariance, 0) / 7).toFixed(1));

  // Interactive slider states
  const [lateNight, setLateNight] = useState(defaultLateNight);
  const [delay, setDelay] = useState(defaultDelay);
  const [library, setLibrary] = useState(defaultLibrary);
  const [variance, setVariance] = useState(defaultVariance);

  // Sync sliders if demo state changes externally
  useEffect(() => {
    setLateNight(defaultLateNight);
    setDelay(defaultDelay);
    setLibrary(defaultLibrary);
    setVariance(defaultVariance);
  }, [demoState, defaultLateNight, defaultDelay, defaultLibrary, defaultVariance]);

  // Compute baseline result vs simulated scenario result
  const initialResult = calculateCounterfactualScore(defaultLateNight, defaultDelay, defaultLibrary, defaultVariance, baseline);
  const simulatedResult = calculateCounterfactualScore(lateNight, delay, library, variance, baseline);

  const handleResetSliders = () => {
    setLateNight(defaultLateNight);
    setDelay(defaultDelay);
    setLibrary(defaultLibrary);
    setVariance(defaultVariance);
  };

  const isModified =
    lateNight !== defaultLateNight ||
    delay !== defaultDelay ||
    library !== defaultLibrary ||
    variance !== defaultVariance;

  return (
    <div className="rounded-2xl border border-teal-200 dark:border-[#24423a] bg-linear-to-br from-teal-50/50 via-white to-emerald-50/40 dark:from-[#152723] dark:via-[#182824] dark:to-[#13221e] p-5 sm:p-7 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 dark:text-[#6ec4b2]">
            <Sliders size={16} /> What-If Model Scenario
          </div>
          <h2 className="mt-1 text-xl font-semibold text-slate-900 dark:text-slate-100">
            Counterfactual Explorer
          </h2>
        </div>

        {isModified && (
          <button
            onClick={handleResetSliders}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2c27] px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#223932] transition-colors cursor-pointer"
          >
            <RotateCcw size={13} /> Reset Variables
          </button>
        )}
      </div>

      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300">
        Adjust individual routine parameters to observe how the mathematical sensitivity model responds.
      </p>

      {/* Main Grid: Controls + Live Model Indicator */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Sliders */}
        <div className="space-y-4">
          {/* Slider 1: Late Night Activity */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/80 dark:bg-[#13221e]/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Clock size={14} className="text-teal-600 dark:text-teal-400" />
                Late-Night Activity
              </span>
              <span className="font-bold text-teal-700 dark:text-teal-300">
                {lateNight} mins <span className="text-[10px] font-normal text-slate-400">(base: {baseline.avgLateNightMinutes}m)</span>
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={120}
              step={5}
              value={lateNight}
              onChange={(e) => setLateNight(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* Slider 2: Assignment Delay */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/80 dark:bg-[#13221e]/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <BookOpen size={14} className="text-teal-600 dark:text-teal-400" />
                Assignment Submission Delay
              </span>
              <span className="font-bold text-teal-700 dark:text-teal-300">
                {delay}h <span className="text-[10px] font-normal text-slate-400">(base: {baseline.avgAssignmentDelayHours}h)</span>
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={10.0}
              step={0.5}
              value={delay}
              onChange={(e) => setDelay(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* Slider 3: Campus Library Visits */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/80 dark:bg-[#13221e]/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <UsersRound size={14} className="text-teal-600 dark:text-teal-400" />
                Campus Library Check-ins
              </span>
              <span className="font-bold text-teal-700 dark:text-teal-300">
                {library} visits/wk <span className="text-[10px] font-normal text-slate-400">(base: {baseline.avgLibraryCheckins})</span>
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={5.0}
              step={0.5}
              value={library}
              onChange={(e) => setLibrary(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          {/* Slider 4: Routine Variance */}
          <div className="rounded-xl border border-slate-200/80 dark:border-slate-700/60 bg-white/80 dark:bg-[#13221e]/80 p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <Activity size={14} className="text-teal-600 dark:text-teal-400" />
                Schedule Consistency Variance
              </span>
              <span className="font-bold text-teal-700 dark:text-teal-300">
                {variance}x <span className="text-[10px] font-normal text-slate-400">(base: {baseline.avgRoutineVariance}x)</span>
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={3.0}
              step={0.1}
              value={variance}
              onChange={(e) => setVariance(Number(e.target.value))}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Live Model Output Comparison */}
        <div className="flex flex-col justify-between rounded-xl border border-teal-200/70 dark:border-teal-900/50 bg-white/90 dark:bg-[#12201c] p-5 space-y-4">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
              Model Trend Output
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-teal-700 dark:text-teal-300">
                {simulatedResult.score}x
              </span>
              <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                +{simulatedResult.percentageShift}% shift vs baseline
              </span>
            </div>

            <div className="mt-3">
              <span
                className={`inline-block rounded-full px-3 py-1 text-xs font-bold capitalize ${
                  simulatedResult.state === 'needs_attention'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200'
                    : simulatedResult.state === 'changing'
                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                }`}
              >
                Model State: {simulatedResult.state.replace('_', ' ')}
              </span>
            </div>

            {/* Comparison with initial state */}
            {isModified && (
              <div className="mt-4 p-3 rounded-lg bg-teal-50/80 dark:bg-[#182b26] border border-teal-100 dark:border-teal-900/40 text-xs space-y-1">
                <div className="font-semibold text-teal-800 dark:text-teal-200 flex items-center gap-1">
                  <span>Scenario Shift:</span>
                  <span>{initialResult.score}x</span>
                  <ArrowRight size={12} />
                  <span className="font-bold">{simulatedResult.score}x</span>
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-300">
                  {simulatedResult.score < initialResult.score
                    ? 'Adjusting these parameters returns the model indicator closer to normal baseline.'
                    : 'Elevating these parameters increases overall model routine variance.'}
                </p>
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-[#162723] text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2 border border-slate-200/60 dark:border-slate-800">
            <Info size={14} className="shrink-0 text-teal-600 dark:text-teal-400 mt-0.5" />
            <span>
              This is a model scenario sensitivity simulation. It evaluates how indicator formulas react to input shifts and does not represent proof of clinical causality or burnout prevention.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface DailyBehaviorSignal {
  date: string;
  dayLabel: string;
  lateNightMinutes: number;
  assignmentDelayHours: number;
  libraryCheckins: number;
  routineVariance: number;
}

export interface TimelineEvent {
  weekLabel: string;
  title: string;
  description: string;
  severity: 'normal' | 'noticeable' | 'elevated';
  metricsSummary: string;
}

export interface DemoStudentScenario {
  id: string;
  name: string;
  branch: string;
  year: number;
  persona: string;
  baseline: {
    avgLateNightMinutes: number;
    avgAssignmentDelayHours: number;
    avgLibraryCheckins: number;
    avgRoutineVariance: number;
  };
  states: {
    stable: DailyBehaviorSignal[];
    changing: DailyBehaviorSignal[];
    needs_attention: DailyBehaviorSignal[];
  };
  timelineEvents: Record<'stable' | 'changing' | 'needs_attention', TimelineEvent[]>;
}

export const DEMO_STUDENT_SCENARIO: DemoStudentScenario = {
  id: 'stu_demo_riya_001',
  name: 'Riya',
  branch: 'Computer Science & Engineering',
  year: 3,
  persona: '3rd year B.Tech student experiencing project deadline overlap and routine shift',
  baseline: {
    avgLateNightMinutes: 35.0,
    avgAssignmentDelayHours: 1.2,
    avgLibraryCheckins: 3.5,
    avgRoutineVariance: 1.0,
  },
  states: {
    stable: [
      { date: '2026-09-03', dayLabel: 'Day -20', lateNightMinutes: 32, assignmentDelayHours: 1.0, libraryCheckins: 3.5, routineVariance: 1.0 },
      { date: '2026-09-04', dayLabel: 'Day -19', lateNightMinutes: 38, assignmentDelayHours: 1.3, libraryCheckins: 3.8, routineVariance: 1.1 },
      { date: '2026-09-05', dayLabel: 'Day -18', lateNightMinutes: 35, assignmentDelayHours: 1.1, libraryCheckins: 3.2, routineVariance: 0.9 },
      { date: '2026-09-06', dayLabel: 'Day -17', lateNightMinutes: 40, assignmentDelayHours: 1.4, libraryCheckins: 3.6, routineVariance: 1.2 },
      { date: '2026-09-07', dayLabel: 'Day -16', lateNightMinutes: 34, assignmentDelayHours: 1.2, libraryCheckins: 3.4, routineVariance: 1.0 },
      { date: '2026-09-08', dayLabel: 'Day -15', lateNightMinutes: 36, assignmentDelayHours: 1.0, libraryCheckins: 3.7, routineVariance: 1.1 },
      { date: '2026-09-09', dayLabel: 'Day -14', lateNightMinutes: 33, assignmentDelayHours: 1.3, libraryCheckins: 3.5, routineVariance: 1.0 },
      { date: '2026-09-10', dayLabel: 'Day -13', lateNightMinutes: 37, assignmentDelayHours: 1.2, libraryCheckins: 3.3, routineVariance: 0.9 },
      { date: '2026-09-11', dayLabel: 'Day -12', lateNightMinutes: 35, assignmentDelayHours: 1.1, libraryCheckins: 3.6, routineVariance: 1.1 },
      { date: '2026-09-12', dayLabel: 'Day -11', lateNightMinutes: 36, assignmentDelayHours: 1.2, libraryCheckins: 3.4, routineVariance: 1.0 },
      { date: '2026-09-13', dayLabel: 'Day -10', lateNightMinutes: 34, assignmentDelayHours: 1.1, libraryCheckins: 3.5, routineVariance: 1.0 },
      { date: '2026-09-14', dayLabel: 'Day -9', lateNightMinutes: 35, assignmentDelayHours: 1.2, libraryCheckins: 3.4, routineVariance: 1.0 },
      { date: '2026-09-15', dayLabel: 'Day -8', lateNightMinutes: 33, assignmentDelayHours: 1.1, libraryCheckins: 3.6, routineVariance: 0.9 },
      { date: '2026-09-16', dayLabel: 'Day -7', lateNightMinutes: 37, assignmentDelayHours: 1.3, libraryCheckins: 3.5, routineVariance: 1.1 },
      { date: '2026-09-17', dayLabel: 'Day -6', lateNightMinutes: 34, assignmentDelayHours: 1.0, libraryCheckins: 3.7, routineVariance: 1.0 },
      { date: '2026-09-18', dayLabel: 'Day -5', lateNightMinutes: 36, assignmentDelayHours: 1.2, libraryCheckins: 3.4, routineVariance: 1.0 },
      { date: '2026-09-19', dayLabel: 'Day -4', lateNightMinutes: 35, assignmentDelayHours: 1.1, libraryCheckins: 3.5, routineVariance: 1.1 },
      { date: '2026-09-20', dayLabel: 'Day -3', lateNightMinutes: 33, assignmentDelayHours: 1.3, libraryCheckins: 3.6, routineVariance: 0.9 },
      { date: '2026-09-21', dayLabel: 'Day -2', lateNightMinutes: 38, assignmentDelayHours: 1.2, libraryCheckins: 3.3, routineVariance: 1.0 },
      { date: '2026-09-22', dayLabel: 'Day -1', lateNightMinutes: 34, assignmentDelayHours: 1.1, libraryCheckins: 3.5, routineVariance: 1.1 },
      { date: '2026-09-23', dayLabel: 'Today', lateNightMinutes: 36, assignmentDelayHours: 1.2, libraryCheckins: 3.6, routineVariance: 1.0 },
    ],
    changing: [
      { date: '2026-09-03', dayLabel: 'Day -20', lateNightMinutes: 32, assignmentDelayHours: 1.0, libraryCheckins: 3.5, routineVariance: 1.0 },
      { date: '2026-09-04', dayLabel: 'Day -19', lateNightMinutes: 38, assignmentDelayHours: 1.3, libraryCheckins: 3.8, routineVariance: 1.1 },
      { date: '2026-09-05', dayLabel: 'Day -18', lateNightMinutes: 35, assignmentDelayHours: 1.1, libraryCheckins: 3.2, routineVariance: 0.9 },
      { date: '2026-09-06', dayLabel: 'Day -17', lateNightMinutes: 40, assignmentDelayHours: 1.4, libraryCheckins: 3.6, routineVariance: 1.2 },
      { date: '2026-09-07', dayLabel: 'Day -16', lateNightMinutes: 34, assignmentDelayHours: 1.2, libraryCheckins: 3.4, routineVariance: 1.0 },
      { date: '2026-09-08', dayLabel: 'Day -15', lateNightMinutes: 36, assignmentDelayHours: 1.0, libraryCheckins: 3.7, routineVariance: 1.1 },
      { date: '2026-09-09', dayLabel: 'Day -14', lateNightMinutes: 33, assignmentDelayHours: 1.3, libraryCheckins: 3.5, routineVariance: 1.0 },
      { date: '2026-09-10', dayLabel: 'Day -13', lateNightMinutes: 37, assignmentDelayHours: 1.2, libraryCheckins: 3.3, routineVariance: 0.9 },
      { date: '2026-09-11', dayLabel: 'Day -12', lateNightMinutes: 35, assignmentDelayHours: 1.1, libraryCheckins: 3.6, routineVariance: 1.1 },
      { date: '2026-09-12', dayLabel: 'Day -11', lateNightMinutes: 36, assignmentDelayHours: 1.2, libraryCheckins: 3.4, routineVariance: 1.0 },
      { date: '2026-09-13', dayLabel: 'Day -10', lateNightMinutes: 34, assignmentDelayHours: 1.1, libraryCheckins: 3.5, routineVariance: 1.0 },
      { date: '2026-09-14', dayLabel: 'Day -9', lateNightMinutes: 45, assignmentDelayHours: 1.6, libraryCheckins: 3.1, routineVariance: 1.2 },
      { date: '2026-09-15', dayLabel: 'Day -8', lateNightMinutes: 48, assignmentDelayHours: 1.8, libraryCheckins: 2.9, routineVariance: 1.3 },
      { date: '2026-09-16', dayLabel: 'Day -7', lateNightMinutes: 52, assignmentDelayHours: 2.1, libraryCheckins: 2.7, routineVariance: 1.4 },
      { date: '2026-09-17', dayLabel: 'Day -6', lateNightMinutes: 55, assignmentDelayHours: 2.3, libraryCheckins: 2.5, routineVariance: 1.5 },
      { date: '2026-09-18', dayLabel: 'Day -5', lateNightMinutes: 58, assignmentDelayHours: 2.5, libraryCheckins: 2.3, routineVariance: 1.6 },
      { date: '2026-09-19', dayLabel: 'Day -4', lateNightMinutes: 60, assignmentDelayHours: 2.7, libraryCheckins: 2.1, routineVariance: 1.7 },
      { date: '2026-09-20', dayLabel: 'Day -3', lateNightMinutes: 62, assignmentDelayHours: 2.9, libraryCheckins: 1.9, routineVariance: 1.8 },
      { date: '2026-09-21', dayLabel: 'Day -2', lateNightMinutes: 65, assignmentDelayHours: 3.1, libraryCheckins: 1.8, routineVariance: 1.8 },
      { date: '2026-09-22', dayLabel: 'Day -1', lateNightMinutes: 68, assignmentDelayHours: 3.3, libraryCheckins: 1.7, routineVariance: 1.9 },
      { date: '2026-09-23', dayLabel: 'Today', lateNightMinutes: 70, assignmentDelayHours: 3.5, libraryCheckins: 1.6, routineVariance: 2.0 },
    ],
    needs_attention: [
      { date: '2026-09-03', dayLabel: 'Day -20', lateNightMinutes: 32, assignmentDelayHours: 1.0, libraryCheckins: 3.5, routineVariance: 1.0 },
      { date: '2026-09-04', dayLabel: 'Day -19', lateNightMinutes: 38, assignmentDelayHours: 1.3, libraryCheckins: 3.8, routineVariance: 1.1 },
      { date: '2026-09-05', dayLabel: 'Day -18', lateNightMinutes: 35, assignmentDelayHours: 1.1, libraryCheckins: 3.2, routineVariance: 0.9 },
      { date: '2026-09-06', dayLabel: 'Day -17', lateNightMinutes: 40, assignmentDelayHours: 1.4, libraryCheckins: 3.6, routineVariance: 1.2 },
      { date: '2026-09-07', dayLabel: 'Day -16', lateNightMinutes: 34, assignmentDelayHours: 1.2, libraryCheckins: 3.4, routineVariance: 1.0 },
      { date: '2026-09-08', dayLabel: 'Day -15', lateNightMinutes: 36, assignmentDelayHours: 1.0, libraryCheckins: 3.7, routineVariance: 1.1 },
      { date: '2026-09-09', dayLabel: 'Day -14', lateNightMinutes: 33, assignmentDelayHours: 1.3, libraryCheckins: 3.5, routineVariance: 1.0 },
      { date: '2026-09-10', dayLabel: 'Day -13', lateNightMinutes: 37, assignmentDelayHours: 1.2, libraryCheckins: 3.3, routineVariance: 0.9 },
      { date: '2026-09-11', dayLabel: 'Day -12', lateNightMinutes: 35, assignmentDelayHours: 1.1, libraryCheckins: 3.6, routineVariance: 1.1 },
      { date: '2026-09-12', dayLabel: 'Day -11', lateNightMinutes: 36, assignmentDelayHours: 1.2, libraryCheckins: 3.4, routineVariance: 1.0 },
      { date: '2026-09-13', dayLabel: 'Day -10', lateNightMinutes: 34, assignmentDelayHours: 1.1, libraryCheckins: 3.5, routineVariance: 1.0 },
      { date: '2026-09-14', dayLabel: 'Day -9', lateNightMinutes: 60, assignmentDelayHours: 2.8, libraryCheckins: 2.2, routineVariance: 1.6 },
      { date: '2026-09-15', dayLabel: 'Day -8', lateNightMinutes: 65, assignmentDelayHours: 3.2, libraryCheckins: 1.9, routineVariance: 1.8 },
      { date: '2026-09-16', dayLabel: 'Day -7', lateNightMinutes: 72, assignmentDelayHours: 3.7, libraryCheckins: 1.6, routineVariance: 2.0 },
      { date: '2026-09-17', dayLabel: 'Day -6', lateNightMinutes: 78, assignmentDelayHours: 4.2, libraryCheckins: 1.3, routineVariance: 2.2 },
      { date: '2026-09-18', dayLabel: 'Day -5', lateNightMinutes: 84, assignmentDelayHours: 4.8, libraryCheckins: 1.0, routineVariance: 2.4 },
      { date: '2026-09-19', dayLabel: 'Day -4', lateNightMinutes: 88, assignmentDelayHours: 5.2, libraryCheckins: 0.8, routineVariance: 2.5 },
      { date: '2026-09-20', dayLabel: 'Day -3', lateNightMinutes: 92, assignmentDelayHours: 5.7, libraryCheckins: 0.6, routineVariance: 2.6 },
      { date: '2026-09-21', dayLabel: 'Day -2', lateNightMinutes: 96, assignmentDelayHours: 6.1, libraryCheckins: 0.5, routineVariance: 2.7 },
      { date: '2026-09-22', dayLabel: 'Day -1', lateNightMinutes: 100, assignmentDelayHours: 6.5, libraryCheckins: 0.4, routineVariance: 2.8 },
      { date: '2026-09-23', dayLabel: 'Today', lateNightMinutes: 105, assignmentDelayHours: 7.0, libraryCheckins: 0.3, routineVariance: 2.9 },
    ],
  },
  timelineEvents: {
    stable: [
      { weekLabel: 'Week 1', title: 'Routine Baseline Established', description: 'Activity, library visits, and assignment submission times align with typical student routine.', severity: 'normal', metricsSummary: 'Avg 35m late activity • 1.2h submission delay' },
      { weekLabel: 'Week 2', title: 'Consistent Sleep & Study Window', description: 'Nightly screen times remain steady under 40 minutes.', severity: 'normal', metricsSummary: 'Avg 3.5 campus visits/wk • 1.0x routine variance' },
      { weekLabel: 'Week 3', title: 'Stable Academic Activity', description: 'Assignment submissions completed predictably within normal hours.', severity: 'normal', metricsSummary: 'Routine indicator: 1.0x (Baseline)' },
    ],
    changing: [
      { weekLabel: 'Week 1', title: 'Routine Baseline Established', description: 'Stable sleep windows and predictable assignment submission timing.', severity: 'normal', metricsSummary: '35m late nights • 1.2h submission delay' },
      { weekLabel: 'Week 2', title: 'Slight Late-Night Shift', description: 'Study activity extending past 1:00 AM on project submission days.', severity: 'noticeable', metricsSummary: 'Late nights +20m • Assignment delay +0.6h' },
      { weekLabel: 'Week 3', title: 'Moderate Task Delay & Variance', description: 'Submission timing variance increased; campus library check-ins decreased.', severity: 'noticeable', metricsSummary: '65m late nights • 3.1h submission delay' },
    ],
    needs_attention: [
      { weekLabel: 'Week 1', title: 'Normal Baseline Pattern', description: 'Consistent study schedule and regular campus involvement.', severity: 'normal', metricsSummary: '35m late nights • 1.2h submission delay' },
      { weekLabel: 'Week 2', title: 'Noticeable Schedule Shift', description: 'Significant increase in late-night activity (+35 min) and assignment delays.', severity: 'noticeable', metricsSummary: '72m late nights • 3.7h submission delay' },
      { weekLabel: 'Week 3', title: 'Significant Routine Drift', description: 'Substantial late-night study spikes and reduced library check-ins over 7 consecutive days.', severity: 'elevated', metricsSummary: '100m late nights • 6.5h submission delay (2.9x variance)' },
    ],
  },
};

/**
 * Calculates routine trend indicator score deterministically given baseline & recent window inputs.
 * Formula: 0.35 * dev_late + 0.30 * dev_delay + 0.20 * dev_library + 0.15 * dev_variance
 */
export function calculateCounterfactualScore(
  lateNightMinutes: number,
  assignmentDelayHours: number,
  libraryCheckins: number,
  routineVariance: number,
  baseline = DEMO_STUDENT_SCENARIO.baseline
) {
  const dev_late = lateNightMinutes / baseline.avgLateNightMinutes;
  const dev_delay = assignmentDelayHours / baseline.avgAssignmentDelayHours;
  const dev_library = baseline.avgLibraryCheckins / (libraryCheckins > 0 ? libraryCheckins : 0.1);
  const dev_variance = routineVariance / baseline.avgRoutineVariance;

  const score = 0.35 * dev_late + 0.30 * dev_delay + 0.20 * dev_library + 0.15 * dev_variance;
  const percentageShift = Math.max(0, Math.round((score - 1.0) * 100));

  let state: 'stable' | 'changing' | 'needs_attention' = 'stable';
  if (score >= 1.45) {
    state = 'needs_attention';
  } else if (score >= 1.15) {
    state = 'changing';
  }

  return {
    score: Number(score.toFixed(2)),
    percentageShift,
    state,
    dev_late: Number(dev_late.toFixed(2)),
    dev_delay: Number(dev_delay.toFixed(2)),
    dev_library: Number(dev_library.toFixed(2)),
    dev_variance: Number(dev_variance.toFixed(2)),
  };
}

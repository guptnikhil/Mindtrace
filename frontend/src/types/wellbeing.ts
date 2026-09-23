export type View =
  | 'welcome'
  | 'consent'
  | 'onboarding'
  | 'checkin'
  | 'assessment'
  | 'dashboard'
  | 'history'
  | 'nudges'
  | 'reset'
  | 'support'
  | 'analytics'
  | 'settings'
  | 'counsellor'
  | 'institution_login'
  | 'institution_dashboard'
  | 'resources';

export type DemoState = 'stable' | 'changing' | 'needs_attention';
export type Tone = 'gentle' | 'balanced' | 'direct';

export interface Student {
  id: string;
  student_identifier: string;
  name: string;
  branch: string;
  year: number;
  created_at: string;
  updated_at: string;
  consent_given?: boolean;
  onboarding_complete?: boolean;
  tone?: Tone;
  selected_concerns?: string[];
  routine_preferences?: {
    sleep_window?: string;
    study_consistency?: string;
    deadline_impact?: string;
  };
  academic_context?: string;
}

export interface RoutineQuestData {
  studentName: string;
  branch: string;
  year: number;
  concerns: string[];
  noticeableChangeChips: string[];
  changeSeverityLevel: number;
  sleepWindow: string;
  studyConsistency: string;
  deadlineDisruption: string;
  academicContext: string;
  consentUnderstood: boolean;
}

export interface Counsellor {
  id: string;
  name: string;
  role: string;
  active: boolean;
  phone_number?: string;
}

export interface AvailabilitySlot {
  id: string;
  counsellor_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface Appointment {
  id: string;
  student_id: string;
  counsellor_id: string;
  counsellor_name: string;
  counsellor_role: string;
  scheduled_at: string;
  duration_minutes: number;
  status: 'scheduled' | 'rescheduled' | 'cancelled' | 'completed';
  meeting_link?: string;
  whatsapp_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Checkin {
  id: string;
  student_id: string;
  mood: number;
  energy_level: number;
  stress_level: number;
  sleep_hours: number;
  academic_pressure: number;
  optional_note?: string | null;
  created_at: string;
}

export interface CheckinCreatePayload {
  student_id: string;
  mood: number;
  energy_level: number;
  stress_level: number;
  sleep_hours: number;
  academic_pressure: number;
  optional_note?: string;
}

export interface WellbeingAssessment {
  id?: string;
  student_id: string;
  risk_level: 'low' | 'moderate' | 'high';
  risk_score: number;
  contributing_factors: string[];
  recommendations: string[];
  explanation: string;
  created_at?: string;
}

export interface Nudge {
  id: string;
  student_id: string;
  category: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  completed_at?: string | null;
  helpful?: boolean;
  body?: string;
  action_label?: string;
}

export interface AnalyticsOverview {
  total_students: number;
  total_checkins: number;
  risk_distribution: {
    low: number;
    moderate: number;
    high: number;
  };
}

export interface AISummary {
  student_id: string;
  summary: string;
  key_observations: string[];
  suggested_focus: string;
}

export interface Factor {
  name: string;
  detail: string;
  status: string;
  icon: string;
}

export interface BehaviorSignal {
  date: string;
  val?: number;
  routine_variance?: number;
}

export interface TrendState {
  state: DemoState;
  score?: number;
  percentage_change?: number;
  factors: Factor[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  safety_state?: 'normal' | 'crisis';
}

export interface AdminUser {
  access_token: string;
  role: 'COLLEGE_ADMIN' | 'COUNSELLOR';
  name: string;
  institution_name: string;
}

export interface InstitutionalOverview {
  eligible_students: number;
  opted_in_students: number;
  active_students: number;
  counselling_requests: number;
  completed_sessions: number;
  nudge_engagement_rate: number;
  demo_mode: boolean;
  institution_name: string;
}

export interface AdoptionFunnel {
  eligible: number;
  opted_in: number;
  onboarded: number;
  active_monthly: number;
  active_weekly: number;
  opt_in_rate: number;
  onboarding_completion_rate: number;
}

export interface CohortBreakdown {
  year: string;
  opted_in_count: number;
  active_count: number;
  counselling_requests: number;
  privacy_masked: boolean;
  message?: string | null;
}

export interface SupportAnalytics {
  total_requests: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  whatsapp_handoffs: number;
  reminder_confirmations: number;
  utilization_rate: number;
}

export interface EngagementMetrics {
  feature_usage: Record<string, number>;
  nudge_feedback: Record<string, number>;
}

export interface InstitutionalReport {
  institution_name: string;
  report_date: string;
  eligible_population: number;
  opt_in_rate: number;
  active_monthly: number;
  counselling_utilization: number;
  top_student_concerns: Array<{ concern: string; percentage: number }>;
  nudge_helpfulness_rate: number;
  privacy_declaration: string;
}

export type ResourceCategory = 'quick_action' | 'breathing' | 'meditation' | 'education' | 'sounds';
export type ResourceIntent = 'calm' | 'clear_mind' | 'sleep' | 'focus' | 'support';

export interface BreathingPhase {
  name: 'INHALE' | 'HOLD' | 'EXHALE';
  durationSeconds: number;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: ResourceCategory;
  description: string;
  duration?: string;
  badge?: string;
  type: 'audio' | 'breathing' | 'article';
  intentTags: ResourceIntent[];
  isFeatured?: boolean;
  content?: {
    readingTime: string;
    sections: Array<{ heading: string; body: string }>;
    keyTakeaways: string[];
  };
  breathingPattern?: {
    phases: BreathingPhase[];
    cycles: number;
  };
}

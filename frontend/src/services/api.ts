import axios from 'axios';
import type {
  Student,
  Checkin,
  CheckinCreatePayload,
  WellbeingAssessment,
  Nudge,
  AnalyticsOverview,
  AISummary,
  Counsellor,
  AvailabilitySlot,
  Appointment,
  ChatMessage,
  AdminUser,
  InstitutionalOverview,
  AdoptionFunnel,
  CohortBreakdown,
  SupportAnalytics,
  EngagementMetrics,
  InstitutionalReport,
} from '../types/wellbeing';

const isBrowser = typeof window !== 'undefined';
const isLocalhost = isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// When deployed on Vercel or any non-localhost domain, always use relative '/api'
// so all requests pass through the same-origin Vercel edge proxy rewrite (vercel.json).
// This eliminates browser CORS preflight errors completely.
const API_BASE_URL = isBrowser && !isLocalhost 
  ? '/api' 
  : (import.meta.env.VITE_API_BASE_URL || '/api');

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

export const StudentService = {
  createStudent: async (student_identifier: string, name: string, branch?: string, year?: number): Promise<Student> => {
    const res = await apiClient.post<Student>('/students', { student_identifier, name, branch, year });
    return res.data;
  },

  getStudent: async (studentId: string): Promise<Student> => {
    const res = await apiClient.get<Student>(`/students/${studentId}`);
    return res.data;
  },

  listStudents: async (): Promise<Student[]> => {
    const res = await apiClient.get<Student[]>('/students');
    return res.data;
  },
};

export const CheckinService = {
  submitCheckin: async (payload: CheckinCreatePayload): Promise<Checkin> => {
    const res = await apiClient.post<Checkin>('/checkins', payload);
    return res.data;
  },

  getCheckins: async (studentId: string): Promise<Checkin[]> => {
    const res = await apiClient.get<Checkin[]>(`/checkins/${studentId}`);
    return res.data;
  },
};

export const WellbeingService = {
  analyzeWellbeing: async (
    studentId: string,
    params?: Partial<CheckinCreatePayload>
  ): Promise<WellbeingAssessment> => {
    const res = await apiClient.post<WellbeingAssessment>('/wellbeing/analyze', {
      student_id: studentId,
      ...params,
    });
    return res.data;
  },
};

export const NudgeService = {
  getNudges: async (studentId: string): Promise<Nudge[]> => {
    const res = await apiClient.get<Nudge[]>(`/nudges/${studentId}`);
    return res.data;
  },

  generateNudge: async (studentId: string): Promise<Nudge> => {
    const res = await apiClient.post<Nudge>(`/nudges/${studentId}/generate`);
    return res.data;
  },
};

export const AnalyticsService = {
  getAnalytics: async (): Promise<AnalyticsOverview> => {
    const res = await apiClient.get<AnalyticsOverview>('/analytics/overview');
    return res.data;
  },
};

export const AIService = {
  getSummary: async (studentId: string): Promise<AISummary> => {
    const res = await apiClient.post<AISummary>('/ai/summary', { student_id: studentId });
    return res.data;
  },
};

export const CounsellingService = {
  listCounsellors: async (): Promise<Counsellor[]> => {
    const res = await apiClient.get<Counsellor[]>('/counsellors');
    return res.data;
  },

  getAvailability: async (counsellorId: string, date?: string): Promise<AvailabilitySlot[]> => {
    const query = date ? `?date=${encodeURIComponent(date)}` : '';
    const res = await apiClient.get<AvailabilitySlot[]>(`/counsellors/${counsellorId}/availability${query}`);
    return res.data;
  },

  bookAppointment: async (
    studentId: string,
    counsellorId: string,
    availabilityId: string,
    durationMinutes: number = 15
  ): Promise<Appointment> => {
    const res = await apiClient.post<Appointment>('/appointments', {
      student_id: studentId,
      counsellor_id: counsellorId,
      availability_id: availabilityId,
      duration_minutes: durationMinutes,
    });
    return res.data;
  },

  getStudentAppointments: async (studentId: string): Promise<Appointment[]> => {
    const res = await apiClient.get<Appointment[]>(`/appointments?student_id=${studentId}`);
    return res.data;
  },

  rescheduleAppointment: async (appointmentId: string, newAvailabilityId: string): Promise<Appointment> => {
    const res = await apiClient.patch<Appointment>(`/appointments/${appointmentId}`, {
      new_availability_id: newAvailabilityId,
    });
    return res.data;
  },

  cancelAppointment: async (appointmentId: string): Promise<Appointment> => {
    const res = await apiClient.delete<Appointment>(`/appointments/${appointmentId}`);
    return res.data;
  },
};

export const ChatService = {
  sendChatMessage: async (
    message: string,
    conversationId: string = 'default',
    history: ChatMessage[] = []
  ): Promise<{ message: string; conversation_id: string; safety_state: 'normal' | 'crisis' }> => {
    const formattedHistory = history.map((h) => ({
      role: h.role,
      content: h.content,
    }));
    const res = await apiClient.post<{ message: string; conversation_id: string; safety_state: 'normal' | 'crisis' }>(
      '/chat',
      {
        message,
        conversation_id: conversationId,
        history: formattedHistory,
      }
    );
    return res.data;
  },
};

export const InstitutionService = {
  loginAdmin: async (email: string, password: string): Promise<AdminUser> => {
    const res = await apiClient.post<AdminUser>('/institution/login', { email, password });
    if (res.data.access_token) {
      localStorage.setItem('admin_access_token', res.data.access_token);
      localStorage.setItem('admin_role', res.data.role);
    }
    return res.data;
  },

  getOverview: async (): Promise<InstitutionalOverview> => {
    const token = localStorage.getItem('admin_access_token') || 'token_admin_rkgit_college_admin_9921';
    const res = await apiClient.get<InstitutionalOverview>('/institution/overview', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getAdoption: async (): Promise<AdoptionFunnel> => {
    const token = localStorage.getItem('admin_access_token') || 'token_admin_rkgit_college_admin_9921';
    const res = await apiClient.get<AdoptionFunnel>('/institution/adoption', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getCohorts: async (year: string = 'All'): Promise<CohortBreakdown[]> => {
    const token = localStorage.getItem('admin_access_token') || 'token_admin_rkgit_college_admin_9921';
    const res = await apiClient.get<CohortBreakdown[]>(`/institution/cohorts?year=${encodeURIComponent(year)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getSupport: async (): Promise<SupportAnalytics> => {
    const token = localStorage.getItem('admin_access_token') || 'token_admin_rkgit_college_admin_9921';
    const res = await apiClient.get<SupportAnalytics>('/institution/support', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getEngagement: async (): Promise<EngagementMetrics> => {
    const token = localStorage.getItem('admin_access_token') || 'token_admin_rkgit_college_admin_9921';
    const res = await apiClient.get<EngagementMetrics>('/institution/engagement', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  getReport: async (): Promise<InstitutionalReport> => {
    const token = localStorage.getItem('admin_access_token') || 'token_admin_rkgit_college_admin_9921';
    const res = await apiClient.get<InstitutionalReport>('/institution/report', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};


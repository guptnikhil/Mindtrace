import { useState, useEffect } from 'react';
import type { View, Student, WellbeingAssessment } from './types/wellbeing';
import { AppLayout } from './layouts/AppLayout';
import { WelcomePage } from './pages/WelcomePage';
import { ConsentPage } from './pages/ConsentPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { CheckinPage } from './pages/CheckinPage';
import { AssessmentResultPage } from './pages/AssessmentResultPage';
import { DashboardPage } from './pages/DashboardPage';
import { HistoryPage } from './pages/HistoryPage';
import { NudgesPage } from './pages/NudgesPage';
import { SupportPage } from './pages/SupportPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ResetPage } from './pages/ResetPage';
import { CounsellorConnectPage } from './components/counselling/CounsellorConnectPage';
import { InstitutionLoginPage } from './pages/InstitutionLoginPage';
import { InstitutionDashboardPage } from './pages/InstitutionDashboardPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { StudentService } from './services/api';

const VALID_VIEWS: View[] = [
  'welcome',
  'consent',
  'onboarding',
  'checkin',
  'assessment',
  'dashboard',
  'history',
  'nudges',
  'resources',
  'support',
  'analytics',
  'settings',
  'reset',
  'counsellor',
  'institution_login',
  'institution_dashboard',
];

const getInitialView = (): View => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '') as View;
    if (hash && VALID_VIEWS.includes(hash)) {
      return hash;
    }
    const saved = localStorage.getItem('mindtrace_current_view') as View;
    if (saved && VALID_VIEWS.includes(saved)) {
      return saved;
    }
  }
  return 'welcome';
};

export function App() {
  const [view, setView] = useState<View>(getInitialView);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(() => {
    try {
      const cached = localStorage.getItem('mindtrace_student_profile');
      if (cached) return JSON.parse(cached);
      const savedId = localStorage.getItem('wellbeing_student_id');
      if (savedId) {
        return {
          id: savedId,
          student_identifier: 'RIYA-CSE-03',
          name: 'Riya Sharma',
          branch: 'Computer Science',
          year: 3,
          tone: 'balanced',
          consent_given: true,
          onboarding_complete: true,
          created_at: new Date().toISOString(),
        };
      }
    } catch {
      // fallback
    }
    return null;
  });
  const [latestAssessment, setLatestAssessment] = useState<WellbeingAssessment | null>(null);

  const navigateTo = (newView: View) => {
    setView(newView);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mindtrace_current_view', newView);
      window.location.hash = newView;
    }
  };

  // Sync hash back/forward history navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') as View;
      if (hash && VALID_VIEWS.includes(hash) && hash !== view) {
        setView(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [view]);

  // Background fetch student on app load (without blocking initial render)
  useEffect(() => {
    const savedStudentId = localStorage.getItem('wellbeing_student_id');
    if (savedStudentId) {
      StudentService.getStudent(savedStudentId)
        .then((stu) => {
          if (stu) {
            setCurrentStudent(stu);
            localStorage.setItem('mindtrace_student_profile', JSON.stringify(stu));
          }
        })
        .catch(() => {
          // Keep existing cached student profile if backend has transient issue
        });
    } else {
      // Auto-fetch default demo student if available
      StudentService.listStudents()
        .then((students) => {
          if (students && students.length > 0) {
            setCurrentStudent(students[0]);
            localStorage.setItem('wellbeing_student_id', students[0].id);
            localStorage.setItem('mindtrace_student_profile', JSON.stringify(students[0]));
          }
        })
        .catch((err) => console.log('No backend students found yet:', err));
    }
  }, []);

  const handleOnboardingComplete = (student: Student) => {
    setCurrentStudent(student);
    localStorage.setItem('wellbeing_student_id', student.id);
    localStorage.setItem('mindtrace_student_profile', JSON.stringify(student));
    navigateTo('checkin');
  };

  const studentId = currentStudent?.id || '';

  return (
    <AppLayout currentView={view} navigate={navigateTo}>
      {view === 'welcome' && (
        <WelcomePage 
          onStart={() => currentStudent ? navigateTo('dashboard') : navigateTo('consent')} 
          onPrivacy={() => navigateTo('consent')}
          onGoToDashboard={() => navigateTo('dashboard')}
          hasStudentProfile={Boolean(currentStudent)}
        />
      )}
      {view === 'consent' && (
        <ConsentPage onContinue={() => navigateTo('onboarding')} onBack={() => navigateTo('welcome')} />
      )}
      {view === 'onboarding' && (
        <OnboardingPage onComplete={handleOnboardingComplete} onBack={() => navigateTo('consent')} />
      )}
      {view === 'checkin' && (
        <CheckinPage
          studentId={studentId}
          navigate={navigateTo}
          onAssessmentComplete={setLatestAssessment}
        />
      )}
      {view === 'assessment' && (
        <AssessmentResultPage assessment={latestAssessment} navigate={navigateTo} />
      )}
      {view === 'dashboard' && <DashboardPage studentId={studentId} navigate={navigateTo} />}
      {view === 'history' && <HistoryPage studentId={studentId} navigate={navigateTo} />}
      {view === 'nudges' && <NudgesPage studentId={studentId} navigate={navigateTo} />}
      {view === 'resources' && <ResourcesPage navigate={navigateTo} />}
      {view === 'support' && <SupportPage navigate={navigateTo} />}
      {view === 'analytics' && <AnalyticsPage navigate={navigateTo} />}
      {view === 'settings' && <SettingsPage navigate={navigateTo} />}
      {view === 'reset' && <ResetPage navigate={navigateTo} />}
      {view === 'counsellor' && (
        <CounsellorConnectPage
          student={currentStudent}
          onNavigateDashboard={() => navigateTo('dashboard')}
          onAppointmentBooked={() => navigateTo('dashboard')}
        />
      )}
      {view === 'institution_login' && (
        <InstitutionLoginPage
          navigate={navigateTo}
          onLoginSuccess={() => navigateTo('institution_dashboard')}
        />
      )}
      {view === 'institution_dashboard' && (
        <InstitutionDashboardPage
          onLogout={() => {
            localStorage.removeItem('admin_access_token');
            localStorage.removeItem('admin_role');
            navigateTo('institution_login');
          }}
        />
      )}
    </AppLayout>
  );
}

export default App;

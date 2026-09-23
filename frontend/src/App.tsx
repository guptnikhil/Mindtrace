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

export function App() {
  const [view, setView] = useState<View>('welcome');
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [latestAssessment, setLatestAssessment] = useState<WellbeingAssessment | null>(null);

  // Initialize or fetch student on app load
  useEffect(() => {
    const savedStudentId = localStorage.getItem('wellbeing_student_id');
    if (savedStudentId) {
      StudentService.getStudent(savedStudentId)
        .then((stu) => {
          setCurrentStudent(stu);
          setView('dashboard');
        })
        .catch(() => {
          localStorage.removeItem('wellbeing_student_id');
        });
    } else {
      // Auto-fetch or list default student if available in backend DB
      StudentService.listStudents()
        .then((students) => {
          if (students && students.length > 0) {
            setCurrentStudent(students[0]);
            localStorage.setItem('wellbeing_student_id', students[0].id);
          }
        })
        .catch((err) => console.log('No backend students found yet:', err));
    }
  }, []);

  const handleOnboardingComplete = (student: Student) => {
    setCurrentStudent(student);
    localStorage.setItem('wellbeing_student_id', student.id);
    setView('checkin');
  };

  const studentId = currentStudent?.id || '';

  return (
    <AppLayout currentView={view} navigate={setView}>
      {view === 'welcome' && (
        <WelcomePage onStart={() => setView('consent')} onPrivacy={() => setView('consent')} />
      )}
      {view === 'consent' && (
        <ConsentPage onContinue={() => setView('onboarding')} onBack={() => setView('welcome')} />
      )}
      {view === 'onboarding' && (
        <OnboardingPage onComplete={handleOnboardingComplete} onBack={() => setView('consent')} />
      )}
      {view === 'checkin' && (
        <CheckinPage
          studentId={studentId}
          navigate={setView}
          onAssessmentComplete={setLatestAssessment}
        />
      )}
      {view === 'assessment' && (
        <AssessmentResultPage assessment={latestAssessment} navigate={setView} />
      )}
      {view === 'dashboard' && <DashboardPage studentId={studentId} navigate={setView} />}
      {view === 'history' && <HistoryPage studentId={studentId} navigate={setView} />}
      {view === 'nudges' && <NudgesPage studentId={studentId} navigate={setView} />}
      {view === 'resources' && <ResourcesPage navigate={setView} />}
      {view === 'support' && <SupportPage navigate={setView} />}
      {view === 'analytics' && <AnalyticsPage navigate={setView} />}
      {view === 'settings' && <SettingsPage navigate={setView} />}
      {view === 'reset' && <ResetPage navigate={setView} />}
      {view === 'counsellor' && (
        <CounsellorConnectPage
          student={currentStudent}
          onNavigateDashboard={() => setView('dashboard')}
          onAppointmentBooked={() => setView('dashboard')}
        />
      )}
      {view === 'institution_login' && (
        <InstitutionLoginPage
          navigate={setView}
          onLoginSuccess={() => setView('institution_dashboard')}
        />
      )}
      {view === 'institution_dashboard' && (
        <InstitutionDashboardPage
          onLogout={() => {
            localStorage.removeItem('admin_access_token');
            localStorage.removeItem('admin_role');
            setView('institution_login');
          }}
        />
      )}
    </AppLayout>
  );
}

export default App;

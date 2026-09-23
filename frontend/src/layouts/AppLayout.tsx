import React from 'react';
import type { View } from '../types/wellbeing';
import { Header } from '../components/common/Header';
import { MobileNav } from '../components/common/MobileNav';
import { ThemeProvider } from '../context/ThemeContext';

interface AppLayoutProps {
  currentView: View;
  navigate: (view: View) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentView,
  navigate,
  children,
}) => {
  const showNav = currentView !== 'welcome' && currentView !== 'consent' && currentView !== 'onboarding';

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-[#fafaf8] text-[#1f2d2a] dark:bg-[#121e1b] dark:text-[#e2ece8] transition-colors duration-200">
        {showNav && (
          <Header currentView={currentView} navigate={navigate} />
        )}

        <main className={showNav ? 'pb-24 lg:pb-8' : ''}>{children}</main>

        {showNav && <MobileNav currentView={currentView} navigate={navigate} />}
      </div>
    </ThemeProvider>
  );
};

import React from 'react';
import { Menu, Sun, Moon } from 'lucide-react';
import { Brand } from './Brand';
import type { View } from '../../types/wellbeing';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  currentView: View;
  navigate: (view: View) => void;
}

const navItems: { view: View; label: string }[] = [
  { view: 'dashboard', label: 'Home' },
  { view: 'checkin', label: 'Check-in' },
  { view: 'nudges', label: 'Nudges' },
  { view: 'resources', label: 'Resources' },
  { view: 'history', label: 'History' },
  { view: 'support', label: 'Support' },
  { view: 'institution_login', label: 'Institutional Portal' },
];

export const Header: React.FC<HeaderProps> = ({ currentView, navigate }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-[#e8eeeb] bg-[#fafaf8]/90 backdrop-blur-md dark:border-[#203630] dark:bg-[#121e1b]/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
        <button onClick={() => navigate('dashboard')} className="text-left cursor-pointer" aria-label="Go to dashboard">
          <Brand />
        </button>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => navigate(item.view)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors cursor-pointer ${
                currentView === item.view
                  ? 'bg-[#eaf3ef] text-[#2f6f64] dark:bg-[#1f3831] dark:text-[#6ec4b2]'
                  : 'text-[#6d8580] hover:bg-[#f0f5f2] hover:text-[#365a52] dark:text-[#a1b8b2] dark:hover:bg-[#1a2c27] dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex size-9 items-center justify-center rounded-lg border border-[#dfe9e5] bg-white text-[#648078] transition-colors hover:bg-[#f0f6f3] dark:border-[#26423a] dark:bg-[#182824] dark:text-[#a0b6af] dark:hover:bg-[#203630] cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={18} className="text-[#e2b778]" /> : <Moon size={18} className="text-[#48675f]" />}
          </button>

          <button
            onClick={() => navigate('settings')}
            className="flex size-9 items-center justify-center rounded-lg border border-[#dfe9e5] bg-white text-[#648078] transition-colors hover:bg-[#f0f6f3] dark:border-[#26423a] dark:bg-[#182824] dark:text-[#a0b6af] dark:hover:bg-[#203630] cursor-pointer"
            aria-label="Open settings"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
};

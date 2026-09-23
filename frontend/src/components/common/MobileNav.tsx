import React from 'react';
import { Home, ClipboardCheck, Bell, Leaf, History, HeartHandshake, Sun, Moon } from 'lucide-react';
import type { View } from '../../types/wellbeing';
import { useTheme } from '../../context/ThemeContext';

interface MobileNavProps {
  currentView: View;
  navigate: (view: View) => void;
}

const items: { view: View; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { view: 'dashboard', label: 'Home', icon: Home },
  { view: 'checkin', label: 'Check-in', icon: ClipboardCheck },
  { view: 'nudges', label: 'Nudges', icon: Bell },
  { view: 'resources', label: 'Resources', icon: Leaf },
  { view: 'history', label: 'History', icon: History },
  { view: 'support', label: 'Support', icon: HeartHandshake },
];

export const MobileNav: React.FC<MobileNavProps> = ({ currentView, navigate }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-[#e4ece8] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 shadow-[0_-6px_25px_rgba(40,70,60,0.06)] backdrop-blur-md dark:border-[#203630] dark:bg-[#121e1b]/95 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {items.map(({ view, label, icon: Icon }) => {
          const isActive = currentView === view;
          return (
            <button
              key={view}
              onClick={() => navigate(view)}
              className={`flex min-w-12 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'text-[#2f6f64] dark:text-[#6ec4b2]'
                  : 'text-[#91a19d] dark:text-[#7d9690] hover:text-[#2f6f64] dark:hover:text-[#6ec4b2]'
              }`}
              aria-label={label}
            >
              <Icon size={19} strokeWidth={isActive ? 2.4 : 1.8} />
              <span>{label}</span>
            </button>
          );
        })}

        <button
          onClick={toggleTheme}
          className="flex min-w-12 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[10px] font-medium text-[#91a19d] dark:text-[#7d9690] transition-colors cursor-pointer"
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? <Sun size={19} className="text-[#e2b778]" /> : <Moon size={19} className="text-[#48675f]" />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </nav>
  );
};

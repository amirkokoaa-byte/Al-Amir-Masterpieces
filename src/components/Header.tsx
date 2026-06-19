import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun, Radio, Menu, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenMenu?: () => void;
  onOpenSettings?: () => void;
}

export function Header({ onOpenMenu, onOpenSettings }: HeaderProps) {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <header className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl sticky top-0 z-40 border-b border-gray-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {onOpenMenu && (
            <button 
              onClick={onOpenMenu}
              className="p-2 rounded-lg hover:bg-white/60 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 ml-2 shadow-sm border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
            <Radio className="w-8 h-8 text-blue-500" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white font-sans tracking-tight">روائع الأمير <span className="text-blue-500 font-medium">للقرآن والسُنّة</span></h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {onOpenSettings && (
            <button 
              onClick={onOpenSettings}
              className="p-2 rounded-full hover:bg-white/60 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 transition-colors shadow-sm border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
              title="إعدادات الإدارة"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-white/60 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-300 transition-colors shadow-sm border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
            title="تغيير المظهر"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}

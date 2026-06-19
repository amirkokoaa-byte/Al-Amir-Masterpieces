import React, { useEffect } from 'react';
import { RadioTower, Heart, BellRing, Mic2, BookOpen, Clock, Library, Compass, Leaf, X, BookText, PlaySquare } from 'lucide-react';

interface Props {
  activeTab: 'all' | 'reciters' | 'quran_read' | 'quran_tafsir' | 'prayers' | 'favorites' | 'alerts' | 'books' | 'prayer_guide' | 'herbs' | 'shorts';
  onChange: (tab: 'all' | 'reciters' | 'quran_read' | 'quran_tafsir' | 'prayers' | 'favorites' | 'alerts' | 'books' | 'prayer_guide' | 'herbs' | 'shorts') => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Navigation({ activeTab, onChange, isOpen, onClose }: Props) {
  const tabs = [
    { id: 'all', label: 'الإذاعات', icon: RadioTower },
    { id: 'reciters', label: 'تلاوات وقراء', icon: Mic2 },
    { id: 'quran_read', label: 'القرآن الكريم', icon: BookOpen },
    { id: 'quran_tafsir', label: 'تفسير القرآن', icon: BookText },
    { id: 'shorts', label: 'ريلز إسلامية', icon: PlaySquare },
    { id: 'prayers', label: 'مواقيت الصلاة', icon: Clock },
    { id: 'books', label: 'مكتبة إسلامية', icon: Library },
    { id: 'prayer_guide', label: 'دليل الصلوات الشامل', icon: Compass },
    { id: 'herbs', label: 'الأعشاب النبوية', icon: Leaf },
    { id: 'favorites', label: 'المفضلة', icon: Heart },
    { id: 'alerts', label: 'التنبيهات', icon: BellRing },
  ] as const;

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className={`fixed right-0 top-0 bottom-0 w-[280px] bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl border-l border-white/40 dark:border-slate-700/50 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between border-b border-gray-200/50 dark:border-slate-800/50">
          <h2 className="font-bold text-lg text-slate-800 dark:text-slate-100">القائمة الرئيسية</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors text-slate-600 dark:text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === (tab.id as any);
            return (
              <button
                key={tab.id}
                onClick={() => onChange(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isActive 
                    ? 'bg-transparent text-blue-600 dark:text-blue-400 border border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                    : 'bg-transparent text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

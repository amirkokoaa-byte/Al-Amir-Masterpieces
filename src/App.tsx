import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { PlayerProvider } from './context/PlayerContext';
import { FavoritesProvider, useFavoritesContext } from './context/FavoritesContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { StationsList } from './components/StationsList';
import { QuranRecitersList } from './components/QuranRecitersList';
import { AudioPlayer } from './components/AudioPlayer';
import { AlertsManager } from './components/AlertsManager';
import { StationCard } from './components/StationCard';
import { QuranReader } from './components/QuranReader';
import { PrayerTimes } from './components/PrayerTimes';
import { BooksLibrary } from './components/BooksLibrary';
import { PrayerGuide } from './components/PrayerGuide';
import { PropheticHerbs } from './components/PropheticHerbs';
import { IslamicShorts } from './components/IslamicShorts';
import { useAzkarAlerts } from './hooks/useAzkar';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<'all' | 'reciters' | 'quran_read' | 'quran_tafsir' | 'prayers' | 'favorites' | 'alerts' | 'books' | 'prayer_guide' | 'herbs' | 'shorts'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { favorites } = useFavoritesContext();
  
  // Call it here to keep interval running when app mounts
  useAzkarAlerts();

  return (
    <div className="min-h-screen pb-32">
      <Header onOpenMenu={() => setIsSidebarOpen(true)} />
      
      <main className="max-w-7xl mx-auto px-4 py-8 relative">
        {/* Background decorative glowing orbs (Grey/Blue tone for Windows 10) */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-slate-400/20 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-400/10 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        
        <Navigation 
          activeTab={activeTab} 
          onChange={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
        />
        
        <div className="mt-4 transition-all relative z-10 w-full animate-in fade-in duration-500">
          {activeTab === 'all' && <StationsList />}
          {activeTab === 'reciters' && <QuranRecitersList />}
          {activeTab === 'quran_read' && <QuranReader viewMode="read" />}
          {activeTab === 'quran_tafsir' && <QuranReader viewMode="tafsir" />}
          {activeTab === 'shorts' && <IslamicShorts />}
          {activeTab === 'prayers' && <PrayerTimes />}
          {activeTab === 'books' && <BooksLibrary />}
          {activeTab === 'prayer_guide' && <PrayerGuide />}
          {activeTab === 'herbs' && <PropheticHerbs />}
          {activeTab === 'favorites' && (
            <div className="w-full">
              {favorites.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-slate-400 glass-panel glow-hover">
                  لم تقم بإضافة أي إذاعة للمفضلة بعد
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map(station => (
                     <StationCard key={station.stationuuid} station={station} />
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === 'alerts' && <AlertsManager />}
        </div>
      </main>

      <div className="pb-36 pt-10 text-center text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wide select-none drop-shadow-sm opacity-80 hover:opacity-100 transition-opacity">
         مع تحيات المطور Amir Lamay
      </div>

      <AudioPlayer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <PlayerProvider>
          <MainLayout />
        </PlayerProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
}



import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Station } from '../types';

interface PlayerContextType {
  currentStation: Station | null;
  isPlaying: boolean;
  volume: number;
  quality: 'high' | 'low';
  sleepTimerHours: number;
  sleepTimerMinutes: number;
  sleepTimerActive: boolean;
  isBuffering: boolean;
  playStation: (station: Station) => void;
  togglePlayPause: () => void;
  setVolume: (v: number) => void;
  setQuality: (q: 'high' | 'low') => void;
  startSleepTimer: (hours: number, minutes: number) => void;
  cancelSleepTimer: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [quality, setQuality] = useState<'high' | 'low'>('high');
  const [isBuffering, setIsBuffering] = useState(false);
  
  const [sleepTimerActive, setSleepTimerActive] = useState(false);
  const [sleepTimerHours, setSleepTimerHours] = useState(0);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const savedVol = localStorage.getItem('radio_volume');
    if (savedVol) setVolume(parseFloat(savedVol));
    const savedQual = localStorage.getItem('radio_quality');
    if (savedQual === 'high' || savedQual === 'low') setQuality(savedQual);
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle station change explicit play
  useEffect(() => {
    if (currentStation && audioRef.current) {
      setIsBuffering(true);
      audioRef.current.play().catch(e => {
        console.error("Play error on station change:", e);
        setIsPlaying(false);
        setIsBuffering(false);
        alert("عذراً، هذا البث لا يعمل حالياً. قد يكون متوقفاً أو غير متوافق.");
      });
    }
  }, [currentStation]);

  const playStation = (station: Station) => {
    if (currentStation?.stationuuid === station.stationuuid) {
      togglePlayPause();
      return;
    }
    setCurrentStation(station);
    setIsPlaying(true);
    setIsBuffering(true);
  };

  const togglePlayPause = () => {
    if (!currentStation || !audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsBuffering(true);
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(e => {
        console.error("Play error:", e);
        setIsBuffering(false);
        setIsPlaying(false);
      });
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    localStorage.setItem('radio_volume', v.toString());
  };

  const handleQualityChange = (q: 'high' | 'low') => {
    setQuality(q);
    localStorage.setItem('radio_quality', q);
  };

  const startSleepTimer = (hours: number, minutes: number) => {
    cancelSleepTimer();
    const totalMs = (hours * 3600 + minutes * 60) * 1000;
    if (totalMs <= 0) return;
    
    setSleepTimerHours(hours);
    setSleepTimerMinutes(minutes);
    setSleepTimerActive(true);

    intervalRef.current = setInterval(() => {
      setSleepTimerMinutes((prevM) => {
        let h = sleepTimerHours;
        let m = prevM - 1;
        if (m < 0) {
          setSleepTimerHours((prevH) => {
            if (prevH > 0) return prevH - 1;
            return 0;
          });
          m = 59;
        }
        return m;
      });
    }, 60000);

    timerRef.current = setTimeout(() => {
      if (audioRef.current) audioRef.current.pause();
      setIsPlaying(false);
      setSleepTimerActive(false);
      cancelSleepTimer();
    }, totalMs);
  };

  const cancelSleepTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setSleepTimerActive(false);
    setSleepTimerHours(0);
    setSleepTimerMinutes(0);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlaying = () => { setIsPlaying(true); setIsBuffering(false); };
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handleError = () => {
      setIsBuffering(false);
      setIsPlaying(false);
      if (currentStation) {
        // Optionally alert if it's not a generic abort
      }
    };

    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('error', handleError);
    };
  }, [audioRef.current, currentStation]);

  return (
    <PlayerContext.Provider
      value={{
        currentStation,
        isPlaying,
        volume,
        quality,
        sleepTimerHours,
        sleepTimerMinutes,
        sleepTimerActive,
        isBuffering,
        playStation,
        togglePlayPause,
        setVolume: handleVolumeChange,
        setQuality: handleQualityChange,
        startSleepTimer,
        cancelSleepTimer,
        audioRef
      }}
    >
      {children}
      <audio 
        ref={audioRef} 
        src={currentStation ? currentStation.url_resolved : undefined} 
      />
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within PlayerProvider');
  return context;
};

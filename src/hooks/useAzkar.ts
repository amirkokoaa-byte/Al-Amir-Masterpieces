import { useEffect, useState } from 'react';
import { AZKAR_LIST, speakZikr } from '../lib/azkar';

export function useAzkarAlerts() {
  const [enabled, setEnabled] = useState(false);
  const [intervalMins, setIntervalMins] = useState(30);

  useEffect(() => {
    const savedEn = localStorage.getItem('azkar_enabled');
    if (savedEn) setEnabled(savedEn === 'true');
    const savedInt = localStorage.getItem('azkar_interval');
    if (savedInt) setIntervalMins(parseInt(savedInt));
  }, []);

  const toggleAzkar = (en: boolean) => {
    setEnabled(en);
    localStorage.setItem('azkar_enabled', en ? 'true' : 'false');
    if (en && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  };

  const setAzkarInterval = (mins: number) => {
    setIntervalMins(mins);
    localStorage.setItem('azkar_interval', mins.toString());
  };

  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      const zikr = AZKAR_LIST[Math.floor(Math.random() * AZKAR_LIST.length)];
      
      // Try to speak it if possible
      speakZikr(zikr.text);
      
      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification("تذكير بذكر الله", {
          body: zikr.text,
          icon: '/favicon.ico'
        });
      }
    }, intervalMins * 60 * 1000);

    return () => clearInterval(interval);
  }, [enabled, intervalMins]);

  return { azkarEnabled: enabled, toggleAzkar, azkarInterval: intervalMins, setAzkarInterval };
}

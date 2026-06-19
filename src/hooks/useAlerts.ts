import { useState, useEffect } from 'react';
import { ProgramAlert } from '../types';

export function useAlerts() {
  const [alerts, setAlerts] = useState<ProgramAlert[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('radio_alerts');
    if (saved) {
      try {
        setAlerts(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  const saveAlerts = (newAlerts: ProgramAlert[]) => {
    setAlerts(newAlerts);
    localStorage.setItem('radio_alerts', JSON.stringify(newAlerts));
  };

  const addAlert = (alert: Omit<ProgramAlert, 'id'>) => {
    const newAlert: ProgramAlert = {
      ...alert,
      id: Math.random().toString(36).substr(2, 9)
    };
    saveAlerts([...alerts, newAlert]);
    
    // Request permission if not already granted
    if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  const removeAlert = (id: string) => {
    saveAlerts(alerts.filter(a => a.id !== id));
  };

  const toggleAlert = (id: string) => {
    saveAlerts(alerts.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  // Check alerts every minute
  useEffect(() => {
    const checkAlerts = () => {
      const now = new Date();
      const currentDay = now.getDay();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;

      alerts.forEach(alert => {
        if (alert.enabled && alert.days.includes(currentDay) && alert.time === currentTime) {
          if (Notification.permission === 'granted') {
            new Notification(`حان وقت برنامجك!`, {
              body: `برنامج ${alert.programName} على إذاعة ${alert.stationName}`,
              icon: '/icon.png' // or a default radio icon
            });
          }
        }
      });
    };

    const interval = setInterval(checkAlerts, 60000);
    // Check initially too, just in case
    // checkAlerts(); 

    return () => clearInterval(interval);
  }, [alerts]);

  return { alerts, addAlert, removeAlert, toggleAlert };
}

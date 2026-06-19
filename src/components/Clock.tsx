import React, { useState, useEffect } from 'react';

export function Clock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = time.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const dateStr = time.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="glass-panel p-4 flex flex-col items-center justify-center glow-hover text-center">
      <div className="text-3xl font-bold text-amber-500 drop-shadow-md mb-1">{timeStr}</div>
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">{dateStr}</div>
    </div>
  );
}

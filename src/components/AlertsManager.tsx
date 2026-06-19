import React, { useState } from 'react';
import { useAlerts } from '../hooks/useAlerts';
import { useFavoritesContext } from '../context/FavoritesContext';
import { DEFAULT_STATIONS } from '../lib/api';
import { Bell, Trash2, Plus, Clock, Volume2 } from 'lucide-react';
import { Station } from '../types';
import { useAzkarAlerts } from '../hooks/useAzkar';

export function AlertsManager() {
  const { alerts, addAlert, removeAlert, toggleAlert } = useAlerts();
  const { azkarEnabled, toggleAzkar, azkarInterval, setAzkarInterval } = useAzkarAlerts();
  const { favorites } = useFavoritesContext();
  
  const [showAdd, setShowAdd] = useState(false);
  const [programName, setProgramName] = useState('');
  const [time, setTime] = useState('12:00');
  const [selectedStation, setSelectedStation] = useState('');

  // Combine default stations with favorites for dropdown
  const availableStations = Array.from(new Set([...DEFAULT_STATIONS, ...favorites].map(s => s.stationuuid)))
    .map(id => {
      const s = [...DEFAULT_STATIONS, ...favorites].find(x => x.stationuuid === id);
      return s as Station;
    }).filter(Boolean);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!programName || !time || !selectedStation) return;
    
    const station = availableStations.find(s => s.stationuuid === selectedStation);
    if (!station) return;

    addAlert({
      stationId: station.stationuuid,
      stationName: station.name,
      programName,
      time,
      days: [0, 1, 2, 3, 4, 5, 6], // All days for simplicity
      enabled: true
    });

    setProgramName('');
    setShowAdd(false);
  };

  return (
    <div className="max-w-2xl mx-auto w-full space-y-8">
      
      {/* Azkar Section */}
      <div className="glass-panel p-6 glow-hover">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Volume2 className="text-amber-500" /> التنبيه الصوتي للأذكار</h2>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">تفعيل نطق الأذكار تلقائياً في الخلفية (يعمل طالما التطبيق مفتوح)</p>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">كل:</label>
              <select 
                value={azkarInterval}
                onChange={(e) => setAzkarInterval(parseInt(e.target.value))}
                className="bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg p-1 text-sm outline-none"
                disabled={!azkarEnabled}
              >
                <option value={15}>15 دقيقة</option>
                <option value={30}>30 دقيقة</option>
                <option value={60}>ساعة</option>
              </select>
            </div>
          </div>
          <button 
             onClick={() => toggleAzkar(!azkarEnabled)}
             className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${azkarEnabled ? 'bg-amber-500' : 'bg-gray-200 dark:bg-slate-700'}`}
           >
             <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${azkarEnabled ? '-translate-x-7' : '-translate-x-1'}`} />
          </button>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">تنبيهات البرامج</h2>
          <button 
            onClick={() => setShowAdd(!showAdd)}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium px-4 py-2 rounded-lg text-sm transition-colors glass-panel glow-hover"
          >
            <Plus className="w-4 h-4" />
            إضافة تنبيه
          </button>
        </div>

        {showAdd && (
          <form onSubmit={handleAdd} className="glass-panel p-6 mb-6 glow-hover">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">اسم البرنامج</label>
                  <input 
                    type="text" required
                    value={programName}
                    onChange={e => setProgramName(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 p-2 text-sm focus:border-amber-500 outline-none backdrop-blur-sm"
                    placeholder="مثال: نور على الدرب"
                  />
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">الإذاعة</label>
                  <select 
                    required
                    value={selectedStation}
                    onChange={e => setSelectedStation(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 p-2 text-sm focus:border-amber-500 outline-none backdrop-blur-sm"
                  >
                    <option value="">اختر الإذاعة...</option>
                    {availableStations.map(s => (
                      <option key={s.stationuuid} value={s.stationuuid}>{s.name}</option>
                    ))}
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">الوقت</label>
                  <input 
                    type="time" required
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-900/50 p-2 text-sm focus:border-amber-500 outline-none backdrop-blur-sm"
                  />
               </div>
            </div>
            <div className="flex justify-end">
               <button type="submit" className="bg-amber-500 text-slate-950 font-medium px-6 py-2 rounded-lg text-sm hover:bg-amber-600 transition-colors shadow-lg">حفظ التنبيه</button>
            </div>
          </form>
        )}

        <div className="space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-slate-400 glass-panel glow-hover">
               لا توجد تنبيهات نشطة حالياً. يمكنك إضافة تنبيه ليقوم التطبيق بتذكيرك بموعد البرامج.
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className="glass-panel p-4 flex items-center justify-between glow-hover">
                 <div className="flex items-center gap-4">
                   <div className={`p-3 rounded-full ${alert.enabled ? 'bg-amber-500/20 text-amber-600 dark:text-amber-500' : 'bg-gray-100/50 text-gray-400 dark:bg-slate-700/50'}`}>
                     <Bell className="w-5 h-5" />
                   </div>
                   <div>
                     <h4 className="font-semibold text-gray-900 dark:text-gray-100">{alert.programName}</h4>
                     <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                       <span className="text-amber-500 font-medium">{alert.time}</span> • {alert.stationName}
                     </p>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <button 
                     onClick={() => toggleAlert(alert.id)}
                     className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${alert.enabled ? 'bg-amber-500' : 'bg-gray-200 dark:bg-slate-700'}`}
                   >
                     <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${alert.enabled ? '-translate-x-6' : '-translate-x-1'}`} />
                   </button>
                   <button onClick={() => removeAlert(alert.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full">
                     <Trash2 className="w-5 h-5" />
                   </button>
                 </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}


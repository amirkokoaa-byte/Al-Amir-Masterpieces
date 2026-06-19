import React, { useState, useEffect } from 'react';
import { Coordinates, CalculationMethod, PrayerTimes as AdhanPrayerTimes, Madhab } from 'adhan';
import { Compass, MapPin, Loader2, Settings2 } from 'lucide-react';
import { Clock } from './Clock';

export function PrayerTimes() {
  const [qibla, setQibla] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationName, setLocationName] = useState('القاهرة، مصر');
  const [coords, setCoords] = useState<{lat: number, lng: number}>({ lat: 30.0444, lng: 31.2357 }); // Cairo by default
  const [offsetMinutes, setOffsetMinutes] = useState(0); // For manual minute override

  // Calculate times based on precise coords
  const computeTimes = () => {
    const coordinates = new Coordinates(coords.lat, coords.lng);
    const params = CalculationMethod.Egyptian();
    params.fajrAngle = 19.5;
    params.ishaAngle = 17.5;
    params.madhab = Madhab.Shafi;
    
    // Apply manual tuning
    if (offsetMinutes !== 0) {
      params.adjustments.fajr = offsetMinutes;
      params.adjustments.sunrise = offsetMinutes;
      params.adjustments.dhuhr = offsetMinutes;
      params.adjustments.asr = offsetMinutes;
      params.adjustments.maghrib = offsetMinutes;
      params.adjustments.isha = offsetMinutes;
    }

    const date = new Date();
    return new AdhanPrayerTimes(coordinates, date, params);
  };

  const getFormattedTime = (date: Date) => {
    // Floor minutes to avoid rounding up 1 minute extra
    const timestamp = date.getTime();
    date = new Date(Math.floor(timestamp / 60000) * 60000); 

    let h = date.getHours();
    const m = date.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'م' : 'ص';
    h = h % 12;
    h = h ? h : 12;
    return `${h}:${m} ${ampm}`;
  };

  useEffect(() => {
    fetchDefault();
  }, []);

  const fetchDefault = async () => {
    setLoading(true);
    // Cairo default Qibla is roughly 136
    setQibla(136.21);
    setLoading(false);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      alert('خدمة الموقع غير مدعومة في متصفحك');
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      setCoords({ lat: latitude, lng: longitude });
      setLocationName('موقعك الحالي');

      // fetch Qibla from Aladhan or math calculation (Aladhan REST for simplicity)
      try {
        const res = await fetch(`https://api.aladhan.com/v1/qibla/${latitude}/${longitude}`);
        const data = await res.json();
        setQibla(data.data.direction);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }, (err) => {
      alert('تعذر الحصول على الموقع');
      fetchDefault();
    });
  };

  const times = computeTimes();

  // Hijri Date approximation or standard string
  const todayDate = new Intl.DateTimeFormat('ar-EG-u-ca-islamic', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(new Date());

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Clock />
        <div className="glass-panel p-4 flex flex-col items-center justify-center glow-hover">
          <button 
            onClick={useMyLocation}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-medium rounded-lg transition-colors mb-2"
          >
            <MapPin className="w-4 h-4" /> تحديد موقعي الحالي
          </button>
          <div className="text-sm font-medium opacity-80">{locationName}</div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-amber-500 w-8 h-8" /></div>
      ) : (
        <div className="glass-panel p-6 glow-hover">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b border-gray-200 dark:border-slate-700 pb-4 gap-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              مواقيت الصلاة <span className="text-sm font-normal text-amber-600 dark:text-amber-400">({todayDate})</span>
            </h3>
            
            <div className="flex items-center gap-2 bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-gray-200 dark:border-slate-700">
              <Settings2 className="w-4 h-4 text-gray-500" />
              <span className="text-sm">تعديل الدقائق:</span>
              <button onClick={() => setOffsetMinutes(p => p - 1)} className="px-2 bg-gray-200 dark:bg-slate-700 rounded">-1</button>
              <span className="text-sm font-mono font-bold">{offsetMinutes}</span>
              <button onClick={() => setOffsetMinutes(p => p + 1)} className="px-2 bg-gray-200 dark:bg-slate-700 rounded">+1</button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-center">
            {[
               { name: 'الفجر', time: getFormattedTime(times.fajr) },
               { name: 'الشروق', time: getFormattedTime(times.sunrise) },
               { name: 'الظهر', time: getFormattedTime(times.dhuhr) },
               { name: 'العصر', time: getFormattedTime(times.asr) },
               { name: 'المغرب', time: getFormattedTime(times.maghrib) },
               { name: 'العشاء', time: getFormattedTime(times.isha) },
            ].map(p => (
              <div key={p.name} className="bg-white/50 dark:bg-black/20 p-3 rounded-xl border border-gray-100 dark:border-slate-800">
                <div className="font-semibold text-gray-700 dark:text-gray-300">{p.name}</div>
                <div className="text-amber-600 dark:text-amber-400 font-bold mt-1 dir-ltr">{p.time}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {qibla !== null && (
        <div className="glass-panel p-6 glow-hover flex flex-col items-center">
           <h3 className="text-lg font-bold mb-4">اتجاه القبلة</h3>
           <div className="relative w-48 h-48 rounded-full border-4 border-amber-500 flex items-center justify-center bg-gray-50 dark:bg-slate-900 shadow-inner">
             <div className="absolute top-2 text-xs font-bold text-gray-400">الشمال</div>
             <Compass className="w-8 h-8 text-gray-300 absolute" />
             <div 
               className="w-full h-full absolute transition-transform duration-1000 ease-out"
               style={{ transform: `rotate(${qibla}deg)` }}

             >
               <div className="w-1 h-1/2 bg-amber-500 mx-auto rounded-t-full relative">
                 <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-amber-600 rotate-45"></div>
               </div>
             </div>
           </div>
           <p className="mt-4 text-sm font-medium opacity-80 text-center">
             اتجاه القبلة: {Math.round(qibla)} درجة من الشمال
           </p>
        </div>
      )}

    </div>
  );
}

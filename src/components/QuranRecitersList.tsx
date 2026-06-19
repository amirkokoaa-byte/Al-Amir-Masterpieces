import React, { useState, useEffect, useMemo } from 'react';
import { Station } from '../types';
import { getQuranRecitersRadios } from '../lib/api';
import { StationCard } from './StationCard';
import { Search, Loader2, Mic2 } from 'lucide-react';

export function QuranRecitersList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [reciters, setReciters] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchReciters = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getQuranRecitersRadios();
        setReciters(data);
      } catch (e) {
        setError(true);
      }
      setLoading(false);
    };
    fetchReciters();
  }, []);

  const filteredReciters = useMemo(() => {
    if (!searchQuery) return reciters;
    return reciters.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [reciters, searchQuery]);

  return (
    <div className="w-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
          <Mic2 className="text-amber-500 w-6 h-6" /> تلاوات بأصوات القراء
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mt-2">استمع إلى القرآن الكريم بصوت قارئك المفضل عبر البث المباشر المخصص لكل قارئ</p>
      </div>

      <div className="relative mb-8 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن اسم القارئ..."
          className="block w-full pl-4 pr-10 py-3 border border-gray-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="h-10 w-10 text-amber-500 animate-spin mb-4" />
          <p className="text-gray-500 dark:text-slate-400">جاري تحميل قائمة القراء...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">
           تأكد من اتصالك بالإنترنت، حدث خطأ أثناء تحميل القراء.
        </div>
      ) : filteredReciters.length === 0 ? (
        <div className="text-center py-12 text-gray-500 dark:text-slate-400">
           لا يوجد قارئ بهذا الاسم المطابق للبحث
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReciters.map(station => (
             <StationCard key={station.stationuuid} station={station} />
          ))}
        </div>
      )}
    </div>
  );
}

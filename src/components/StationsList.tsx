import React, { useState, useEffect, useRef } from 'react';
import { Station } from '../types';
import { searchStations, DEFAULT_STATIONS } from '../lib/api';
import { StationCard } from './StationCard';
import { Search, Loader2 } from 'lucide-react';

export function StationsList() {
  const [query, setQuery] = useState('');
  const [stations, setStations] = useState<Station[]>(DEFAULT_STATIONS);
  const [loading, setLoading] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const timer = setTimeout(() => {
      handleSearch(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = async (q: string) => {
    setLoading(true);
    if (!q.trim()) {
      setStations(DEFAULT_STATIONS);
    } else {
      const results = await searchStations(q);
      setStations(results);
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      <div className="relative mb-8 max-w-2xl mx-auto">
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن محطة راديو، مثلاً: نجوم اف ام..."
          className="block w-full pl-4 pr-10 py-3 border border-gray-200 dark:border-slate-700 rounded-xl leading-5 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 sm:text-sm transition-all shadow-sm"
        />
        {loading && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Loader2 className="h-5 w-5 text-amber-500 animate-spin" />
          </div>
        )}
      </div>

      {stations.length === 0 && !loading ? (
        <div className="text-center py-12 text-gray-500 dark:text-slate-400">
           لا توجد نتائج مطابقة للبحث
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stations.map(station => (
             <StationCard key={station.stationuuid} station={station} />
          ))}
        </div>
      )}
    </div>
  );
}

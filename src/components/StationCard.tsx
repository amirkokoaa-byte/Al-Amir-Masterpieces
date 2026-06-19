import React from 'react';
import { Station } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { useFavoritesContext } from '../context/FavoritesContext';
import { Play, Pause, Heart, RadioTower } from 'lucide-react';

interface Props {
  station: Station;
}

export function StationCard({ station }: Props) {
  const { currentStation, isPlaying, togglePlayPause, playStation } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavoritesContext();

  const isCurrent = currentStation?.stationuuid === station.stationuuid;
  const fav = isFavorite(station.stationuuid);

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playStation(station);
    }
  };

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(station);
  };

  return (
    <div 
      onClick={handlePlayClick}
      className={`group relative rounded-2xl p-4 transition-all cursor-pointer border glass-panel glow-hover ${isCurrent ? 'border-amber-500 shadow-[0_0_15px_rgba(139,168,136,0.3)]' : 'border-transparent'}`}
    >
      <div className="flex items-start gap-4">
        {/* Icon / Favicon */}
        <div className="w-16 h-16 rounded-xl bg-white/50 dark:bg-black/50 flex items-center justify-center shrink-0 overflow-hidden relative border border-gray-100/50 dark:border-slate-800/50 backdrop-blur-sm">
          {station.favicon ? (
             <img src={station.favicon} alt={station.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          ) : (
             <RadioTower className="w-8 h-8 text-amber-500 opacity-70" />
          )}
          
          {/* Overlay Play/Pause indicator */}
          <div className={`absolute inset-0 bg-black/60 flex items-center justify-center transition-opacity backdrop-blur-sm ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            {isCurrent && isPlaying ? (
              <Pause className="w-6 h-6 text-white drop-shadow-md" />
            ) : (
              <Play className="w-6 h-6 text-amber-500 ml-1 drop-shadow-md" />
            )}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate pr-8" title={station.name}>{station.name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 capitalize truncate mt-1">
            {station.country || 'Unknown'} {station.tags ? `• ${station.tags.split(',')[0]}` : ''}
          </p>
          
          <div className="mt-3 flex items-center gap-2 h-4">
            {isCurrent && isPlaying && (
              <div className="flex items-end gap-1 h-3">
                <span className="w-1 bg-amber-500 rounded-full animate-audio-bar-1 h-1/3 shadow-[0_0_5px_rgba(139,168,136,0.8)]" />
                <span className="w-1 bg-amber-500 rounded-full animate-audio-bar-2 h-full shadow-[0_0_5px_rgba(139,168,136,0.8)]" />
                <span className="w-1 bg-amber-500 rounded-full animate-audio-bar-3 h-2/3 shadow-[0_0_5px_rgba(139,168,136,0.8)]" />
                <span className="w-1 text-[10px] mx-1 text-amber-500 font-bold tracking-wider">مباشر</span>
              </div>
            )}
          </div>
        </div>

        <button 
          onClick={handleFavClick}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors z-10"
        >
          <Heart className={`w-5 h-5 transition-colors ${fav ? 'fill-red-500 text-red-500 drop-shadow-md' : 'text-gray-400 dark:text-slate-500'}`} />
        </button>
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Station } from '../types';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Station[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('radio_favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  const toggleFavorite = (station: Station) => {
    setFavorites(prev => {
      const isFav = prev.some(s => s.stationuuid === station.stationuuid);
      let nextFavs;
      if (isFav) {
        nextFavs = prev.filter(s => s.stationuuid !== station.stationuuid);
      } else {
        nextFavs = [...prev, station];
      }
      localStorage.setItem('radio_favorites', JSON.stringify(nextFavs));
      return nextFavs;
    });
  };

  const isFavorite = (uuid: string) => {
    return favorites.some(s => s.stationuuid === uuid);
  };

  return { favorites, toggleFavorite, isFavorite };
}

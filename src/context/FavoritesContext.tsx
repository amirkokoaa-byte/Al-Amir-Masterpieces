import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Station } from '../types';

interface FavoritesContextType {
  favorites: Station[];
  toggleFavorite: (station: Station) => void;
  isFavorite: (uuid: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
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

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavoritesContext = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavoritesContext must be used within FavoritesProvider');
  return context;
};

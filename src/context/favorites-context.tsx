import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { AnimeMedia } from '@/features/anime/types/anime.types';
import {
  addFavoriteToDb,
  getAllFavoritesFromDb,
  getFavoriteIdsFromDb,
  removeFavoriteFromDb,
} from '@/services/database/favoritesDb';

interface FavoritesContextType {
  favorites: AnimeMedia[];
  favoriteIds: Set<number>;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (anime: AnimeMedia) => Promise<boolean>;
  removeFavorite: (id: number) => Promise<void>;
  count: number;
  isLoading: boolean;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  favoriteIds: new Set(),
  isFavorite: () => false,
  toggleFavorite: async () => false,
  removeFavorite: async () => {},
  count: 0,
  isLoading: true,
  refreshFavorites: async () => {},
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<AnimeMedia[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const refreshFavorites = useCallback(async () => {
    try {
      const [list, ids] = await Promise.all([
        getAllFavoritesFromDb(),
        getFavoriteIdsFromDb(),
      ]);
      setFavorites(list);
      setFavoriteIds(new Set(ids));
    } catch (e) {
      console.error('Error loading favorites from local DB:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const isFavorite = useCallback(
    (id: number) => {
      return favoriteIds.has(id);
    },
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (anime: AnimeMedia): Promise<boolean> => {
      const currentlyFavorite = favoriteIds.has(anime.id);
      if (currentlyFavorite) {
        // Optimistic update
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(anime.id);
          return next;
        });
        setFavorites((prev) => prev.filter((item) => item.id !== anime.id));
        await removeFavoriteFromDb(anime.id);
        return false;
      } else {
        // Optimistic update
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.add(anime.id);
          return next;
        });
        setFavorites((prev) => [anime, ...prev]);
        await addFavoriteToDb(anime);
        return true;
      }
    },
    [favoriteIds]
  );

  const removeFavorite = useCallback(async (id: number) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setFavorites((prev) => prev.filter((item) => item.id !== id));
    await removeFavoriteFromDb(id);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        count: favorites.length,
        isLoading,
        refreshFavorites,
      }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { AnimeMedia } from '@/features/anime';
import {
  addFavoriteToDb,
  getAllFavoritesFromDb,
  removeFavoriteFromDb,
} from '../services/favoritesDb';

interface FavoritesContextType {
  favorites: AnimeMedia[];
  favoriteIds: Set<number>;
  isFavorite: (id: number) => boolean;
  toggleFavorite: (anime: AnimeMedia) => Promise<boolean>;
  removeFavorite: (id: number) => Promise<void>;
  restoreFavorite: (anime: AnimeMedia) => Promise<void>;
  count: number;
  isLoading: boolean;
  error: string | null;
  refreshFavorites: () => Promise<void>;
}
const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<AnimeMedia[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentFavorites = useRef<AnimeMedia[]>([]);
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const publish = useCallback((list: AnimeMedia[]) => {
    currentFavorites.current = list;
    setFavorites(list);
  }, []);
  const enqueue = useCallback(<T,>(operation: () => Promise<T>): Promise<T> => {
    const task = queue.current.then(operation);
    queue.current = task.catch(() => {});
    return task;
  }, []);
  const refreshFavorites = useCallback(
    () =>
      enqueue(async () => {
        try {
          publish(await getAllFavoritesFromDb());
          setError(null);
        } catch {
          setError('No pudimos cargar tus favoritos. Inténtalo otra vez.');
        } finally {
          setIsLoading(false);
        }
      }),
    [enqueue, publish]
  );
  useEffect(() => {
    void refreshFavorites();
  }, [refreshFavorites]);

  const mutate = useCallback(
    (
      operation: () => Promise<void>,
      update: (list: AnimeMedia[]) => AnimeMedia[]
    ) =>
      enqueue(async () => {
        const previous = currentFavorites.current;
        publish(update(previous));
        try {
          await operation();
          setError(null);
        } catch (err) {
          publish(previous);
          setError(
            'No pudimos guardar el cambio en favoritos. Inténtalo otra vez.'
          );
          throw err;
        }
      }),
    [enqueue, publish]
  );

  const removeFavorite = useCallback(
    (id: number) =>
      mutate(
        () => removeFavoriteFromDb(id),
        (list) => list.filter((item) => item.id !== id)
      ),
    [mutate]
  );
  const restoreFavorite = useCallback(
    (anime: AnimeMedia) =>
      mutate(
        () => addFavoriteToDb(anime),
        (list) =>
          list.some((item) => item.id === anime.id) ? list : [anime, ...list]
      ),
    [mutate]
  );
  const toggleFavorite = useCallback(
    (anime: AnimeMedia) =>
      enqueue(async () => {
        const exists = currentFavorites.current.some(
          (item) => item.id === anime.id
        );
        const previous = currentFavorites.current;
        publish(
          exists
            ? previous.filter((item) => item.id !== anime.id)
            : [anime, ...previous]
        );
        try {
          if (exists) await removeFavoriteFromDb(anime.id);
          else await addFavoriteToDb(anime);
          setError(null);
          return !exists;
        } catch (err) {
          publish(previous);
          setError(
            'No pudimos guardar el cambio en favoritos. Inténtalo otra vez.'
          );
          throw err;
        }
      }),
    [enqueue, publish]
  );
  const favoriteIds = useMemo(
    () => new Set(favorites.map((anime) => anime.id)),
    [favorites]
  );
  const isFavorite = useCallback(
    (id: number) => favoriteIds.has(id),
    [favoriteIds]
  );
  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        isFavorite,
        toggleFavorite,
        removeFavorite,
        restoreFavorite,
        count: favorites.length,
        isLoading,
        error,
        refreshFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context)
    throw new Error('useFavorites debe usarse dentro de FavoritesProvider');
  return context;
}

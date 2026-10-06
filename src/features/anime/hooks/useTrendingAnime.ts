import { useCallback, useEffect, useState } from 'react';

import { getTrendingAnime } from '../services/animeApi';
import { AnimeMedia, PageInfo } from '../types/anime.types';

export function useTrendingAnime() {
  const [animes, setAnimes] = useState<AnimeMedia[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    void getTrendingAnime(1, 20)
      .then((response) => {
        if (!isActive) return;
        setAnimes(response.media);
        setPageInfo(response.pageInfo);
      })
      .catch((cause) => {
        if (!isActive) return;
        setError(
          cause instanceof Error
            ? cause.message
            : 'Error desconocido al cargar animes'
        );
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  const refetch = useCallback(async () => {
    try {
      setIsRefreshing(true);
      setError(null);

      const response = await getTrendingAnime(1, 20);
      setAnimes(response.media);
      setPageInfo(response.pageInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar animes');
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    animes,
    pageInfo,
    isLoading,
    isRefreshing,
    error,
    refetch,
  };
}

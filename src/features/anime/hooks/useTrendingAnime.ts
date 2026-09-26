import { useCallback, useEffect, useState } from 'react';

import { getTrendingAnime } from '../services/animeApi';
import { AnimeMedia, PageInfo } from '../types/anime.types';

export function useTrendingAnime() {
  const [animes, setAnimes] = useState<AnimeMedia[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrending = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const response = await getTrendingAnime(1, 20);
      setAnimes(response.media);
      setPageInfo(response.pageInfo);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido al cargar animes');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTrending();
  }, [fetchTrending]);

  const refetch = useCallback(() => {
    return fetchTrending(true);
  }, [fetchTrending]);

  return {
    animes,
    pageInfo,
    isLoading,
    isRefreshing,
    error,
    refetch,
  };
}

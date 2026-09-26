import { useCallback, useEffect, useState } from 'react';

import { getAnimeDetail } from '../services/animeApi';
import { AnimeMedia } from '../types/anime.types';

export function useAnimeDetail(id?: number | string) {
  const [anime, setAnime] = useState<AnimeMedia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

  const fetchDetail = useCallback(async () => {
    if (!numericId || isNaN(numericId)) {
      setError('ID de anime no válido');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await getAnimeDetail(numericId);
      setAnime(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el detalle del anime');
    } finally {
      setIsLoading(false);
    }
  }, [numericId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    anime,
    isLoading,
    error,
    refetch: fetchDetail,
  };
}

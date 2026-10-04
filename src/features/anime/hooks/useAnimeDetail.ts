import { useCallback, useEffect, useRef, useState } from 'react';
import { getAnimeDetail } from '../services/animeApi';
import { AnimeMedia } from '../types/anime.types';

export function useAnimeDetail(id?: number | string) {
  const [anime, setAnime] = useState<AnimeMedia | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const controller = useRef<AbortController | null>(null);
  const numericId = typeof id === 'string' ? Number(id) : id;
  const fetchDetail = useCallback(async () => {
    controller.current?.abort();
    const request = new AbortController();
    controller.current = request;
    if (!numericId || !Number.isInteger(numericId) || numericId < 1) {
      setError('ID de anime no válido');
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAnimeDetail(numericId, request.signal);
      if (!request.signal.aborted) setAnime(data);
    } catch (err) {
      if (!request.signal.aborted)
        setError(
          err instanceof Error ? err.message : 'No pudimos cargar el detalle.'
        );
    } finally {
      if (!request.signal.aborted) setIsLoading(false);
    }
  }, [numericId]);
  useEffect(() => {
    const timer = setTimeout(() => {
      void fetchDetail();
    }, 0);
    return () => {
      clearTimeout(timer);
      controller.current?.abort();
    };
  }, [fetchDetail]);
  return { anime, isLoading, error, refetch: fetchDetail };
}

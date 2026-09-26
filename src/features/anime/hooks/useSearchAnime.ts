import { useCallback, useEffect, useState } from 'react';

import { searchAnime } from '../services/animeApi';
import { AnimeMedia } from '../types/anime.types';

export function useSearchAnime(debounceMs = 500) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>();
  const [results, setResults] = useState<AnimeMedia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeSearch = useCallback(async (text: string, genre?: string) => {
    if (!text.trim() && !genre) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const response = await searchAnime(text, 1, 25, genre);
      setResults(response.media);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      executeSearch(searchTerm, selectedGenre);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [searchTerm, selectedGenre, debounceMs, executeSearch]);

  return {
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    results,
    isLoading,
    error,
    refresh: () => executeSearch(searchTerm, selectedGenre),
  };
}

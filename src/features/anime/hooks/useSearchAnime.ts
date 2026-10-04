import { useCallback, useEffect, useRef, useState } from 'react';
import { searchAnime } from '../services/animeApi';
import { AnimeMedia, PageInfo } from '../types/anime.types';

export function useSearchAnime(debounceMs = 350) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>();
  const [sort, setSort] = useState<'POPULARITY_DESC' | 'TRENDING_DESC'>(
    'POPULARITY_DESC'
  );
  const [results, setResults] = useState<AnimeMedia[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestVersion = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const pending = useRef(false);
  const failedPage = useRef(1);
  const queryKey = JSON.stringify([searchTerm.trim(), selectedGenre, sort]);
  const currentKey = useRef(queryKey);
  useEffect(() => {
    currentKey.current = queryKey;
  }, [queryKey]);
  const completedKey = useRef<string | null>(null);

  const executeSearch = useCallback(
    async (page = 1) => {
      const key = queryKey;
      const version = ++requestVersion.current;
      controller.current?.abort();
      const abortController = new AbortController();
      controller.current = abortController;
      pending.current = true;
      setIsLoading(page === 1);
      setIsLoadingMore(page > 1);
      setError(null);
      failedPage.current = page;
      try {
        const response = await searchAnime(
          searchTerm,
          page,
          25,
          selectedGenre,
          sort,
          abortController.signal
        );
        if (version !== requestVersion.current || key !== currentKey.current)
          return;
        setResults((previous) =>
          page === 1
            ? response.media
            : [
                ...previous,
                ...response.media.filter(
                  (item) =>
                    !previous.some((existing) => existing.id === item.id)
                ),
              ]
        );
        setPageInfo(response.pageInfo);
        completedKey.current = key;
      } catch (err) {
        if (
          version !== requestVersion.current ||
          key !== currentKey.current ||
          abortController.signal.aborted
        )
          return;
        setError(
          err instanceof Error
            ? err.message
            : 'No pudimos cargar los animes. Inténtalo otra vez.'
        );
      } finally {
        if (version === requestVersion.current && key === currentKey.current) {
          pending.current = false;
          setIsLoading(false);
          setIsLoadingMore(false);
        }
      }
    },
    [queryKey, searchTerm, selectedGenre, sort]
  );

  const invalidate = useCallback(() => {
    ++requestVersion.current;
    controller.current?.abort();
  }, []);

  useEffect(() => {
    invalidate();
    failedPage.current = 1;
    const timer = setTimeout(
      () => {
        void executeSearch();
      },
      searchTerm.trim() ? debounceMs : 0
    );
    return () => {
      clearTimeout(timer);
      invalidate();
    };
  }, [executeSearch, searchTerm, debounceMs, invalidate]);

  const loadMore = () => {
    if (
      !pending.current &&
      completedKey.current === queryKey &&
      pageInfo?.hasNextPage
    ) {
      void executeSearch(pageInfo.currentPage + 1);
    }
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedGenre,
    setSelectedGenre,
    sort,
    setSort,
    results,
    isLoading,
    isLoadingMore,
    error,
    pageInfo,
    loadMore,
    refresh: () => executeSearch(),
    retry: () => executeSearch(failedPage.current),
  };
}

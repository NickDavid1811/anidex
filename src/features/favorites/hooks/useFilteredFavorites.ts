import { useMemo, useState } from 'react';

import type { AnimeMedia } from '@/features/anime';

import { SortType } from '../components/FavoritesSortButton';

export function useFilteredFavorites(favorites: AnimeMedia[]) {
  const [filterText, setFilterText] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('Todos');
  const [sortType, setSortType] = useState<SortType>('recent');

  const filteredFavorites = useMemo(() => {
    const normalizedFilter = filterText.trim().toLocaleLowerCase();
    const filtered = favorites.filter((anime) => {
      const title = (
        anime.title.english ||
        anime.title.userPreferred ||
        anime.title.romaji ||
        ''
      ).toLocaleLowerCase();
      const matchesSearch =
        normalizedFilter.length === 0 || title.includes(normalizedFilter);
      const matchesGenre =
        selectedGenre === 'Todos' || anime.genres?.includes(selectedGenre);

      return matchesSearch && matchesGenre;
    });

    if (sortType === 'alphabetical') {
      return [...filtered].sort((a, b) => {
        const titleA =
          a.title.english || a.title.userPreferred || a.title.romaji || '';
        const titleB =
          b.title.english || b.title.userPreferred || b.title.romaji || '';
        return titleA.localeCompare(titleB);
      });
    }

    if (sortType === 'ranking') {
      return [...filtered].sort(
        (a, b) => (b.averageScore ?? 0) - (a.averageScore ?? 0)
      );
    }

    return filtered;
  }, [favorites, filterText, selectedGenre, sortType]);

  const clearFilters = () => {
    setFilterText('');
    setSelectedGenre('Todos');
  };

  return {
    filterText,
    setFilterText,
    selectedGenre,
    setSelectedGenre,
    sortType,
    setSortType,
    filteredFavorites,
    clearFilters,
  };
}

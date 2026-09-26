import { AnimeMedia, AnimePageResponse } from '../types/anime.types';
import { fetchAniList } from './anilistClient';
import {
  GET_ANIME_DETAIL_QUERY,
  GET_TRENDING_ANIME_QUERY,
  SEARCH_ANIME_QUERY,
} from './queries/animeQueries';

export async function getTrendingAnime(page = 1, perPage = 20): Promise<AnimePageResponse> {
  const result = await fetchAniList<{ Page: AnimePageResponse }>(GET_TRENDING_ANIME_QUERY, {
    page,
    perPage,
  });
  return result.Page;
}

export async function getAnimeDetail(id: number): Promise<AnimeMedia> {
  const result = await fetchAniList<{ Media: AnimeMedia }>(GET_ANIME_DETAIL_QUERY, {
    id,
  });
  return result.Media;
}

export async function searchAnime(
  search?: string,
  page = 1,
  perPage = 20,
  genre?: string
): Promise<AnimePageResponse> {
  const result = await fetchAniList<{ Page: AnimePageResponse }>(SEARCH_ANIME_QUERY, {
    search: search && search.trim().length > 0 ? search.trim() : undefined,
    page,
    perPage,
    genre: genre && genre.trim().length > 0 ? genre.trim() : undefined,
  });
  return result.Page;
}

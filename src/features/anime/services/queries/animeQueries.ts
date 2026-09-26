export const GET_TRENDING_ANIME_QUERY = `
query GetTrendingAnime($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(type: ANIME, sort: TRENDING_DESC, isAdult: false) {
      id
      title {
        romaji
        english
        userPreferred
      }
      coverImage {
        extraLarge
        large
        medium
        color
      }
      bannerImage
      description
      episodes
      status
      genres
      averageScore
      format
      seasonYear
    }
  }
}
`;

export const GET_ANIME_DETAIL_QUERY = `
query GetAnimeDetail($id: Int) {
  Media(id: $id, type: ANIME) {
    id
    title {
      romaji
      english
      native
      userPreferred
    }
    coverImage {
      extraLarge
      large
      color
    }
    bannerImage
    description(asHtml: false)
    episodes
    status
    genres
    averageScore
    meanScore
    popularity
    format
    season
    seasonYear
    startDate {
      year
      month
      day
    }
  }
}
`;

export const SEARCH_ANIME_QUERY = `
query SearchAnime($search: String, $page: Int, $perPage: Int, $genre: String) {
  Page(page: $page, perPage: $perPage) {
    pageInfo {
      total
      perPage
      currentPage
      lastPage
      hasNextPage
    }
    media(search: $search, genre: $genre, type: ANIME, sort: POPULARITY_DESC, isAdult: false) {
      id
      title {
        romaji
        english
        userPreferred
      }
      coverImage {
        large
        color
      }
      episodes
      status
      genres
      averageScore
      format
      seasonYear
    }
  }
}
`;

const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co';

export class AniListError extends Error {
  constructor(message: string, public status?: number) { super(message); }
}

interface GraphQLResponse<T> {
  data?: T;
  errors?: {
    message: string;
    status?: number;
    locations?: { line: number; column: number }[];
  }[];
}

/**
 * Cliente genérico para ejecutar peticiones GraphQL hacia la API de AniList
 */
export async function fetchAniList<T>(
  query: string,
  variables: Record<string, unknown> = {},
  signal?: AbortSignal,
  accessToken?: string
): Promise<T> {
  const response = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json: GraphQLResponse<T> = await response.json();

  if (!response.ok || json.errors) {
    const errorMessage =
      json.errors?.[0]?.message || `Error HTTP ${response.status} en AniList`;
    throw new AniListError(errorMessage, json.errors?.[0]?.status ?? response.status);
  }

  if (!json.data) {
    throw new Error('Respuesta vacía de AniList');
  }

  return json.data;
}

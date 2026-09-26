const ANILIST_GRAPHQL_ENDPOINT = 'https://graphql.anilist.co';

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{
    message: string;
    status?: number;
    locations?: Array<{ line: number; column: number }>;
  }>;
}

/**
 * Cliente genérico para ejecutar peticiones GraphQL hacia la API de AniList
 */
export async function fetchAniList<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const response = await fetch(ANILIST_GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json: GraphQLResponse<T> = await response.json();

  if (!response.ok || json.errors) {
    const errorMessage = json.errors?.[0]?.message || `Error HTTP ${response.status} en AniList`;
    throw new Error(errorMessage);
  }

  if (!json.data) {
    throw new Error('Respuesta vacía de AniList');
  }

  return json.data;
}

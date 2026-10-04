/** AniList uses the callback registered for the client; keep OAuth state intact. */
export function aniListAuthorizationUrl(generatedUrl: string): string {
  const url = new URL(generatedUrl);
  url.searchParams.delete('redirect_uri');
  return url.toString();
}

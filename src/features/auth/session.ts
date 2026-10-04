export interface AniListUser {
  id: number;
  name: string;
  avatar: { large?: string | null; medium?: string | null };
}
export interface Session {
  accessToken: string;
  expiresAt: number;
  user: AniListUser;
}
export function parseSession(value: string | null, now = Date.now()): Session | null {
  if (!value) return null;
  try {
    const session = JSON.parse(value);
    if (typeof session.accessToken !== 'string' || !session.accessToken ||
        !Number.isFinite(session.expiresAt) || session.expiresAt <= now ||
        !Number.isInteger(session.user?.id) || typeof session.user?.name !== 'string') return null;
    return session;
  } catch { return null; }
}

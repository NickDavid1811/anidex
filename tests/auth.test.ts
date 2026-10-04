import { describe, expect, test } from 'bun:test';
import { aniListAuthorizationUrl } from '../src/features/auth/authorization-url';
import { parseSession } from '../src/features/auth/session';
import { redirectSystemPath } from '../src/app/+native-intent';

describe('sesión AniList', () => {
  const session = { accessToken: 'test-token', expiresAt: 2000, user: { id: 1, name: 'Usuario', avatar: {} } };
  test('restaura una sesión vigente', () => {
    expect(parseSession(JSON.stringify(session), 1000)).toEqual(session);
  });
  test('rechaza sesiones vencidas, dañadas o incompletas', () => {
    expect(parseSession(JSON.stringify(session), 2000)).toBeNull();
    expect(parseSession('{')).toBeNull();
    expect(parseSession(JSON.stringify({ ...session, accessToken: '' }), 1000)).toBeNull();
    expect(parseSession(JSON.stringify({ ...session, user: null }), 1000)).toBeNull();
  });
  test('elimina credenciales de la ruta del callback', () => {
    expect(redirectSystemPath({ path: 'anidex://auth/callback#access_token=secret&state=test', initial: false })).toBe('/(tabs)/settings');
    expect(redirectSystemPath({ path: 'anidex://anime/123', initial: true })).toBe('anidex://anime/123');
  });
});

 test('AniList recibe token y state sin redirect_uri', () => {
   const url = new URL(aniListAuthorizationUrl('https://anilist.co/api/v2/oauth/authorize?redirect_uri=anidex%3A%2F%2Fauth%2Fcallback&client_id=52712&response_type=token&state=cCukTBA3HG'));
   expect(url.searchParams.has('redirect_uri')).toBe(false);
   expect(url.searchParams.get('client_id')).toBe('52712');
   expect(url.searchParams.get('response_type')).toBe('token');
   expect(url.searchParams.get('state')).toBe('cCukTBA3HG');
 });

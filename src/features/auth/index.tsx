import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import { AniListError, fetchAniList } from '@/lib/anilist/client';
import { aniListAuthorizationUrl } from './authorization-url';
import { parseSession, type AniListUser, type Session } from './session';

WebBrowser.maybeCompleteAuthSession();
const KEY = 'anidex.anilist.session';
const discovery = { authorizationEndpoint: 'https://anilist.co/api/v2/oauth/authorize' };
const viewerQuery = 'query { Viewer { id name avatar { large medium } } }';
interface AuthContextValue {
  user: AniListUser | null;
  isRestoring: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  request: <T>(query: string, variables?: Record<string, unknown>) => Promise<T>;
}
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isRestoring, setRestoring] = useState(true);
  const [isConnecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const current = useRef<Session | null>(null);
  const busy = useRef(false);
  const generation = useRef(0);
  // Serialize writes so signing out also removes an in-flight saved session.
  const storage = useRef<Promise<unknown>>(Promise.resolve());
  const persist = useCallback((value: Session | null) => {
    const task = storage.current.catch(() => {}).then(() => value
      ? SecureStore.setItemAsync(KEY, JSON.stringify(value))
      : SecureStore.deleteItemAsync(KEY));
    storage.current = task;
    return task;
  }, []);
  const publish = useCallback((value: Session | null) => { current.current = value; setSession(value); }, []);
  const disconnect = useCallback(async () => {
    generation.current += 1;
    publish(null);
    setError(null);
    try { await persist(null); }
    catch { setError('No se pudo borrar la sesión guardada. Intenta desconectar otra vez.'); }
  }, [persist, publish]);
  useEffect(() => {
    let active = true;
    const version = generation.current;
    void (async () => {
      try {
        if (Platform.OS === 'web') return;
        const raw = await SecureStore.getItemAsync(KEY);
        const saved = parseSession(raw);
        if (!active || version !== generation.current) return;
        if (saved) publish(saved);
        else if (raw) await persist(null);
      } catch { if (active) setError('No se pudo recuperar la sesión guardada.'); }
      finally { if (active) setRestoring(false); }
    })();
    return () => { active = false; };
  }, [persist, publish]);
  useEffect(() => {
    const check = () => {
      if (current.current && current.current.expiresAt <= Date.now()) {
        void disconnect().then(() => setError('Tu sesión venció. Conecta AniList de nuevo.'));
      }
    };
    const subscription = AppState.addEventListener('change', check);
    const timer = setInterval(check, 60_000);
    return () => { subscription.remove(); clearInterval(timer); };
  }, [disconnect]);
  async function connect() {
    if (busy.current || isRestoring) return;
    busy.current = true;
    setConnecting(true);
    setError(null);
    const version = ++generation.current;
    try {
      if (Platform.OS === 'web' || Constants.appOwnership === 'expo') {
        throw new Error('Abre Anidex en una compilación de desarrollo instalada en tu teléfono.');
      }
      const clientId = process.env.EXPO_PUBLIC_ANILIST_CLIENT_ID;
      if (!clientId) throw new Error('Falta configurar el Client ID de AniList.');
      const request = new AuthSession.AuthRequest({
        clientId, responseType: AuthSession.ResponseType.Token, usePKCE: false,
        redirectUri: 'anidex://auth/callback',
      });
      // Keep redirectUri on AuthRequest so Expo captures the native callback.
      // AniList resolves the redirect from its developer settings instead.
      const url = aniListAuthorizationUrl(await request.makeAuthUrlAsync(discovery));
      const result = await request.promptAsync(discovery, { url });
      if (version !== generation.current) return;
      if (result.type === 'cancel' || result.type === 'dismiss') return;
      if (result.type !== 'success') throw new Error('AniList no pudo autorizar la conexión. Intenta de nuevo.');
      const token = result.authentication?.accessToken;
      const seconds = Number(result.params.expires_in);
      if (!token || result.params.state !== request.state || !Number.isFinite(seconds) || seconds <= 0) {
        throw new Error('La respuesta de autenticación no es válida. Intenta de nuevo.');
      }
      const { Viewer: user } = await fetchAniList<{ Viewer: AniListUser }>(viewerQuery, {}, undefined, token);
      if (!user?.id || !user.name) throw new Error('No se pudo obtener tu perfil de AniList.');
      const next = { accessToken: token, expiresAt: Date.now() + seconds * 1000, user };
      if (version !== generation.current) return;
      await persist(next);
      if (version === generation.current) publish(next);
    } catch (cause) {
      if (version === generation.current) setError(cause instanceof Error && !(cause instanceof AniListError)
        ? cause.message : 'No se pudo conectar con AniList. Intenta de nuevo.');
    } finally { busy.current = false; setConnecting(false); }
  }
  async function request<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const saved = current.current;
    if (!saved || saved.expiresAt <= Date.now()) {
      if (saved) await disconnect();
      throw new Error('Conecta tu cuenta de AniList para continuar.');
    }
    try { return await fetchAniList<T>(query, variables, undefined, saved.accessToken); }
    catch (cause) {
      if (cause instanceof AniListError && cause.status === 401 && current.current === saved) await disconnect();
      throw cause;
    }
  }
  return <AuthContext.Provider value={{ user: session?.user ?? null, isRestoring, isConnecting, error, connect, disconnect, request }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth requiere AuthProvider');
  return value;
}

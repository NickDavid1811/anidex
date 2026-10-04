export function redirectSystemPath({ path }: { path: string; initial: boolean }) {
  try {
    const url = new URL(path, 'anidex://');
    if (url.protocol === 'anidex:' && url.hostname === 'auth' && url.pathname === '/callback') {
      return '/(tabs)/settings';
    }
  } catch { /* Preserve unrelated incoming routes. */ }
  return path;
}

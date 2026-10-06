import { useAppTheme } from '../context/theme-context';

export function useColorScheme() {
  return useAppTheme().activeScheme;
}

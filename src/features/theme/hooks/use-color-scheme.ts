import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useAppTheme } from '../context/theme-context';

export function useColorScheme() {
  try {
    const { activeScheme } = useAppTheme();
    return activeScheme;
  } catch {
    return useDeviceColorScheme() ?? 'dark';
  }
}

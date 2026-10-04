import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '@/features/theme';
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}
export function ErrorState({
  message = 'No pudimos cargar la información.',
  onRetry,
}: ErrorStateProps) {
  const { activeScheme } = useAppTheme();
  const isDark = activeScheme === 'dark';
  return (
    <View className="justify-center items-center p-6 gap-2">
      <Text
        className={`text-lg font-bold ${isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'}`}
      >
        No pudimos cargarlo
      </Text>
      <Text
        accessibilityRole="alert"
        className={`text-sm text-center mb-3 ${isDark ? 'text-[#A89C94]' : 'text-[#776962]'}`}
      >
        {message}
      </Text>
      {onRetry && (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          className={`min-h-12 px-5 justify-center rounded-2xl ${isDark ? 'bg-[#E09F7D]' : 'bg-[#8B4F26]'}`}
        >
          <Text
            className={`font-bold text-sm ${isDark ? 'text-[#351A08]' : 'text-white'}`}
          >
            Reintentar
          </Text>
        </Pressable>
      )}
    </View>
  );
}

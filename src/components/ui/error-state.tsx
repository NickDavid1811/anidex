import { Pressable, Text, View } from 'react-native';
import { useAppTheme } from '@/features/theme';
import { useLocalization } from '@/features/localization';
interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}
export function ErrorState({
  message,
  onRetry,
}: ErrorStateProps) {
  const { activeScheme } = useAppTheme();
  const { t } = useLocalization();
  const isDark = activeScheme === 'dark';
  return (
    <View className="justify-center items-center p-6 gap-2">
      <Text
        className={`text-lg font-manrope-bold ${isDark ? 'text-[#EDE0DB]' : 'text-[#201A17]'}`}
      >
        {t('common.loadError')}
      </Text>
      <Text
        accessibilityRole="alert"
        className={`font-manrope text-sm text-center mb-3 ${isDark ? 'text-[#A89C94]' : 'text-[#776962]'}`}
      >
        {message ?? t('common.loadErrorHint')}
      </Text>
      {onRetry && (
        <Pressable
          accessibilityRole="button"
          onPress={onRetry}
          className={`min-h-12 px-5 justify-center rounded-2xl ${isDark ? 'bg-[#E09F7D]' : 'bg-[#8B4F26]'}`}
        >
          <Text
            className={`font-manrope-bold text-sm ${isDark ? 'text-[#351A08]' : 'text-white'}`}
          >
            {t('common.retry')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

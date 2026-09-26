import { ActivityIndicator, Text, View } from 'react-native';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Cargando animes...' }: LoadingStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-6 gap-3">
      <ActivityIndicator size="large" color="#F47521" />
      <Text className="text-sm font-medium text-slate-500 dark:text-zinc-400">
        {message}
      </Text>
    </View>
  );
}

import { Pressable, Text, View } from 'react-native';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Hubo un error al cargar la información.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="flex-1 justify-center items-center p-6 gap-2">
      <Text className="text-lg font-bold text-slate-900 dark:text-white">Algo salió mal</Text>
      <Text className="text-sm text-center text-slate-500 dark:text-zinc-400 mb-3">{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="px-5 py-2.5 rounded-xl bg-crunchyroll-primary active:opacity-80">
          <Text className="text-white font-bold text-sm">Reintentar</Text>
        </Pressable>
      )}
    </View>
  );
}

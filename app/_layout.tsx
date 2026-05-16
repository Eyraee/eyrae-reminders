import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar, StyleSheet, View } from 'react-native';
import 'react-native-gesture-handler'; // MUST BE AT THE VERY TOP
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MeshBackground } from '../src/components/core/MeshBackground';
import { useThemeStore } from '../src/store/useThemeStore';

export default function RootLayout() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
          
          <MeshBackground />

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' }, 
              animation: 'fade',
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* We will add the focus screen route here implicitly by creating the file later */}
            <Stack.Screen name="+not-found" />
          </Stack>
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
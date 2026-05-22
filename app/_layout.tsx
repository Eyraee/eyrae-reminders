import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, View } from "react-native";
import "react-native-gesture-handler"; // MUST BE AT THE VERY TOP
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { MeshBackground } from "../src/components/core/MeshBackground";
import { useThemeStore } from "../src/store/useThemeStore";

// Prevent the native splash screen from hiding automatically
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const theme = useThemeStore((state) => state.theme);

  const [isSplashReady, setSplashReady] = useState(false);
  const [isAnimationComplete, setAnimationComplete] = useState(false);
  const splashOpacity = useSharedValue(1);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load logic (fonts, databases, etc.) goes here
        setSplashReady(true);
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (isSplashReady) {
      // 1. Hide the static native splash screen instantly
      SplashScreen.hideAsync();

      // 2. Keep our custom GIF on screen for 2.8 seconds, then fade it out!
      const timer = setTimeout(() => {
        splashOpacity.value = withTiming(
          0,
          { duration: 600, easing: Easing.inOut(Easing.ease) },
          () => {
            runOnJS(setAnimationComplete)(true);
          },
        );
      }, 2800);

      return () => clearTimeout(timer);
    }
  }, [isSplashReady]);

  const animatedSplashStyle = useAnimatedStyle(() => ({
    opacity: splashOpacity.value,
  }));

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={DarkTheme}>
        <View style={[styles.container, { backgroundColor: theme.background }]}>
          <StatusBar
            barStyle="light-content"
            translucent
            backgroundColor="transparent"
          />

          <MeshBackground />

          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
              animation: "fade",
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>

          {/* THE CUSTOM ANIMATED SPLASH SCREEN */}
          {!isAnimationComplete && (
            <Animated.View
              style={[
                StyleSheet.absoluteFill,
                styles.splashContainer,
                animatedSplashStyle,
                { backgroundColor: theme.background },
              ]}
            >
              <Image
                source={require("../assets/images/splash-anim.gif")}
                style={styles.splashImage}
              />
            </Animated.View>
          )}
        </View>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  splashContainer: {
    zIndex: 9999, // Guarantees the animation sits on top of all routes
    justifyContent: "center",
    alignItems: "center",
  },
  splashImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain", // Keeps your wizard perfectly scaled inside the safe zone
  },
});

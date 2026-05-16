import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useThemeStore } from '../../src/store/useThemeStore';
import { metrics } from '../../src/theme/metrics';

export default function TabLayout() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, 
        tabBarActiveTintColor: theme.primary, 
        tabBarInactiveTintColor: theme.textMuted,
        tabBarStyle: [styles.floatingTabBar, { borderColor: theme.surfaceHighlight }],
        tabBarBackground: () => (
          <View style={styles.glassWrapper}>
            {/* Increased intensity and added a solid dark fallback to block text bleed */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(10, 10, 15, 0.85)' }]} />
            <BlurView intensity={100} tint="dark" style={StyleSheet.absoluteFill} />
          </View>
        ),
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ title: 'Home', tabBarIcon: ({ color }) => <Feather name="layers" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="calendar" 
        options={{ title: 'Calendar', tabBarIcon: ({ color }) => <Feather name="calendar" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="settings" 
        options={{ title: 'Settings', tabBarIcon: ({ color }) => <Feather name="sliders" size={24} color={color} /> }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  floatingTabBar: {
    position: 'absolute', bottom: 24, left: 24, right: 24, height: 64,
    borderRadius: metrics.borderRadius.round, borderWidth: 1, borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)', elevation: 0, backgroundColor: 'transparent', 
  },
  glassWrapper: { ...StyleSheet.absoluteFillObject, borderRadius: metrics.borderRadius.round, overflow: 'hidden' }
});
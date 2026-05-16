import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DynamicText } from '../../src/components/core/DynamicText';
import { GlassSwitch } from '../../src/components/core/GlassSwitch';
import { NeoCard } from '../../src/components/core/NeoCard';
import { useCurvedScreen } from '../../src/hooks/useCurvedScreen';
import { useTaskStore } from '../../src/store/useTaskStore';
import { useThemeStore, VIBES } from '../../src/store/useThemeStore';
import { metrics } from '../../src/theme/metrics';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { safeHorizontalPadding } = useCurvedScreen();
  
  const currentTheme = useThemeStore((state) => state.theme);
  const setVibe = useThemeStore((state) => state.setVibe);
  
  // Pull the new clearTasks function
  const clearTasks = useTaskStore((state) => state.clearTasks);

  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [autoEscalate, setAutoEscalate] = useState(true);

  const handleVibeSelect = (id: string) => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setVibe(id);
  };

  const toggleHaptics = (val: boolean) => {
    if (val) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setHapticsEnabled(val);
  };

  const toggleEscalation = (val: boolean) => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setAutoEscalate(val);
  };

  const handleClearData = () => {
    if (hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      "Purge All Data",
      "This will permanently delete all your reminders. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Purge", 
          style: "destructive", 
          onPress: () => {
            if (hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            clearTasks(); // Executes the wipe
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.mainWrapper}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + metrics.spacing.lg, paddingHorizontal: safeHorizontalPadding }
        ]}
      >
        <View style={styles.header}>
          <DynamicText variant="h1">Control Center</DynamicText>
        </View>

        <Animated.View entering={FadeInUp.springify().damping(24).delay(100)} layout={Layout.springify()}>
          <DynamicText variant="caption" color="muted" style={styles.sectionTitle}>AESTHETIC VIBE</DynamicText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vibeScroller}>
            {Object.values(VIBES).map((vibe) => (
              <TouchableOpacity
                key={vibe.id}
                activeOpacity={0.8}
                onPress={() => handleVibeSelect(vibe.id)}
                style={[
                  styles.vibeBubble,
                  currentTheme.id === vibe.id && { borderColor: vibe.primary, backgroundColor: `${vibe.primary}15` }
                ]}
              >
                <View style={[styles.vibeColorDot, { backgroundColor: vibe.primary }]} />
                <DynamicText variant="body" color={currentTheme.id === vibe.id ? 'default' : 'muted'}>
                  {vibe.name}
                </DynamicText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        <Animated.View entering={FadeInUp.springify().damping(24).delay(200)} layout={Layout.springify()}>
          <DynamicText variant="caption" color="muted" style={styles.sectionTitle}>PREFERENCES</DynamicText>
          <NeoCard intensity={40} style={styles.settingsCard}>
            
            <View style={styles.settingRow}>
              <View style={styles.settingTextContent}>
                <DynamicText variant="h2" style={{ fontSize: 18 }}>Sensory Haptics</DynamicText>
                <DynamicText variant="caption" color="muted" style={{ marginTop: 2 }}>Physical feedback on interactions</DynamicText>
              </View>
              <GlassSwitch value={hapticsEnabled} onValueChange={toggleHaptics} activeColor={currentTheme.primary} />
            </View>

            <View style={styles.divider} />

            <View style={styles.settingRow}>
              <View style={styles.settingTextContent}>
                <DynamicText variant="h2" style={{ fontSize: 18 }}>Auto-Escalation</DynamicText>
                <DynamicText variant="caption" color="muted" style={{ marginTop: 2 }}>Mark tasks urgent 24h before due</DynamicText>
              </View>
              <GlassSwitch value={autoEscalate} onValueChange={toggleEscalation} activeColor={currentTheme.primary} />
            </View>
            
          </NeoCard>
        </Animated.View>

        <Animated.View entering={FadeInUp.springify().damping(24).delay(300)} layout={Layout.springify()}>
          <DynamicText variant="caption" color="muted" style={[styles.sectionTitle, { marginTop: metrics.spacing.lg }]}>DANGER ZONE</DynamicText>
          <TouchableOpacity activeOpacity={0.7} onPress={handleClearData}>
            <NeoCard intensity={30} style={styles.dangerCard}>
              <Feather name="trash-2" size={24} color="#FF4500" style={{ marginRight: metrics.spacing.md }} />
              <View style={styles.settingTextContent}>
                <DynamicText variant="h2" style={{ fontSize: 18, color: '#FF4500' }}>Purge Data</DynamicText>
                <DynamicText variant="caption" color="muted" style={{ marginTop: 2 }}>Wipe all reminders from device</DynamicText>
              </View>
            </NeoCard>
          </TouchableOpacity>
        </Animated.View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: { flex: 1 },
  container: { flex: 1 },
  scrollContent: { paddingBottom: 180 },
  header: { marginBottom: metrics.spacing.xl },
  sectionTitle: { marginBottom: metrics.spacing.sm, letterSpacing: 1.5, paddingLeft: metrics.spacing.xs },
  vibeScroller: { marginBottom: metrics.spacing.xl },
  vibeBubble: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: metrics.spacing.sm, paddingHorizontal: metrics.spacing.lg,
    borderRadius: metrics.borderRadius.round, backgroundColor: 'rgba(255, 255, 255, 0.03)', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)', marginRight: metrics.spacing.sm,
  },
  vibeColorDot: { width: 12, height: 12, borderRadius: 6, marginRight: metrics.spacing.sm },
  settingsCard: { padding: metrics.spacing.md },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: metrics.spacing.sm },
  settingTextContent: { flex: 1, paddingRight: metrics.spacing.md },
  divider: { height: 1, backgroundColor: 'rgba(255, 255, 255, 0.05)', marginVertical: metrics.spacing.sm },
  dangerCard: { flexDirection: 'row', alignItems: 'center', borderColor: 'rgba(255, 69, 0, 0.2)', backgroundColor: 'rgba(255, 69, 0, 0.05)', padding: metrics.spacing.md }
});
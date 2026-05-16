import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';
import { DynamicText } from '../src/components/core/DynamicText';
import { useTaskStore } from '../src/store/useTaskStore';
import { useThemeStore } from '../src/store/useThemeStore';

export default function FocusScreen() {
  const { taskId } = useLocalSearchParams();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  
  const theme = useThemeStore(state => state.theme);
  const task = useTaskStore(state => state.tasks.find(t => t.id === taskId));

  // 25 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // Breathing animation values
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
      
      // Deep breathing physics: Inhale 4s, Hold 2s, Exhale 4s
      scale.value = withRepeat(withSequence(
        withTiming(1.3, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1.3, { duration: 2000 }),
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ), -1, true);
      
      opacity.value = withRepeat(withSequence(
        withTiming(0.6, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 2000 }),
        withTiming(0.3, { duration: 4000, easing: Easing.inOut(Easing.ease) })
      ), -1, true);

    } else if (timeLeft === 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setIsActive(false);
      scale.value = withTiming(1);
      opacity.value = withTiming(0.3);
    } else {
      scale.value = withTiming(1);
      opacity.value = withTiming(0.3);
      if (interval) clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const toggleTimer = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsActive(!isActive);
  };

  const handleExit = () => {
    Haptics.selectionAsync();
    router.back();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const animatedOrbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Massive Breathing Orb */}
      <Animated.View style={[styles.orb, animatedOrbStyle, { top: height * 0.2, left: -width * 0.5 }]}>
        <LinearGradient
          colors={[theme.primary, 'transparent']}
          style={{ width: width * 2, height: width * 2, borderRadius: width }}
          start={{ x: 0.5, y: 0.5 }} end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.closeBtn} onPress={handleExit}>
          <Feather name="x" size={28} color={theme.textMuted} />
        </TouchableOpacity>

        <Animated.View entering={FadeIn.duration(1000)} style={styles.centerText}>
          <DynamicText variant="caption" color="muted" style={{ letterSpacing: 2, marginBottom: 16 }}>FOCUSING ON</DynamicText>
          <DynamicText variant="h1" align="center" style={{ color: theme.text, fontSize: 32 }}>{task?.title || 'Deep Work'}</DynamicText>
          
          {/* THE FIX: Removed 'monospace', added tabular-nums and a sleek font weight */}
          <DynamicText 
            variant="h1" 
            style={{ 
              fontSize: 94, 
              marginTop: 40, 
              color: theme.text, 
              fontWeight: '300', 
              fontVariant: ['tabular-nums'] 
            }}
          >
            {formatTime(timeLeft)}
          </DynamicText>
        </Animated.View>

        <TouchableOpacity style={[styles.playBtn, { backgroundColor: theme.primary }]} onPress={toggleTimer}>
          <Feather name={isActive ? "pause" : "play"} size={32} color="#FFF" style={{ marginLeft: isActive ? 0 : 4 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  orb: { position: 'absolute' },
  content: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', alignItems: 'center', paddingVertical: 80 },
  closeBtn: { position: 'absolute', top: 60, left: 24, padding: 8 },
  centerText: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  playBtn: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 16, elevation: 10 }
});
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface SwipeableCardProps {
  children: React.ReactNode;
  onComplete: () => void;
  isCompleted: boolean;
}

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

export const SwipeableCard = ({ children, onComplete, isCompleted }: SwipeableCardProps) => {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((event) => {
      // Only allow swiping right to complete, or left to un-complete
      if (!isCompleted && event.translationX > 0) {
        translateX.value = event.translationX;
      } else if (isCompleted && event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (!isCompleted && event.translationX > SWIPE_THRESHOLD) {
        translateX.value = withSpring(width, { damping: 20 }, () => {
          runOnJS(onComplete)();
          runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
          translateX.value = withTiming(0, { duration: 0 }); // Reset instantly offscreen
        });
      } else if (isCompleted && event.translationX < -SWIPE_THRESHOLD) {
        translateX.value = withSpring(-width, { damping: 20 }, () => {
          runOnJS(onComplete)();
          runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium);
          translateX.value = withTiming(0, { duration: 0 }); 
        });
      } else {
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 }); // Snap back
      }
    });

  const rStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const bgStyle = useAnimatedStyle(() => ({
    opacity: Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1),
  }));

  return (
    <View style={styles.container}>
      {/* Background Checkmark */}
      <Animated.View style={[styles.background, bgStyle, { backgroundColor: isCompleted ? 'rgba(255,69,0,0.2)' : 'rgba(46, 160, 67, 0.2)' }]}>
        <Feather name={isCompleted ? "x" : "check"} size={32} color={isCompleted ? "#FF4500" : "#2EA043"} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={rStyle}>
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    justifyContent: 'center',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'flex-start', // Adjust this based on swipe direction if you want it to move
  },
});
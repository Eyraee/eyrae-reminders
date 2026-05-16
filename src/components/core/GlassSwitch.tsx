import React, { useEffect } from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming
} from 'react-native-reanimated';

interface GlassSwitchProps {
  value: boolean;
  onValueChange: (val: boolean) => void;
  activeColor: string;
}

export const GlassSwitch = ({ value, onValueChange, activeColor }: GlassSwitchProps) => {
  // 0 is off, 1 is on
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, { damping: 20, stiffness: 250 });
  }, [value]);

  const trackAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(
      value ? activeColor : 'rgba(255, 255, 255, 0.1)', 
      { duration: 200 }
    ),
  }));

  const thumbAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 20 }], // Move right by 20px when active
  }));

  return (
    <TouchableWithoutFeedback onPress={() => onValueChange(!value)}>
      <Animated.View style={[styles.track, trackAnimatedStyle]}>
        <Animated.View style={[styles.thumb, thumbAnimatedStyle]} />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  thumb: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
});
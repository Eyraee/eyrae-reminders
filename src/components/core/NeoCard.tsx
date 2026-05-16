import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import Animated, { FadeInUp, FadeOutDown, LinearTransition } from 'react-native-reanimated';
import { metrics } from '../../theme/metrics';

interface NeoCardProps extends ViewProps {
  children: React.ReactNode;
  intensity?: number;
  glowColor?: string;
}

export const NeoCard = ({ 
  children, 
  intensity = 35, 
  glowColor, 
  style, 
  ...rest 
}: NeoCardProps) => {
  return (
    <Animated.View 
      // High damping and stiffness for professional, snap-to-place physics
      entering={FadeInUp.springify().damping(24).stiffness(220)}
      exiting={FadeOutDown.springify().damping(24).stiffness(220)}
      layout={LinearTransition.springify().damping(26).stiffness(220)}
      style={[
        styles.container, 
        glowColor && { 
          borderColor: glowColor, 
          borderWidth: 1,
          backgroundColor: `${glowColor}10`
        }, 
        style
      ]} 
      {...rest}
    >
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      
      <View style={styles.glassWash} />

      <View style={styles.innerContent}>
        {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: metrics.borderRadius.large,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)', 
    overflow: 'hidden', 
  },
  glassWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)', 
  },
  innerContent: {
    padding: metrics.spacing.lg,
  },
});